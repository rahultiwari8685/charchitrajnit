import News from "../models/News.js";
import Category from "../models/Category.js";

export const generateSitemap = async (req, res) => {
  try {
    const baseUrl = "https://bharat19express.com";

    // Only published news
    const news = await News.find({
      type: 1,
      slug: {
        $exists: true,
        $nin: ["", "-2", "30", "sc", "up--"],
      },
    })
      .select("slug updatedAt")
      .sort({ updatedAt: -1 })
      .lean();

    // Categories having slug
    const categories = await Category.find({
      slug: { $exists: true, $ne: "" },
    })
      .select("slug updatedAt")
      .lean();

    const urls = [];

    // Homepage
    urls.push(`
      <url>
        <loc>${baseUrl}/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
    `);

    // Categories
    categories.forEach((category) => {
      urls.push(`
        <url>
          <loc>${baseUrl}/category/${category.slug}</loc>
          <lastmod>${new Date(category.updatedAt).toISOString()}</lastmod>
          <changefreq>daily</changefreq>
          <priority>0.8</priority>
        </url>
      `);
    });

    // Published News
    news.forEach((item) => {
      urls.push(`
        <url>
          <loc>${baseUrl}/news/${item.slug}</loc>
          <lastmod>${new Date(item.updatedAt).toISOString()}</lastmod>
          <changefreq>daily</changefreq>
          <priority>0.7</priority>
        </url>
      `);
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
${urls.join("")}
</urlset>`;

    res.header("Content-Type", "application/xml");

    return res.status(200).send(sitemap);
  } catch (error) {
    console.error("Sitemap Error:", error);

    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
