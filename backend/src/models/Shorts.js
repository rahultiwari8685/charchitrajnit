import mongoose from "mongoose";

const shortsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    subtitle: {
      type: String,
      default: "",
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],

    video: {
      type: String,
      required: true,
    },

    thumbnail: {
      type: String,
      default: "",
    },

    slug: {
      type: String,
      unique: true,
    },

    views: {
      type: Number,
      default: 0,
    },

    likes: {
      type: Number,
      default: 0,
    },

    shares: {
      type: Number,
      default: 0,
    },

    status: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Shorts", shortsSchema);
