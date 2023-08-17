const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TagSchema = new Schema({
  name: { type: String, required: true },
});

module.exports = mongoose.model("Tag", UserSchema);
