import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import {
  getAllMagazines,
  getMagazineById,
  getMagazineBySlug,
  createMagazine,
  updateMagazine,
  deleteMagazine,
} from "../controllers/magazineController.js";

const router = express.Router();

const uploadDir = path.join(process.cwd(), "uploads", "magazines");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    const name = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9]/g, "-")
      .toLowerCase();

    cb(null, `${Date.now()}-${name}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  // Cover image
  if (file.fieldname === "coverImage") {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed for cover image"), false);
    }

    return;
  }

  // PDF
  if (file.fieldname === "pdfFile") {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }

    return;
  }

  cb(new Error("Invalid file field"), false);
};

const upload = multer({
  storage,
  fileFilter,

  limits: {
    // 50 MB
    fileSize: 50 * 1024 * 1024,
  },
});

router.get("/", getAllMagazines);

router.get("/slug/:slug", getMagazineBySlug);

router.get("/:id", getMagazineById);

router.post(
  "/",
  upload.fields([
    {
      name: "coverImage",
      maxCount: 1,
    },
    {
      name: "pdfFile",
      maxCount: 1,
    },
  ]),
  createMagazine,
);

router.put(
  "/:id",
  upload.fields([
    {
      name: "coverImage",
      maxCount: 1,
    },
    {
      name: "pdfFile",
      maxCount: 1,
    },
  ]),
  updateMagazine,
);

router.delete("/:id", deleteMagazine);

export default router;
