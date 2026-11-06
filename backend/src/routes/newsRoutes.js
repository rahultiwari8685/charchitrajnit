import express from "express";
import upload from "../middlewares/upload.js";

import {
  createNews,
  getNews,
  getNewsBySlug,
  updateNews,
  getNewsById,
  getAllNewsByCategory,
  getAllNewsByAuthorId,
  deleteNews,
  autoSaveNews,
  increaseView,
  getTrendingNews,
  getPopularNews,
  getVideoNews,
  getMostSharedNews,
  increaseShare,
  previousNextNews,
  shareNews,
  newsMeta,
  getLiveStatus,
  getAllDraftNews,
  searchNews,
  getScheduleNews,
} from "../controllers/newsController.js";

const router = express.Router();

router.post("/saveNews", upload.single("thumbnail"), createNews);

router.post("/updateNews", upload.single("thumbnail"), updateNews);

router.get("/getAllNews", getNews);
router.get("/getAllDraftNews", getAllDraftNews);
router.get("/getScheduleNews", getScheduleNews);
// router.get("/news/category/:categoryId", getAllNewsByCategory);
router.get("/category/:categoryId", getAllNewsByCategory);
// router.get("/:slug", getNewsBySlug);

router.get("/slug/:slug", getNewsBySlug);
router.get("/id/:id", getNewsById);

router.delete("/deleteNews/:id", deleteNews);
router.post("/view/:id", increaseView);

router.get("/getAllNewsByAuthorId/:authorId", getAllNewsByAuthorId);

router.post("/auto-save", upload.single("thumbnail"), autoSaveNews);
router.get("/live", getLiveStatus);
router.get("/trending", getTrendingNews);

router.get("/popular", getPopularNews);
router.get("/videos", getVideoNews);
router.get("/most-shared", getMostSharedNews);
router.post("/share/:id", increaseShare);
router.get("/previous-next/:id", previousNextNews);
router.get("/share/:slug", shareNews);
router.get("/news/:slug", newsMeta);
router.get("/:slug/meta", newsMeta);
router.get("/search", searchNews);
export default router;
