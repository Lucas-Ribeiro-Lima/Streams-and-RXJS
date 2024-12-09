/**
 * 
 * @param {HTMLElement} target 
 * @param {string} eventName 
 * @returns { ReadableStream }
 * 
 */
function FromEvent(target, eventName) {
  let __listener
  return new ReadableStream({
    start(controller) {
      __listener = (e) => {
        e.preventDefault()
        controller.enqueue(e)
      }
      target.addEventListener(eventName, __listener, { passive: false })
    },
    cancel() {
      target.removeEventListener(eventName, __listener)
    }
  })
}

/**
 * 
 * @typedef { ReadableStream | TransformStream } Stream
 * @param {Stream[]} streams 
 * @returns { ReadableStream } 
 * 
 */
function merge(streams) {
    return new ReadableStream({
    start(controller) {
      streams.forEach(stream => {
        const reader = (stream.readable || stream).getReader()
        async function read() {
          const { value, done } = await reader.read()
          if(done) return
          if(!controller.desiredSize) return
          controller.enqueue(value)
          read()
        }
        read()
      })
    }
  })
}

/**
 * 
 * @param { Function } fn 
 * @returns { TransformStream }
 * 
 */
function map(fn) {
  return new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(fn.bind(fn)(chunk))
    }
  })
}

/**
 * 
 * @typedef { function(): ReadableStream | TransformStream } StreamFunction
 * @param { StreamFunction } fn 
 * @param {object} options
 * @param {boolean} options.pairwise
 * 
 * @returns { TransformStream }
 */
function SwitchMap(fn, options = { pairwise: true }) {
  return new TransformStream({
    transform(chunk, controller) {
      const stream = fn(chunk)
      const reader = (stream.readable || stream).getReader()
      async function read() {
        const { value, done } = await reader.read()
        if(done) return
        const result = options.pairwise ? [chunk, value]: value
        controller.enqueue(result)

        return read()
      }

      read()
    }
  })
}

/**
 * 
 * @param {ReadableStream | TransformStream} stream 
 * @returns { TransformStream }
 * 
 */
function TakeUntil(stream) {

  async function readAndTerminate(stream, controller) {
    const reader = (stream.readable || stream).getReader()
    const { value } = await reader.read()
    controller.enqueue(value)
    controller.terminate()
  }

  return new TransformStream({
    start(controller) {
      readAndTerminate(stream, controller)
    },
    transform(chunk, controller) {
      controller.enqueue(chunk)
    }
  })
}

export {
  FromEvent,
  SwitchMap,
  TakeUntil,
  merge,
  map
}


