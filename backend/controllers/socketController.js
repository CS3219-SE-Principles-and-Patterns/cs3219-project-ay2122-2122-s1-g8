const Room = require("../models/room");
const crypto = require("crypto");

function ioServer(server, roomManager) {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {

    socket.on("show credential", (roomId, username) => {
      Room.findById(roomId).then((doc) => {
        if (doc && doc.usernames.includes(username)) {
          socket.join(roomId);
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
      const msgId = crypto.randomBytes(10).toString("hex");
      msg.msgId = msgId;
      io.sockets.in(roomId).emit("chat message", msg);
    });
    socket.on("change question", (roomId, msg) => {
      socket.broadcast.to(roomId).emit("change question", msg);
    });
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
      socketId = socket.rooms;
      socketId.forEach((roomId) => {
        if (io.sockets.adapter.rooms.get(roomId).size === 1) {
          disposeRoom(roomId, roomManager);
        }
      });
    });
    socket.on("get-document", (roomId) => {
      socket.emit("load-document", "");
      socket.on("send-changes", (delta) => {
        socket.broadcast.to(roomId).emit("receive-changes", delta);
      });
    });
  });
}

function disposeRoom(roomId, roomManager) {
  Room.updateOne(
    { roomId: roomId },
    { $set: { endTime: new Date() } },
    function (err, _) {
      if (err) console.log("err", err);
    }
  );
  Room.findById(roomId)
    .then((doc) => {
      if (doc) {
        let usernames = doc.usernames;
        let difficulty = doc.questionDifficulty;
        usernames.forEach((username) => {
          roomManager.deleteUserRequest(username, difficulty);
        });
      }
    })
    .catch((err) => {});
}

module.exports = ioServer;
