import express from "express";
import {
  saveBookmark,
  removeBookmark,
  getBookmarks,
  isBookmarked,
  toggleBookmark,
} from "../controllers/bookmarkController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/add", verifyToken, saveBookmark);

router.post("/toggle", verifyToken, toggleBookmark);

router.delete("/remove/:newsId", verifyToken, removeBookmark);

router.get("/list", verifyToken, getBookmarks);

router.get("/check/:newsId", verifyToken, isBookmarked);

export default router;
