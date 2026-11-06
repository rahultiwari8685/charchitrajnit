import fs from "fs";
import path from "path";

import SiteSetting from "../models/SiteSetting.js";

const deleteFile = (filename) => {
  if (!filename) return;

  const filePath = path.join(process.cwd(), "uploads", "images", filename);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// ==========================
// CREATE / UPDATE SETTINGS
// ==========================

export const saveSiteSetting = async (req, res) => {
  try {
    const {
      siteName,
      metaTitle,
      metaDescription,
      metaKeywords,
      facebook,
      instagram,
      twitter,
      youtube,
      linkedin,
      email,
      phone,
      address,
      copyright,
    } = req.body;

    let setting = await SiteSetting.findOne();

    if (!setting) {
      setting = new SiteSetting();
    }

    setting.siteName = siteName;
    setting.metaTitle = metaTitle;
    setting.metaDescription = metaDescription;
    setting.metaKeywords = metaKeywords;

    setting.facebook = facebook;
    setting.instagram = instagram;
    setting.twitter = twitter;
    setting.youtube = youtube;
    setting.linkedin = linkedin;

    setting.email = email;
    setting.phone = phone;
    setting.address = address;
    setting.copyright = copyright;

    // Header Logo
    if (req.files?.headerLogo?.length) {
      deleteFile(setting.headerLogo);

      setting.headerLogo = req.files.headerLogo[0].filename;
    }

    // Footer Logo
    if (req.files?.footerLogo?.length) {
      deleteFile(setting.footerLogo);

      setting.footerLogo = req.files.footerLogo[0].filename;
    }

    // Favicon
    if (req.files?.favicon?.length) {
      deleteFile(setting.favicon);

      setting.favicon = req.files.favicon[0].filename;
    }

    await setting.save();

    return res.status(200).json({
      success: true,
      message: "Site setting saved successfully",
      data: setting,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ==========================
// GET SITE SETTINGS
// ==========================

export const getSiteSetting = async (req, res) => {
  try {
    const setting = await SiteSetting.findOne();

    return res.status(200).json({
      success: true,
      data: setting,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ==========================
// DELETE HEADER LOGO
// ==========================

export const deleteHeaderLogo = async (req, res) => {
  try {
    const setting = await SiteSetting.findOne();

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: "Setting not found",
      });
    }

    deleteFile(setting.headerLogo);

    setting.headerLogo = "";

    await setting.save();

    return res.status(200).json({
      success: true,
      message: "Header logo deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ==========================
// DELETE FOOTER LOGO
// ==========================

export const deleteFooterLogo = async (req, res) => {
  try {
    const setting = await SiteSetting.findOne();

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: "Setting not found",
      });
    }

    deleteFile(setting.footerLogo);

    setting.footerLogo = "";

    await setting.save();

    return res.status(200).json({
      success: true,
      message: "Footer logo deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ==========================
// DELETE FAVICON
// ==========================

export const deleteFavicon = async (req, res) => {
  try {
    const setting = await SiteSetting.findOne();

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: "Setting not found",
      });
    }

    deleteFile(setting.favicon);

    setting.favicon = "";

    await setting.save();

    return res.status(200).json({
      success: true,
      message: "Favicon deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
