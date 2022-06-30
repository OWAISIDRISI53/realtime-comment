const { response } = require("express");
const express = require("express");
const app = express();
// const dbConnect = require('./db.js');

const port = process.env.PORT || 3000;

app.use(express.static("public"));

// database

const dbConnect = require("./db");
dbConnect();
const Comment = require("./models/comment");

app.use(express.json());

// routes
app.post("/api/comments", (req, res) => {
  const comment = new Comment({
    username: req.body.username,
    comment: req.body.comment,
  });

  comment.save().then((response) => {
    res.send(response);
  });
});

app.get("/api/comments", (req, res) => {
  Comment.find().then((comment) => {
    res.send(comment);
  });
});

// delete all comments

app.get("/api/delete", (req, res) => {
  Comment.deleteMany({}, (err, data) => {
    if (err) {
      console.log(err);
    }

    res.send(data);
  });
});

// server
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

let io = require("socket.io")(server);
// let users = {}

// let users = []
io.on("connection", (socket) => {
  // recieve event
  socket.on("comment", (data) => {
    // console.log(data.username);
    data.time = Date();
    socket.broadcast.emit("comment", data);
  });

  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", data);
  });

  // alert functionality : when new user join
  socket.on("user-joint", (user) => {
    // console.log(`${user} Join `);
    socket.broadcast.emit("new-user", user);
  });

  // socket.on("onlineUser",userArr => {
  //     userArr.push(socket.id)
  //     // console.log(userArr);
  //     if (true) {
  //         socket.on('disconnect',  (d) => {
  //         userArr  = userArr.filter((item) => {
  //             let itemIdx = userArr.indexOf(item)
  //             userArr.splice(itemIdx,1)
  //             console.log(`userArr ${userArr}`);
  //         })
  //         });

  //     }

  //     console.log(userArr);
  // })
});
