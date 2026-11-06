import mongoose from "mongoose";

const SiteSettingSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      required: true,
    },

    headerLogo: {
      type: String,
      default: "",
    },

    footerLogo: {
      type: String,
      default: "",
    },

    favicon: {
      type: String,
      default: "",
    },

    metaTitle: {
      type: String,
      default: "",
    },

    metaDescription: {
      type: String,
      default: "",
    },

    metaKeywords: {
      type: String,
      default: "",
    },

    facebook: {
      type: String,
      default: "",
    },

    twitter: {
      type: String,
      default: "",
    },

    instagram: {
      type: String,
      default: "",
    },

    youtube: {
      type: String,
      default: "",
    },

    linkedin: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    copyright: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const SiteSetting = mongoose.model("SiteSetting", SiteSettingSchema);

export default SiteSetting;
