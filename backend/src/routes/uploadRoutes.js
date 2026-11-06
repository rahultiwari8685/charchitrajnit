import express from "express";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.post("/image", upload.single("file"), (req, res) => {
  console.log(req.file);

  if (!req.file) {
    return res.status(400).json({
      message: "No file uploaded",
    });
  }

  return res.json({
    location: `https://api.bharat19express.com/uploads/images/${req.file.filename}`,
  });
});

export default router;
