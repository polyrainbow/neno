/* eslint-disable no-invalid-this */

/*
@license
Parts of the code in this file are based loosely on code from this repository:
https://github.com/gaguri777/d3--directed-graph-creator

In the repository, it is stated that the code is licensed under the
MIT/X license. However, the repository does not include a copyright notice
typical for the MIT license. This is my best attempt at creating one myself,
in good faith, on behalf of the code creators, using the Open Source Intiative's
MIT license text:

Copyright (c) 2013-2014 Colorado Reed, Andreas Stuhlmüller

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import * as d3 from "d3";
import {
  binaryArrayIncludes,
  shortenText,
  htmlDecode,
} from "./utils.js";


const prepareGraphObject = (graph) => {
  const preparedGraphObject = {
    ...graph,
  };

  preparedGraphObject.nodes = graph.nodes.map((node) => {
    node.title = htmlDecode(node.title);
    return node;
  });

  preparedGraphObject.links = graph.links.map((link) => {
    return {
      source: graph.nodes.find((node) => node.id === link[0]),
      target: graph.nodes.find((node) => node.id === link[1]),
    };
  });

  return preparedGraphObject;
};


export default class Graph {
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
    MAX_NODE_TEXT_LENGTH: 55,
  };

  #searchValue = "";
  #onHighlight = null;
  #onChange = null;
  #nodes = null;
  #links = null;
  #screenPosition = null;
  #initialNodePosition = null;
  #parent = null;
  svg = null;
  #idsOfAllNodesWithLinkedNote = [];
  #updatedNodes = new Set();
  #mouseDownNode = null;
  #justDragged = false;
  #justScaleTransGraph = false;
  #lastKeyDown = -1;
  #newLinkCreationInProgress = false;
  #selection = new Set();
  #connectedNodeIdsOfSelection = [];
  #titleRenderingEnabled = false;

  #shiftKeyIsPressed = false;
  #ctrlKeyIsPressed = false;
  #sKeyIsPressed = false;

  constructor({
    parent,
    graphObject,
    onHighlight,
    onChange,
    initialFocusNoteId,
  }) {
    const graphObjectPrepared = prepareGraphObject(graphObject);
    const thisGraph = this;
    thisGraph.#parent = parent;
    const { width, height } = thisGraph.#parent.getBoundingClientRect();

    /** MAIN SVG **/
    const svg = d3.select(parent)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    thisGraph.svg = svg;
    thisGraph.#onHighlight = onHighlight;
    thisGraph.#onChange = onChange;

    thisGraph.#nodes = graphObjectPrepared.nodes;
    thisGraph.#links = graphObjectPrepared.links;

    // by default, we're using the screenPosition from the given data object ...
    thisGraph.#screenPosition = graphObjectPrepared.screenPosition;

    // ... we'll overwrite it if a valid note to focus is given
    if (typeof initialFocusNoteId === "number" && !isNaN(initialFocusNoteId)) {
      // set initial node in the center of the screen
      const node = thisGraph.#nodes.find(
        (node) => node.id === initialFocusNoteId,
      );

      if (typeof note === "object") {
        const { width, height } = thisGraph.svg.node().getBoundingClientRect();
        const SCALE = 1.5;
        thisGraph.#screenPosition = {
          translateX: (-node.position.x * SCALE) + (width / 2),
          translateY: (-node.position.y * SCALE) + (height / 2),
          scale: SCALE,
        };
      }
    }

    thisGraph.#initialNodePosition = graphObjectPrepared.initialNodePosition;

    thisGraph.mainSVGGroup = svg.append("g")
      .classed(Graph.#consts.graphClass, true);
    const mainSVGGroup = thisGraph.mainSVGGroup;

    thisGraph.gridLines = mainSVGGroup.append("g")
      .classed("grid-lines", true);

    thisGraph.gridLines
      .append("rect")
      .attr("width", 100)
      .attr("height", 40000)
      .attr("x", -50)
      .attr("y", -20000)
      .classed("grid-line", true);

    thisGraph.gridLines
      .append("rect")
      .attr("width", 40000)
      .attr("height", 100)
      .attr("x", -20000)
      .attr("y", -50)
      .classed("grid-line", true);

    thisGraph.initialNodePositionIndicator = mainSVGGroup.append("g")
      .classed("new-node-position-indicator", true)
      .append("rect")
      .attr("width", String(Graph.#consts.newNodeIndicatorSize))
      .attr("height", String(Graph.#consts.newNodeIndicatorSize))
      .attr("rx", 4)
      .attr("ry", 4)
      .on("mouseover", function() {
        thisGraph.#onHighlight({
          active: true,
          type: "new-nodes-position-indicator",
        });
      })
      .on("mouseout", function() {
        thisGraph.#onHighlight({
          active: false,
        });
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

        thisGraph.#updateGraph({ type: "NODE_DRAG", node: d });
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

    // by default, text rendering is activated, if the number of nodes is <= 500
    if (thisGraph.#nodes.length <= 500) {
      thisGraph.toggleTextRendering();
    }
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
  }


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
  }


  // insert svg line breaks: taken from
  // http://stackoverflow.com/questions/13241475/how-do-i-include-newlines-in-labels-in-d3-charts
  #insertTitleLinebreaks(gEl, title) {
    const titleShortened = shortenText(
      title,
      Graph.#consts.MAX_NODE_TEXT_LENGTH,
    );
    const words = (titleShortened && titleShortened.split(/\s+/g)) || "";
    const nwords = words.length;
    const el = gEl.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-" + (Math.max(nwords, 1) - 1) * 7.5);

    for (let i = 0; i < words.length; i++) {
      const tspan = el.append("tspan").text(words[i]);
      if (i > 0) {tspan.attr("x", 0).attr("dy", "15");}
    }
  }


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


  #select(values, addToOrRemoveFromExistingSelection = false) {
    const thisGraph = this;

    if (!addToOrRemoveFromExistingSelection) {
      thisGraph.#selection = new Set(values);
    } else {
      values.forEach((value) => {
        if (thisGraph.#selection.has(value)) {
          thisGraph.#selection.delete(value);
        } else {
          thisGraph.#selection.add(value);
        }
      });
    }

    thisGraph.#connectedNodeIdsOfSelection
      = this.#getConnectedNodeIdsOfSelection(
        Array.from(thisGraph.#selection),
      );

    thisGraph.#updateGraph();
  }


  #handleMouseDownOnEdge(e, d3path, d) {
    const thisGraph = this;
    e.stopPropagation();

    // when shift key is pressed down during mousedown,
    // add edge to current selection
    thisGraph.#select([d], e.shiftKey);
  }


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
  }


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
  }


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
  }


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
  }


  #svgKeyUp(e) {
    const thisGraph = this;
    thisGraph.#shiftKeyIsPressed = e.shiftKey;
    thisGraph.#ctrlKeyIsPressed = e.ctrlKey;

    if (e.keyCode === Graph.#consts.S_KEY) {
      thisGraph.#sKeyIsPressed = false;
    }

    this.#lastKeyDown = -1;
  }


  // call to propagate changes to graph
  #updateGraph(event) {
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
        thisGraph.#onHighlight({
          active: true,
          type: "edge",
          titles: [d.source.title, d.target.title],
        });
      })
      .on("mouseout", function() {
        thisGraph.#onHighlight({
          active: false,
        });
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
        if (event?.type === "INFLATION") return true;

        const draggedNode = event?.type === "NODE_DRAG" && event.node;

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
        thisGraph.#onHighlight({
          active: true,
          type: "node",
          title: d.title,
        });
      })
      .on("mouseout", function() {
        d3.select(this).classed(consts.connectClass, false);
        thisGraph.#onHighlight({
          active: false,
        });
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

    // currently it's not possible to remove nodes in Graph View
    /*
    // remove old nodes
    const nodeExitSelection = thisGraph.nodeElements.exit();
    nodeExitSelection.remove();
  */
  }


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
  }


  #updateWindow(svg) {
    const { width, height } = this.#parent.getBoundingClientRect();
    svg.attr("width", width).attr("height", height);
  }


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


  inflateGraph(factor) {
    const thisGraph = this;

    thisGraph.#nodes
      .forEach((node) => {
        node.position.x *= factor;
        node.position.y *= factor;

        thisGraph.#updatedNodes.add(node);
      });

    thisGraph.#updateGraph({ type: "INFLATION" });
    thisGraph.#onChange();
  }


  toggleTextRendering() {
    const thisGraph = this;

    if (!thisGraph.#titleRenderingEnabled) {
      thisGraph.#titleRenderingEnabled = true;
      d3.selectAll("g." + Graph.#consts.nodeClassName)
        .each(function(d) {
          thisGraph.#insertTitleLinebreaks(d3.select(this), d.title);
        });
    } else {
      d3.selectAll("text").remove();
      thisGraph.#titleRenderingEnabled = false;
    }
  }
}

