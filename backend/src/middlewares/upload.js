import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = (folder) => {
  const dir = path.join(process.cwd(), "uploads", folder);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  return dir;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, uploadDir("reports"));
    }

    // Images
    else if (file.mimetype.startsWith("image/")) {
      if (req.baseUrl.includes("advertisements")) {
        cb(null, uploadDir("advertisements"));
      } else {
        cb(null, uploadDir("images"));
      }
    }

    // Videos
    else if (file.mimetype.startsWith("video/")) {
      cb(null, uploadDir("videos"));
    } else {
      cb(new Error("Unsupported file type"));
    }
  },

  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",

    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
    "image/gif",

    // Videos
    "video/mp4",
    "video/quicktime", // .mov
    "video/x-msvideo", // .avi
    "video/x-matroska", // .mkv
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("File type not allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 300 * 1024 * 1024, // 300 MB
  },
});

export default upload;
