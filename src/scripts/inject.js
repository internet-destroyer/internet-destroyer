import ContentEdit from './destroyer/content-edit'
import Shooter from './destroyer/shooter'
import Paint from './destroyer/paint'

import { default as $ } from 'jquery'

window.$ = $

function ModeSelect() {
  const $modeWrapper = $('<div id="intruder"></div>').css({
    position: 'fixed',
    top: '50%',
    left: '10px',
    'pointer-events': 'none',
    background: '#eee',
  })

  const mode = () => ({})

  $('body').append($modeWrapper)
}

ModeSelect()

$('head').append(
  '<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/3.0.0-beta.2/jquery.contextMenu.min.css">'
)

$('head').append(
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/3.0.0-beta.2/jquery.contextMenu.min.js"></script>'
)

$('head').append(
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.1/socket.io.js"></script>'
)

const ioInterval = setInterval(() => {
  if (window.io) {
    clearInterval(ioInterval)
  } else return false

  // io shit here
  const socket = io('https://destroyer.bandprotocol.com')
  const myRoom = window.location.host + window.location.pathname

  // listen to the command
  socket.on('connect', () => {
    console.log('Destroyer connected')

    socket.emit('enter', {
      room: myRoom,
    })
  })

  socket.on('action_init', async ({ room, actions }) => {
    console.log('Destroyer Initiated at', room)
    console.log(actions)

    for (let i = 0; i < actions.length; i++) {
      const a = actions[i]
      switch (a.command) {
        case 'text':
          ContentEdit.act(a.params)
          break
        case 'shooter':
          Shooter.act(a.params)
          break
        case 'paint':
          Paint.act(a.params)
          break
      }

      await new Promise(resolve =>
        setTimeout(resolve, a.command === 'shooter' ? 130 : 0)
      )
    }
  })

  socket.on('action_incr', ({ room, action }) => {
    console.log('New command', room)
  })

  const commandSend = (command, params) => {
    socket.emit('action', { room: myRoom, action: { command, params } })
  }

  const contextInterval = setInterval(() => {
    if ($.contextMenu) {
      clearInterval(contextInterval)
    } else return false

    $.contextMenu({
      selector: 'body',
      callback: function(key, options) {
        switch (options) {
          case 'text':
            return ContentEdit.setup(commandSend)
          case 'shooter':
            return Shooter.setup(commandSend)
          case 'paint':
            return Paint.setup(commandSend)
          case 'quit':
            window.location.reload()
        }
      },
      items: {
        welcome: { name: 'Welcome, Invader' },
        sep1: '---------',
        text: { name: 'Brainwasher', icon: 'fa-font' },
        shooter: { name: 'Lasergun', icon: 'fa-dot-circle-o' },
        paint: { name: 'Eject Liquid', icon: 'fa-paint-brush' },
        sep2: '---------',
        quit: { name: 'Exit Invasion', icon: 'fa-sign-out' },
      },
    })

    // $('.context-menu-list').css('z-index', '999999999')
  }, 300)
}, 300)
