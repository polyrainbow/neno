export default interface Stats {
    readonly numberOfAllNotes: number,
    readonly numberOfLinks: number,
    readonly numberOfUnlinkedNotes: number,
    numberOfFiles?: number,
    numberOfPins?: number,
}
