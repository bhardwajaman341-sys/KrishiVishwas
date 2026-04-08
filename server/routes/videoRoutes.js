const express = require("express");
const router = express.Router();

const {
  getENSOVideo,
  addVideo
} = require("../controllers/videoController");

// ✅ correct usage
router.get("/enso-video", getENSOVideo);
router.get("/add-video", addVideo); // use GET for testing

module.exports = router;