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



app.get("/news/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;

    // Old slug redirects
    if (slugRedirects[slug]) {
      return res.redirect(301, `/news/${slugRedirects[slug]}`);
    }

    const { data } = await axios.get(
      `https://api.bharat19express.com/api/news/slug/${encodeURIComponent(slug)}`
    );

    if (!data.status || !data.data) {
      return res.status(404).send(baseHtml);
    }

    const news = data.data;

    const title = news.metaTitle || news.title || "Bharat 19 Express";
    const description =
      news.metaDescription ||
      news.subtitle ||
      "Latest news from Bharat 19 Express";

    const image = news.thumbnail
      ? `https://api.bharat19express.com/uploads/images/${news.thumbnail}`
      : "https://www.bharat19express.com/default-news.jpg";

    const url = `https://www.bharat19express.com/news/${news.slug}`;

    // Escape HTML special characters
    const escapeHtml = (value = "") =>
      String(value)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    let html = baseHtml;

    // Remove existing metadata to prevent duplicate OG tags
    html = html
      .replace(/<title[^>]*>[\s\S]*?<\/title>/i, "")
      .replace(/<meta[^>]+name=["']description["'][^>]*>/gi, "")
      .replace(/<meta[^>]+property=["']og:[^"']+["'][^>]*>/gi, "")
      .replace(/<meta[^>]+name=["']twitter:[^"']+["'][^>]*>/gi, "");

    const metaTags = `
      <title>${escapeHtml(title)}</title>

      <meta name="description" content="${escapeHtml(description)}">

      <meta property="og:type" content="article">
      <meta property="og:title" content="${escapeHtml(title)}">
      <meta property="og:description" content="${escapeHtml(description)}">
      <meta property="og:image" content="${escapeHtml(image)}">
      <meta property="og:image:secure_url" content="${escapeHtml(image)}">
      <meta property="og:image:alt" content="${escapeHtml(title)}">
      <meta property="og:url" content="${escapeHtml(url)}">
      <meta property="og:site_name" content="Bharat 19 Express">

      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${escapeHtml(title)}">
      <meta name="twitter:description" content="${escapeHtml(description)}">
      <meta name="twitter:image" content="${escapeHtml(image)}">
    `;

    html = html.replace("</head>", `${metaTags}</head>`);

    res.set("Cache-Control", "public, max-age=300");

    return res.status(200).send(html);

  } catch (err) {
    console.error("News SSR Error:", err.message);
    return res.status(500).send(baseHtml);
  }
});


router.get("/:slug/meta", newsMeta);
router.get("/search", searchNews);
export default router;
