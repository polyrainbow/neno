/* eslint-disable no-invalid-this */
import * as Utils from "./utils.js";

const statusElement = document.getElementById("status");
const DEFAULT_STATUS = "Hold shift to draw links";

const screenPosition = {
  translateX: 0,
  translateY: 0,
  scale: 1,
};

document.onload = (function(d3) {
  "use strict";

  // define graphcreator object
  const GraphCreator = function(svg, nodes, links) {
    const thisGraph = this;

    thisGraph.nodes = nodes || [];
    thisGraph.links = links || [];

    thisGraph.state = {
      selectedNode: null,
      selectedEdge: null,
      mouseDownNode: null,
      mouseDownLink: null,
      justDragged: false,
      justScaleTransGraph: false,
      lastKeyDown: -1,
      shiftDragInProgress: false,
      selectedText: null,
    };

    thisGraph.svg = svg;
    thisGraph.svgG = svg.append("g")
      .classed(thisGraph.consts.graphClass, true);
    const svgG = thisGraph.svgG;

    // displayed when dragging between nodes
    thisGraph.newLinkLine = svgG.append("svg:path")
      .attr("class", "link newLinkLine hidden")
      .attr("d", "M0,0L0,0");

    // svg nodes and links
    thisGraph.linksContainer = svgG.append("g")
      .classed("links", true);

    thisGraph.nodesContainer = svgG.append("g")
      .classed("notes", true);

    thisGraph.drag = d3.drag()
      .subject(function(d) {
        return { x: d.x, y: d.y };
      })
      .filter(() => {
        return (!d3.event.shiftKey) && (!d3.event.ctrlKey);
      })
      .on("drag", function(args) {
        thisGraph.state.justDragged = true;
        thisGraph.dragmove(args);
      })
      .on("end", function() {
        // todo check if edge-mode is selected
      });

    // listen for key events
    d3.select(window)
      .on("keydown", function() {
        thisGraph.svgKeyDown();
      })
      .on("keyup", function() {
        thisGraph.svgKeyUp();
      });
    svg.on("mousedown", function(d) {
      thisGraph.svgMouseDown(d);
    });
    svg.on("mouseup", function(d) {
      thisGraph.svgMouseUp(d);
    });
    svg.on("mousemove", function() {
      thisGraph.newPathMove(thisGraph.state.mouseDownNode);
    });

    // listen for dragging
    const zoom = d3.zoom();

    zoom.on("zoom", function() {
      if (d3.event.shiftKey) {
        // TODO  the internal d3 state is still changing
        return false;
      } else {
        thisGraph.zoomed();
      }
      return true;
    });

    zoom.on("start", function() {
      const ael = d3.select("#" + thisGraph.consts.activeEditId).node();
      if (ael) {
        ael.blur();
      }
      if (!d3.event.shiftKey) {
        d3.select("body").style("cursor", "move");
      }
    });
    svg.call(zoom).on("dblclick.zoom", null);
    zoom.on("end", function() {
      d3.select("body").style("cursor", "auto");
    });

    const initialZoomTranform = d3.zoomIdentity
      .translate(
        screenPosition.translateX,
        screenPosition.translateY,
      )
      .scale(screenPosition.scale);
    zoom.transform(svg, initialZoomTranform);

    // listen for resize
    window.onresize = function() {thisGraph.updateWindow(svg);};

    d3.select("#button-save").on("click", function() {
      const links = thisGraph.links.map((link) => {
        return [
          link.source.id,
          link.target.id,
        ];
      });

      const nodes = thisGraph.nodes.map((node) => {
        return {
          id: node.id,
          x: node.x,
          y: node.y,
        };
      });

      const graphObject = {
        nodes: nodes,
        links: links,
        screenPosition,
      };

      fetch("/api/graph", {
        method: "POST",
        body: JSON.stringify(graphObject),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          if (!response.success === true) {
            statusElement.innerHTML = "ERROR SAVING GRAPH!";
            return;
          }
          statusElement.innerHTML = "Graph saved!";
          setTimeout(() => {
            statusElement.innerHTML = DEFAULT_STATUS;
          }, 2000);
          console.log("Graph saved!");
        })
        .catch((e) => {
          const statusElement = document.getElementById("status");
          statusElement.innerHTML = "ERROR SAVING GRAPH! " + e;
        });
    });
  };

  GraphCreator.prototype.consts = {
    selectedClass: "selected",
    connectClass: "connect-node",
    nodeClassName: "node",
    graphClass: "graph",
    activeEditId: "active-editing",
    BACKSPACE_KEY: 8,
    DELETE_KEY: 46,
    ENTER_KEY: 13,
    nodeRadius: 50,
  };

  /* PROTOTYPE FUNCTIONS */
  GraphCreator.prototype.newPathMove = function(originNode) {
    const thisGraph = this;
    if (!thisGraph.state.shiftDragInProgress) {
      return;
    }

    thisGraph.newLinkLine.attr(
      "d",
      "M" + originNode.x + "," + originNode.y
      + "L" + (d3.mouse(thisGraph.svgG.node())[0] - 1) + ","
      + (d3.mouse(this.svgG.node())[1] - 1),
    );
  };


  GraphCreator.prototype.dragmove = function(d) {
    const thisGraph = this;
    d.x += d3.event.dx;
    d.y += d3.event.dy;
    thisGraph.updateGraph();
  };

  /* insert svg line breaks: taken from http://stackoverflow.com/questions/13241475/how-do-i-include-newlines-in-labels-in-d3-charts */
  GraphCreator.prototype.insertTitleLinebreaks = function(gEl, title) {
    const words = (title && title.split(/\s+/g)) || "";
    const nwords = words.length;
    const el = gEl.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-" + (Math.max(nwords, 1) - 1) * 7.5);

    for (let i = 0; i < words.length; i++) {
      const tspan = el.append("tspan").text(words[i]);
      if (i > 0) {tspan.attr("x", 0).attr("dy", "15");}
    }
  };


  // remove links associated with a node
  GraphCreator.prototype.spliceLinksForNode = function(node) {
    const thisGraph = this;
    const toSplice = thisGraph.links.filter(function(l) {
      return (l.source === node || l.target === node);
    });
    toSplice.map(function(l) {
      thisGraph.links.splice(thisGraph.links.indexOf(l), 1);
    });
  };

  GraphCreator.prototype.replaceSelectEdge = function(d3Path, edgeData) {
    const thisGraph = this;
    d3Path.classed(thisGraph.consts.selectedClass, true);
    if (thisGraph.state.selectedEdge) {
      thisGraph.removeSelectFromEdge();
    }
    thisGraph.state.selectedEdge = edgeData;
  };

  GraphCreator.prototype.replaceSelectNode = function(d3Node, nodeData) {
    const thisGraph = this;
    d3Node.classed(this.consts.selectedClass, true);
    if (thisGraph.state.selectedNode) {
      thisGraph.removeSelectFromNode();
    }
    thisGraph.state.selectedNode = nodeData;
  };

  GraphCreator.prototype.removeSelectFromNode = function() {
    const thisGraph = this;
    thisGraph.nodeElements.filter(function(cd) {
      return cd.id === thisGraph.state.selectedNode.id;
    }).classed(thisGraph.consts.selectedClass, false);
    thisGraph.state.selectedNode = null;
  };

  GraphCreator.prototype.removeSelectFromEdge = function() {
    const thisGraph = this;
    thisGraph.linkElements.filter(function(cd) {
      return cd === thisGraph.state.selectedEdge;
    }).classed(thisGraph.consts.selectedClass, false);
    thisGraph.state.selectedEdge = null;
  };

  GraphCreator.prototype.pathMouseDown = function(d3path, d) {
    const thisGraph = this;
    const state = thisGraph.state;
    d3.event.stopPropagation();
    state.mouseDownLink = d;

    if (state.selectedNode) {
      thisGraph.removeSelectFromNode();
    }

    const prevEdge = state.selectedEdge;
    if (!prevEdge || prevEdge !== d) {
      thisGraph.replaceSelectEdge(d3path, d);
    } else {
      thisGraph.removeSelectFromEdge();
    }
  };

  // mousedown on node
  GraphCreator.prototype.handleMouseDownOnNode = function(d3node, d) {
    const thisGraph = this;
    const state = thisGraph.state;
    d3.event.stopPropagation();
    state.mouseDownNode = d;
    if (d3.event.shiftKey) {
      state.shiftDragInProgress = d3.event.shiftKey;
      // reposition dragged directed edge
      thisGraph.newLinkLine
        .classed("hidden", false)
        .attr("d", "M" + d.x + "," + d.y + "L" + d.x + "," + d.y);
    }
  };


  // mouseup on nodes
  GraphCreator.prototype.handleMouseUpOnNode = function(d3node, d) {
    const thisGraph = this;
    const state = thisGraph.state;
    const consts = thisGraph.consts;
    // reset the states
    state.shiftDragInProgress = false;
    d3node.classed(consts.connectClass, false);

    const mouseDownNode = state.mouseDownNode;

    if (!mouseDownNode) return;

    thisGraph.newLinkLine.classed("hidden", true);

    if (mouseDownNode !== d) {
      console.log("creating edge");
      // we're in a different node:
      // create new edge for mousedown edge and add to graph
      const newEdge = { source: mouseDownNode, target: d };

      // check if such an edge is already there ...
      const edgeAlreadyExists = thisGraph
        .linksContainer
        .selectAll("path.link")
        .filter(
          function(d) {
            return (
              (d.source === newEdge.source && d.target === newEdge.target)
              || (d.source === newEdge.target && d.target === newEdge.source)
            );
          },
        )
        .size() !== 0;

      // ... if not, create it
      if (!edgeAlreadyExists) {
        thisGraph.links.push(newEdge);
        thisGraph.updateGraph();
      }
    } else {
      // we're in the same node
      if (state.justDragged) {
        // dragged, not clicked
        state.justDragged = false;
      } else {
        if (state.selectedEdge) {
          thisGraph.removeSelectFromEdge();
        }
        const prevNode = state.selectedNode;

        if (!prevNode || prevNode.id !== d.id) {
          thisGraph.replaceSelectNode(d3node, d);
        } else {
          thisGraph.removeSelectFromNode();
        }
      }
    }
    state.mouseDownNode = null;
  }; // end of nodeElements mouseup

  // mousedown on main svg
  GraphCreator.prototype.svgMouseDown = function() {
    this.state.graphMouseDown = true;
  };

  // mouseup on main svg
  GraphCreator.prototype.svgMouseUp = function() {
    const thisGraph = this;
    const state = thisGraph.state;
    if (state.justScaleTransGraph) {
      // dragged not clicked
      state.justScaleTransGraph = false;
    }

    // on mouse up, shift drag is always over
    state.shiftDragInProgress = false;
    thisGraph.newLinkLine.classed("hidden", true);

    state.graphMouseDown = false;
  };

  // keydown on main svg
  GraphCreator.prototype.svgKeyDown = function() {
    const thisGraph = this;
    const state = thisGraph.state;
    const consts = thisGraph.consts;
    // make sure repeated key presses don't register for each keydown
    if (state.lastKeyDown !== -1) return;

    state.lastKeyDown = d3.event.keyCode;
    const selectedNode = state.selectedNode;
    const selectedEdge = state.selectedEdge;

    switch (d3.event.keyCode) {
    case consts.BACKSPACE_KEY:
    case consts.DELETE_KEY:
      d3.event.preventDefault();
      if (selectedNode) {
        thisGraph.nodes.splice(thisGraph.nodes.indexOf(selectedNode), 1);
        thisGraph.spliceLinksForNode(selectedNode);
        state.selectedNode = null;
        thisGraph.updateGraph();
      } else if (selectedEdge) {
        thisGraph.links.splice(thisGraph.links.indexOf(selectedEdge), 1);
        state.selectedEdge = null;
        thisGraph.updateGraph();
      }
      break;
    }
  };

  GraphCreator.prototype.svgKeyUp = function() {
    this.state.lastKeyDown = -1;
  };

  // call to propagate changes to graph
  GraphCreator.prototype.updateGraph = function() {
    const thisGraph = this;
    const consts = thisGraph.consts;
    const state = thisGraph.state;

    // create link selection
    thisGraph.linkElements = thisGraph.linksContainer.selectAll("path.link");

    // append new link data
    thisGraph.linkElements = thisGraph.linkElements
      .data(
        thisGraph.links,
        function(d) {
          return String(d.source.id) + "+" + String(d.target.id);
        },
      );

    // update existing links
    thisGraph.linkElements
      .classed(consts.selectedClass, function(d) {
        return d === state.selectedEdge;
      })
      .attr("d", function(d) {
        return "M" + d.source.x + "," + d.source.y
          + "L" + d.target.x + "," + d.target.y;
      });


    // add new linkElements
    const linkEnter = thisGraph.linkElements
      .enter();

    const newLink = linkEnter
      .append("path");

    newLink
      .classed("link", true)
      .attr("d", function(d) {
        return "M" + d.source.x + "," + d.source.y
        + "L" + d.target.x + "," + d.target.y;
      })
      .on("mousedown", function(d) {
        thisGraph.pathMouseDown(d3.select(this), d);
      })
      .on("mouseup", function() {
        state.mouseDownLink = null;
      });

    // remove old links
    const linkExitSelection = thisGraph.linkElements.exit();
    linkExitSelection.remove();


    // create node selection
    thisGraph.nodeElements = thisGraph.nodesContainer.selectAll("g.node");

    // append new node data
    thisGraph.nodeElements = thisGraph.nodeElements
      .data(
        thisGraph.nodes,
        function(d) {return d.id;},
      );

    // update existing nodes
    thisGraph.nodeElements
      .attr(
        "transform",
        function(d) {return "translate(" + d.x + "," + d.y + ")";},
      );

    // add new nodes
    const nodeEnter = thisGraph.nodeElements
      .enter();

    const newNode = nodeEnter
      .append("g");

    newNode
      .classed(consts.nodeClassName, true)
      .attr(
        "transform",
        function(d) {return "translate(" + d.x + "," + d.y + ")";},
      )
      .on("mouseover", function(d) {
        if (state.shiftDragInProgress) {
          d3.select(this).classed(consts.connectClass, true);
        }
        statusElement.innerHTML = d.title;
      })
      .on("mouseout", function() {
        d3.select(this).classed(consts.connectClass, false);
        statusElement.innerHTML = "";
      })
      .on("mousedown", function(d) {
        thisGraph.handleMouseDownOnNode(d3.select(this), d);
      })
      .on("mouseup", function(d) {
        thisGraph.handleMouseUpOnNode(d3.select(this), d);
      })
      .on("click", function(d) {
        if (d3.event.ctrlKey) {
          window.location.href = "/?id=" + d.id;
        }
      })
      .call(thisGraph.drag);

    newNode
      .append("circle")
      .attr("r", String(consts.nodeRadius));

    newNode
      .each(function(d) {
        thisGraph.insertTitleLinebreaks(d3.select(this), d.title);
      });

    // remove old nodes
    const nodeExitSelection = thisGraph.nodeElements.exit();
    nodeExitSelection.remove();
  };

  GraphCreator.prototype.zoomed = function() {
    this.state.justScaleTransGraph = true;
    d3.select("." + this.consts.graphClass)
      .attr(
        "transform",
        "translate("
        + d3.event.transform.x + "," + d3.event.transform.y + ") "
        + "scale(" + d3.event.transform.k + ")",
      );
    screenPosition.translateX = d3.event.transform.x;
    screenPosition.translateY = d3.event.transform.y;
    screenPosition.scale = d3.event.transform.k;
  };

  GraphCreator.prototype.updateWindow = function(svg) {
    const docEl = document.documentElement;
    const bodyEl = document.getElementsByTagName("body")[0];
    const x = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth;
    const y = window.innerHeight || docEl.clientHeight || bodyEl.clientHeight;
    svg.attr("width", x).attr("height", y);
  };


  /** ** MAIN ****/

  // warn the user when leaving
  window.onbeforeunload = function() {
    return "Make sure to save your graph before leaving";
  };

  const docEl = document.documentElement;
  const bodyEl = document.getElementsByTagName("body")[0];

  const width = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth;
  const height = window.innerHeight
    || docEl.clientHeight || bodyEl.clientHeight;

  // initial node data
  fetch("/api/graph")
    .then((response) => response.json())
    .then((graph) => {
      const nodes = graph.nodes.map((node) => {
        node.title = Utils.htmlDecode(node.title);
        return node;
      });

      const links = graph.links.map((link) => {
        return {
          source: nodes.find((node) => node.id === link[0]),
          target: nodes.find((node) => node.id === link[1]),
        };
      });

      /** MAIN SVG **/
      const svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      screenPosition.translateX = graph.screenPosition.translateX;
      screenPosition.translateY = graph.screenPosition.translateY;
      screenPosition.scale = graph.screenPosition.scale;
      window.screenPosition = screenPosition;
      const graphInstance = new GraphCreator(
        svg, nodes, links,
      );
      graphInstance.updateGraph();
    });
})(window.d3);

document.getElementById("button-home").addEventListener("click", () => {
  window.location.href = "/";
});
