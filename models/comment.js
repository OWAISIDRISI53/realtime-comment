const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// creating new schema

const commentSchema = new Schema(
  {
    // username: { type: String, required: true },
    // Comment: { type: String, required: true },
    username: String,
    comment: String,
  },
  { timestamps: true }
);

const comment = mongoose.model("comment", commentSchema);

module.exports = comment;
