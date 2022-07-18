const mongoose = require("mongoose");
const { schemaOptions } = require("./modelOption");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  schemaOptions
);

module.exports = mongoose.model("User", userSchema);
