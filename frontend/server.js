
import express from "express";
import fs from "fs";
import path from "path";
import axios from "axios";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST = path.join(__dirname, "dist");
const INDEX = path.join(DIST, "index.html");

const baseHtml = fs.readFileSync(INDEX, "utf8");

app.use(express.static(DIST));

// Escape HTML attributes and content
const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);


const slugRedirects = {
  "-2": "haryana-ko-mili-badi-jimmedari-cpa-zone-2-ki-karegi-mezbani",
  "30": "sapa-ko-bada-jhatka-30-padadhikariyon-ne-thama-subhaspa-ka-daman",
  sc: "lakhimpur-hinsa-case-mein-dheeme-trial-par-sc-sakht-ashish-mishra-mamle-mein-mangi-nayi-report",
  "up--": "up-mein-congress-spa-ka-hoga-safaya-keshav",
};

app.get("/news/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;

    if (slugRedirects[slug]) {
      return res.redirect(301, `/news/${slugRedirects[slug]}`);
    }


    const response = await axios.get(
      `https://api.charchitrajnit.com/api/news/slug/${encodeURIComponent(slug)}`,
      { timeout: 10000 }
    );

    const news = response.data?.data;

    if (!response.data?.status || !news) {
      return res.status(404).send(baseHtml);
    }

    const title = escapeHtml(news.metaTitle || news.title || "Charchitrajnit");

    const description = escapeHtml(
      news.metaDescription || news.subtitle || news.title || ""
    );


    const image = news.thumbnail
      ? `https://api.charchitrajnit.com/uploads/images/${encodeURIComponent(news.thumbnail)}`
      : "";

    const pageUrl = `https://charchitrajnit.com/news/${encodeURIComponent(news.slug || slug)}`;

    let html = baseHtml;

    const tags = `
      <title>${title}</title>

      <meta name="description" content="${description}">

      <link rel="canonical" href="${pageUrl}">

      <meta property="og:type" content="article">
      <meta property="og:site_name" content="Charchitrajnit">
      <meta property="og:title" content="${title}">
      <meta property="og:description" content="${description}">
      <meta property="og:url" content="${pageUrl}">
      ${image ? `
      <meta property="og:image" content="${image}">
      <meta property="og:image:secure_url" content="${image}">
      <meta property="og:image:width" content="1200">
      <meta property="og:image:height" content="630">
      <meta property="og:image:alt" content="${title}">
      ` : ""}

      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${title}">
      <meta name="twitter:description" content="${description}">
      ${image ? `<meta name="twitter:image" content="${image}">` : ""}
    `;

    // Replace default title and inject dynamic metadata
    html = html.replace(
      /<title[^>]*>[\s\S]*?<\/title>/i,
      ""
    );

    html = html.replace(
      /<\/head>/i,
      `${tags}</head>`
    );

    res.set("Cache-Control", "public, max-age=300");

    return res.status(200).send(html);

  } catch (error) {
    console.error("News SSR Error:", error.response?.data || error.message);
    return res.status(200).send(baseHtml);
  }
});

// React Vite fallback
app.use((req, res) => {
  res.sendFile(INDEX);
});

app.listen(3006, () => {
  console.log("Charchitrajnit frontend running on port 3006");
});
