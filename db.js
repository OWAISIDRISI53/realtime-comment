function dbConnect() {
  const mongoose = require("mongoose");
  const url = "mongodb://localhost/realtimeComment";
  mongoose.connect(url, { useNewUrlParser: true });

  const connection = mongoose.connection;
  connection.on("error", console.error.bind(console, "connection error"));

  connection.once("open", () => {
    console.log("Connected to database");
  });
}

module.exports = dbConnect;
