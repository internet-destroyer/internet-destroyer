const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const db = {};
const db_paint = {};


function get_data(key) {
  if (!db.hasOwnProperty(key)) {
    db[key] = [];
  }
  return db[key];
}

function clear_data(key) {
  db[key] = [];
}

io.on('connect', (socket) => {
  socket.on('enter', ({ room }) => {
    socket.join(room);
    let actions = get_data(room);
    if (db_paint.hasOwnProperty(room)) {
      actions = actions.concat([db_paint[room]]);
    }
    socket.emit('action_init', { room: room, actions: actions });
  });

  socket.on('action', ({ room, action }) => {
    if (action.command !== 'paint') {
      get_data(room).push(action);
    } else {
      db_paint[room] = action;
    }
    socket.broadcast.to(room).emit('action_incr', { room: room, action: action });
  });

  socket.on('clear', ({ room }) => {
    clear_data(room);
    db_paint.delete(room);
    socket.broadcast.to(room).emit('action_clear', { room: room });
  });
});

app.get('/', (req, res) => {
  res.send('Hello, World!\n');
});

http.listen(80, () => {
  console.log('listening on 80');
});

