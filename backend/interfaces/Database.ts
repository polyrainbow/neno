import DatabaseNote from "./DatabaseNote.js";
import { Link } from "./Link.js";
import ScreenPosition from "./ScreenPosition.js";

export default interface Database {
    id: number,
    timestamp: number,
    notes: DatabaseNote[],
    links: Link[],
    idCounter: number,
    screenPosition: ScreenPosition,
};