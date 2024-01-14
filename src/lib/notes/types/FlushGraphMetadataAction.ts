/*
  An enum that determines if and how graph metadata should be written to disk
  on a flush.
*/

enum WriteGraphMetadataAction {
  NONE = "NONE",
  WRITE = "WRITE",
  UPDATE_TIMESTAMP_AND_WRITE = "UPDATE_TIMESTAMP_AND_WRITE",
}

export default WriteGraphMetadataAction;
