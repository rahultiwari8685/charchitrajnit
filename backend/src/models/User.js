// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     bio: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//     },
//     phone: {
//       type: String,
//       default: "",
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     role: {
//       type: String,
//       required: true,
//     },
//     post_permission: {
//       type: String,
//       required: true,
//     },
//     user_status: {
//       type: String,
//       required: true,
//     },
//     profileImage: {
//       type: String,
//       default: "",
//     },
//   },
//   { timestamps: true },
// );

// export default mongoose.model("User", userSchema);

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    post_permission: {
      type: String,
      required: true,
    },
    user_status: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: "",
    },

    // Admin-controlled blue tick
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
