/* eslint-disable no-invalid-this */
import * as Utils from "./utils.js";

let screenPosition = {
  translateX: 0,
  translateY: 0,
  scale: 1,
};

document.onload = (function(d3) {
  "use strict";

  // define graphcreator object
  const GraphCreator = function(svg, nodes, links, initialScreenPosition) {
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
      shiftNodeDrag: false,
      selectedText: null,
    };

    thisGraph.svg = svg;
    thisGraph.svgG = svg.append("g")
      .classed(thisGraph.consts.graphClass, true);
    const svgG = thisGraph.svgG;

    // displayed when dragging between nodes
    thisGraph.dragLine = svgG.append("svg:path")
      .attr("class", "link dragline hidden")
      .attr("d", "M0,0L0,0");
    // do not show arrow at end of line
    // .style('marker-end', 'url(#mark-end-arrow)');

    // svg nodes and links
    thisGraph.paths = svgG.append("g").selectAll("g");
    thisGraph.circles = svgG.append("g").selectAll("g");

    thisGraph.drag = d3.drag()
      .subject(function(d) {
        return { x: d.x, y: d.y };
      })
      .on("drag", function(args) {
        thisGraph.state.justDragged = true;
        thisGraph.dragmove(args);
      })
      .on("end", function() {
        // todo check if edge-mode is selected
      });

    // listen for key events
    d3.select(window).on("keydown", function() {
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

    zoom.on("end", function() {
      d3.select("body").style("cursor", "auto");
    });

    zoom.translateTo(svg,
      initialScreenPosition.translateX,
      initialScreenPosition.translateY,
    );
    zoom.scaleTo(svg, initialScreenPosition.scale);

    svg.call(zoom).on("dblclick.zoom", null);

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
          const statusElement = document.getElementById("status");
          if (!response.success === true) {
            statusElement.innerHTML = "ERROR SAVING GRAPH!";
            return;
          }
          statusElement.innerHTML = "Graph saved!";
          setTimeout(() => {
            statusElement.innerHTML = "";
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
    circleGClass: "node",
    graphClass: "graph",
    activeEditId: "active-editing",
    BACKSPACE_KEY: 8,
    DELETE_KEY: 46,
    ENTER_KEY: 13,
    nodeRadius: 50,
  };

  /* PROTOTYPE FUNCTIONS */

  GraphCreator.prototype.dragmove = function(d) {
    const thisGraph = this;
    if (thisGraph.state.shiftNodeDrag) {
      thisGraph.dragLine.attr(
        "d",
        "M" + d.x + "," + d.y
        + "L" + d3.mouse(thisGraph.svgG.node())[0] + ","
        + d3.mouse(this.svgG.node())[1],
      );
    } else {
      d.x += d3.event.dx;
      d.y += d3.event.dy;
      thisGraph.updateGraph();
    }
  };

  /* select all text in element: taken from http://stackoverflow.com/questions/6139107/programatically-select-text-in-a-contenteditable-html-element */
  GraphCreator.prototype.selectElementContents = function(el) {
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
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
    thisGraph.circles.filter(function(cd) {
      return cd.id === thisGraph.state.selectedNode.id;
    }).classed(thisGraph.consts.selectedClass, false);
    thisGraph.state.selectedNode = null;
  };

  GraphCreator.prototype.removeSelectFromEdge = function() {
    const thisGraph = this;
    thisGraph.paths.filter(function(cd) {
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
  GraphCreator.prototype.circleMouseDown = function(d3node, d) {
    const thisGraph = this;
    const state = thisGraph.state;
    d3.event.stopPropagation();
    state.mouseDownNode = d;
    if (d3.event.shiftKey) {
      state.shiftNodeDrag = d3.event.shiftKey;
      // reposition dragged directed edge
      thisGraph.dragLine.classed("hidden", false)
        .attr("d", "M" + d.x + "," + d.y + "L" + d.x + "," + d.y);
    }
  };

  /* place editable text on node in place of svg text */
  GraphCreator.prototype.changeTextOfNode = function(d3node, d) {
    const thisGraph = this;
    const consts = thisGraph.consts;
    const htmlEl = d3node.node();
    d3node.selectAll("text").remove();
    const nodeBCR = htmlEl.getBoundingClientRect();
    const curScale = nodeBCR.width / consts.nodeRadius;
    const placePad = 5 * curScale;
    const useHW = curScale > 1
      ? nodeBCR.width * 0.71
      : consts.nodeRadius * 1.42;
    // replace with editableconent text
    const d3txt = thisGraph.svg.selectAll("foreignObject")
      .data([d])
      .enter()
      .append("foreignObject")
      .attr("x", nodeBCR.left + placePad)
      .attr("y", nodeBCR.top + placePad)
      .attr("height", 2 * useHW)
      .attr("width", useHW)
      .append("xhtml:p")
      .attr("id", consts.activeEditId)
      .attr("contentEditable", "true")
      .text(d.title)
      .on("mousedown", function() {
        d3.event.stopPropagation();
      })
      .on("keydown", function() {
        d3.event.stopPropagation();
        if (d3.event.keyCode === consts.ENTER_KEY && !d3.event.shiftKey) {
          this.blur();
        }
      })
      .on("blur", function(d) {
        d.title = this.textContent;
        thisGraph.insertTitleLinebreaks(d3node, d.title);
        d3.select(this.parentElement).remove();
      });
    return d3txt;
  };

  // mouseup on nodes
  GraphCreator.prototype.circleMouseUp = function(d3node, d) {
    const thisGraph = this;
    const state = thisGraph.state;
    const consts = thisGraph.consts;
    // reset the states
    state.shiftNodeDrag = false;
    d3node.classed(consts.connectClass, false);

    const mouseDownNode = state.mouseDownNode;

    if (!mouseDownNode) return;

    thisGraph.dragLine.classed("hidden", true);

    if (mouseDownNode !== d) {
      // we're in a different node:
      // create new edge for mousedown edge and add to graph
      const newEdge = { source: mouseDownNode, target: d };
      const filtRes = thisGraph.paths.filter(function(d) {
        if (d.source === newEdge.target && d.target === newEdge.source) {
          thisGraph.links.splice(thisGraph.links.indexOf(d), 1);
        }
        return d.source === newEdge.source && d.target === newEdge.target;
      });
      if (!filtRes[0].length) {
        thisGraph.links.push(newEdge);
        thisGraph.updateGraph();
      }
    } else {
      // we're in the same node
      if (state.justDragged) {
        // dragged, not clicked
        state.justDragged = false;
      } else {
        // clicked, not dragged
        if (d3.event.shiftKey) {
          // shift-clicked node: edit text content
          const d3txt = thisGraph.changeTextOfNode(d3node, d);
          const txtNode = d3txt.node();
          thisGraph.selectElementContents(txtNode);
          txtNode.focus();
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
    }
    state.mouseDownNode = null;
  }; // end of circles mouseup

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
    } else if (state.shiftNodeDrag) {
      // dragged from node
      state.shiftNodeDrag = false;
      thisGraph.dragLine.classed("hidden", true);
    }
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

    thisGraph.paths = thisGraph.paths.data(thisGraph.links, function(d) {
      return String(d.source.id) + "+" + String(d.target.id);
    });
    const paths = thisGraph.paths;
    // update existing paths

    paths
      .classed(consts.selectedClass, function(d) {
        return d === state.selectedEdge;
      })
      .attr("d", function(d) {
        return "M" + d.source.x + "," + d.source.y
          + "L" + d.target.x + "," + d.target.y;
      });


    // add new paths
    paths.enter()
      .append("path")
      .classed("link", true)
      .attr("d", function(d) {
        return "M" + d.source.x + "," + d.source.y
        + "L" + d.target.x + "," + d.target.y;
      })
      .on("mousedown", function(d) {
        thisGraph.pathMouseDown(d3.select(this), d);
      },
      )
      .on("mouseup", function() {
        state.mouseDownLink = null;
      });

    // remove old links
    paths.exit().remove();

    // update existing nodes
    thisGraph.circles = thisGraph.circles.data(
      thisGraph.nodes,
      function(d) {return d.id;},
    );
    thisGraph.circles.attr(
      "transform",
      function(d) {return "translate(" + d.x + "," + d.y + ")";},
    );

    // add new nodes
    const newGs = thisGraph.circles.enter()
      .append("g");

    newGs.classed(consts.circleGClass, true)
      .attr(
        "transform",
        function(d) {return "translate(" + d.x + "," + d.y + ")";},
      )
      .on("mouseover", function() {
        if (state.shiftNodeDrag) {
          d3.select(this).classed(consts.connectClass, true);
        }
      })
      .on("mouseout", function() {
        d3.select(this).classed(consts.connectClass, false);
      })
      .on("mousedown", function(d) {
        thisGraph.circleMouseDown(d3.select(this), d);
      })
      .on("mouseup", function(d) {
        thisGraph.circleMouseUp(d3.select(this), d);
      })
      .call(thisGraph.drag);

    newGs.append("circle")
      .attr("r", String(consts.nodeRadius));

    newGs.each(function(d) {
      thisGraph.insertTitleLinebreaks(d3.select(this), d.title);
    });

    // remove old nodes
    thisGraph.circles.exit().remove();
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
    screenPosition = {
      translateX: d3.event.transform.x,
      translateY: d3.event.transform.y,
      scale: d3.event.transform.k,
    };
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

      const graphInstance = new GraphCreator(
        svg, nodes, links, graph.screenPosition,
      );
      graphInstance.updateGraph();
      screenPosition = graph.screenPosition;
      d3.select(".graph")
        .attr(
          "transform",
          "translate("
            + graph.screenPosition.translateX
            + ", "
            + graph.screenPosition.translateY
            + ") scale("
            + graph.screenPosition.scale
            + ")",
        );
    });
})(window.d3);

document.getElementById("button-home").addEventListener("click", () => {
  window.location.href = "/";
});
