import { knowEvents } from './globals.js'

/**
 * 
 * @param {HTMLCanvasElement} canvasDom 
 * @param {MouseEvent} eventValue 
 * @returns { {x, y } }
 */
function getMousePosition(canvasDom, eventValue) {
  const rect = canvasDom.getBoundingClientRect()
  return {
    x: eventValue.clientX - rect.left,
    y: eventValue.clientY - rect.top
  }
}

/**
 * @param { [ MouseEvent, MouseEvent ] } drawPoints 
 * @param { HTMLCanvasElement } canvas
 * @typedef { { Number, Number } } Coordinates
 * @returns { Function }
 */
function mapCoordinatesFromEvent(canvas) {
  return function ([ mouseDown, mouseMove ]) {
    this.__lastPosition = this.__lastPosition ?? mouseDown
    const [ from, to ] = [ this.__lastPosition, mouseMove ]
      .map(item => getMousePosition(canvas, item)
    )  
    this.__lastPosition = mouseMove.type === knowEvents.up ? null : mouseMove
  
    return { from, to }
  }
}

/**
 * 
 * @param { TouchEvent } touchEvent 
 * @param { string } mouseEvent 
 * @returns { { x, y }touch }
 */
function mapTouchToMouse(mouseEvent) {
  return (touchEvent) => {
    const [ touch ] = touchEvent.touches.length ? touchEvent.touches : touchEvent.changedTouches
  
    const event = new MouseEvent(mouseEvent, {
      clientX: touch.clientX,
      clientY: touch.clientY
    })
  
    return event
  }
}

/**
 * 
 * @param {Number} ms 
 * @returns 
 */
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))


export { 
  getMousePosition,
  mapTouchToMouse,
  mapCoordinatesFromEvent,
  sleep
}
