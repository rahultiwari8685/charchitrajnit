// import mongoose from "mongoose";

// const categorySchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     parentCategory: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Category",
//       default: null,
//     },

//     slug: {
//       type: String,
//       unique: true,
//       index: true,
//     },

//     showInMenu: {
//       type: String,
//       default: "0",
//     },
//     position: {
//       type: Number,
//       default: 0,
//     },

//     meta_title: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     meta_desc: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     bannerImage: {
//       type: String,
//       default: "",
//     },
//   },
//   {
//     timestamps: true,
//   },
// );

// export default mongoose.model("Category", categorySchema);

import mongoose from "mongoose";

const categoryTranslationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false },
);

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    translations: {
      en: {
        type: categoryTranslationSchema,
        default: {},
      },

      hi: {
        type: categoryTranslationSchema,
        default: {},
      },

      ur: {
        type: categoryTranslationSchema,
        default: {},
      },

      bn: {
        type: categoryTranslationSchema,
        default: {},
      },

      mr: {
        type: categoryTranslationSchema,
        default: {},
      },
    },

    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    showInMenu: {
      type: String,
      default: "0",
    },

    position: {
      type: Number,
      default: 0,
    },

    meta_title: {
      type: String,
      required: true,
      trim: true,
    },

    meta_desc: {
      type: String,
      required: true,
      trim: true,
    },

    bannerImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Category", categorySchema);
