export default interface Stats {
    readonly numberOfAllNotes: number,
    readonly numberOfLinks: number,
    readonly numberOfUnlinkedNotes: number,
    numberOfFiles?: number,
    numberOfPins?: number,
    numberOfComponents?: number,
    numberOfComponentsWithMoreThanOneNode?: number,
    numberOfHubs?: number,
    maxNumberOfLinksOnANode?: number,
}
