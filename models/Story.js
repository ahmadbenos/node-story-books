const mongoose = require("mongoose");
const moment = require("moment");

const StorySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  body: { type: String, required: true },
  status: { type: String, default: "public", enum: ["public", "private"] },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: String, default: moment().format("lll") },
});

const Story = mongoose.model("Story", StorySchema);

module.exports = Story;
