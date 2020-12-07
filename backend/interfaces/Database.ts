import { DatabaseId } from "./DatabaseId.js";
import DatabaseNote from "./DatabaseNote.js";
import { Link } from "./Link.js";
import ScreenPosition from "./ScreenPosition.js";

export default interface Database {
    readonly id: DatabaseId,
    timestamp: number,
    notes: DatabaseNote[],
    links: Link[],
    idCounter: number,
    screenPosition: ScreenPosition,
};