/*
  The typescript compiler throws errors for react-router-dom:
  Cannot find namespace 'JSX'.
  That's why we are using this dummy namespace to get rid of the error
*/

declare namespace JSX {
  interface Element {
    x: any
  }
}