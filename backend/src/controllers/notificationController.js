import NotificationToken from "../models/NotificationToken.js";
import { sendNotification } from "../services/sendNotification.js";

export const saveToken = async (req, res) => {
  try {
    const { token, platform } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token Required",
      });
    }

    const exists = await NotificationToken.findOne({ token });

    if (!exists) {
      await NotificationToken.create({
        token,
        platform,
      });
    }

    return res.json({
      success: true,
      message: "Token Saved Successfully",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * TEST PUSH NOTIFICATION
 */
export const testNotification = async (req, res) => {
  try {
    const tokens = await NotificationToken.find().select("token");

    console.log("================================");
    console.log("TOTAL TOKENS:", tokens.length);
    console.log(tokens);
    console.log("================================");

    if (!tokens.length) {
      return res.status(404).json({
        success: false,
        message: "No Tokens Found",
      });
    }

    const news = {
      _id: "123456",
      slug: "test-news",
      title: "🚨 Test Notification",
    };

    await sendNotification(
      tokens.map((item) => item.token),
      news,
    );

    return res.json({
      success: true,
      message: "Notification Sent",
      totalTokens: tokens.length,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
