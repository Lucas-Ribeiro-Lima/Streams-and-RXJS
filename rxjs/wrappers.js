import { merge, map } from "./operators.js";

/**
 * @typedef { ReadableStream | TransformStream } StreamEvents
 * @param {StreamEvents[]} streamEvents 
 * @returns { ReadableStream }
 */
function FromAllEvents(streamEvents) {
  return merge([...streamEvents])
}

/**
 * 
 * @param { ReadableStream | TransformStream } fromEvent 
 * @param { Function } mapFn 
 * @returns {  TransformStream }
 */
function FromEventToEvent(fromEvent, mapFn) {
  return fromEvent
    .pipeThrough(map(e => mapFn(e)))
}


export {
  FromAllEvents,
  FromEventToEvent
}