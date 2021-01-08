/* eslint-disable no-invalid-this */
import * as d3 from "d3";
import { binaryArrayIncludes } from "./utils.js";
import { emojis } from "./config.js";


class Graph {
  static #consts = {
    selectedClass: "selected",
    connectClass: "connect-node",
    nodeClassName: "node",
    graphClass: "graph",
    activeEditId: "active-editing",
    BACKSPACE_KEY: 8,
    DELETE_KEY: 46,
    ENTER_KEY: 13,
    ESCAPE_KEY: 27,
    C_KEY: 67,
    S_KEY: 83,
    nodeRadius: 50,
    newNodeIndicatorSize: 4 * 50,
  };

  #searchValue = "";
  #onHighlight = null;
  #onChange = null;
  #nodes = null;
  #links = null;
  #screenPosition = null;
  #initialNodePosition = null;
  svg = null;
  #idsOfAllNodesWithLinkedNote = null;
  #updatedNodes = new Set();
  #mouseDownNode = null;
  #justDragged = false;
  #justScaleTransGraph = false;
  #lastKeyDown = -1;
  #newLinkCreationInProgress = false;
  #selection = new Set();
  #connectedNodeIdsOfSelection = [];

  #shiftKeyIsPressed = false;
  #ctrlKeyIsPressed = false;
  #sKeyIsPressed = false;

  constructor(svg, graphObject, onHighlight, onChange) {
    const thisGraph = this;
    thisGraph.#onHighlight = onHighlight;
    thisGraph.#onChange = onChange;

    thisGraph.#nodes = graphObject.nodes;
    thisGraph.#links = graphObject.links;
    thisGraph.#screenPosition = graphObject.screenPosition;
    thisGraph.#initialNodePosition = graphObject.initialNodePosition;

    thisGraph.svg = svg;
    thisGraph.mainSVGGroup = svg.append("g")
      .classed(Graph.#consts.graphClass, true);
    const mainSVGGroup = thisGraph.mainSVGGroup;

    thisGraph.initialNodePositionIndicator = mainSVGGroup.append("g")
      .classed("new-node-position-indicator", true)
      .append("rect")
      .attr("width", String(Graph.#consts.newNodeIndicatorSize))
      .attr("height", String(Graph.#consts.newNodeIndicatorSize))
      .attr("rx", 4)
      .attr("ry", 4)
      .on("mouseover", function() {
        thisGraph.#onHighlight(
          true,
          emojis.new
          + " Initial position for new nodes (drag and drop to move)",
        );
      })
      .on("mouseout", function() {
        thisGraph.#onHighlight(false);
      });

    thisGraph.nodeHighlighterContainer = mainSVGGroup.append("g")
      .classed("note-highlighters", true);

    // displayed when dragging between nodes - should be rendered in front of
    // node highlighter circles, so this code is placed after node highlighter g
    // creation code
    thisGraph.newLinkLine = mainSVGGroup.append("svg:path")
      .attr("class", "link newLinkLine hidden")
      .attr("d", "M0,0L0,0");

    // svg nodes and links
    thisGraph.linksContainer = mainSVGGroup.append("g")
      .classed("links", true);

    thisGraph.nodesContainer = mainSVGGroup.append("g")
      .classed("notes", true);

    // drag single nodes, but not, if shift key is pressed
    thisGraph.nodeDrag = d3.drag()
      .subject(function(event) {
        return {
          x: event.x,
          y: event.y,
        };
      })
      .filter(() => {
        return (!thisGraph.#shiftKeyIsPressed)
          && (!thisGraph.#ctrlKeyIsPressed)
          && (!thisGraph.#sKeyIsPressed);
      })
      .on("drag", (e, d) => {
        const thisGraph = this;
        thisGraph.#justDragged = true;

        const nodesToDrag = Array.from(thisGraph.#selection)
          .filter((value) => !thisGraph.#isEdge(value));

        // also drag mouse down node, regardless of if it's selected or not
        if (!nodesToDrag.includes(d)) {
          nodesToDrag.push(d);
        }

        nodesToDrag
          .forEach((node) => {
            node.position.x += e.dx;
            node.position.y += e.dy;

            thisGraph.#updatedNodes.add(node);
          });

        thisGraph.#updateGraph(d);
        thisGraph.#onChange();
      });

    // drag intitial node position indicator
    thisGraph.inpIndicatorDrag = d3.drag()
      .subject(function(event) {
        return { x: event.x, y: event.y };
      })
      .on("drag", function(e) {
        thisGraph.#initialNodePosition.x += e.dx;
        thisGraph.#initialNodePosition.y += e.dy;
        thisGraph.#onChange();
        thisGraph.#updateGraph();
      });

    // listen for key events
    d3.select(window)
      .on("keydown", function(e) {
        thisGraph.#svgKeyDown(e);
      })
      .on("keyup", function(e) {
        thisGraph.#svgKeyUp(e);
      });
    svg.on("mouseup", function(e, d) {
      thisGraph.#svgMouseUp(d);
    });
    svg.on("mousemove", function(e) {
      thisGraph.#newPathMove(e, thisGraph.#mouseDownNode);
    });

    // listen for dragging
    const zoom = d3.zoom();

    zoom.on("zoom", function(e) {
      if (e.shiftKey) {
        // TODO  the internal d3 state is still changing
        return false;
      } else {
        thisGraph.#zoomed(e);
      }
      return true;
    });

    zoom.on("start", function(e) {
      const ael = d3.select("#" + Graph.#consts.activeEditId).node();
      if (ael) {
        ael.blur();
      }
      if (!e.shiftKey) {
        d3.select("body").style("cursor", "move");
      }
    });
    svg.call(zoom).on("dblclick.zoom", null);

    // when creating the graph, a zoom end event is initially dispatched.
    // since this first one does not change anything, we don't want to fire the
    // onChange event
    let firstZoomEndHappened = false;

    zoom.on("end", function() {
      d3.select("body").style("cursor", "auto");
      if (firstZoomEndHappened) {
        thisGraph.#onChange();
      } else {
        firstZoomEndHappened = true;
      }
    });

    const initialZoomTranform = d3.zoomIdentity
      .translate(
        thisGraph.#screenPosition.translateX,
        thisGraph.#screenPosition.translateY,
      )
      .scale(thisGraph.#screenPosition.scale);
    zoom.transform(svg, initialZoomTranform);

    // listen for resize
    window.onresize = () => thisGraph.#updateWindow(svg);

    thisGraph.#updateConnectedNodeIds();

    thisGraph.#updateGraph();
  }


  #updateConnectedNodeIds() {
    const thisGraph = this;

    thisGraph.#idsOfAllNodesWithLinkedNote = thisGraph.#links
      .reduce((accumulator, link) => {
        accumulator.push(link.source.id);
        accumulator.push(link.target.id);
        return accumulator;
      }, [])
      .sort((a, b) => a - b);
  };


  #newPathMove(e, originNode) {
    const thisGraph = this;
    if (!thisGraph.#newLinkCreationInProgress) {
      return;
    }

    const newLinkEnd = {
      x: d3.pointer(e, thisGraph.mainSVGGroup.node())[0] - 1,
      y: d3.pointer(e, thisGraph.mainSVGGroup.node())[1] - 1,
    };

    thisGraph.newLinkLine.attr(
      "d",
      "M" + originNode.position.x + "," + originNode.position.y
      + "L" + newLinkEnd.x + "," + newLinkEnd.y,
    );
  };


  // insert svg line breaks: taken from
  // http://stackoverflow.com/questions/13241475/how-do-i-include-newlines-in-labels-in-d3-charts
  #insertTitleLinebreaks(gEl, title) {
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


  #getConnectedNodeIdsOfSelection(selection) {
    return selection.reduce((accumulator, newValue) => {
      if (this.#isEdge(newValue)) {
        accumulator.push(newValue.source.id, newValue.target.id);
      } else {
        const linkedNoteIds = newValue.linkedNotes.map((node) => node.id);
        accumulator.push(...linkedNoteIds);
      }

      return accumulator;
    }, []);
  }


  #isEdge(value) {
    return !!(value.source && value.target);
  }


  #select(values, addToExistingSelection = false) {
    const thisGraph = this;

    if (!addToExistingSelection) {
      thisGraph.#selection = new Set(values);
    } else {
      values.forEach((value) => {
        thisGraph.#selection.add(value);
      });
    }

    thisGraph.#connectedNodeIdsOfSelection
      = this.#getConnectedNodeIdsOfSelection(
        Array.from(thisGraph.#selection),
      );

    thisGraph.#updateGraph();
  };


  #handleMouseDownOnEdge(e, d3path, d) {
    const thisGraph = this;
    e.stopPropagation();

    // when shift key is pressed down during mousedown,
    // add edge to current selection
    thisGraph.#select([d], e.shiftKey);
  };


  #handleMouseDownOnNode(e, d3node, d) {
    const thisGraph = this;
    e.stopPropagation();
    thisGraph.#mouseDownNode = d;
    if (e.shiftKey) {
      thisGraph.#newLinkCreationInProgress = true;
      // reposition dragged directed edge
      thisGraph.newLinkLine
        .classed("hidden", false)
        .attr(
          "d",
          "M" + d.position.x + "," + d.position.y
          + "L" + d.position.x + "," + d.position.y,
        );
    } else if (thisGraph.#sKeyIsPressed) {
      thisGraph.#select([d], true);
    }
  };


  // mouseup on nodes
  #handleMouseUpOnNode(e, d3node, mouseUpNode) {
    const thisGraph = this;
    const consts = Graph.#consts;
    // reset the states
    thisGraph.#newLinkCreationInProgress = false;
    d3node.classed(consts.connectClass, false);

    const mouseDownNode = thisGraph.#mouseDownNode;

    if (!mouseDownNode) return;

    thisGraph.newLinkLine.classed("hidden", true);

    if (mouseDownNode !== mouseUpNode) {
      // we're in a different node:
      // create new edge for mousedown edge and add to graph
      const newEdge = { source: mouseDownNode, target: mouseUpNode };

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
        thisGraph.#links.push(newEdge);
        thisGraph.#onChange();
        thisGraph.#updateConnectedNodeIds();
        thisGraph.#updateGraph();
      }
    } else {
      // we're in the same node
      if (thisGraph.#justDragged) {
        // dragged, not clicked
        thisGraph.#justDragged = false;
      }
    }
    thisGraph.#mouseDownNode = null;
  };


  // mouseup on main svg
  #svgMouseUp() {
    const thisGraph = this;
    if (thisGraph.#justScaleTransGraph) {
      // dragged not clicked
      thisGraph.#justScaleTransGraph = false;
    }

    // on mouse up, new link creation process is always over
    thisGraph.#newLinkCreationInProgress = false;
    thisGraph.newLinkLine.classed("hidden", true);
  };


  // keydown on main svg
  #svgKeyDown(e) {
    const thisGraph = this;
    const consts = Graph.#consts;

    if (e.shiftKey) {
      thisGraph.#shiftKeyIsPressed = true;
    }

    if (e.ctrlKey) {
      thisGraph.#ctrlKeyIsPressed = true;
    }

    if (e.keyCode === consts.S_KEY) {
      thisGraph.#sKeyIsPressed = true;
    }

    // make sure repeated key presses don't register for each keydown
    if (thisGraph.#lastKeyDown !== -1) return;

    thisGraph.#lastKeyDown = e.keyCode;

    switch (e.keyCode) {
    case consts.BACKSPACE_KEY:
    case consts.DELETE_KEY:
      // we cannot prevent default because then we cannot delete values from
      // search input
      // e.preventDefault();

      // right now, we don't support deleting nodes from the graph view
      // so let's consider only edges
      Array.from(this.#selection)
        .filter(thisGraph.#isEdge)
        .forEach((edge) => {
          thisGraph.#links.splice(thisGraph.#links.indexOf(edge), 1);
        });

      thisGraph.#onChange();
      thisGraph.#select([]);
      thisGraph.#updateConnectedNodeIds();
      thisGraph.#updateGraph();

      break;
    case consts.ESCAPE_KEY:
    case consts.C_KEY:
      thisGraph.#select([]);
      break;
    }
  };


  #svgKeyUp(e) {
    const thisGraph = this;
    thisGraph.#shiftKeyIsPressed = e.shiftKey;
    thisGraph.#ctrlKeyIsPressed = e.ctrlKey;

    if (e.keyCode === Graph.#consts.S_KEY) {
      thisGraph.#sKeyIsPressed = false;
    }

    this.#lastKeyDown = -1;
  };


  // call to propagate changes to graph
  #updateGraph(draggedNode) {
    const thisGraph = this;
    const consts = Graph.#consts;

    thisGraph.initialNodePositionIndicatorElement
      = thisGraph.initialNodePositionIndicator
        .attr("x",
          thisGraph.#initialNodePosition.x - (consts.newNodeIndicatorSize / 2),
        )
        .attr("y",
          thisGraph.#initialNodePosition.y - (consts.newNodeIndicatorSize / 2),
        )
        .call(thisGraph.inpIndicatorDrag);

    /** ********************
      node highlighter circles
    ***********************/

    // create selection
    thisGraph.nodeHighlighterElements = thisGraph.nodeHighlighterContainer
      .selectAll("g.node-highlighter");
    // append new node data
    thisGraph.nodeHighlighterElements = thisGraph.nodeHighlighterElements
      .data(
        // append only the nodes that are search hits
        thisGraph.#nodes.filter((node) => {
          if (typeof thisGraph.#searchValue !== "string") return false;
          if (thisGraph.#searchValue.length < 3) return false;
          return node.title.toLowerCase().includes(thisGraph.#searchValue);
        }),
        function(d) {return d.id;},
      )
      .attr(
        "transform",
        function(d) {
          return "translate(" + d.position.x + "," + d.position.y + ")";
        },
      );

    // add new node highlighters
    const nodeHighlighterEnter = thisGraph.nodeHighlighterElements
      .enter();

    nodeHighlighterEnter
      .append("g")
      .attr(
        "transform",
        function(d) {
          return "translate(" + d.position.x + "," + d.position.y + ")";
        },
      )
      .classed("node-highlighter", true)
      .append("circle")
      .attr("r", "320");

    // remove old node highlighters
    const nodeHighlighterExitSelection
      = thisGraph.nodeHighlighterElements.exit();
    nodeHighlighterExitSelection.remove();

    /** ********************
      links
    ***********************/

    // create link selection
    thisGraph.linkElements = thisGraph.linksContainer
      .selectAll("path.link")
      .data(thisGraph.#links);

    // update existing links
    thisGraph.linkElements
      .classed(consts.selectedClass, function(edge) {
        return thisGraph.#selection.has(edge);
      })
      .attr("d", function(d) {
        return "M" + d.source.position.x + "," + d.source.position.y
          + "L" + d.target.position.x + "," + d.target.position.y;
      })
      .classed("connected-to-selected", (edge) => {
        // only nodes can be connected to a link, links cannot be connected to
        // other links

        const idsOfSelectedNodes = Array.from(this.#selection)
          .filter((val) => !thisGraph.#isEdge(val))
          .map((val) => val.id);

        return (
          idsOfSelectedNodes.includes(edge.source.id)
          || idsOfSelectedNodes.includes(edge.target.id)
        );
      });


    // add new links
    thisGraph.linkElements
      .enter()
      .append("path")
      .classed("link", true)
      .attr("d", function(d) {
        return "M" + d.source.position.x + "," + d.source.position.y
        + "L" + d.target.position.x + "," + d.target.position.y;
      })
      .on("mouseover", function(e, d) {
        thisGraph.#onHighlight(
          true,
          emojis.link + " " + d.source.title + " - " + d.target.title,
        );
      })
      .on("mouseout", function() {
        thisGraph.#onHighlight(false);
      })
      .on("mousedown", function(e, d) {
        thisGraph.#handleMouseDownOnEdge(e, d3.select(this), d);
      });

    // remove old links
    thisGraph.linkElements
      = thisGraph.linkElements.exit().remove();

    /** ********************
      nodes
    ***********************/

    // create node selection
    thisGraph.nodeElements = thisGraph.nodesContainer.selectAll("g.node");

    // append new node data
    thisGraph.nodeElements = thisGraph.nodeElements
      .data(
        thisGraph.#nodes,
        function(d) {return d.id;},
      );

    // update node positions of moved/dragged nodes
    thisGraph.nodeElements
      .filter((d) => {
        const selectedNodeIds = Array.from(thisGraph.#selection)
          .filter((value) => {
            return !thisGraph.#isEdge(value);
          })
          .map((node) => node.id);

        return draggedNode || selectedNodeIds.includes(d.id);
      })
      .attr(
        "transform",
        function(d) {
          return "translate(" + d.position.x + "," + d.position.y + ")";
        },
      );

    // update existing nodes
    thisGraph.nodeElements
      .classed("unconnected", function(d) {
        return !binaryArrayIncludes(
          thisGraph.#idsOfAllNodesWithLinkedNote,
          d.id,
        );
      })
      .classed("selected", (node) => {
        return thisGraph.#selection.has(node);
      })
      .classed("connected-to-selected", (node) => {
        return thisGraph.#connectedNodeIdsOfSelection.includes(node.id);
      });


    // add new nodes
    const nodeG = thisGraph.nodeElements
      .enter()
      .append("g")
      .classed(consts.nodeClassName, true)
      .classed("new", function(d) {
        const MAX_NEW_AGE = 1000 * 60 * 60 * 24 * 10; // 10 days
        return Date.now() - d.creationTime < MAX_NEW_AGE;
      })
      .classed("hub", function(d) {
        return d.linkedNotes.length > 7;
      })
      .classed("unconnected", function(d) {
        return !binaryArrayIncludes(
          thisGraph.#idsOfAllNodesWithLinkedNote,
          d.id,
        );
      })
      .attr(
        "transform",
        function(d) {
          return "translate(" + d.position.x + "," + d.position.y + ")";
        },
      )
      .on("mouseover", function(e, d) {
        if (thisGraph.#newLinkCreationInProgress) {
          d3.select(this).classed(consts.connectClass, true);
        }
        thisGraph.#onHighlight(true, emojis.note + " " + d.title);
      })
      .on("mouseout", function() {
        d3.select(this).classed(consts.connectClass, false);
        thisGraph.#onHighlight(false);
      })
      .on("mousedown", function(e, d) {
        thisGraph.#handleMouseDownOnNode(e, d3.select(this), d);
      })
      .on("mouseup", function(e, d) {
        thisGraph.#handleMouseUpOnNode(e, d3.select(this), d);
      })
      .on("click", function(e, d) {
        if (e.ctrlKey) {
          window.open("/?id=" + d.id, "_blank");
        }
      })
      .call(thisGraph.nodeDrag);

    nodeG.append("circle")
      .attr("r", String(consts.nodeRadius));

    nodeG.each(function(d) {
      thisGraph.#insertTitleLinebreaks(d3.select(this), d.title);
    });

    // currently it's not possible to remove nodes in Graph View
    /*
    // remove old nodes
    const nodeExitSelection = thisGraph.nodeElements.exit();
    nodeExitSelection.remove();
  */
  };


  #zoomed(e) {
    const thisGraph = this;

    this.#justScaleTransGraph = true;
    d3.select("." + Graph.#consts.graphClass)
      .attr(
        "transform",
        "translate("
        + e.transform.x + "," + e.transform.y + ") "
        + "scale(" + e.transform.k + ")",
      );

    thisGraph.#screenPosition.translateX = e.transform.x;
    thisGraph.#screenPosition.translateY = e.transform.y;
    thisGraph.#screenPosition.scale = e.transform.k;
  };


  #updateWindow(svg) {
    const docEl = document.documentElement;
    const bodyEl = document.getElementsByTagName("body")[0];
    const x = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth;
    const y = window.innerHeight || docEl.clientHeight || bodyEl.clientHeight;
    svg.attr("width", x).attr("height", y);
  };


  /** *****************
    PUBLIC METHODS
  ********************/


  getSaveData() {
    const thisGraph = this;

    const linksToTransmit = thisGraph.#links.map((link) => {
      return [
        link.source.id,
        link.target.id,
      ];
    });

    const nodePositionUpdates = Array.from(thisGraph.#updatedNodes)
      .map((node) => {
        return {
          id: node.id,
          position: node.position,
        };
      });

    const graphObject = {
      nodePositionUpdates,
      links: linksToTransmit,
      screenPosition: thisGraph.#screenPosition,
      initialNodePosition: thisGraph.#initialNodePosition,
    };

    return graphObject;
  }


  getSelectedNodeIds() {
    const thisGraph = this;

    return Array.from(thisGraph.#selection)
      .filter((val) => !thisGraph.#isEdge(val))
      .map((val) => val.id);
  }


  setSearchValue(newSearchValue) {
    const thisGraph = this;
    if (typeof newSearchValue === "string") {
      thisGraph.#searchValue = newSearchValue;
    }
    thisGraph.#updateGraph();
  }
}


const initGraph = (parent, graphObject, onHighlight, onChange) => {
  const docEl = document.documentElement;
  const bodyEl = document.getElementsByTagName("body")[0];

  const width = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth;
  const height = (
    window.innerHeight
    || docEl.clientHeight
    || bodyEl.clientHeight
  ) - 50;


  /** MAIN SVG **/
  const svg = d3.select(parent)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const graphInstance = new Graph(
    svg, graphObject, onHighlight, onChange,
  );

  return graphInstance;
};


export {
  initGraph,
};


