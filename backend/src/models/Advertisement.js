import mongoose from "mongoose";

const advertisementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["image", "video", "html", "adsense"],
      default: "image",
    },

    image: {
      type: String,
      default: "",
    },

    video: {
      type: String,
      default: "",
    },

    htmlCode: {
      type: String,
      default: "",
    },

    redirectUrl: {
      type: String,
      default: "",
    },

    position: {
      type: String,
      enum: [
        "homepage_top",
        "homepage_middle",
        "homepage_bottom",
        "sidebar",
        "article_top",
        "article_middle",
        "article_bottom",
        "footer",
        "popup",
      ],
      required: true,
    },

    priority: {
      type: Number,
      default: 1,
    },

    width: {
      type: Number,
      default: 0,
    },

    height: {
      type: Number,
      default: 0,
    },

    startDate: {
      type: Date,
    },

    endDate: {
      type: Date,
    },

    totalViews: {
      type: Number,
      default: 0,
    },

    totalClicks: {
      type: Number,
      default: 0,
    },

    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Advertisement", advertisementSchema);
