import admin from "../config/firebase.js";
import NotificationToken from "../models/NotificationToken.js";
export async function sendNotification(tokens, news) {
  for (const token of tokens) {
    try {
      console.log("================================");
      console.log("Sending to:", token);

      const message = {
        token,

        notification: {
          title: "Top Headlines",
          body: news.title,

          // imageUrl: `https://api.bharat19express.com/uploads/images/${news.thumbnail}`,
        },

        android: {
          priority: "high",

          notification: {
            channelId: "breaking-news",

            imageUrl: `https://api.bharat19express.com/uploads/images/${news.thumbnail}`,

            sound: "default",

            priority: "high",

            visibility: "public",

            defaultSound: true,

            defaultVibrateTimings: true,

            notificationCount: 1,
          },
        },

        apns: {
          payload: {
            aps: {
              mutableContent: true,
            },
          },
        },

        data: {
          slug: news.slug,
          newsId: news._id.toString(),

          image: `https://api.bharat19express.com/uploads/images/${news.thumbnail}`,

          title: "Top Headlines",

          body: news.title,
        },
      };

      const response = await admin.messaging().send(message);

      console.log("✅ Message ID:", response);

      console.log("✅ Sent:", response);
    } catch (err) {
      console.log("❌ Send Error");
      console.log(err.message);

      // Invalid token delete
      if (
        err.code === "messaging/registration-token-not-registered" ||
        err.code === "messaging/invalid-registration-token"
      ) {
        console.log("Deleting Invalid Token:", token);

        await NotificationToken.deleteOne({
          token,
        });
      }
    }
  }
}
