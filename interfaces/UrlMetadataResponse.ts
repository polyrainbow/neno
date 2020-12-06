import EditorData from "./EditorData";
import LinkedNote from "./LinkedNote";
import { NoteId } from "./NoteId";

export default interface UrlMetadataResponse {
    success: number,
    url: string,
    meta: {
        title: string,
        description: string,
        image: {
            url: string,
        },
    }
}