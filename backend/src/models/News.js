

import mongoose from "mongoose";

const translationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },

    subtitle: {
      type: String,
      default: "",
    },

    content: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { _id: false },
);

const newsSchema = new mongoose.Schema(
  {
    // Default / English content
    title: {
      type: String,
      required: true,
      trim: true,
    },

    subtitle: {
      type: String,
      default: "",
    },

    content: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    translations: {
      en: {
        type: translationSchema,
        default: {},
      },

      hi: {
        type: translationSchema,
        default: {},
      },

      ur: {
        type: translationSchema,
        default: {},
      },

      bn: {
        type: translationSchema,
        default: {},
      },

      mr: {
        type: translationSchema,
        default: {},
      },
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

    slug: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    type: {
      type: Number,
      enum: [1, 2, 3],
      default: 2,
    },

    scheduledAt: {
      type: Date,
      default: null,
    },

    views: {
      type: Number,
      default: 0,
    },

    shares: {
      type: Number,
      default: 0,
    },

    isScheduled: {
      type: Boolean,
      default: false,
    },

    youtubeUrl: {
      type: String,
      default: "",
    },

    videoType: {
      type: Number,
      default: 0,
    },

    thumbnail: {
      type: String,
      default: "",
    },
    thumbnailCaption: {
  type: String,
  default: '',
  trim: true,
},
  },
  {
    timestamps: true,
  },
);

newsSchema.index({ title: 1, author: 1 }, { unique: true });

export default mongoose.model("News", newsSchema);
