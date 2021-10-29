const Room = require("../models/room");
const Automerge = require("automerge");
const crypto = require("crypto");
var roomSummary = {};

function ioServer(server, roomManager) {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("connected!");
    var preset = {
      blocks: [
        {
          key: "34dpc",
          text: "",
          type: "unstyled",
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {},
        },
      ],
      entityMap: {},
    };
    console.log("sending preset");
    socket.emit("initialize", JSON.stringify(preset));

    // socket.emit("initialize chat", roomId)   // Chris said no need
    socket.on("show credential", (roomId, username) => {
      console.log(roomId);
      console.log(username);
      Room.findById(roomId).then((doc) => {
        if (doc && doc.usernames.includes(username)) {
          socket.join(roomId);
          console.log("credential accepted code sent");
          socket.emit("credential accepted", `${roomId} has ${username}`);
          const doc1 = Automerge.from({ state: [preset] });
        } else {
          console.log("credential invalid code sent");
          socket.emit(
            "credential invalid",
            `${roomId} does not have ${username}`
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

    socket.on("disconnecting", () => {
      console.log("disconnecting");
      socketId = socket.rooms;
      socketId.forEach((roomId) => {
        if (io.sockets.adapter.rooms.get(roomId).size === 1) {
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
        }
      });
    });
    socket.on("newState", (roomId, msg) => {
      console.log(msg);
      io.sockets.in(roomId).emit("newState", msg);
      // socket.to(roomId).emit("newState", msg); // JX to Chris: need to broadcast to the whole room too?
      // dont broadcast to sender
    });
  });
}

module.exports = ioServer;