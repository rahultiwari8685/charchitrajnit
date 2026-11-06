import mongoose from "mongoose";

const NotificationTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      unique: true,
      required: true,
    },

    platform: {
      type: String,
      enum: ["android", "ios"],
      default: "android",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("NotificationToken", NotificationTokenSchema);
