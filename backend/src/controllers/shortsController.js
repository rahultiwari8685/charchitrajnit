import fs from "fs";
import slugify from "slugify";

import Shorts from "../models/Shorts.js";

export const createShort = async (req, res) => {
  try {
    const { title, subtitle, author, categories } = req.body;

    if (!title) {
      return res.status(400).json({
        status: false,
        message: "Title is required",
      });
    }

    if (!req.files?.video) {
      return res.status(400).json({
        status: false,
        message: "Video is required",
      });
    }

    const slug = slugify(title, {
      lower: true,
      strict: true,
    });

    const short = await Shorts.create({
      title,
      subtitle,

      author,

      categories: categories
        ? Array.isArray(categories)
          ? categories
          : JSON.parse(categories)
        : [],

      slug,

      thumbnail: req.files?.thumbnail?.[0]?.filename || "",

      video: req.files.video[0].filename,
    });

    return res.status(201).json({
      status: true,
      message: "Short created successfully.",
      data: short,
    });
  } catch (err) {
    console.log(err);

    if (req.files?.thumbnail?.[0]) {
      fs.unlinkSync("uploads/images/" + req.files.thumbnail[0].filename);
    }

    if (req.files?.video?.[0]) {
      fs.unlinkSync("uploads/videos/" + req.files.video[0].filename);
    }

    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

export const getShorts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const total = await Shorts.countDocuments();

    const shorts = await Shorts.find()
      .populate("author", "name")
      .populate("categories", "name")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);

    return res.json({
      status: true,
      total,
      totalPages: Math.ceil(total / limit),
      data: shorts,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

export const updateShort = async (req, res) => {
  try {
    const { id, title, subtitle, author, categories } = req.body;

    const short = await Shorts.findById(id);

    if (!short) {
      return res.status(404).json({
        status: false,
        message: "Short not found",
      });
    }

    short.title = title;
    short.subtitle = subtitle;
    short.author = author;

    short.categories = categories
      ? Array.isArray(categories)
        ? categories
        : JSON.parse(categories)
      : [];

    short.slug = slugify(title, {
      lower: true,
      strict: true,
    });

    if (req.files?.thumbnail?.length) {
      if (
        short.thumbnail &&
        fs.existsSync(`uploads/images/${short.thumbnail}`)
      ) {
        fs.unlinkSync(`uploads/images/${short.thumbnail}`);
      }

      short.thumbnail = req.files.thumbnail[0].filename;
    }

    if (req.files?.video?.length) {
      if (short.video && fs.existsSync(`uploads/videos/${short.video}`)) {
        fs.unlinkSync(`uploads/videos/${short.video}`);
      }

      short.video = req.files.video[0].filename;
    }

    await short.save();

    return res.json({
      status: true,
      message: "Short updated successfully",
      data: short,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

export const deleteShort = async (req, res) => {
  try {
    const short = await Shorts.findById(req.params.id);

    if (!short) {
      return res.status(404).json({
        status: false,
        message: "Short not found",
      });
    }

    if (short.thumbnail && fs.existsSync(`uploads/images/${short.thumbnail}`)) {
      fs.unlinkSync(`uploads/images/${short.thumbnail}`);
    }

    if (short.video && fs.existsSync(`uploads/videos/${short.video}`)) {
      fs.unlinkSync(`uploads/videos/${short.video}`);
    }

    await Shorts.findByIdAndDelete(req.params.id);

    return res.json({
      status: true,
      message: "Short deleted successfully",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

export const getShortById = async (req, res) => {
  try {
    const short = await Shorts.findById(req.params.id)
      .populate("author", "name")
      .populate("categories", "name");

    if (!short) {
      return res.status(404).json({
        status: false,
        message: "Short not found",
      });
    }

    return res.json({
      status: true,
      data: short,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};
