import { FromEvent, TakeUntil, SwitchMap, map } from "../rxjs/operators.js"
import { mapCoordinatesFromEvent, mapTouchToMouse, sleep } from "../utils.js"
import { FromAllEvents, FromEventToEvent } from "../rxjs/wrappers.js"
import { knowEvents }from '../globals.js'

/**
 * @param {object} CanvasContext
 * @param { HTMLCanvasElement } CanvasContext.canvas
 * @param { HTMLButtonElement } CanvasContext.clearBtn
 * @param { HTMLButtonElement } CanvasContext.undoBtn
 * @param { HTMLButtonElement } CanvasContext.redoBtn
 * @param { Function } CanvasContext.resetCanvas
 * 
 * @param { Object} store
 * @param { Array } store.db
 * @param { Array } store.junk
 * @param { Function } store.get
 * @param { Function } store.getJunk
 * @param { Function } store.set
 * @param { Function } store.undo
 * @param { Function } store.clear
 * 
 * @returns { void }
 */
export function DrawControls({ canvas, clearBtn, resetCanvas }, store) {
  const ctx = canvas.getContext("2d")

  resetCanvas(ctx)

  const DrawEvents = {
    start: element => {
      return(
        FromAllEvents([
          FromEvent(element, knowEvents.down), 
          FromEventToEvent(FromEvent(element, knowEvents.touchstart), mapTouchToMouse(knowEvents.down))
        ])
      )
    },
    move: element => {
      return(
        FromAllEvents([
          FromEvent(element, knowEvents.move), 
          FromEventToEvent(FromEvent(element, knowEvents.touchmove), mapTouchToMouse(knowEvents.move))
        ])
      )
    },
    stop: element => {
      return(
        FromAllEvents([          
          FromEvent(element, knowEvents.up),
          FromEvent(element, knowEvents.leave),
          FromEventToEvent(FromEvent(element, knowEvents.touchend), mapTouchToMouse(knowEvents.up)
        )])
      )
    },
    click: element => FromEvent(element, knowEvents.click)
  }

  DrawEvents.start(canvas)
  .pipeThrough(
    SwitchMap( _ => 
      DrawEvents.move(canvas)
      .pipeThrough(TakeUntil(
        DrawEvents.stop(canvas)
      ))
    )
  )
  .pipeThrough(
    map(mapCoordinatesFromEvent(canvas))
  )
  .pipeTo(
    new WritableStream({
      write({ from, to }) {
        store.set({ from, to })
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
        ctx.stroke()  
      }
    })
  )

  DrawEvents.click(clearBtn)
  .pipeTo(
    new WritableStream({
      async write() {
        ctx.beginPath()
        ctx.strokeStyle = "white"
        await store.get().forEach(({ from, to }) => {
          sleep(5)
          ctx.moveTo(to.x, to.y)
          ctx.lineTo(from.x, from.y)
          ctx.stroke()
        })
        store.clear()
        resetCanvas(ctx, canvas.width, canvas.height)
      },
    })
  )
}