export interface GraphSize {
  graph: number,
  files: number,
}


interface GraphStatsMetadata {
  readonly size: GraphSize,
  readonly createdAt: number,
  readonly updatedAt: number,
}


interface GraphStatsAnalysis {
  readonly numberOfComponents: number,
  readonly numberOfComponentsWithMoreThanOneNode: number,
}
export default interface GraphStats {
  readonly numberOfAllNotes: number,
  readonly numberOfLinks: number,
  readonly numberOfFiles: number,
  readonly numberOfPins: number,
  readonly numberOfAliases: number,
  readonly numberOfUnlinkedNotes: number,
  metadata?: GraphStatsMetadata,
  analysis?: GraphStatsAnalysis,
  readonly id?: string,
}
