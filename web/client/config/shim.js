/*
Request Animation frame polyfill for testing.
 */
global.requestAnimationFrame = (callback) => {
  setTimeout(callback, 0)
}
