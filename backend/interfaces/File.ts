export interface File {
  // The size of the uploaded file in bytes.
  // If the file is still being uploaded (see `'fileBegin'` event),
  // this property says how many bytes of the file have been written to disk yet.
  size: number;
 
  // The path this file is being written to. You can modify this in the `'fileBegin'` event in
  // case you are unhappy with the way formidable generates a temporary path for your files.
  path: string;
 
  // The name this file had according to the uploading client.
  name: string | null;
 
  // The mime type of this file, according to the uploading client.
  type: string | null;
 
  // A Date object (or `null`) containing the time this file was last written to.
  // Mostly here for compatibility with the [W3C File API Draft](http://dev.w3.org/2006/webapi/FileAPI/).
  lastModifiedDate: Date | null;
 
  // If `options.hash` calculation was set, you can read the hex digest out of this var.
  hash: string | 'sha1' | 'md5' | 'sha256' | null;
}