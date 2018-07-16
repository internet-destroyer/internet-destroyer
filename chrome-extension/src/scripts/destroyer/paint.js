import { default as $ } from 'jquery'

let setData
let setRegisterChange
;(function() {
  let registerChange = null
  const $canvas = $('<canvas id="invader-canvas"></cancas>').css({
    position: 'absolute',
    top: 0,
    left: 0,
    'pointer-events': 'none',
    'z-index': 9999999,
  })
  $canvas.appendTo($('body'))
  var canvas = document.getElementById('invader-canvas')
  var context = canvas.getContext('2d')
  var height = (canvas.height = window.innerHeight)
  var width = (canvas.width = window.innerWidth)
  var mouseClicked = false
  var lastX = 0,
    lastY = 0

  setData = imageData => {
    var img = new Image()
    img.src = imageData
    img.onload = function() {
      context.drawImage(img, 0, 0)
    }
  }

  setRegisterChange = _registerChange => (registerChange = _registerChange)

  document.addEventListener('mousemove', onMouseMove, false)
  document.addEventListener('mousedown', onMouseDown, false)
  document.addEventListener('mouseup', onMouseUp, false)
  function onMouseDown(e) {
    mouseClicked = true
    lastX = e.clientX
    lastY = e.clientY
  }
  function onMouseUp(e) {
    mouseClicked = false
  }
  function onMouseMove(e) {
    if (mouseClicked && registerChange) {
      context.beginPath()
      context.moveTo(lastX, lastY)
      context.lineTo(e.clientX, e.clientY)
      context.lineWidth = 5
      context.strokeStyle = getRandomColor()
      context.stroke()

      lastX = e.clientX
      lastY = e.clientY

      registerChange('paint', { data: canvas.toDataURL() })
    }
  }
  function getRandomColor() {
    var letters = '0123456789ABCDEF'
    var color = '#'
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }
})()

export default class Paint {
  static setup(registerChange) {
    if (setRegisterChange) setRegisterChange(registerChange)
    $('body').css('user-select', 'none')
  }

  static act({ data }) {
    if (setData) setData(data)
  }
}
