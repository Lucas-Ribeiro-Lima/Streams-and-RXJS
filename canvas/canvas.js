const canvas = document.querySelector("#draw-canvas")
const clearBtn = document.querySelector("#clear-btn")
const undoBtn = document.querySelector("#undo-btn")
const redoBtn = document.querySelector("#redo-btn")


/**
 * 
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} width 
 * @param {Number} height 
 * @returns { void }
 */
const resetCanvas = (ctx, width, height) => {
  const parent = canvas.parentElement
  canvas.width = width || parent.clientWidth * 0.9
  canvas.height = height || parent.clientHeight * 1.5

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.strokeStyle = "green"
  ctx.lineWidth = 4
}

export const CanvasContext = {
  canvas,
  clearBtn,
  undoBtn,
  redoBtn,
  resetCanvas
}

