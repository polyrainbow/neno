/* eslint-disable no-invalid-this */
import * as d3 from "d3";
import { binaryArrayIncludes } from "./utils.js";


const Graph = function(svg, graphObject, onHighlight, onChange) {
  const thisGraph = this;

  thisGraph.graphIsRendered = false;
  thisGraph.searchValue = "";
  thisGraph.onHighlight = onHighlight;
  thisGraph.onChange = onChange;

  thisGraph.nodes = graphObject.nodes;
  thisGraph.links = graphObject.links;
  thisGraph.screenPosition = graphObject.screenPosition;

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
  thisGraph.mainSVGGroup = svg.append("g")
    .classed(thisGraph.consts.graphClass, true);
  const mainSVGGroup = thisGraph.mainSVGGroup;

  // displayed when dragging between nodes
  thisGraph.newLinkLine = mainSVGGroup.append("svg:path")
    .attr("class", "link newLinkLine hidden")
    .attr("d", "M0,0L0,0");

  thisGraph.nodeHighlighterContainer = mainSVGGroup.append("g")
    .classed("note-highlighters", true);

  // svg nodes and links
  thisGraph.linksContainer = mainSVGGroup.append("g")
    .classed("links", true);

  thisGraph.nodesContainer = mainSVGGroup.append("g")
    .classed("notes", true);

  // drag single nodes, but not, if shift key is pressed
  thisGraph.drag = d3.drag()
    .subject(function(d) {
      return { x: d.x, y: d.y };
    })
    .filter(() => {
      return (!thisGraph.shiftKeyIsPressed) && (!thisGraph.ctrlKeyIsPressed);
    })
    .on("drag", function(e, args) {
      thisGraph.state.justDragged = true;
      thisGraph.dragmove(e, args);
    })
    .on("end", function(e, d) {
      if (e.shiftKey) return;

      thisGraph.replaceSelectNode(d3.select(this), d);
    });

  // listen for key events
  d3.select(window)
    .on("keydown", function(e) {
      thisGraph.svgKeyDown(e);
    })
    .on("keyup", function(e) {
      thisGraph.svgKeyUp(e);
    });
  svg.on("mousedown", function(e, d) {
    thisGraph.svgMouseDown(d);
  });
  svg.on("mouseup", function(e, d) {
    thisGraph.svgMouseUp(d);
  });
  svg.on("mousemove", function(e) {
    thisGraph.newPathMove(e, thisGraph.state.mouseDownNode);
  });

  // listen for dragging
  const zoom = d3.zoom();

  zoom.on("zoom", function(e) {
    if (e.shiftKey) {
      // TODO  the internal d3 state is still changing
      return false;
    } else {
      thisGraph.zoomed(e);
    }
    return true;
  });

  zoom.on("start", function(e) {
    const ael = d3.select("#" + thisGraph.consts.activeEditId).node();
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
      thisGraph.onChange();
    } else {
      firstZoomEndHappened = true;
    }
  });

  const initialZoomTranform = d3.zoomIdentity
    .translate(
      thisGraph.screenPosition.translateX,
      thisGraph.screenPosition.translateY,
    )
    .scale(thisGraph.screenPosition.scale);
  zoom.transform(svg, initialZoomTranform);

  // listen for resize
  window.onresize = function() {thisGraph.updateWindow(svg);};

  thisGraph.updateConnectedNodeIds();
};

Graph.prototype.updateConnectedNodeIds = function() {
  const thisGraph = this;

  thisGraph.connectedNodeIds = thisGraph.links
    .reduce((accumulator, link) => {
      accumulator.push(link.source.id);
      accumulator.push(link.target.id);
      return accumulator;
    }, [])
    .sort((a, b) => a - b);
};


Graph.prototype.getSaveData = function() {
  const thisGraph = this;

  const linksToTransmit = thisGraph.links.map((link) => {
    return [
      link.source.id,
      link.target.id,
    ];
  });

  const nodesToTransmit = thisGraph.nodes.map((node) => {
    return {
      id: node.id,
      x: node.x,
      y: node.y,
    };
  });

  const graphObject = {
    nodes: nodesToTransmit,
    links: linksToTransmit,
    screenPosition: thisGraph.screenPosition,
  };

  return graphObject;
};


Graph.prototype.getSelectedNodeId = function() {
  const thisGraph = this;

  if (!thisGraph.state.selectedNode) {
    return;
  }

  return thisGraph.state.selectedNode.id;
};


Graph.prototype.consts = {
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
Graph.prototype.newPathMove = function(e, originNode) {
  const thisGraph = this;
  if (!thisGraph.state.shiftDragInProgress) {
    return;
  }

  const newLinkEnd = {
    x: d3.pointer(e, thisGraph.mainSVGGroup.node())[0] - 1,
    y: d3.pointer(e, thisGraph.mainSVGGroup.node())[1] - 1,
  };

  thisGraph.newLinkLine.attr(
    "d",
    "M" + originNode.x + "," + originNode.y
    + "L" + newLinkEnd.x + "," + newLinkEnd.y,
  );
};


Graph.prototype.dragmove = function(e, d) {
  const thisGraph = this;
  d.x += e.dx;
  d.y += e.dy;
  thisGraph.updateGraph();
};

/* insert svg line breaks: taken from http://stackoverflow.com/questions/13241475/how-do-i-include-newlines-in-labels-in-d3-charts */
Graph.prototype.insertTitleLinebreaks = function(gEl, title) {
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
Graph.prototype.spliceLinksForNode = function(node) {
  const thisGraph = this;
  const toSplice = thisGraph.links.filter(function(l) {
    return (l.source === node || l.target === node);
  });
  toSplice.map(function(l) {
    return thisGraph.links.splice(thisGraph.links.indexOf(l), 1);
  });
};

Graph.prototype.replaceSelectEdge = function(d3Path, edgeData) {
  const thisGraph = this;
  d3Path.classed(thisGraph.consts.selectedClass, true);
  if (thisGraph.state.selectedEdge) {
    thisGraph.removeSelectFromEdge();
  }
  thisGraph.state.selectedEdge = edgeData;
};


Graph.prototype.replaceSelectNode = function(d3Node, nodeData) {
  const thisGraph = this;
  if (thisGraph.state.selectedNode) {
    thisGraph.removeSelectFromNode();
  }
  d3Node.classed(this.consts.selectedClass, true);

  const connectedNodeIdsToThisNode
    = nodeData.linkedNotes.map((node) => node.id);

  thisGraph.nodesContainer.selectAll("g.node")
    .filter((d) => {
      return connectedNodeIdsToThisNode.includes(d.id);
    })
    .classed("connected-to-selected", true);

  thisGraph.linksContainer.selectAll("path.link")
    .filter((d) => {
      return (
        nodeData.id === d.source.id
        || nodeData.id === d.target.id
      );
    })
    .classed("connected-to-selected", true);

  thisGraph.state.selectedNode = nodeData;
};

Graph.prototype.removeSelectFromNode = function() {
  const thisGraph = this;
  thisGraph.nodesContainer.selectAll("g.node.selected")
    .classed(this.consts.selectedClass, false);

  thisGraph.nodesContainer.selectAll("g.node.connected-to-selected")
    .classed("connected-to-selected", false);

  thisGraph.linksContainer.selectAll("path.link.connected-to-selected")
    .classed("connected-to-selected", false);

  thisGraph.state.selectedNode = null;
};

Graph.prototype.removeSelectFromEdge = function() {
  const thisGraph = this;
  thisGraph.linkElements.filter(function(cd) {
    return cd === thisGraph.state.selectedEdge;
  }).classed(thisGraph.consts.selectedClass, false);
  thisGraph.state.selectedEdge = null;
};

Graph.prototype.pathMouseDown = function(e, d3path, d) {
  const thisGraph = this;
  const state = thisGraph.state;
  e.stopPropagation();
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
Graph.prototype.handleMouseDownOnNode = function(e, d3node, d) {
  const thisGraph = this;
  const state = thisGraph.state;
  e.stopPropagation();
  state.mouseDownNode = d;
  if (e.shiftKey) {
    state.shiftDragInProgress = e.shiftKey;
    // reposition dragged directed edge
    thisGraph.newLinkLine
      .classed("hidden", false)
      .attr("d", "M" + d.x + "," + d.y + "L" + d.x + "," + d.y);
  }
};


// mouseup on nodes
Graph.prototype.handleMouseUpOnNode = function(d3node, d) {
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
      thisGraph.updateConnectedNodeIds();
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
      }
    }
  }
  state.mouseDownNode = null;
}; // end of nodeElements mouseup

// mousedown on main svg
Graph.prototype.svgMouseDown = function() {
  this.state.graphMouseDown = true;
};

// mouseup on main svg
Graph.prototype.svgMouseUp = function() {
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
Graph.prototype.svgKeyDown = function(e) {
  const thisGraph = this;
  const state = thisGraph.state;
  const consts = thisGraph.consts;

  if (e.shiftKey) {
    thisGraph.shiftKeyIsPressed = true;
  }

  if (e.ctrlKey) {
    thisGraph.ctrlKeyIsPressed = true;
  }

  // make sure repeated key presses don't register for each keydown
  if (state.lastKeyDown !== -1) return;

  state.lastKeyDown = e.keyCode;
  const selectedNode = state.selectedNode;
  const selectedEdge = state.selectedEdge;

  switch (e.keyCode) {
  case consts.BACKSPACE_KEY:
  case consts.DELETE_KEY:
    // we cannot prevent default because then we cannot delete values from
    // search input
    // e.preventDefault();
    if (selectedNode) {
      // right now, we don't support deleting nodes from the graph view

      /*
      thisGraph.nodes.splice(thisGraph.nodes.indexOf(selectedNode), 1);
      thisGraph.spliceLinksForNode(selectedNode);
      state.selectedNode = null;
      thisGraph.updateGraph();
      */
    } else if (selectedEdge) {
      thisGraph.links.splice(thisGraph.links.indexOf(selectedEdge), 1);
      state.selectedEdge = null;
      thisGraph.updateConnectedNodeIds();
      thisGraph.updateGraph();
    }
    break;
  }
};

Graph.prototype.svgKeyUp = function(e) {
  const thisGraph = this;
  thisGraph.shiftKeyIsPressed = e.shiftKey;
  thisGraph.ctrlKeyIsPressed = e.ctrlKey;

  this.state.lastKeyDown = -1;
};

// call to propagate changes to graph
Graph.prototype.updateGraph = function(newSearchValue) {
  const thisGraph = this;
  const consts = thisGraph.consts;
  const state = thisGraph.state;

  if (typeof newSearchValue === "string") {
    thisGraph.searchValue = newSearchValue;
  }

  // node highlighters
  // create node selection
  thisGraph.nodeHighlighterElements = thisGraph.nodeHighlighterContainer
    .selectAll("g.node-highlighter");
  // append new node data
  thisGraph.nodeHighlighterElements = thisGraph.nodeHighlighterElements
    .data(
      thisGraph.nodes.filter((node) => {
        if (typeof thisGraph.searchValue !== "string") return false;
        if (thisGraph.searchValue.length < 3) return false;
        return node.title.toLowerCase().includes(thisGraph.searchValue);
      }),
      function(d) {return d.id;},
    )
    .attr(
      "transform",
      function(d) {return "translate(" + d.x + "," + d.y + ")";},
    );

  // add new node highlighters
  const nodeHighlighterEnter = thisGraph.nodeHighlighterElements
    .enter();

  const newHighlighterNode = nodeHighlighterEnter
    .append("g")
    .attr(
      "transform",
      function(d) {return "translate(" + d.x + "," + d.y + ")";},
    );

  newHighlighterNode
    .classed("node-highlighter", true);

  newHighlighterNode
    .append("circle")
    .attr("r", "320");

  // remove old links
  const nodeHighlighterExitSelection
    = thisGraph.nodeHighlighterElements.exit();
  nodeHighlighterExitSelection.remove();


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
    .on("mouseover", function(e, d) {
      thisGraph.onHighlight(true, d.source.title + " - " + d.target.title);
    })
    .on("mouseout", function() {
      thisGraph.onHighlight(false);
    })
    .on("mousedown", function(e, d) {
      thisGraph.pathMouseDown(e, d3.select(this), d);
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
    )
    .classed("unconnected", function(d) {
      return !binaryArrayIncludes(thisGraph.connectedNodeIds, d.id);
    });

  // add new nodes
  const nodeEnter = thisGraph.nodeElements
    .enter();

  const newNode = nodeEnter
    .append("g");

  newNode
    .classed(consts.nodeClassName, true)
    .classed("new", function(d) {
      const MAX_NEW_AGE = 1000 * 60 * 60 * 24 * 10; // 10 days
      return Date.now() - d.creationTime < MAX_NEW_AGE;
    })
    .classed("hub", function(d) {
      return d.linkedNotes.length > 7;
    })
    .classed("unconnected", function(d) {
      return !binaryArrayIncludes(thisGraph.connectedNodeIds, d.id);
    })
    .attr(
      "transform",
      function(d) {return "translate(" + d.x + "," + d.y + ")";},
    )
    .on("mouseover", function(e, d) {
      if (state.shiftDragInProgress) {
        d3.select(this).classed(consts.connectClass, true);
      }
      thisGraph.onHighlight(true, d.title);
    })
    .on("mouseout", function() {
      d3.select(this).classed(consts.connectClass, false);
      thisGraph.onHighlight(false);
    })
    .on("mousedown", function(e, d) {
      thisGraph.handleMouseDownOnNode(e, d3.select(this), d);
    })
    .on("mouseup", function(e, d) {
      thisGraph.handleMouseUpOnNode(d3.select(this), d);
    })
    .on("click", function(e, d) {
      if (e.ctrlKey) {
        window.open("/?id=" + d.id, "_blank");
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

  // when the graph is rendered for the first time, no unsaved change has
  // been made, but if the graph is updated a 2nd time, these must be unsaved
  // changes
  if (thisGraph.graphIsRendered) {
    thisGraph.onChange();
  } else {
    thisGraph.graphIsRendered = true;
  }
};


Graph.prototype.zoomed = function(e) {
  const thisGraph = this;

  this.state.justScaleTransGraph = true;
  d3.select("." + this.consts.graphClass)
    .attr(
      "transform",
      "translate("
      + e.transform.x + "," + e.transform.y + ") "
      + "scale(" + e.transform.k + ")",
    );
  thisGraph.screenPosition.translateX = e.transform.x;
  thisGraph.screenPosition.translateY = e.transform.y;
  thisGraph.screenPosition.scale = e.transform.k;
};


Graph.prototype.updateWindow = function(svg) {
  const docEl = document.documentElement;
  const bodyEl = document.getElementsByTagName("body")[0];
  const x = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth;
  const y = window.innerHeight || docEl.clientHeight || bodyEl.clientHeight;
  svg.attr("width", x).attr("height", y);
};


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
  graphInstance.updateGraph();

  return graphInstance;
};


export {
  initGraph,
};


