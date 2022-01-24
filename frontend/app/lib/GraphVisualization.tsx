/* eslint-disable no-invalid-this */

/*
  This class provides everything to render the D3.js graph.
*/

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
} from "./utils";


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


export default class GraphVisualization {
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
  #onHighlight;
  #onChange;
  #openNote;
  #nodes;
  #links;
  #screenPosition;
  #initialNodePosition;
  #parent;
  #svg;
  #idsOfAllNodesWithLinkedNote = [];
  #updatedNodes = new Set();
  #mouseDownNode = null;
  #justDragged = false;
  #justScaleTransGraph = false;
  #lastKeyDown = -1;
  #newLinkCreationInProgress = false;
  #selection = new Set<any>();
  #connectedNodeIdsOfSelection:number[] = [];
  #titleRenderingEnabled = false;

  #mainSVGGroup;
  #gridLines;
  #initialNodePositionIndicator;
  #nodeHighlighterContainer;
  #newLinkLine;
  #linksContainer;
  #nodesContainer;
  #nodeDrag;
  #inpIndicatorDrag;
  #nodeHighlighterElements;
  #nodeElements;
  #linkElements;

  #shiftKeyIsPressed = false;
  #ctrlKeyIsPressed = false;
  #sKeyIsPressed = false;

  constructor({
    parent,
    graphObject,
    onHighlight,
    onChange,
    initialFocusNoteId,
    openNote,
  }) {
    const graphObjectPrepared = prepareGraphObject(graphObject);
    this.#parent = parent;
    const { width, height } = this.#parent.getBoundingClientRect();

    /** MAIN SVG **/
    const svg = d3.select(parent)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    this.#svg = svg;
    this.#onHighlight = onHighlight;
    this.#onChange = onChange;
    this.#openNote = openNote;

    this.#nodes = graphObjectPrepared.nodes;
    this.#links = graphObjectPrepared.links;

    // by default, we're using the screenPosition from the given data object ...
    this.#screenPosition = graphObjectPrepared.screenPosition;

    // ... we'll overwrite it if a valid note to focus is given
    if (typeof initialFocusNoteId === "number" && !isNaN(initialFocusNoteId)) {
      // set initial node in the center of the screen
      const node = this.#nodes.find(
        (node) => node.id === initialFocusNoteId,
      );

      if (typeof node === "object") {
        const { width, height } = this.#svg.node().getBoundingClientRect();
        const SCALE = 1.5;
        this.#screenPosition = {
          translateX: (-node.position.x * SCALE) + (width / 2),
          translateY: (-node.position.y * SCALE) + (height / 2),
          scale: SCALE,
        };
      }
    }

    this.#initialNodePosition = graphObjectPrepared.initialNodePosition;

    this.#mainSVGGroup = svg.append("g")
      .classed(GraphVisualization.#consts.graphClass, true);
    const mainSVGGroup = this.#mainSVGGroup;

    this.#gridLines = mainSVGGroup.append("g")
      .classed("grid-lines", true);

    this.#gridLines
      .append("rect")
      .attr("width", 100)
      .attr("height", 40000)
      .attr("x", -50)
      .attr("y", -20000)
      .classed("grid-line", true);

    this.#gridLines
      .append("rect")
      .attr("width", 40000)
      .attr("height", 100)
      .attr("x", -20000)
      .attr("y", -50)
      .classed("grid-line", true);

    this.#initialNodePositionIndicator = mainSVGGroup.append("g")
      .classed("new-node-position-indicator", true)
      .append("rect")
      .attr("width", String(GraphVisualization.#consts.newNodeIndicatorSize))
      .attr("height", String(GraphVisualization.#consts.newNodeIndicatorSize))
      .attr("rx", 4)
      .attr("ry", 4)
      .on("mouseover", () => {
        this.#onHighlight({
          active: true,
          type: "new-nodes-position-indicator",
        });
      })
      .on("mouseout", () => {
        this.#onHighlight({
          active: false,
        });
      });

    this.#nodeHighlighterContainer = mainSVGGroup.append("g")
      .classed("note-highlighters", true);

    // displayed when dragging between nodes - should be rendered in front of
    // node highlighter circles, so this code is placed after node highlighter g
    // creation code
    this.#newLinkLine = mainSVGGroup.append("svg:path")
      .attr("class", "link newLinkLine hidden")
      .attr("d", "M0,0L0,0");

    // svg nodes and links
    this.#linksContainer = mainSVGGroup.append("g")
      .classed("links", true);

    this.#nodesContainer = mainSVGGroup.append("g")
      .classed("notes", true);

    // drag single nodes, but not, if shift key is pressed
    this.#nodeDrag = d3.drag()
      .subject((event) => {
        return {
          x: event.x,
          y: event.y,
        };
      })
      .filter(() => {
        return (!this.#shiftKeyIsPressed)
          && (!this.#ctrlKeyIsPressed)
          && (!this.#sKeyIsPressed);
      })
      .on("drag", (e, d) => {
        this.#justDragged = true;

        const nodesToDrag = Array.from(this.#selection)
          .filter((value) => !this.#isEdge(value));

        // also drag mouse down node, regardless of if it's selected or not
        if (!nodesToDrag.includes(d)) {
          nodesToDrag.push(d);
        }

        nodesToDrag
          .forEach((node) => {
            node.position.x += e.dx;
            node.position.y += e.dy;

            this.#updatedNodes.add(node);
          });

        this.#updateGraph({ type: "NODE_DRAG", node: d });
        this.#onChange();
      });

    // drag intitial node position indicator
    this.#inpIndicatorDrag = d3.drag()
      .subject((event) => {
        return { x: event.x, y: event.y };
      })
      .on("drag", (e) => {
        this.#initialNodePosition.x += e.dx;
        this.#initialNodePosition.y += e.dy;
        this.#onChange();
        this.#updateGraph();
      });

    // listen for key events
    d3.select(window)
      .on("keydown", (e) => {
        this.#svgKeyDown(e);
      })
      .on("keyup", (e) => {
        this.#svgKeyUp(e);
      });
    svg.on("mouseup", () => {
      this.#svgMouseUp();
    });
    svg.on("mousemove", (e) => {
      this.#newPathMove(e, this.#mouseDownNode);
    });

    // listen for dragging
    const zoom = d3.zoom();

    zoom.on("zoom", (e) => {
      if (e.shiftKey) {
        // TODO  the internal d3 state is still changing
        return false;
      } else {
        this.#zoomed(e);
      }
      return true;
    });

    zoom.on("start", (e) => {
      const ael = d3.select(
        "#" + GraphVisualization.#consts.activeEditId,
      ).node();
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

    zoom.on("end", () => {
      d3.select("body").style("cursor", "auto");
      if (firstZoomEndHappened) {
        this.#onChange();
      } else {
        firstZoomEndHappened = true;
      }
    });

    const initialZoomTranform = d3.zoomIdentity
      .translate(
        this.#screenPosition.translateX,
        this.#screenPosition.translateY,
      )
      .scale(this.#screenPosition.scale);
    zoom.transform(svg, initialZoomTranform);

    // listen for resize
    window.onresize = () => this.#updateWindow(svg);

    this.#updateConnectedNodeIds();

    this.#updateGraph();

    // by default, text rendering is activated, if the number of nodes is <= 500
    if (this.#nodes.length <= 500) {
      this.toggleTextRendering();
    }
  }


  #updateConnectedNodeIds() {
    this.#idsOfAllNodesWithLinkedNote = this.#links
      .reduce((accumulator, link) => {
        accumulator.push(link.source.id);
        accumulator.push(link.target.id);
        return accumulator;
      }, [])
      .sort((a, b) => a - b);
  }


  #newPathMove(e, originNode) {
    if (!this.#newLinkCreationInProgress) {
      return;
    }

    const newLinkEnd = {
      x: d3.pointer(e, this.#mainSVGGroup.node())[0] - 1,
      y: d3.pointer(e, this.#mainSVGGroup.node())[1] - 1,
    };

    this.#newLinkLine.attr(
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
      GraphVisualization.#consts.MAX_NODE_TEXT_LENGTH,
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
    if (!addToOrRemoveFromExistingSelection) {
      this.#selection = new Set(values);
    } else {
      values.forEach((value) => {
        if (this.#selection.has(value)) {
          this.#selection.delete(value);
        } else {
          this.#selection.add(value);
        }
      });
    }

    this.#connectedNodeIdsOfSelection
      = this.#getConnectedNodeIdsOfSelection(
        Array.from(this.#selection),
      );

    this.#updateGraph();
  }


  #handleMouseDownOnEdge(e, d) {
    e.stopPropagation();

    // when shift key is pressed down during mousedown,
    // add edge to current selection
    this.#select([d], e.shiftKey);
  }


  #handleMouseDownOnNode(e, d) {
    e.stopPropagation();
    this.#mouseDownNode = d;
    if (e.shiftKey) {
      this.#newLinkCreationInProgress = true;
      // reposition dragged directed edge
      this.#newLinkLine
        .classed("hidden", false)
        .attr(
          "d",
          "M" + d.position.x + "," + d.position.y
          + "L" + d.position.x + "," + d.position.y,
        );
    } else if (this.#sKeyIsPressed) {
      this.#select([d], true);
    }
  }


  // mouseup on nodes
  #handleMouseUpOnNode(d3node, mouseUpNode) {
    const consts = GraphVisualization.#consts;
    // reset the states
    this.#newLinkCreationInProgress = false;
    d3node.classed(consts.connectClass, false);

    const mouseDownNode = this.#mouseDownNode;

    if (!mouseDownNode) return;

    this.#newLinkLine.classed("hidden", true);

    if (mouseDownNode !== mouseUpNode) {
      // we're in a different node:
      // create new edge for mousedown edge and add to graph
      const newEdge = { source: mouseDownNode, target: mouseUpNode };

      // check if such an edge is already there ...
      const edgeAlreadyExists = this
        .#linksContainer
        .selectAll("path.link")
        .filter(
          (d) => {
            return (
              (d.source === newEdge.source && d.target === newEdge.target)
              || (d.source === newEdge.target && d.target === newEdge.source)
            );
          },
        )
        .size() !== 0;

      // ... if not, create it
      if (!edgeAlreadyExists) {
        this.#links.push(newEdge);
        this.#onChange();
        this.#updateConnectedNodeIds();
        this.#updateGraph();
      }
    } else {
      // we're in the same node
      if (this.#justDragged) {
        // dragged, not clicked
        this.#justDragged = false;
      }
    }
    this.#mouseDownNode = null;
  }


  // mouseup on main svg
  #svgMouseUp() {
    if (this.#justScaleTransGraph) {
      // dragged not clicked
      this.#justScaleTransGraph = false;
    }

    // on mouse up, new link creation process is always over
    this.#newLinkCreationInProgress = false;
    this.#newLinkLine.classed("hidden", true);
  }


  // keydown on main svg
  #svgKeyDown(e) {
    const consts = GraphVisualization.#consts;

    if (e.shiftKey) {
      this.#shiftKeyIsPressed = true;
    }

    if (e.ctrlKey) {
      this.#ctrlKeyIsPressed = true;
    }

    if (e.keyCode === consts.S_KEY) {
      this.#sKeyIsPressed = true;
    }

    // make sure repeated key presses don't register for each keydown
    if (this.#lastKeyDown !== -1) return;

    this.#lastKeyDown = e.keyCode;

    switch (e.keyCode) {
    case consts.BACKSPACE_KEY:
    case consts.DELETE_KEY:
      // we cannot prevent default because then we cannot delete values from
      // search input
      // e.preventDefault();

      // right now, we don't support deleting nodes from the graph view
      // so let's consider only edges
      Array.from(this.#selection)
        .filter(this.#isEdge)
        .forEach((edge) => {
          this.#links.splice(this.#links.indexOf(edge), 1);
        });

      this.#onChange();
      this.#select([]);
      this.#updateConnectedNodeIds();
      this.#updateGraph();

      break;
    case consts.ESCAPE_KEY:
    case consts.C_KEY:
      this.#select([]);
      break;
    }
  }


  #svgKeyUp(e) {
    this.#shiftKeyIsPressed = e.shiftKey;
    this.#ctrlKeyIsPressed = e.ctrlKey;

    if (e.keyCode === GraphVisualization.#consts.S_KEY) {
      this.#sKeyIsPressed = false;
    }

    this.#lastKeyDown = -1;
  }


  // call to propagate changes to graph
  #updateGraph(event?):void {
    const consts = GraphVisualization.#consts;

    this.#initialNodePositionIndicator
      .attr("x",
        this.#initialNodePosition.x - (consts.newNodeIndicatorSize / 2),
      )
      .attr("y",
        this.#initialNodePosition.y - (consts.newNodeIndicatorSize / 2),
      )
      .call(this.#inpIndicatorDrag);

    /** ********************
      node highlighter circles
    ***********************/

    // create selection
    this.#nodeHighlighterElements = this.#nodeHighlighterContainer
      .selectAll("g.node-highlighter");
    // append new node data
    this.#nodeHighlighterElements = this.#nodeHighlighterElements
      .data(
        // append only the nodes that are search hits
        this.#nodes.filter((node) => {
          if (typeof this.#searchValue !== "string") return false;
          if (this.#searchValue.length < 3) return false;
          return node.title.toLowerCase().includes(this.#searchValue);
        }),
        (d) => d.id,
      )
      .attr(
        "transform",
        (d) => {
          return "translate(" + d.position.x + "," + d.position.y + ")";
        },
      );

    // add new node highlighters
    const nodeHighlighterEnter = this.#nodeHighlighterElements
      .enter();

    nodeHighlighterEnter
      .append("g")
      .attr(
        "transform",
        (d) => {
          return "translate(" + d.position.x + "," + d.position.y + ")";
        },
      )
      .classed("node-highlighter", true)
      .append("circle")
      .attr("r", "320");

    // remove old node highlighters
    const nodeHighlighterExitSelection
      = this.#nodeHighlighterElements.exit();
    nodeHighlighterExitSelection.remove();

    /** ********************
      links
    ***********************/

    // create link selection
    this.#linkElements = this.#linksContainer
      .selectAll("path.link")
      .data(this.#links);

    // update existing links
    this.#linkElements
      .classed(consts.selectedClass, (edge) => {
        return this.#selection.has(edge);
      })
      .attr("d", (d) => {
        return "M" + d.source.position.x + "," + d.source.position.y
          + "L" + d.target.position.x + "," + d.target.position.y;
      })
      .classed("connected-to-selected", (edge) => {
        // only nodes can be connected to a link, links cannot be connected to
        // other links

        const idsOfSelectedNodes = Array.from(this.#selection)
          .filter((val) => !this.#isEdge(val))
          .map((val) => val.id);

        return (
          idsOfSelectedNodes.includes(edge.source.id)
          || idsOfSelectedNodes.includes(edge.target.id)
        );
      });


    // add new links
    this.#linkElements
      .enter()
      .append("path")
      .classed("link", true)
      .attr("d", (d) => {
        return "M" + d.source.position.x + "," + d.source.position.y
        + "L" + d.target.position.x + "," + d.target.position.y;
      })
      .on("mouseover", (e, d) => {
        this.#onHighlight({
          active: true,
          type: "edge",
          titles: [d.source.title, d.target.title],
        });
      })
      .on("mouseout", () => {
        this.#onHighlight({
          active: false,
        });
      })
      .on("mousedown", (e, d) => {
        this.#handleMouseDownOnEdge(e, d);
      });

    // remove old links
    this.#linkElements
      = this.#linkElements.exit().remove();

    /** ********************
      nodes
    ***********************/

    // create node selection
    this.#nodeElements = this.#nodesContainer.selectAll("g.node");

    // append new node data
    this.#nodeElements = this.#nodeElements
      .data(
        this.#nodes,
        (d) => d.id,
      );

    // update node positions of moved/dragged nodes
    this.#nodeElements
      .filter((d) => {
        if (event?.type === "INFLATION") return true;

        const draggedNode = event?.type === "NODE_DRAG" && event.node;

        const selectedNodeIds = Array.from(this.#selection)
          .filter((value) => {
            return !this.#isEdge(value);
          })
          .map((node) => node.id);

        return draggedNode || selectedNodeIds.includes(d.id);
      })
      .attr(
        "transform",
        (d) => {
          return "translate(" + d.position.x + "," + d.position.y + ")";
        },
      );

    // update existing nodes
    this.#nodeElements
      .classed("unconnected", (d) => {
        return !binaryArrayIncludes(
          this.#idsOfAllNodesWithLinkedNote,
          d.id,
        );
      })
      .classed("selected", (node) => {
        return this.#selection.has(node);
      })
      .classed("connected-to-selected", (node) => {
        return this.#connectedNodeIdsOfSelection.includes(node.id);
      });


    // add new nodes
    const nodeG = this.#nodeElements
      .enter()
      .append("g")
      .classed(consts.nodeClassName, true)
      .classed("new", (d) => {
        const MAX_NEW_AGE = 1000 * 60 * 60 * 24 * 10; // 10 days
        return Date.now() - d.creationTime < MAX_NEW_AGE;
      })
      .classed("hub", (d) => {
        return d.linkedNotes.length > 7;
      })
      .classed("unconnected", (d) => {
        return !binaryArrayIncludes(
          this.#idsOfAllNodesWithLinkedNote,
          d.id,
        );
      })
      .attr(
        "transform",
        (d) => {
          return "translate(" + d.position.x + "," + d.position.y + ")";
        },
      )
      .on("mouseover", (e, d) => {
        if (this.#newLinkCreationInProgress) {
          d3.select(e.currentTarget).classed(consts.connectClass, true);
        }
        this.#onHighlight({
          active: true,
          type: "node",
          title: d.title,
        });
      })
      .on("mouseout", (e) => {
        d3.select(e.currentTarget).classed(consts.connectClass, false);
        this.#onHighlight({
          active: false,
        });
      })
      .on("mousedown", (e, d) => {
        this.#handleMouseDownOnNode(e, d);
      })
      .on("mouseup", (e, d) => {
        this.#handleMouseUpOnNode(d3.select(e.currentTarget), d);
      })
      .on("click", (e, d) => {
        if (e.ctrlKey) {
          this.#openNote(d.id);
        }
      })
      .call(this.#nodeDrag);

    nodeG.append("circle")
      .attr("r", String(consts.nodeRadius));

    // currently it's not possible to remove nodes in Graph View
    /*
    // remove old nodes
    const nodeExitSelection = this.nodeElements.exit();
    nodeExitSelection.remove();
  */
  }


  #zoomed(e) {
    this.#justScaleTransGraph = true;
    d3.select("." + GraphVisualization.#consts.graphClass)
      .attr(
        "transform",
        "translate("
        + e.transform.x + "," + e.transform.y + ") "
        + "scale(" + e.transform.k + ")",
      );

    this.#screenPosition.translateX = e.transform.x;
    this.#screenPosition.translateY = e.transform.y;
    this.#screenPosition.scale = e.transform.k;
  }


  #updateWindow(svg) {
    const { width, height } = this.#parent.getBoundingClientRect();
    svg.attr("width", width).attr("height", height);
  }


  /** *****************
    PUBLIC METHODS
  ********************/


  getSaveData() {
    const linksToTransmit = this.#links.map((link) => {
      return [
        link.source.id,
        link.target.id,
      ];
    });

    const nodePositionUpdates = Array.from(this.#updatedNodes)
      .map((node:any) => {
        return {
          id: node.id,
          position: node.position,
        };
      });

    const graphObject = {
      nodePositionUpdates,
      links: linksToTransmit,
      screenPosition: this.#screenPosition,
      initialNodePosition: this.#initialNodePosition,
    };

    return graphObject;
  }


  getSelectedNodeIds() {
    return Array.from(this.#selection)
      .filter((val) => !this.#isEdge(val))
      .map((val) => val.id);
  }


  setSearchValue(newSearchValue) {
    if (typeof newSearchValue === "string") {
      this.#searchValue = newSearchValue;
    }
    this.#updateGraph();
  }


  inflateGraph(factor) {
    this.#nodes
      .forEach((node) => {
        node.position.x *= factor;
        node.position.y *= factor;

        this.#updatedNodes.add(node);
      });

    this.#updateGraph({ type: "INFLATION" });
    this.#onChange();
  }


  toggleTextRendering() {
    if (!this.#titleRenderingEnabled) {
      this.#titleRenderingEnabled = true;
      d3.selectAll("g." + GraphVisualization.#consts.nodeClassName)
        .each((d, i, nodes) => {
          const domElement = nodes[i];
          this.#insertTitleLinebreaks(d3.select(domElement), d.title);
        });
    } else {
      d3.selectAll("text").remove();
      this.#titleRenderingEnabled = false;
    }
  }
}
