import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import authRoutes from "./routes/auth.js";
import customerAuth from "./routes/customerAuth.js";

import advertisementRoutes from "./routes/advertisementRoutes.js";
import rateLimit from "express-rate-limit";
import goldRoutes from "./routes/gold.js";

import "./cron/publishScheduledNews.js";
import siteSettingRoutes from "./routes/siteSettingRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import shortsRoutes from "./routes/shortsRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import magazineRoutes from "./routes/magazineRoutes.js";
import sitemapRoutes from "./routes/sitemapRoutes.js";
import pollRoutes from "./routes/pollRoutes.js";
import youtubeRoutes from "./routes/youtubeRoutes.js";
import { checkLiveStatus } from "./services/youtubeService.js";
import galleryRoutes from "./routes/gallery.js";
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.set("trust proxy", 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
});

app.use(
  "/api/auth",
  rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 20,
  }),
);

app.use("/api", limiter);

const allowedOrigins = [
  "https://bharat19express.com",
  "https://www.bharat19express.com",
  "https://admin.bharat19express.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },

    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],

    credentials: true,
  }),
);

app.use(express.json({ limit: "300mb" }));
app.use(express.urlencoded({ extended: true, limit: "300mb" }));

app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/news", newsRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/customer", customerAuth);
app.use("/api", goldRoutes);
app.use("/api/advertisements", advertisementRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/site-settings", siteSettingRoutes);
app.use("/api/shorts", shortsRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/", sitemapRoutes);
app.use("/api/magazines", magazineRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/youtube", youtubeRoutes);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/gallery", galleryRoutes);
app.get("/api/youtube/live", async (req, res) => {
  try {
    const result = await checkLiveStatus();

    res.json({
      status: true,
      ...result,
    });
  } catch (error) {
    console.error("YouTube Live Route Error:", error);

    res.status(500).json({
      status: false,
      isLive: false,
      message: "Failed to check YouTube live status",
    });
  }
});

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

console.log("MONGO_URI from env:", MONGO_URI);

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err.message));

app.get("/", (req, res) => {
  res.send("API is working!");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
