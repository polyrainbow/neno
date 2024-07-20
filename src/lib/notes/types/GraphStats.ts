export interface GraphSize {
  total: number,
  notes: number,
  files: number,
}


interface GraphStatsMetadata {
  readonly size: GraphSize,
  readonly createdAt: string,
  readonly updatedAt: string,
  readonly version: string,
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
