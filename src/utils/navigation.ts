/**
 * Returns true if the click event is a "plain" click (no modifier keys, left button).
 * Use this to decide whether to handle navigation in-page or let the browser
 * open a new tab via the element's href.
 */
export function isPlainClick(event: MouseEvent): boolean {
  return !event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0;
}
