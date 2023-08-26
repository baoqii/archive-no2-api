const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const { DateTime } = require("luxon");

const PostSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    isPublished: { type: Boolean, default: false, required: true },
  },
  {
    toJSON: { virtuals: true },
  }
);

PostSchema.virtual("timestamp_formatted").get(function () {
  return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model("Post", PostSchema);
