import Magazine from "../models/Magazine.js";
import fs from "fs";
import path from "path";

const toBoolean = (value, defaultValue = false) => {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }

  return value === true || value === "true" || value === "1" || value === 1;
};

const deleteFile = (fileName) => {
  if (!fileName) return;

  const filePath = path.join(process.cwd(), "uploads", "magazines", fileName);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

export const getAllMagazines = async (req, res) => {
  try {
    const magazines = await Magazine.find().sort({
      issueDate: -1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: magazines,
    });
  } catch (error) {
    console.error("Get Magazines Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch magazines",
      error: error.message,
    });
  }
};

export const getMagazineById = async (req, res) => {
  try {
    const magazine = await Magazine.findById(req.params.id);

    if (!magazine) {
      return res.status(404).json({
        success: false,
        message: "Magazine not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: magazine,
    });
  } catch (error) {
    console.error("Get Magazine Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch magazine",
      error: error.message,
    });
  }
};

export const getMagazineBySlug = async (req, res) => {
  try {
    const magazine = await Magazine.findOne({
      slug: req.params.slug,
      status: true,
    });

    if (!magazine) {
      return res.status(404).json({
        success: false,
        message: "Magazine not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: magazine,
    });
  } catch (error) {
    console.error("Get Magazine By Slug Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch magazine",
      error: error.message,
    });
  }
};

export const createMagazine = async (req, res) => {
  try {
    const { title, slug, description, category, issueDate, featured, status } =
      req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Slug is required",
      });
    }

    if (!issueDate) {
      return res.status(400).json({
        success: false,
        message: "Issue date is required",
      });
    }

    if (!req.files?.pdfFile?.[0]) {
      return res.status(400).json({
        success: false,
        message: "PDF file is required",
      });
    }

    // -----------------------------
    // CHECK SLUG
    // -----------------------------

    const existingMagazine = await Magazine.findOne({ slug });

    if (existingMagazine) {
      return res.status(400).json({
        success: false,
        message: "Magazine slug already exists",
      });
    }

    // -----------------------------
    // FILES
    // -----------------------------

    const coverImage = req.files?.coverImage?.[0]?.filename || "";

    const pdfFile = req.files?.pdfFile?.[0]?.filename || "";

    // -----------------------------
    // CREATE
    // -----------------------------

    const magazine = await Magazine.create({
      title,
      slug,
      description: description || "",
      category: category || "",
      issueDate,

      coverImage,
      pdfFile,

      featured: toBoolean(featured),
      status: toBoolean(status, true),
    });

    return res.status(201).json({
      success: true,
      message: "Magazine created successfully",
      data: magazine,
    });
  } catch (error) {
    console.error("Create Magazine Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create magazine",
      error: error.message,
    });
  }
};

export const updateMagazine = async (req, res) => {
  try {
    const magazine = await Magazine.findById(req.params.id);

    if (!magazine) {
      return res.status(404).json({
        success: false,
        message: "Magazine not found",
      });
    }

    const { title, slug, description, category, issueDate, featured, status } =
      req.body;

    // -----------------------------
    // SLUG CHECK
    // -----------------------------

    if (slug && slug !== magazine.slug) {
      const existingMagazine = await Magazine.findOne({
        slug,
        _id: { $ne: magazine._id },
      });

      if (existingMagazine) {
        return res.status(400).json({
          success: false,
          message: "Magazine slug already exists",
        });
      }
    }

    // -----------------------------
    // NEW COVER
    // -----------------------------

    if (req.files?.coverImage?.[0]) {
      const newCover = req.files.coverImage[0].filename;

      if (magazine.coverImage) {
        deleteFile(magazine.coverImage);
      }

      magazine.coverImage = newCover;
    }

    // -----------------------------
    // NEW PDF
    // -----------------------------

    if (req.files?.pdfFile?.[0]) {
      const newPdf = req.files.pdfFile[0].filename;

      if (magazine.pdfFile) {
        deleteFile(magazine.pdfFile);
      }

      magazine.pdfFile = newPdf;
    }

    // -----------------------------
    // UPDATE DATA
    // -----------------------------

    if (title !== undefined) {
      magazine.title = title;
    }

    if (slug !== undefined) {
      magazine.slug = slug;
    }

    if (description !== undefined) {
      magazine.description = description;
    }

    if (category !== undefined) {
      magazine.category = category;
    }

    if (issueDate !== undefined) {
      magazine.issueDate = issueDate;
    }

    if (featured !== undefined) {
      magazine.featured = toBoolean(featured, magazine.featured);
    }

    if (status !== undefined) {
      magazine.status = toBoolean(status, magazine.status);
    }

    await magazine.save();

    return res.status(200).json({
      success: true,
      message: "Magazine updated successfully",
      data: magazine,
    });
  } catch (error) {
    console.error("Update Magazine Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update magazine",
      error: error.message,
    });
  }
};

export const deleteMagazine = async (req, res) => {
  try {
    const magazine = await Magazine.findById(req.params.id);

    if (!magazine) {
      return res.status(404).json({
        success: false,
        message: "Magazine not found",
      });
    }

    // Delete cover
    if (magazine.coverImage) {
      deleteFile(magazine.coverImage);
    }

    // Delete PDF
    if (magazine.pdfFile) {
      deleteFile(magazine.pdfFile);
    }

    await Magazine.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Magazine deleted successfully",
    });
  } catch (error) {
    console.error("Delete Magazine Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete magazine",
      error: error.message,
    });
  }
};
