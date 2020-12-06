import DatabaseNote from "./DatabaseNote";
import { Link } from "./Link";
import ScreenPosition from "./ScreenPosition";

export default interface Database {
    id: number,
    timestamp: number,
    notes: DatabaseNote[],
    links: Link[],
    idCounter: number,
    screenPosition: ScreenPosition,
};