const Video = require("../models/Video");

// ✅ GET VIDEO
exports.getENSOVideo = async (req, res) => {
  try {
    const video = await Video.findOne({ title: "ENSO" });
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ ADD VIDEO
exports.addVideo = async (req, res) => {
  try {
    const video = await Video.create({
      title: "ENSO",
      videoUrl: "/media/enso-video.mp4",
      languages: [
        { lang: "English", audioUrl: "/media/audio-en.mp3" },
        { lang: "Hindi", audioUrl: "/media/audio-hi.mp3" }
      ]
    });

    res.json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};