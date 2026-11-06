import cron from "node-cron";
import News from "../models/News.js";

console.log("✅ publishScheduledNews.js loaded");

cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

    console.log("✅ CRON RUNNING");
    console.log("NOW:", now);

    const pending = await News.find({
      type: 3,
      scheduledAt: { $lte: now },
    });

    console.log("Found scheduled news:", pending.length);

    const result = await News.updateMany(
      {
        type: 3,
        scheduledAt: { $lte: now },
      },
      {
        $set: {
          type: 1,
          isScheduled: false,
        },
      },
    );

    console.log("Published:", result.modifiedCount);
  } catch (err) {
    console.error("Cron Error:", err);
  }
});
