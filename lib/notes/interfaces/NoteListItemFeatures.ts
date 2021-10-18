export default interface NoteListItemFeatures {
    readonly containsText: boolean,
    readonly containsWeblink: boolean,
    readonly containsCode: boolean,
    readonly containsImages: boolean,
    readonly containsDocuments: boolean,
    readonly containsAudio: boolean,
    readonly containsVideo: boolean,
}
