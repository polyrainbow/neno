

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
  shortenText,
} from "./utils";
import BackendGraphVisualization
  from "../lib/notes/interfaces/GraphVisualization";
import FrontendGraphVisualization, {
  GraphVisualizationLink,
  GraphVisualizationMode,
}
  from "../types/GraphVisualization";
import GraphVisualizationNode
  from "../lib/notes/interfaces/GraphVisualizationNode";
import { Link } from "../lib/notes/interfaces/Link";
import GraphVisualizationFromUser
  from "../lib/notes/interfaces/GraphVisualizationFromUser";
import ScreenPosition from "../lib/notes/interfaces/ScreenPosition";
import NodePosition from "../lib/notes/interfaces/NodePosition";
import GraphVisualizerConfig, {
  HighlightDetails,
} from "../types/GraphVisualizerConfig";
import { Delaunay } from "d3";
import { Slug } from "./notes/interfaces/Slug";


export default class GraphVisualization {
  /** ********************
    STATIC
  ***********************/

  static #consts = {
    selectedClass: "selected",
    connectClass: "connect-node",
    nodeClassName: "node",
    graphClass: "graph",
    BACKSPACE_KEY: 8,
    DELETE_KEY: 46,
    ENTER_KEY: 13,
    ESCAPE_KEY: 27,
    C_KEY: 67,
    L_KEY: 76,
    S_KEY: 83,
    nodeRadius: 50,
    nodeRadiusHubsOnly: 150,
    newNodeIndicatorSize: 4 * 50,
    MAX_NODE_TEXT_LENGTH: 55,
    // minimum and maximum zoom
    SCALE_EXTENT: [0.01, 10] as [number, number],
    MIN_LINKS_HUB: 8,
  };


  static prepareGraphObject = (
    backendGraph: BackendGraphVisualization,
  ): FrontendGraphVisualization => {
    const frontendGraph: FrontendGraphVisualization = {
      ...backendGraph,
      links: backendGraph.links
        .map(
          (link: Link): GraphVisualizationLink => {
            return [
              backendGraph.nodes.find(
                (node) => node.slug === link[0],
              ) as GraphVisualizationNode,
              backendGraph.nodes.find(
                (node) => node.slug === link[1],
              ) as GraphVisualizationNode,
            ];
          },
        )
        .filter((link) => link[0] && link[1]),
    };

    return frontendGraph;
  };


  static #isNode(value): value is GraphVisualizationNode {
    return !GraphVisualization.#isEdge(value);
  }


  static #isEdge(value): value is GraphVisualizationLink {
    return !!(value[0] && value[1]);
  }

  /*
    This class uses the top left corner of the SVG element as reference
    position for translations. From a user's perspective however, it makes
    more sense to have the center position as reference. That way, the user
    sees the same content in the middle of the screen when using multiple
    devices with different screen sizes or simply resizes the browser window.
    That means we want to save the center position of the graph visualization
    in the database graph object.
    So every time we get a screen position object from the database or
    save one to the database, we need to transform it first with this function.
  */
  static #transformScreenPosition = (
    center: ScreenPosition,
    svgRect: DOMRect,
  ): ScreenPosition => {
    return {
      translateX: (-center.translateX) + (svgRect.width / 2),
      translateY: (-center.translateY) + (svgRect.height / 2),
      scale: center.scale,
    };
  };


  /** ********************
    PRIVATE VARS
  ***********************/

  #searchValue = "";
  #onHighlight: (highlightDetails: HighlightDetails) => void;
  #onChange: (() => void) | undefined;
  #openNote: (slug: Slug) => void;
  #nodes: GraphVisualizationNode[];
  #links: GraphVisualizationLink[];
  #screenPosition: ScreenPosition;
  #initialNodePosition: NodePosition;
  #parent: HTMLElement;
  #svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  #slugsOfAllNodesWithAtLeast1LinkedNote: Set<Slug> = new Set();
  #updatedNodes = new Set<GraphVisualizationNode>();
  #mouseDownNode: GraphVisualizationNode | null = null;
  #justDragged = false;
  #justScaleTransGraph = false;
  #lastKeyDown = -1;
  #newLinkCreationInProgress = false;
  #selection = new Set<GraphVisualizationNode>();
  #connectedNodeIdsOfSelection: Slug[] = [];
  #mode: GraphVisualizationMode | null = null;

  #mainSVGGroup: d3.Selection<SVGGElement, unknown, null, undefined>;
  #inpiGroup: d3.Selection<SVGGElement, unknown, null, undefined>;
  #voronoyGroup: d3.Selection<SVGGElement, unknown, null, undefined>;
  #gridLines: d3.Selection<SVGGElement, unknown, null, undefined>;
  // eslint-disable-next-line max-len
  #initialNodePositionIndicator: d3.Selection<SVGRectElement, unknown, null, undefined> | null = null;
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

  /** ********************
    CONSTRUCTOR
  ***********************/

  constructor({
    parent,
    graphObject,
    onHighlight,
    onChange,
    initialFocusNoteSlug,
    openNote,
    initialMode,
  }: GraphVisualizerConfig) {
    const graphObjectPrepared: FrontendGraphVisualization
      = GraphVisualization.prepareGraphObject(graphObject);
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

    const svgElement = this.#svg.node();
    if (!svgElement) throw new Error("No SVG element found");
    const svgRect: DOMRect = svgElement.getBoundingClientRect();

    // ... we'll overwrite it if a valid note to focus is given
    if (
      typeof initialFocusNoteSlug === "string"
      && initialFocusNoteSlug.length > 0) {
      // set initial node in the center of the screen
      const node = this.#nodes.find(
        (node) => node.slug === initialFocusNoteSlug,
      );

      if (typeof node === "object") {
        const SCALE = 1.5;
        this.#screenPosition = {
          translateX: (-node.position.x * SCALE) + (svgRect.width / 2),
          translateY: (-node.position.y * SCALE) + (svgRect.height / 2),
          scale: SCALE,
        };
      } else {
        // by default, we're using the screenPosition from the database ...
        this.#screenPosition = GraphVisualization.#transformScreenPosition(
          graphObjectPrepared.screenPosition,
          svgRect,
        );
      }
    } else {
      // by default, we're using the screenPosition from the database ...
      this.#screenPosition = GraphVisualization.#transformScreenPosition(
        graphObjectPrepared.screenPosition,
        svgRect,
      );
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

    this.#inpiGroup = this.#mainSVGGroup.append("g")
      .classed("new-node-position-indicator", true);

    this.#voronoyGroup = this.#mainSVGGroup.append("g")
      .classed("voronoy-group", true);

    this.#nodeHighlighterContainer = mainSVGGroup.append("g")
      .classed("note-highlighters", true);

    // displayed when dragging between nodes - should be rendered in front of
    // node highlighter circles, so this code is placed after node highlighter g
    // creation code
    this.#newLinkLine = mainSVGGroup.append("svg:path")
      .attr("class", "link new-link-line hidden")
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
          && (!this.#sKeyIsPressed)
          && this.#mode !== GraphVisualizationMode.HUBS_ONLY;
      })
      .on("drag", (e, d) => {
        const node = d as GraphVisualizationNode;
        this.#justDragged = true;

        const nodesToDrag = Array.from(this.#selection)
          .filter(GraphVisualization.#isNode);

        // also drag mouse down node, regardless of if it's selected or not
        if (!nodesToDrag.includes(node)) {
          nodesToDrag.push(node);
        }

        nodesToDrag
          .forEach((node) => {
            node.position.x += e.dx;
            node.position.y += e.dy;

            this.#updatedNodes.add(node);
          });

        this.#updateGraph({ type: "NODE_DRAG", node });
        this.#onChange?.();
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

    // listen for dragging and zooming
    const zoom = d3.zoom()
      .scaleExtent(GraphVisualization.#consts.SCALE_EXTENT)
      .filter((e) => {
        // enable graph dragging with left and middle mouse buttons
        return e.button === 0 || e.button === 1;
      });

    zoom.on("zoom", (e) => {
      const { x, y, k } = e.transform;

      this.#justScaleTransGraph = true;
      d3.select("." + GraphVisualization.#consts.graphClass)
        .attr(
          "transform",
          `translate(${x}, ${y}) scale(${k})`,
        );

      this.#screenPosition = {
        translateX: x,
        translateY: y,
        scale: k,
      };
    });

    zoom.on("start", (e) => {
      if (!e.shiftKey) {
        d3.select("body").style("cursor", "move");
      }
    });
    // @ts-ignore
    svg.call(zoom).on("dblclick.zoom", null);

    // when creating the graph, a zoom end event is initially dispatched.
    // since this first one does not change anything, we don't want to fire the
    // onChange event
    let firstZoomEndHappened = false;

    zoom.on("end", () => {
      d3.select("body").style("cursor", "auto");
      if (firstZoomEndHappened) {
        this.#onChange?.();
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
    // @ts-ignore
    zoom.transform(svg, initialZoomTranform);

    // listen for resize
    window.onresize = () => this.#updateWindow(svg);

    this.#updateConnectedNodeIds();

    // by default, text rendering is activated, if the number of nodes is <= 500
    this.setMode(initialMode || GraphVisualizationMode.DEFAULT);
  }


  /** ********************
    PRIVATE METHODS
  ***********************/

  #isHub(node: GraphVisualizationNode): boolean {
    return this.#links.filter((link) => {
      return link[0].slug === node.slug
        || link[1].slug === node.slug;
    }).length >= GraphVisualization.#consts.MIN_LINKS_HUB;
  }


  #updateConnectedNodeIds(): void {
    this.#slugsOfAllNodesWithAtLeast1LinkedNote = new Set(
      this.#links
        .reduce(
          (accumulator: Slug[], link) => {
            accumulator.push(link[0].slug);
            accumulator.push(link[1].slug);
            return accumulator;
          },
          [],
        ),
    );
  }


  #newPathMove(e, originNode): void {
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
  // http://stackoverflow.com/questions/13241475/how-do-i-include-newlines-in-
  // labels-in-d3-charts
  #insertTitleLinebreaks(gEl, title: string): void {
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
      if (i > 0) {
        tspan.attr("x", 0).attr("dy", "15");
      }
    }
  }


  #getBoundaries(): { xmin: number, ymin: number, xmax: number, ymax: number } {
    return this.#nodes.reduce(
      (boundaries, node) => {
        const pos = node.position;
        if (pos.x < boundaries.xmin) boundaries.xmin = pos.x;
        if (pos.x > boundaries.xmax) boundaries.xmax = pos.x;
        if (pos.y < boundaries.ymin) boundaries.ymin = pos.y;
        if (pos.y > boundaries.ymax) boundaries.ymax = pos.y;
        return boundaries;
      },
      {
        xmin: 0,
        ymin: 0,
        xmax: 0,
        ymax: 0,
      },
    );
  }


  #getConnectedNodeIdsOfSelection(selection: GraphVisualizationNode[]): Slug[] {
    const slugs = selection.reduce((accumulator: Slug[], newValue) => {
      const linkedSlugs: Slug[] = this.#getLinkedNodes(newValue)
        .map((node) => node.slug);
      accumulator.push(...linkedSlugs);

      return accumulator;
    }, []);

    return Array.from(new Set(slugs));
  }


  #setSelection(
    values: GraphVisualizationNode[],
  ): void {
    this.#selection = new Set(values);

    this.#connectedNodeIdsOfSelection
      = this.#getConnectedNodeIdsOfSelection(Array.from(this.#selection));

    this.#updateGraph();
  }


  #addToSelection(
    values: GraphVisualizationNode[],
  ): void {
    values.forEach((value) => {
      this.#selection.add(value);
    });

    this.#connectedNodeIdsOfSelection
      = this.#getConnectedNodeIdsOfSelection(
        Array.from(this.#selection),
      );

    this.#updateGraph();
  }


  #toggleSelection(
    values: GraphVisualizationNode[],
  ): void {
    values.forEach((value) => {
      if (this.#selection.has(value)) {
        this.#selection.delete(value);
      } else {
        this.#selection.add(value);
      }
    });

    this.#connectedNodeIdsOfSelection
      = this.#getConnectedNodeIdsOfSelection(
        Array.from(this.#selection),
      );

    this.#updateGraph();
  }


  #getLinksOfNode(node) {
    const linksOfThisNote = this.#links
      .filter((link) => {
        return (link[0] === node) || (link[1] === node);
      });

    return linksOfThisNote;
  }


  #getLinkedNodes(node) {
    const linkedNodes = this.#getLinksOfNode(node)
      .map((link) => {
        const linkedNote
          = (link[0] === node) ? link[1] : link[0];
        return linkedNote;
      });

    return linkedNodes;
  }


  /*
    Adds all linked nodes of the currently selected nodes to the selection.
    The param maxLinksOfLinkedNotes limits the addition to nodes that have
    not more than this number of links. This is useful when the user
    wants to select a hub with its surrounding satellite nodes, but not other
    hubs connected to the hub. Set this value to 0, NaN or -1 to disable the
    filter.
  */
  #addLinkedNodesToSelection(maxLinksOfLinkedNotes: number): void {
    Array.from(this.#selection).forEach((value) => {
      if (GraphVisualization.#isEdge(value)) return;
      let nodesToAdd = this.#getLinkedNodes(value);
      if (maxLinksOfLinkedNotes > 0) {
        nodesToAdd = nodesToAdd
          .filter((node: GraphVisualizationNode): boolean => {
            return this.#getLinkedNodes(node).length <= maxLinksOfLinkedNotes;
          });
      }
      this.#addToSelection(nodesToAdd);
    });
  }


  #handleMouseDownOnNode(e, d: GraphVisualizationNode) {
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
      this.#toggleSelection([d]);
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
      const newEdge: GraphVisualizationLink = [mouseDownNode, mouseUpNode];

      // check if such an edge is already there ...
      const edgeAlreadyExists = this
        .#linksContainer
        .selectAll("path.link")
        .filter(
          (d: GraphVisualizationLink) => {
            return (
              (d[0] === newEdge[0] && d[1] === newEdge[1])
              || (d[0] === newEdge[1] && d[1] === newEdge[0])
            );
          },
        )
        .size() !== 0;

      // ... if not, create it
      if (!edgeAlreadyExists) {
        this.#links.push(newEdge);
        this.#onChange?.();
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
      case consts.ESCAPE_KEY:
      case consts.C_KEY:
        this.#setSelection([]);
        break;
      case consts.L_KEY:
        this.#addLinkedNodesToSelection(0);
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
  #updateGraph(event?): void {
    const consts = GraphVisualization.#consts;

    /** ********************
      Initial node position indicator
    ***********************/

    this.#initialNodePositionIndicator
      ?.attr("x",
        this.#initialNodePosition.x - (consts.newNodeIndicatorSize / 2),
      )
      .attr("y",
        this.#initialNodePosition.y - (consts.newNodeIndicatorSize / 2),
      );

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
      .data(
        (
          this.#mode === GraphVisualizationMode.DEFAULT
          || this.#mode === GraphVisualizationMode.NO_LABELS
        )
          ? this.#links
          : [],
      );

    // update existing links
    this.#linkElements
      .classed(consts.selectedClass, (edge) => {
        return this.#selection.has(edge);
      })
      .attr("d", (d: GraphVisualizationLink) => {
        return "M" + d[0].position.x + "," + d[0].position.y
          + "L" + d[1].position.x + "," + d[1].position.y;
      })
      .classed("connected-to-selected", (edge: GraphVisualizationLink) => {
        // only nodes can be connected to a link, links cannot be connected to
        // other links

        const idsOfSelectedNodes = Array.from(this.#selection)
          .filter(GraphVisualization.#isNode)
          .map((val) => val.slug);

        return (
          idsOfSelectedNodes.includes(edge[0].slug)
          || idsOfSelectedNodes.includes(edge[1].slug)
        );
      });


    // add new links
    this.#linkElements
      .enter()
      .append("path")
      .classed("link", true)
      .attr("d", (d: GraphVisualizationLink) => {
        return "M" + d[0].position.x + "," + d[0].position.y
        + "L" + d[1].position.x + "," + d[1].position.y;
      })
      .on("mouseover", (_e, d: GraphVisualizationLink) => {
        this.#onHighlight({
          active: true,
          type: "edge",
          titles: [d[0].title, d[1].title],
        });
      })
      .on("mouseout", () => {
        this.#onHighlight({
          active: false,
        });
      });

    // remove old links
    this.#linkElements
      = this.#linkElements.exit().remove();

    /** ********************
      nodes
    ***********************/

    // create node selection
    this.#nodeElements = this.#nodesContainer.selectAll("g.node");

    const nodesData = this.#mode === GraphVisualizationMode.HUBS_ONLY
      ? this.#nodes.filter(this.#isHub)
      : (
        this.#mode === GraphVisualizationMode.DEFAULT
        || this.#mode === GraphVisualizationMode.NO_LABELS
      )
        ? this.#nodes
        : [];

    // append new node data
    this.#nodeElements = this.#nodeElements
      .data(
        nodesData,
        (d) => d.id,
      );

    // update node positions of moved/dragged nodes
    this.#nodeElements
      .filter((d) => {
        if (event?.type === "INFLATION") return true;

        const draggedNode = event?.type === "NODE_DRAG" && event.node;

        const selectedNodeIds = Array.from(this.#selection)
          .filter(GraphVisualization.#isNode)
          .map((node) => node.slug);

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
        return this.#slugsOfAllNodesWithAtLeast1LinkedNote.has(d.id);
      })
      .classed("selected", (node) => {
        return this.#selection.has(node);
      })
      .classed("connected-to-selected", (node) => {
        return this.#connectedNodeIdsOfSelection.includes(node.id);
      })
      .select("circle")
      .attr("r", String(
        this.#mode === GraphVisualizationMode.HUBS_ONLY
          ? consts.nodeRadiusHubsOnly
          : consts.nodeRadius,
      ));


    // add new nodes
    this.#nodeElements
      .enter()
      .append("g")
      .classed(consts.nodeClassName, true)
      .classed("new", (d: GraphVisualizationNode) => {
        const MAX_NEW_AGE = 1000 * 60 * 60 * 24 * 10; // 10 days
        return Date.now() - d.createdAt < MAX_NEW_AGE;
      })
      .classed("hub", (d) => this.#isHub(d))
      .classed("unconnected", (d) => {
        return this.#slugsOfAllNodesWithAtLeast1LinkedNote.has(d.id);
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
      .call(this.#nodeDrag)
      .append("circle")
      .attr("r", String(
        this.#mode === GraphVisualizationMode.HUBS_ONLY
          ? consts.nodeRadiusHubsOnly
          : consts.nodeRadius,
      ));


    // remove old nodes
    this.#nodeElements
      .exit()
      .remove();
  }


  #updateWindow(svg) {
    const { width, height } = this.#parent.getBoundingClientRect();
    svg.attr("width", width).attr("height", height);
  }


  /** *****************
    PUBLIC METHODS
  ********************/


  getSaveData(): GraphVisualizationFromUser {
    const nodePositionUpdates = Array.from(this.#updatedNodes)
      .map((node: GraphVisualizationNode) => {
        return {
          slug: node.slug,
          position: node.position,
        };
      });

    const svgElement = this.#svg.node();
    if (!svgElement) throw new Error("No SVG element found");
    const svgRect = svgElement.getBoundingClientRect();

    const graphObject: GraphVisualizationFromUser = {
      nodePositionUpdates,
      screenPosition: GraphVisualization.#transformScreenPosition(
        this.#screenPosition,
        svgRect,
      ),
      initialNodePosition: this.#initialNodePosition,
    };

    return graphObject;
  }


  getSelectedNodeIds(): Slug[] {
    return Array.from(this.#selection)
      .filter(GraphVisualization.#isNode)
      .map((val) => val.slug);
  }


  setSearchValue(newSearchValue: string): void {
    if (typeof newSearchValue === "string") {
      this.#searchValue = newSearchValue;
    }
    this.#updateGraph();
  }


  setMode(mode: GraphVisualizationMode): void {
    if (this.#mode === mode) return;

    this.#mode = mode;
    this.#setSelection([]);
    this.#inpiGroup.select("rect").remove();
    this.#voronoyGroup.selectAll("path").remove();
    d3.selectAll("text").remove();

    if (
      this.#mode === GraphVisualizationMode.DEFAULT
      || this.#mode === GraphVisualizationMode.NO_LABELS
    ) {
      // drag intitial node position indicator
      this.#inpIndicatorDrag = d3.drag()
        .subject((event) => {
          return { x: event.x, y: event.y };
        })
        .on("drag", (e) => {
          this.#initialNodePosition.x += e.dx;
          this.#initialNodePosition.y += e.dy;
          this.#onChange?.();
          this.#updateGraph();
        });

      this.#initialNodePositionIndicator = this.#inpiGroup
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
        })
        .call(this.#inpIndicatorDrag);
    }

    if (
      mode === GraphVisualizationMode.VORONOY
      || mode === GraphVisualizationMode.VORONOY_HUBS
    ) {
      const nodes = mode === GraphVisualizationMode.VORONOY_HUBS
        ? this.#nodes.filter(this.#isHub)
        : this.#nodes;
      const points = nodes.map(
        (node) => [node.position.x, node.position.y],
      );
      const delaunay = Delaunay.from(points);
      const boundaries = this.#getBoundaries();
      const voronoy = delaunay.voronoi([
        boundaries.xmin,
        boundaries.ymin,
        boundaries.xmax,
        boundaries.ymax,
      ]);

      this.#voronoyGroup
        .append("path")
        .attr("d", voronoy.renderBounds())
        .style("stroke", "white")
        .style("stroke-width", "20");

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        const svgPath = voronoy.renderCell(i);
        this.#voronoyGroup
          .append("path")
          .attr("d", svgPath)
          .style("stroke", "white")
          .style("fill", d3.schemeCategory10[i % 10])
          .style("stroke-width", "10");

        this.#voronoyGroup
          .append("text")
          .attr(
            "transform",
            "translate(" + node.position.x + "," + node.position.y + ")",
          )
          .text(nodes[i].title)
          .attr("text-anchor", "middle")
          .style(
            "font-size",
            mode === GraphVisualizationMode.VORONOY_HUBS ? "72px" : "36px",
          );
      }
    }

    this.#updateGraph();

    if (this.#mode !== GraphVisualizationMode.NO_LABELS) {
      d3.selectAll("g." + GraphVisualization.#consts.nodeClassName)
        .each((d, i, domElements) => {
          const node = d as GraphVisualizationNode;
          const domElement = domElements[i];
          this.#insertTitleLinebreaks(
            d3.select(domElement),
            node.title,
          );
        });
    }
  }


  inflateGraph(factor: number): void {
    this.#nodes
      .forEach((node) => {
        node.position.x *= factor;
        node.position.y *= factor;

        this.#updatedNodes.add(node);
      });

    this.#updateGraph({ type: "INFLATION" });
    this.#onChange?.();
  }


  inflateSelection(factor: number): void {
    const selectedNodes
      = Array.from(this.#selection).filter(GraphVisualization.#isNode);

    if (selectedNodes.length < 2) {
      throw new Error("Not enough nodes selected");
    }

    const boundaries = {
      xmin: selectedNodes[0].position.x,
      xmax: selectedNodes[0].position.x,
      ymin: selectedNodes[0].position.y,
      ymax: selectedNodes[0].position.y,
    };

    selectedNodes.slice(1)
      .forEach((node) => {
        (node.position.x < boundaries.xmin)
          && (boundaries.xmin = node.position.x);
        (node.position.x > boundaries.xmax)
          && (boundaries.xmax = node.position.x);
        (node.position.y < boundaries.ymin)
          && (boundaries.ymin = node.position.y);
        (node.position.y > boundaries.ymax)
          && (boundaries.ymax = node.position.y);
      });

    const center = {
      x: (boundaries.xmax + boundaries.xmin) / 2,
      y: (boundaries.ymax + boundaries.ymin) / 2,
    };

    selectedNodes
      .forEach((node) => {
        const originalVectorFromCenter = {
          x: node.position.x - center.x,
          y: node.position.y - center.y,
        };

        const newVectorFromCenter = {
          x: originalVectorFromCenter.x * factor,
          y: originalVectorFromCenter.y * factor,
        };

        node.position.x = center.x + newVectorFromCenter.x;
        node.position.y = center.y + newVectorFromCenter.y;

        this.#updatedNodes.add(node);
      });

    this.#updateGraph({ type: "INFLATION" });
    this.#onChange?.();
  }
}

