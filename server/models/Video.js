const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
  languages: [
    {
      lang: String,
      audioUrl: String
    }
  ]
});

module.exports = mongoose.model("Video", videoSchema);