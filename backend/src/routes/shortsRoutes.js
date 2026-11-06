import express from "express";
import upload from "../middlewares/upload.js";

import {
  createShort,
  updateShort,
  deleteShort,
  getShortById,
  getShorts,
} from "../controllers/shortsController.js";

const router = express.Router();

router.post(
  "/create",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createShort,
);

router.post(
  "/update",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  updateShort,
);

router.get("/list", getShorts);

router.get("/:id", getShortById);

router.delete("/:id", deleteShort);

export default router;
