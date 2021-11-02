const Room = require("../models/room");
const crypto = require("crypto");

function ioServer(server, roomManager) {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("connected!");

    socket.on("show credential", (roomId, username) => {
      console.log(roomId);
      console.log(username);
      Room.findById(roomId).then((doc) => {
        if (doc && doc.usernames.includes(username)) {
          socket.join(roomId);
          console.log("credential accepted code sent");
          socket.emit("credential accepted", `${roomId} has ${username}`);
        } else {
          console.log("credential invalid code sent");
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
    socket.on("get-document", (roomId) => {
      // console.log("getting document for roomId ", roomId);
      // if (roomId == null) return;
      // socket.join(roomId);
      socket.emit("load-document", "");
      socket.on("send-changes", (delta) => {
        socket.broadcast.to(roomId).emit("receive-changes", delta);
      });
    });
  });
}

function disposeRoom(roomId, roomManager){
  console.log("disposing room with id = " + roomId); // debug
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
        console.log("disposed rooms and fixed"); // debug
      }
    })
    .catch((err) => console.log(err));
  Room.deleteMany().then((doc) => console.log(doc)).catch(err => console.log(err)) // uncomment if the remote mongodb has too many rooms
}

module.exports = ioServer;