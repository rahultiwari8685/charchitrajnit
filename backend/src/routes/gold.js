import express from "express";

const router = express.Router();

router.get("/india-gold", async (req, res) => {
  try {
    // ✅ Default Lucknow + 24K
    const { city = "Lucknow", carat = "24K" } = req.query;

    const response = await fetch("https://api.gold-api.com/price/XAU");
    const data = await response.json();

    const usd = data?.price;
    if (!usd) {
      return res.status(500).json({
        status: false,
        message: "Gold price not available",
      });
    }

    const usdToInr = 83;
    const perGram24 = (usd * usdToInr) / 31.1;

    const cityFactorMap = {
      Delhi: 1.0,
      Lucknow: 1.005,
      Mumbai: 0.995,
      Kolkata: 1.01,
    };

    const factor = cityFactorMap[city] || 1;

    const caratMap = {
      "24K": 1,
      "22K": 0.916,
      "18K": 0.75,
    };

    const selectedCaratFactor = caratMap[carat] || 1;

    const pricePerGram = perGram24 * selectedCaratFactor * factor;
    const pricePer10g = pricePerGram * 10;

    return res.json({
      status: true,
      data: {
        city,
        carat,
        perGram: +pricePerGram.toFixed(2),
        per10g: +pricePer10g.toFixed(0),
        source: "XAU spot (converted to INR)",
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Gold API Error:", error);

    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export default router;
