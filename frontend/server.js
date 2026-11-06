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

app.use(express.static(DIST));

const BOT_REGEX =
  /facebookexternalhit|Facebot|Twitterbot|WhatsApp|TelegramBot|LinkedInBot|Slackbot|Discordbot|Googlebot/i;

const baseHtml = fs.readFileSync(INDEX, "utf8");

// Old slug -> new slug redirects
const slugRedirects = {
  "-2": "haryana-ko-mili-badi-jimmedari-cpa-zone-2-ki-karegi-mezbani",

  30: "sapa-ko-bada-jhatka-30-padadhikariyon-ne-thama-subhaspa-ka-daman",

  sc: "lakhimpur-hinsa-case-mein-dheeme-trial-par-sc-sakht-ashish-mishra-mamle-mein-mangi-nayi-report",

  "up--": "up-mein-congress-spa-ka-hoga-safaya-keshav",
};

app.get("/news/:slug", async (req, res) => {
  try {
    const oldSlug = req.params.slug;
    if (slugRedirects[oldSlug]) {
      return res.redirect(301, `/news/${slugRedirects[oldSlug]}`);
    }

    const { data } = await axios.get(
      `https://api.bharat19express.com/api/news/slug/${encodeURIComponent(oldSlug)}`,
    );

    if (!data.status || !data.data) {
      return res.send(baseHtml);
    }

    const news = data.data;

    const image = news.thumbnail
      ? `https://api.bharat19express.com/uploads/images/${news.thumbnail}`
      : "";

    let html = baseHtml;

    const tags = `
<title>${news.metaTitle || news.title}</title>

<meta name="description" content="${news.metaDescription || news.subtitle || ""}">

<meta property="og:type" content="article">
<meta property="og:title" content="${news.title}">
<meta property="og:description" content="${news.metaDescription || news.subtitle || ""}">
<meta property="og:image" content="${image}">
<meta property="og:url" content="https://bharat19express.com/news/${news.slug}">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${news.title}">
<meta name="twitter:description" content="${news.metaDescription || news.subtitle || ""}">
<meta name="twitter:image" content="${image}">
`;

    html = html.replace("</head>", tags + "</head>");

    return res.send(html);
  } catch (err) {
    console.error("News SSR Error:", err.message);

    return res.send(baseHtml);
  }
});

app.use((req, res) => {
  res.sendFile(INDEX);
});

app.listen(3005, () => {
  console.log("Frontend running on port 3005");
});
