const Room = require("../models/room");
const crypto = require("crypto");
var Y = require('yjs')

require('y-memory')(Y)
try {require('y-leveldb')(Y)} catch (err) {}
try {
  require('./y-websockets-server.js')(Y)
  console.log('connected to local y-websockets-server')
} catch (err) {
  console.log('no local, hence y-websockets-server')
  require('y-websockets-server')(Y)
}

global.yInstances = {}

function ioServer(server, roomManager) {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
    },
  });
  console.log('Running y-websockets-server')

  io.on("connection", (socket) => {
    console.log("connected!");

    socket.on("show credential", (roomId, username) => {
      Room.findById(roomId).then((doc) => {
        if (doc && doc.usernames.includes(username)) {
          socket.join(roomId);
          console.log("credential accepted code sent");
          socket.emit("credential accepted", `${roomId} has ${username}`);
        } else {
          socket.emit(
            "credential invalid",
            `Either room ${roomId} does not exist or does not have this user ${username}`
          );
        }
      });
    });

    // events
    socket.on("chat message", (roomId, msg) => {
      console.log("chat message sent", msg);
      // socket.to(roomId).emit("chat message", msg);
      const msgId = crypto.randomBytes(10).toString("hex");
      msg.msgId = msgId;
      io.sockets.in(roomId).emit("chat message", msg);
    });

    // Editor Page
    socket.on('yjsEvent', function (msg) {
      console.log('received yjsEvent with msg = ', msg) // debug
      if (msg.room != null) {
        getInstanceOfY(msg.room).then(function (y) {
          y.connector.receiveMessage(socket.id, msg)
        })
      }
    })

    socket.on("disconnect", () => {
      console.log("user disconnected");
      console.log("Number of connected users: ", io.engine.clientsCount);
    });
    
    // leave room
    socket.on("leave room", (roomId) => {
      io.sockets.in(roomId).emit("leave room");
      disposeRoom(roomId, roomManager);
    });

    socket.on("disconnecting", () => {
      console.log("disconnecting");
      socketId = socket.rooms;
      socketId.forEach((roomId) => {
        if (io.sockets.adapter.rooms.get(roomId).size === 1) {
          disposeRoom(roomId, roomManager);
        }
      });
    });

  });
}

function disposeRoom(roomId, roomManager){
  Room.updateOne(
    { roomId: roomId },
    { $set: { endTime: new Date() } },
    function (err, _) {
      if (err) console.log("err", err);
    }
  );
  Room.findOne({ roomId: roomId })
    .then((doc) => {
      if (doc) {
        let usernames = doc.usernames;
        let difficulty = doc.questionDifficulty;
        usernames.forEach((username) => {
          roomManager.deleteUserRequest(username, difficulty);
        });
      }
    })
    .catch((err) => console.log(err));
  // Room.deleteMany().then((doc) => console.log(doc)).catch(err => console.log(err)) // uncomment if the remote mongodb has too many rooms
}

function getInstanceOfY (room) {
  if (global.yInstances[room] == null) {
    global.yInstances[room] = Y({
      db: {
        name: options.db,
        dir: 'y-leveldb-databases',
        namespace: room
      },
      connector: {
        name: 'websockets-server',
        room: room,
        io: io,
        debug: !!options.debug
      },
      share: {}
    })
  }
  return global.yInstances[room]
}

module.exports = ioServer;








// var port = Number.parseInt(options.port, 10)
// var io = require('socket.io')(port)
// console.log('Running y-websockets-server on port ' + port)





// io.on('connection', function (socket) {
//   var rooms = []
//   socket.on('joinRoom', function (room) {
//     console.log('User "%s" joins room "%s"', socket.id, room)
//     socket.join(room)
//     getInstanceOfY(room).then(function (y) {
//       global.y = y // TODO: remove !!!
//       if (rooms.indexOf(room) === -1) {
//         y.connector.userJoined(socket.id, 'slave')
//         rooms.push(room)
//       }
//     })
//   })
  
//   socket.on('disconnect', function () {
//     for (var i = 0; i < rooms.length; i++) {
//       let room = rooms[i]
//       getInstanceOfY(room).then(function (y) {
//         var i = rooms.indexOf(room)
//         if (i >= 0) {
//           y.connector.userLeft(socket.id)
//           rooms.splice(i, 1)
//         }
//       })
//     }
//   })
//   socket.on('leaveRoom', function (room) {
//     getInstanceOfY(room).then(function (y) {
//       var i = rooms.indexOf(room)
//       if (i >= 0) {
//         y.connector.userLeft(socket.id)
//         rooms.splice(i, 1)
//       }
//     })
//   })
// })
