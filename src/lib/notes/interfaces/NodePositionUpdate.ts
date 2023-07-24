import NodePosition from "./NodePosition.js";
import { Slug } from "./Slug.js";

export default interface NodePositionUpdate {
  slug: Slug,
  position: NodePosition,
}
