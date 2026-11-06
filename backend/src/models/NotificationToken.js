import mongoose from "mongoose";

const NotificationTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },

    platform: {
      type: String,
      default: "android",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("NotificationToken", NotificationTokenSchema);
