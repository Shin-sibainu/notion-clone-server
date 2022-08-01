const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { schemaOptions } = require("./modelOption");

const sectionSchema = new Schema(
  {
    memo: {
      type: Schema.Types.ObjectId,
      ref: "Memo",
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
  },
  schemaOptions
);

module.exports = mongoose.model("Section", sectionSchema);
