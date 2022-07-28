/* 
  SomeReadableStream can be anything, depending on
  what kind of environment the Notes module is started in
  E. g. it could be ReadableStream or NodeJS.ReadStream, etc.
  As these types are quite different so we do not use a union type.
*/
export type SomeReadableStream = any;