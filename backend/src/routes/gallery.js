// import express from "express";
// import multer from "multer";
// import path from "path";
// import fs from "fs";
// import { fileURLToPath } from "url";
// import Gallery from "../models/Gallery.js";

// const router = express.Router();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const uploadDir = path.join(__dirname, "../../uploads/gallery");

// fs.mkdirSync(uploadDir, { recursive: true });

// const API_BASE_URL = "https://api.bharat19express.com";

// const allowedMimeTypes = [
//   "image/jpeg",
//   "image/png",
//   "image/webp",
//   "image/avif",
//   "image/gif",
//   "video/mp4",
//   "video/webm",
//   "video/ogg",
//   "video/quicktime",
// ];

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },

//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname).toLowerCase();
//     cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
//   },
// });

// const upload = multer({
//   storage,
//   limits: {
//     fileSize: 200 * 1024 * 1024,
//   },

//   fileFilter: (req, file, cb) => {
//     if (!allowedMimeTypes.includes(file.mimetype)) {
//       return cb(
//         new Error("Only supported image and video formats are allowed"),
//       );
//     }

//     cb(null, true);
//   },
// });

// const getMediaType = (item) => {
//   if (item.mediaType === "image" || item.mediaType === "video") {
//     return item.mediaType;
//   }

//   // Compatibility with older records that do not have mediaType.
//   return item.mimeType?.startsWith("image/") ? "image" : "video";
// };

// const formatMedia = (item) => {
//   const mediaType = getMediaType(item);
//   const mediaUrl = `${API_BASE_URL}/uploads/gallery/${encodeURIComponent(
//     item.filename,
//   )}`;

//   return {
//     ...item,
//     mediaType,
//     mediaUrl,

//     // Preserve the old field for existing frontend code.
//     videoUrl: mediaUrl,
//   };
// };

// // GET /api/gallery
// // GET /api/gallery?type=image
// // GET /api/gallery?type=video
// router.get("/", async (req, res) => {
//   try {
//     const requestedType = req.query.type?.toString().toLowerCase();

//     if (requestedType && !["all", "image", "video"].includes(requestedType)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid type. Use all, image, or video.",
//       });
//     }

//     const items = await Gallery.find({ isPublished: true })
//       .sort({ createdAt: -1 })
//       .lean();

//     let data = items.map(formatMedia);

//     if (requestedType === "image" || requestedType === "video") {
//       data = data.filter((item) => item.mediaType === requestedType);
//     }

//     res.json({
//       success: true,
//       count: data.length,
//       data,
//     });
//   } catch (error) {
//     console.error("Gallery fetch error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to load gallery",
//     });
//   }
// });

// // Upload field name: media
// // IMPORTANT: Attach your existing admin-auth middleware before upload.
// router.post("/", upload.single("media"), async (req, res) => {
//   try {
//     const title = req.body.title?.trim();

//     if (!title || !req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "Title and media file are required",
//       });
//     }

//     const mediaType = req.file.mimetype.startsWith("image/")
//       ? "image"
//       : "video";

//     const item = await Gallery.create({
//       title,
//       filename: req.file.filename,
//       originalName: req.file.originalname,
//       mimeType: req.file.mimetype,
//       mediaType,
//       isPublished: req.body.isPublished === "true",
//     });

//     res.status(201).json({
//       success: true,
//       message: `${mediaType === "image" ? "Image" : "Video"} uploaded successfully`,
//       data: formatMedia(item.toObject()),
//     });
//   } catch (error) {
//     console.error("Gallery upload error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Media upload failed",
//     });
//   }
// });

// // Multer and file-validation errors.
// router.use((error, req, res, next) => {
//   if (error instanceof multer.MulterError) {
//     return res.status(400).json({
//       success: false,
//       message:
//         error.code === "LIMIT_FILE_SIZE"
//           ? "File size cannot exceed 200 MB"
//           : error.message,
//     });
//   }

//   if (error.message?.includes("supported image and video formats")) {
//     return res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }

//   next(error);
// });

// export default router;

import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Gallery from "../models/Gallery.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../../uploads/gallery");

fs.mkdirSync(uploadDir, { recursive: true });

const API_BASE_URL = "https://api.bharat19express.com";

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 200 * 1024 * 1024, // 200 MB
  },
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(
        new Error("Only supported image and video formats are allowed"),
      );
    }
    cb(null, true);
  },
});

// Helper to safely delete old files from disk
const removePhysicalFile = async (filename) => {
  if (!filename) return;
  const filePath = path.join(uploadDir, filename);
  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  } catch (err) {
    console.error(`Failed to delete disk file: ${filePath}`, err);
  }
};

const getMediaType = (item) => {
  if (item.mediaType === "image" || item.mediaType === "video") {
    return item.mediaType;
  }
  return item.mimeType?.startsWith("image/") ? "image" : "video";
};

const formatMedia = (item) => {
  const mediaType = getMediaType(item);
  const mediaUrl = `${API_BASE_URL}/uploads/gallery/${encodeURIComponent(
    item.filename,
  )}`;

  return {
    ...item,
    mediaType,
    mediaUrl,
    videoUrl: mediaUrl,
  };
};

// GET /api/gallery
// Supports query: ?type=image|video|all and ?all=true (to view drafts in admin panel)
router.get("/", async (req, res) => {
  try {
    const requestedType = req.query.type?.toString().toLowerCase();

    if (requestedType && !["all", "image", "video"].includes(requestedType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid type. Use all, image, or video.",
      });
    }

    // If query has all=true or admin request, don't filter only published
    const filter = req.query.all === "true" ? {} : { isPublished: true };

    const items = await Gallery.find(filter).sort({ createdAt: -1 }).lean();

    let data = items.map(formatMedia);

    if (requestedType === "image" || requestedType === "video") {
      data = data.filter((item) => item.mediaType === requestedType);
    }

    res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("Gallery fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load gallery",
    });
  }
});

// GET /api/gallery/:id
router.get("/:id", async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id).lean();

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Gallery media not found",
      });
    }

    res.json({
      success: true,
      data: formatMedia(item),
    });
  } catch (error) {
    console.error("Gallery get single item error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get gallery item",
    });
  }
});

// POST /api/gallery
// Create new media
router.post("/", upload.single("media"), async (req, res) => {
  try {
    const title = req.body.title?.trim();

    if (!title || !req.file) {
      // Remove uploaded file if validation failed
      if (req.file) await removePhysicalFile(req.file.filename);
      return res.status(400).json({
        success: false,
        message: "Title and media file are required",
      });
    }

    const mediaType = req.file.mimetype.startsWith("image/")
      ? "image"
      : "video";

    const item = await Gallery.create({
      title,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      mediaType,
      isPublished:
        req.body.isPublished === "true" || req.body.isPublished === true,
    });

    res.status(201).json({
      success: true,
      message: `${mediaType === "image" ? "Image" : "Video"} uploaded successfully`,
      data: formatMedia(item.toObject()),
    });
  } catch (error) {
    if (req.file) await removePhysicalFile(req.file.filename);
    console.error("Gallery upload error:", error);
    res.status(500).json({
      success: false,
      message: "Media upload failed",
    });
  }
});

// PUT /api/gallery/:id
// Update media details (title, isPublished, and optional media replacement)
router.put("/:id", upload.single("media"), async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);

    if (!item) {
      if (req.file) await removePhysicalFile(req.file.filename);
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    // Update title if provided
    if (req.body.title !== undefined) {
      const trimmed = req.body.title.trim();
      if (!trimmed) {
        if (req.file) await removePhysicalFile(req.file.filename);
        return res.status(400).json({
          success: false,
          message: "Title cannot be empty",
        });
      }
      item.title = trimmed;
    }

    // Update published status if provided
    if (req.body.isPublished !== undefined) {
      item.isPublished =
        req.body.isPublished === "true" || req.body.isPublished === true;
    }

    // If new file was uploaded, replace old file
    if (req.file) {
      const oldFilename = item.filename;

      item.filename = req.file.filename;
      item.originalName = req.file.originalname;
      item.mimeType = req.file.mimetype;
      item.mediaType = req.file.mimetype.startsWith("image/")
        ? "image"
        : "video";

      // Delete the previous file from storage
      await removePhysicalFile(oldFilename);
    }

    await item.save();

    res.json({
      success: true,
      message: "Gallery item updated successfully",
      data: formatMedia(item.toObject()),
    });
  } catch (error) {
    if (req.file) await removePhysicalFile(req.file.filename);
    console.error("Gallery update error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update gallery item",
    });
  }
});

// DELETE /api/gallery/:id
// Deletes document from MongoDB and removes the file from disk
router.delete("/:id", async (req, res) => {
  try {
    const item = await Gallery.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    // Delete associated physical media file
    await removePhysicalFile(item.filename);

    res.json({
      success: true,
      message: "Gallery item deleted successfully",
      data: { id: req.params.id },
    });
  } catch (error) {
    console.error("Gallery delete error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete gallery item",
    });
  }
});

// Multer and file-validation errors handler
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message:
        error.code === "LIMIT_FILE_SIZE"
          ? "File size cannot exceed 200 MB"
          : error.message,
    });
  }

  if (error.message?.includes("supported image and video formats")) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  next(error);
});

export default router;
