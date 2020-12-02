/* eslint-disable no-invalid-this */
import * as d3 from "d3";


const GraphCreator = function(svg, graphObject, onHighlight, onChange) {
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
  thisGraph.svgG = svg.append("g")
    .classed(thisGraph.consts.graphClass, true);
  const svgG = thisGraph.svgG;

  // displayed when dragging between nodes
  thisGraph.newLinkLine = svgG.append("svg:path")
    .attr("class", "link newLinkLine hidden")
    .attr("d", "M0,0L0,0");

  thisGraph.nodeHighlighterContainer = svgG.append("g")
    .classed("note-highlighters", true);

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
    .on("end", function(d) {
      thisGraph.replaceSelectNode(d3.select(this), d);
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
    thisGraph.onChange();
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
};


GraphCreator.prototype.getSaveData = () => {
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


GraphCreator.prototype.getSelectedNodeId = function() {
  const thisGraph = this;

  if (!thisGraph.state.selectedNode) {
    return;
  }

  return thisGraph.state.selectedNode.id;
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
    return thisGraph.links.splice(thisGraph.links.indexOf(l), 1);
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
  if (thisGraph.state.selectedNode) {
    thisGraph.removeSelectFromNode();
  }
  d3Node.classed(this.consts.selectedClass, true);

  const connectedNodeIds = nodeData.linkedNotes.map((node) => node.id);

  thisGraph.nodesContainer.selectAll("g.node")
    .filter((d) => {
      return connectedNodeIds.includes(d.id);
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

GraphCreator.prototype.removeSelectFromNode = function() {
  const thisGraph = this;
  thisGraph.nodesContainer.selectAll("g.node.selected")
    .classed(this.consts.selectedClass, false);

  thisGraph.nodesContainer.selectAll("g.node.connected-to-selected")
    .classed("connected-to-selected", false);

  thisGraph.linksContainer.selectAll("path.link.connected-to-selected")
    .classed("connected-to-selected", false);

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
    // we cannot prevent default because then we cannot delete values from
    // search input
    // d3.event.preventDefault();
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
      thisGraph.updateGraph();
    }
    break;
  }
};

GraphCreator.prototype.svgKeyUp = function() {
  this.state.lastKeyDown = -1;
};

// call to propagate changes to graph
GraphCreator.prototype.updateGraph = function(newSearchValue) {
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
    .on("mouseover", function(d) {
      thisGraph.onHighlight(true, d.source.title + " - " + d.target.title);
    })
    .on("mouseout", function() {
      thisGraph.onHighlight(false);
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

  const connectedNodeIds = thisGraph.links.reduce((accumulator, link) => {
    accumulator.push(link.source.id);
    accumulator.push(link.target.id);
    return accumulator;
  }, []);

  // update existing nodes
  thisGraph.nodeElements
    .attr(
      "transform",
      function(d) {return "translate(" + d.x + "," + d.y + ")";},
    )
    .classed("unconnected", function(d) {
      return !connectedNodeIds.includes(d.id);
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
      return !connectedNodeIds.includes(d.id);
    })
    .attr(
      "transform",
      function(d) {return "translate(" + d.x + "," + d.y + ")";},
    )
    .on("mouseover", function(d) {
      if (state.shiftDragInProgress) {
        d3.select(this).classed(consts.connectClass, true);
      }
      thisGraph.onHighlight(true, d.title);
    })
    .on("mouseout", function() {
      d3.select(this).classed(consts.connectClass, false);
      thisGraph.onHighlight(false);
    })
    .on("mousedown", function(d) {
      thisGraph.handleMouseDownOnNode(d3.select(this), d);
    })
    .on("mouseup", function(d) {
      thisGraph.handleMouseUpOnNode(d3.select(this), d);
    })
    .on("click", function(d) {
      if (d3.event.ctrlKey) {
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


GraphCreator.prototype.zoomed = function() {
  const thisGraph = this;

  this.state.justScaleTransGraph = true;
  d3.select("." + this.consts.graphClass)
    .attr(
      "transform",
      "translate("
      + d3.event.transform.x + "," + d3.event.transform.y + ") "
      + "scale(" + d3.event.transform.k + ")",
    );
  thisGraph.screenPosition.translateX = d3.event.transform.x;
  thisGraph.screenPosition.translateY = d3.event.transform.y;
  thisGraph.screenPosition.scale = d3.event.transform.k;
};


GraphCreator.prototype.updateWindow = function(svg) {
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

  const graphInstance = new GraphCreator(
    svg, graphObject, onHighlight, onChange,
  );
  graphInstance.updateGraph();

  return graphInstance;
};


export {
  initGraph,
};


