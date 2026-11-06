// import axios from "axios";
// import mongoose from "mongoose";
// import News from "../models/News.js";

// import { sendNotification } from "../services/sendNotification.js";
// import NotificationToken from "../models/NotificationToken.js";

// const SUPPORTED_LANGUAGES = ["en", "hi", "bn", "mr", "ta"];

// const getLanguage = (req) => {
//   const lang = req.query.lang || "en";

//   return SUPPORTED_LANGUAGES.includes(lang) ? lang : "en";
// };

// const applyTranslation = (news, lang = "en") => {
//   if (!news) return news;

//   const item = news.toObject ? news.toObject() : { ...news };

//   const translation = item.translations?.[lang] || {};

//   return {
//     ...item,

//     title: translation.title || item.title || "",

//     subtitle: translation.subtitle || item.subtitle || "",

//     content: translation.content || item.content || {},
//   };
// };

// export const createNews = async (req, res) => {
//   try {
//     const {
//       title,
//       sub_title,
//       video_type,
//       youtube_url,
//       content,
//       slug,
//       type,
//       scheduledAt,
//       translations,
//     } = req.body;
//     // const {
//     //   title,
//     //   sub_title,
//     //   video_type,
//     //   youtube_url,
//     //   content,
//     //   slug,
//     //   type,
//     //   scheduledAt,
//     // } = req.body;

//     let categories = [];

//     // try {
//     //   categories = JSON.parse(req.body.categories || "[]");
//     // } catch (err) {
//     //   categories = [];
//     // }
//     let parsedTranslations = {};

//     try {
//       parsedTranslations = JSON.parse(req.body.translations || "{}");
//     } catch (err) {
//       parsedTranslations = {};
//     }

//     categories = categories.map((id) => new mongoose.Types.ObjectId(id));

//     // Convert schedule date
//     let scheduledDate = null;

//     if (scheduledAt) {
//       scheduledDate = new Date(new Date(scheduledAt).getTime() - 19800000);
//     }

//     // const existingNews = await News.findOne({
//     //   title: title.trim(),
//     //   author: req.body.author,
//     //   type: 1,
//     // });

//     const existingNews = await News.findOne({
//       title: title.trim(),
//       author: req.body.author,
//       type: 1,
//     });

//     if (existingNews) {
//       return res.status(400).json({
//         status: false,
//         message: "News already exists",
//       });
//     }

//     if (slug) {
//       const existingSlug = await News.findOne({
//         slug: slug.trim(),
//       });

//       if (existingSlug) {
//         return res.status(400).json({
//           status: false,
//           message: "Slug already exists",
//         });
//       }
//     }

//     const createdNews = await News.create({
//       title,
//       subtitle: sub_title,

//       author: req.body.author,

//       categories,
//       ...(req.body.slug && req.body.slug.trim()
//         ? { slug: req.body.slug.trim() }
//         : {}),
//       videoType: video_type,

//       youtubeUrl: youtube_url || "",

//       content: content || "",
//       translations: parsedTranslations,
//       type: Number(type),

//       scheduledAt: scheduledDate,

//       isScheduled: Number(type) === 3,

//       thumbnail: req.file?.filename || "",
//     });

//     // Send Push Notification only when Published

//     if (Number(createdNews.type) === 1) {
//       console.log("=================================");
//       console.log("Sending Push Notification...");
//       console.log("News:", createdNews.title);

//       const tokens = await NotificationToken.find();

//       console.log("Total Tokens:", tokens.length);

//       if (tokens.length > 0) {
//         await sendNotification(
//           tokens.map((item) => item.token),
//           createdNews,
//         );

//         console.log("✅ Push Notification Sent");
//       } else {
//         console.log("❌ No Device Tokens Found");
//       }

//       console.log("=================================");
//     }

//     // populate author after create
//     const news = await News.findById(createdNews._id)
//       .populate("author", "name email")
//       .populate("categories", "name");

//     return res.status(201).json({
//       status: true,
//       message: "News created successfully",
//       data: news,
//     });
//   } catch (error) {
//     console.error("Create News Error:", error);

//     if (error.code === 11000) {
//       return res.status(400).json({
//         status: false,
//         message: "News already exists",
//       });
//     }

//     return res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };

// export const getNews = async (req, res) => {
//   try {
//     // const { page = 1, limit } = req.query;

//     const { page = 1, limit } = req.query;

//     const lang = getLanguage(req);

//     const query = {
//       type: 1, // Published News
//     };

//     let newsQuery = News.find(query)
//       .populate("author", "name email")
//       .populate("categories", "name slug")
//       .sort({ createdAt: -1 });

//     // Apply pagination only if limit is provided
//     if (limit) {
//       const pageNumber = parseInt(page);
//       const limitNumber = parseInt(limit);

//       newsQuery = newsQuery
//         .skip((pageNumber - 1) * limitNumber)
//         .limit(limitNumber);
//     }

//     const news = await newsQuery;

//     const translatedNews = news.map((item) => applyTranslation(item, lang));

//     const total = await News.countDocuments(query);

//     // return res.status(200).json({
//     //   status: true,
//     //   total,
//     //   totalPages: limit ? Math.ceil(total / parseInt(limit)) : 1,
//     //   data: news,
//     // });

//     return res.status(200).json({
//       status: true,
//       total,
//       totalPages: limit ? Math.ceil(total / parseInt(limit)) : 1,
//       data: translatedNews,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };

// export const getAllDraftNews = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, author } = req.query;

//     const query = {
//       type: 2, // Draft News
//     };

//     // Optional: filter drafts by author
//     if (author) {
//       if (!mongoose.Types.ObjectId.isValid(author)) {
//         return res.status(400).json({
//           status: false,
//           message: "Invalid author ID",
//         });
//       }

//       query.author = author;
//     }

//     const pageNumber = parseInt(page);
//     const limitNumber = parseInt(limit);
//     const skip = (pageNumber - 1) * limitNumber;

//     const news = await News.find(query)
//       .populate("author", "name email profileImage")
//       .populate("categories", "name slug")
//       .sort({ updatedAt: -1 })
//       .skip(skip)
//       .limit(limitNumber);

//     const total = await News.countDocuments(query);

//     return res.status(200).json({
//       status: true,
//       total,
//       page: pageNumber,
//       limit: limitNumber,
//       totalPages: Math.ceil(total / limitNumber),
//       data: news,
//     });
//   } catch (error) {
//     console.error("Get All Draft News Error:", error);

//     return res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };

// export const getAllNewsByCategory = async (req, res) => {
//   try {
//     const { categoryId } = req.params;
//     const { page = 1, limit = 6 } = req.query;
//     const lang = getLanguage(req);
//     if (!mongoose.Types.ObjectId.isValid(categoryId)) {
//       return res.status(400).json({
//         status: false,
//         message: "Invalid category ID",
//       });
//     }

//     const skip = (page - 1) * limit;

//     const news = await News.find({
//       categories: { $in: [categoryId] },
//       type: 1,
//     })

//       .populate("categories", "name slug _id")
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(parseInt(limit));

//     const translatedNews = news.map((item) => applyTranslation(item, lang));

//     const total = await News.countDocuments({
//       categories: { $in: [categoryId] },
//       type: 1,
//     });

//     return res.status(200).json({
//       status: true,
//       totalPages: Math.ceil(total / limit),
//       total,
//       data: translatedNews,
//     });
//   } catch (error) {
//     console.error("Get News By Category Error:", error);

//     return res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };

// export const getNewsBySlug = async (req, res) => {
//   try {
//     const lang = getLanguage(req);

//     const oldSlug = req.params.slug;

//     const slugRedirects = {
//       "-2": "haryana-ko-mili-badi-jimmedari-cpa-zone-2-ki-karegi-mezbani",

//       30: "sapa-ko-bada-jhatka-30-padadhikariyon-ne-thama-subhaspa-ka-daman",

//       sc: "lakhimpur-hinsa-case-mein-dheeme-trial-par-sc-sakht-ashish-mishra-mamle-mein-mangi-nayi-report",

//       "up--": "up-mein-congress-spa-ka-hoga-safaya-keshav",
//     };

//     if (slugRedirects[oldSlug]) {
//       const newSlug = slugRedirects[oldSlug];

//       return res.redirect(301, `/news/${newSlug}`);
//     }

//     const news = await News.findOne({
//       slug: oldSlug,
//     })
//       .populate("author", "name email profileImage")
//       .populate("categories", "name slug _id");

//     if (!news) {
//       return res.status(404).json({
//         status: false,
//         message: "News not found",
//       });
//     }

//     return res.status(200).json({
//       status: true,
//       data: applyTranslation(news, lang),
//     });

//     // return res.status(200).json({
//     //   status: true,
//     //   data: news,
//     // });
//   } catch (error) {
//     console.error("Get News By Slug Error:", error);

//     return res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };

// export const getNewsById = async (req, res) => {
//   try {
//     const lang = getLanguage(req);
//     const { id } = req.params;

//     const news = await News.findById(id).populate("categories", "name slug");

//     if (!news) {
//       return res.status(404).json({
//         status: false,
//         message: "News not found",
//       });
//     }

//     return res.status(200).json({
//       status: true,
//       data: applyTranslation(news, lang),
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };

// export const updateNews = async (req, res) => {
//   try {
//     const {
//       id,
//       title,
//       sub_title,
//       video_type,
//       youtube_url,
//       content,
//       slug,
//       type,
//       scheduledAt,
//       translations,
//     } = req.body;

//     let categories = [];
//     try {
//       categories = JSON.parse(req.body.categories || "[]");
//     } catch (err) {
//       categories = [];
//     }

//     let parsedTranslations = {};

//     try {
//       parsedTranslations = JSON.parse(req.body.translations || "{}");
//     } catch (err) {
//       parsedTranslations = {};
//     }

//     categories = categories.map((id) => new mongoose.Types.ObjectId(id));

//     const existingNews = await News.findOne({
//       title: title.trim(),
//       author: req.body.author,
//       _id: { $ne: id },
//       type: 1,
//     });

//     if (existingNews) {
//       return res.status(400).json({
//         status: false,
//         message: "News already exists",
//       });
//     }

//     const updateData = {
//       title,
//       subtitle: sub_title,
//       categories,
//       videoType: video_type,

//       translations: parsedTranslations,

//       ...(slug && slug.trim() ? { slug: slug.trim() } : {}),

//       youtubeUrl: youtube_url || "",

//       content: content || "",

//       scheduledAt: req.body.scheduledAt
//         ? new Date(new Date(req.body.scheduledAt).getTime() - 19800000)
//         : null,

//       isScheduled: Number(type) === 3,

//       type: Number(type),
//     };

//     // const updateData = {
//     //   title,
//     //   subtitle: sub_title,
//     //   categories,
//     //   videoType: video_type,
//     //   ...(slug && slug.trim() ? { slug: slug.trim() } : {}),
//     //   youtubeUrl: youtube_url || "",

//     //   content: content || "",
//     //   scheduledAt: req.body.scheduledAt
//     //     ? new Date(new Date(req.body.scheduledAt).getTime() - 19800000)
//     //     : null,
//     //   isScheduled: Number(type) === 3,
//     //   type: Number(type),
//     // };

//     if (req.file) {
//       updateData.thumbnail = req.file.filename;
//     }

//     if (slug) {
//       const existingSlug = await News.findOne({
//         slug: slug.trim(),
//         _id: { $ne: id },
//       });

//       if (existingSlug) {
//         return res.status(400).json({
//           status: false,
//           message: "Slug already exists",
//         });
//       }
//     }

//     const updated = await News.findByIdAndUpdate(id, updateData, {
//       new: true,
//     });

//     // =============================
//     // Send Push Notification
//     // =============================

//     if (Number(updated.type) === 1) {
//       console.log("================================");
//       console.log("Sending Notification...");
//       console.log("News:", updated.title);

//       const tokens = await NotificationToken.find().select("token");

//       console.log("Total Tokens:", tokens.length);

//       if (tokens.length > 0) {
//         await sendNotification(
//           tokens.map((item) => item.token),
//           updated,
//         );

//         console.log("✅ Notification Sent Successfully");
//       } else {
//         console.log("❌ No Device Tokens Found");
//       }

//       console.log("================================");
//     }

//     return res.status(200).json({
//       status: true,
//       message: "News updated successfully",
//       data: updated,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };

// export const deleteNews = async (req, res) => {
//   try {
//     await News.findByIdAndDelete(req.params.id);

//     return res.status(200).json({
//       status: true,
//       message: "News deleted successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };

// export const getAllNewsByAuthorId = async (req, res) => {
//   try {
//     const { authorId } = req.params;

//     const { page = 1, limit = 10 } = req.query;

//     // Validate ObjectId
//     if (!mongoose.Types.ObjectId.isValid(authorId)) {
//       return res.status(400).json({
//         status: false,
//         message: "Invalid author ID",
//       });
//     }

//     const skip = (page - 1) * limit;

//     // Get News
//     const news = await News.find({
//       author: authorId,
//     })
//       .populate("author", "name email profileImage")
//       .populate("categories", "name slug")
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(parseInt(limit));

//     // Total Count
//     const total = await News.countDocuments({
//       author: authorId,
//     });

//     return res.status(200).json({
//       status: true,
//       totalPages: Math.ceil(total / limit),
//       total,
//       data: news,
//     });
//   } catch (error) {
//     console.error("Get News By Author Error:", error);

//     return res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };

// export const autoSaveNews = async (req, res) => {
//   try {
//     // const { title, subtitle, categories, videoType, content, type, slug } =
//     //   req.body;
//     const {
//       title,
//       subtitle,
//       categories,
//       videoType,
//       content,
//       type,
//       slug,
//       translations,
//     } = req.body;

//     let parsedTranslations = {};

//     try {
//       parsedTranslations = JSON.parse(req.body.translations || "{}");
//     } catch (err) {
//       parsedTranslations = {};
//     }

//     if (Number(type) === 2) {
//       console.log("Draft auto-save: translation skipped");
//     }

//     let parsedCategories = [];

//     try {
//       parsedCategories = JSON.parse(categories || "[]");
//     } catch (err) {
//       parsedCategories = [];
//     }

//     parsedCategories = parsedCategories.map(
//       (id) => new mongoose.Types.ObjectId(id),
//     );

//     let draft = await News.findOne({
//       author: req.body.author,
//       type: 2,
//     }).sort({ updatedAt: -1 });

//     if (slug) {
//       const existingSlug = await News.findOne({
//         slug: slug.trim(),
//         _id: { $ne: draft?._id },
//       });

//       if (existingSlug) {
//         return res.status(400).json({
//           status: false,
//           message: "Slug already exists",
//         });
//       }
//     }

//     if (draft) {
//       draft.title = title;
//       draft.subtitle = subtitle;
//       if (slug && slug.trim()) {
//         draft.slug = slug.trim();
//       }
//       draft.categories = parsedCategories;
//       draft.videoType = videoType;
//       draft.translations = parsedTranslations;
//       draft.content =
//         typeof content === "string" ? content : JSON.stringify(content);

//       if (req.file) {
//         draft.thumbnail = req.file.filename;
//       }

//       await draft.save();
//     } else {
//       draft = await News.create({
//         title,
//         subtitle,
//         ...(slug && slug.trim() ? { slug: slug.trim() } : {}),
//         categories: parsedCategories,
//         videoType,
//         translations: parsedTranslations,
//         content:
//           typeof content === "string" ? content : JSON.stringify(content),
//         type: 2,
//         author: req.body.author,
//         thumbnail: req.file?.filename || "",
//         youtubeUrl: "",
//       });
//     }

//     res.json({
//       status: true,
//       message: "Draft auto-saved",
//       data: draft,
//     });
//   } catch (error) {
//     console.error("AUTO SAVE ERROR:", error);

//     res.status(500).json({
//       status: false,
//       message: "Auto save failed",
//       error: error.message,
//     });
//   }
// };

// export const increaseView = async (req, res) => {
//   try {
//     const { id } = req.params;

//     await News.findByIdAndUpdate(id, {
//       $inc: { views: 1 },
//     });

//     return res.json({
//       status: true,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };

// export const getTrendingNews = async (req, res) => {
//   try {
//     // const { limit = 10 } = req.query;

//     const { limit = 10 } = req.query;

//     const lang = getLanguage(req);

//     const last7Days = new Date();
//     last7Days.setDate(last7Days.getDate() - 7);

//     const news = await News.find({
//       type: 1,
//       createdAt: { $gte: last7Days },
//     })
//       .populate("author", "name")
//       .populate("categories", "name slug")
//       .sort({
//         views: -1,
//         createdAt: -1,
//       })
//       .limit(parseInt(limit));

//     const translatedNews = news.map((item) => applyTranslation(item, lang));

//     return res.status(200).json({
//       status: true,
//       total: news.length,
//       data: translatedNews,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };

// export const getPopularNews = async (req, res) => {
//   try {
//     const { limit = 10 } = req.query;
//     const lang = getLanguage(req);
//     const news = await News.find({
//       type: 1,
//     })
//       .populate("author", "name")
//       .populate("categories", "name slug")
//       .sort({
//         views: -1,
//         createdAt: -1,
//       })
//       .limit(parseInt(limit));

//     const translatedNews = news.map((item) => applyTranslation(item, lang));

//     return res.status(200).json({
//       status: true,
//       total: news.length,
//       data: translatedNews,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };

// export const increaseShare = async (req, res) => {
//   try {
//     const { id } = req.params;

//     await News.findByIdAndUpdate(id, {
//       $inc: {
//         shares: 1,
//       },
//     });

//     return res.json({
//       status: true,
//       message: "Share updated",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };

// export const getMostSharedNews = async (req, res) => {
//   try {
//     const { limit = 5 } = req.query;
//     const lang = getLanguage(req);
//     const news = await News.find({
//       type: 1,
//     })
//       .populate("author", "name")
//       .populate("categories", "name slug")
//       .sort({
//         shares: -1,
//         createdAt: -1,
//       })
//       .limit(parseInt(limit));

//     const translatedNews = news.map((item) => applyTranslation(item, lang));

//     return res.status(200).json({
//       status: true,
//       total: news.length,
//       data: translatedNews,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };

// export const getVideoNews = async (req, res) => {
//   try {
//     // const { page = 1, limit = 10 } = req.query;
//     const { page = 1, limit = 10 } = req.query;

//     const lang = getLanguage(req);
//     const skip = (page - 1) * limit;

//     const news = await News.find({
//       type: 1, // Published
//       videoType: 1, // Video News
//     })
//       .populate("author", "name")
//       .populate("categories", "name slug")
//       .sort({
//         createdAt: -1,
//       })
//       .skip(skip)
//       .limit(parseInt(limit));

//     const total = await News.countDocuments({
//       type: 1,
//       videoType: 1,
//     });

//     const translatedNews = news.map((item) => applyTranslation(item, lang));

//     return res.status(200).json({
//       status: true,
//       total,
//       totalPages: Math.ceil(total / limit),
//       data: translatedNews,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };

// export const previousNextNews = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const lang = getLanguage(req);
//     const currentNews = await News.findById(id);

//     if (!currentNews) {
//       return res.status(404).json({
//         success: false,
//         message: "News not found",
//       });
//     }

//     const previous = await News.findOne({
//       type: 1,
//       createdAt: { $lt: currentNews.createdAt },
//     })
//       .sort({ createdAt: -1 })
//       // .select("_id title slug");
//       .select("_id title subtitle slug translations");
//     const next = await News.findOne({
//       type: 1,
//       createdAt: { $gt: currentNews.createdAt },
//     })
//       .sort({ createdAt: 1 })
//       .select("_id title subtitle slug translations");

//     return res.json({
//       success: true,
//       previous,
//       next,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// export const shareNews = async (req, res) => {
//   try {
//     const news = await News.findOne({
//       slug: req.params.slug,
//       type: 1,
//     });

//     if (!news) {
//       return res.status(404).send("News not found");
//     }

//     res.render("share", {
//       title: news.title,
//       description: news.subtitle || news.metaDescription || "",
//       image: `https://api.bharat19express.com/uploads/images/${news.thumbnail}`,
//       url: `https://api.bharat19express.com/api/news/share/${news.slug}`,
//       frontendUrl: `https://bharat19express.com/news/${news.slug}`,
//     });
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// };

// export const getLiveStatus = async (req, res) => {
//   try {
//     const API_KEY = process.env.YOUTUBE_API_KEY;
//     const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

//     console.log("API KEY:", API_KEY);
//     console.log("CHANNEL:", CHANNEL_ID);

//     const url = `https://www.googleapis.com/youtube/v3/search`;

//     const response = await axios.get(url, {
//       params: {
//         part: "snippet",
//         channelId: CHANNEL_ID,
//         eventType: "live",
//         type: "video",
//         key: API_KEY,
//       },
//     });

//     console.log(response.data);

//     if (response.data.items.length > 0) {
//       const live = response.data.items[0];

//       return res.json({
//         status: true,
//         isLive: true,
//         videoId: live.id.videoId,
//         title: live.snippet.title,
//         thumbnail: live.snippet.thumbnails.high.url,
//       });
//     }

//     return res.json({
//       status: true,
//       isLive: false,
//     });
//   } catch (err) {
//     console.log("========== GOOGLE ERROR ==========");

//     if (err.response) {
//       console.log(err.response.status);
//       console.log(JSON.stringify(err.response.data, null, 2));

//       return res.status(err.response.status).json(err.response.data);
//     }

//     console.log(err.message);

//     return res.status(500).json({
//       status: false,
//       message: err.message,
//     });
//   }
// };

// export const newsMeta = async (req, res) => {
//   try {
//     const news = await News.findOne({
//       slug: req.params.slug,
//       type: 1,
//     });

//     if (!news) {
//       return res.status(404).send("News not found");
//     }

//     const image = `https://api.bharat19express.com/uploads/images/${news.thumbnail}`;
//     const url = `https://bharat19express.com/news/${news.slug}`;

//     res.send(`
// <!DOCTYPE html>
// <html lang="en">
// <head>

// <meta charset="UTF-8">

// <title>${news.title}</title>

// <meta name="description" content="${news.subtitle || ""}">

// <meta property="og:type" content="article">
// <meta property="og:title" content="${news.title}">
// <meta property="og:description" content="${news.subtitle || ""}">
// <meta property="og:image" content="${image}">
// <meta property="og:url" content="${url}">

// <meta name="twitter:card" content="summary_large_image">
// <meta name="twitter:title" content="${news.title}">
// <meta name="twitter:description" content="${news.subtitle || ""}">
// <meta name="twitter:image" content="${image}">

// <script>
// window.location.href="${url}";
// </script>

// </head>

// <body>
// Redirecting...
// </body>

// </html>
// `);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// };

import axios from "axios";
import mongoose from "mongoose";
import News from "../models/News.js";

import { sendNotification } from "../services/sendNotification.js";
import NotificationToken from "../models/NotificationToken.js";

/*
|--------------------------------------------------------------------------
| Supported Languages
|--------------------------------------------------------------------------
*/

const SUPPORTED_LANGUAGES = ["en", "hi", "bn", "mr", "ta"];

/*
|--------------------------------------------------------------------------
| Get Language
|--------------------------------------------------------------------------
|
| Example:
| /api/news?lang=hi
| /api/news?lang=bn
| /api/news?lang=mr
| /api/news?lang=ta
|
*/

const getLanguage = (req) => {
  const lang = req.query.lang || "en";

  return SUPPORTED_LANGUAGES.includes(lang) ? lang : "en";
};

/*
|--------------------------------------------------------------------------
| Apply Translation
|--------------------------------------------------------------------------
|
| English:
| Uses original title/subtitle/content
|
| Other languages:
| Uses translations[lang]
|
| If translation is empty, English is used as fallback.
|
*/

const applyTranslation = (news, lang = "en") => {
  if (!news) return news;

  const item = news.toObject ? news.toObject() : { ...news };

  const translation = item.translations?.[lang] || {};

  return {
    ...item,

    title: translation.title || item.title || "",

    subtitle: translation.subtitle || item.subtitle || "",

    content: translation.content || item.content || {},
  };
};

/*
|--------------------------------------------------------------------------
| CREATE NEWS
|--------------------------------------------------------------------------
*/

export const createNews = async (req, res) => {
  try {
    const {
      title,
      sub_title,
      video_type,
      youtube_url,
      content,
      slug,
      type,
      scheduledAt,
      translations,
    } = req.body;

    let categories = [];

    try {
      categories = JSON.parse(req.body.categories || "[]");
    } catch (err) {
      categories = [];
    }

    let parsedTranslations = {};

    try {
      parsedTranslations = JSON.parse(req.body.translations || "{}");
    } catch (err) {
      parsedTranslations = {};
    }

    categories = categories
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id));

    let scheduledDate = null;

    if (scheduledAt) {
      scheduledDate = new Date(new Date(scheduledAt).getTime() - 19800000);
    }

    /*
    |--------------------------------------------------------------------------
    | Check Duplicate News
    |--------------------------------------------------------------------------
    */

    const existingNews = await News.findOne({
      title: title.trim(),
      author: req.body.author,
      type: 1,
    });

    if (existingNews) {
      return res.status(400).json({
        status: false,
        message: "News already exists",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Check Duplicate Slug
    |--------------------------------------------------------------------------
    */

    if (slug) {
      const existingSlug = await News.findOne({
        slug: slug.trim(),
      });

      if (existingSlug) {
        return res.status(400).json({
          status: false,
          message: "Slug already exists",
        });
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Create News
    |--------------------------------------------------------------------------
    */

    const createdNews = await News.create({
      title,

      subtitle: sub_title,

      author: req.body.author,

      categories,

      ...(req.body.slug && req.body.slug.trim()
        ? {
            slug: req.body.slug.trim(),
          }
        : {}),

      videoType: video_type,

      youtubeUrl: youtube_url || "",

      content: content || "",

      /*
      |--------------------------------------------------------------------------
      | Multilingual Data
      |--------------------------------------------------------------------------
      */

      translations: parsedTranslations,

      type: Number(type),

      scheduledAt: scheduledDate,

      isScheduled: Number(type) === 3,

      thumbnail: req.file?.filename || "",
    });

    /*
    |--------------------------------------------------------------------------
    | Send Push Notification
    |--------------------------------------------------------------------------
    */

    if (Number(createdNews.type) === 1) {
      console.log("=================================");
      console.log("Sending Push Notification...");
      console.log("News:", createdNews.title);

      const tokens = await NotificationToken.find();

      console.log("Total Tokens:", tokens.length);

      if (tokens.length > 0) {
        await sendNotification(
          tokens.map((item) => item.token),
          createdNews,
        );

        console.log("Push Notification Sent");
      } else {
        console.log("No Device Tokens Found");
      }

      console.log("=================================");
    }

    /*
    |--------------------------------------------------------------------------
    | Populate
    |--------------------------------------------------------------------------
    */

    const news = await News.findById(createdNews._id)
      .populate("author", "name email")
      .populate("categories", "name slug");

    return res.status(201).json({
      status: true,
      message: "News created successfully",
      data: news,
    });
  } catch (error) {
    console.error("Create News Error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        status: false,
        message: "News already exists",
      });
    }

    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET PUBLISHED NEWS
|--------------------------------------------------------------------------
*/

export const getNews = async (req, res) => {
  try {
    const { page = 1, limit } = req.query;

    const lang = getLanguage(req);

    const query = {
      type: 1,
    };

    let newsQuery = News.find(query)
      .populate("author", "name email")
      .populate("categories", "name slug")
      .sort({
        createdAt: -1,
      });

    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */

    if (limit) {
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);

      newsQuery = newsQuery
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);
    }

    const news = await newsQuery;

    /*
    |--------------------------------------------------------------------------
    | Apply Translation
    |--------------------------------------------------------------------------
    */

    const translatedNews = news.map((item) => applyTranslation(item, lang));

    const total = await News.countDocuments(query);

    return res.status(200).json({
      status: true,
      total,

      totalPages: limit ? Math.ceil(total / parseInt(limit)) : 1,

      data: translatedNews,
    });
  } catch (error) {
    console.error("Get News Error:", error);

    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET ALL DRAFT NEWS
|--------------------------------------------------------------------------
*/

export const getAllDraftNews = async (req, res) => {
  try {
    const { page = 1, limit = 10, author } = req.query;

    const query = {
      type: 2,
    };

    /*
    |--------------------------------------------------------------------------
    | Filter by Author
    |--------------------------------------------------------------------------
    */

    if (author) {
      if (!mongoose.Types.ObjectId.isValid(author)) {
        return res.status(400).json({
          status: false,
          message: "Invalid author ID",
        });
      }

      query.author = author;
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const skip = (pageNumber - 1) * limitNumber;

    const news = await News.find(query)
      .populate("author", "name email profileImage")
      .populate("categories", "name slug")
      .sort({
        updatedAt: -1,
      })
      .skip(skip)
      .limit(limitNumber);

    const total = await News.countDocuments(query);

    return res.status(200).json({
      status: true,

      total,

      page: pageNumber,

      limit: limitNumber,

      totalPages: Math.ceil(total / limitNumber),

      data: news,
    });
  } catch (error) {
    console.error("Get All Draft News Error:", error);

    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET NEWS BY CATEGORY
|--------------------------------------------------------------------------
*/

export const getAllNewsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const { page = 1, limit = 6 } = req.query;

    const lang = getLanguage(req);

    /*
    |--------------------------------------------------------------------------
    | Validate Category ID
    |--------------------------------------------------------------------------
    */

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid category ID",
      });
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const skip = (pageNumber - 1) * limitNumber;

    const query = {
      categories: {
        $in: [categoryId],
      },

      type: 1,
    };

    const news = await News.find(query)
      .populate("categories", "name slug _id")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limitNumber);

    const translatedNews = news.map((item) => applyTranslation(item, lang));

    const total = await News.countDocuments(query);

    return res.status(200).json({
      status: true,

      totalPages: Math.ceil(total / limitNumber),

      total,

      data: translatedNews,
    });
  } catch (error) {
    console.error("Get News By Category Error:", error);

    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET NEWS BY SLUG
|--------------------------------------------------------------------------
*/

export const getNewsBySlug = async (req, res) => {
  try {
    const lang = getLanguage(req);

    const oldSlug = req.params.slug;

    /*
    |--------------------------------------------------------------------------
    | Old Slug Redirects
    |--------------------------------------------------------------------------
    */

    const slugRedirects = {
      "-2": "haryana-ko-mili-badi-jimmedari-cpa-zone-2-ki-karegi-mezbani",

      30: "sapa-ko-bada-jhatka-30-padadhikariyon-ne-thama-subhaspa-ka-daman",

      sc: "lakhimpur-hinsa-case-mein-dheeme-trial-par-sc-sakht-ashish-mishra-mamle-mein-mangi-nayi-report",

      "up--": "up-mein-congress-spa-ka-hoga-safaya-keshav",
    };

    if (slugRedirects[oldSlug]) {
      const newSlug = slugRedirects[oldSlug];

      return res.redirect(301, `/news/${newSlug}`);
    }

    /*
    |--------------------------------------------------------------------------
    | Find News
    |--------------------------------------------------------------------------
    */

    const news = await News.findOne({
      slug: oldSlug,
    })
      .populate("author", "name email profileImage")
      .populate("categories", "name slug _id");

    if (!news) {
      return res.status(404).json({
        status: false,
        message: "News not found",
      });
    }

    return res.status(200).json({
      status: true,

      data: applyTranslation(news, lang),
    });
  } catch (error) {
    console.error("Get News By Slug Error:", error);

    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET NEWS BY ID
|--------------------------------------------------------------------------
*/

export const getNewsById = async (req, res) => {
  try {
    const lang = getLanguage(req);

    const { id } = req.params;

    const news = await News.findById(id).populate("categories", "name slug");

    if (!news) {
      return res.status(404).json({
        status: false,
        message: "News not found",
      });
    }

    return res.status(200).json({
      status: true,

      data: applyTranslation(news, lang),
    });
  } catch (error) {
    console.error("Get News By ID Error:", error);

    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE NEWS
|--------------------------------------------------------------------------
*/

export const updateNews = async (req, res) => {
  try {
    const {
      id,
      title,
      sub_title,
      video_type,
      youtube_url,
      content,
      slug,
      type,
      scheduledAt,
      translations,
      categories,
    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | Validate ID
    |--------------------------------------------------------------------------
    */

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid news ID",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Find News
    |--------------------------------------------------------------------------
    */

    const news = await News.findById(id);

    if (!news) {
      return res.status(404).json({
        status: false,
        message: "News not found",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Parse Translations
    |--------------------------------------------------------------------------
    */

    let parsedTranslations = news.translations || {};

    try {
      if (translations) {
        parsedTranslations =
          typeof translations === "string"
            ? JSON.parse(translations)
            : translations;
      }
    } catch (err) {
      console.error("Translation JSON Parse Error:", err);
    }

    /*
    |--------------------------------------------------------------------------
    | Parse Categories
    |--------------------------------------------------------------------------
    */

    let parsedCategories = news.categories || [];

    try {
      if (categories) {
        const categoryData =
          typeof categories === "string" ? JSON.parse(categories) : categories;

        parsedCategories = categoryData
          .filter((categoryId) => mongoose.Types.ObjectId.isValid(categoryId))
          .map((categoryId) => new mongoose.Types.ObjectId(categoryId));
      }
    } catch (err) {
      console.error("Category JSON Parse Error:", err);
    }

    /*
    |--------------------------------------------------------------------------
    | Duplicate Slug Check
    |--------------------------------------------------------------------------
    */

    if (slug && slug.trim()) {
      const existingSlug = await News.findOne({
        slug: slug.trim(),

        _id: {
          $ne: id,
        },
      });

      if (existingSlug) {
        return res.status(400).json({
          status: false,
          message: "Slug already exists",
        });
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Schedule Date
    |--------------------------------------------------------------------------
    */

    let scheduledDate = news.scheduledAt;

    if (scheduledAt) {
      scheduledDate = new Date(new Date(scheduledAt).getTime() - 19800000);
    }

    /*
    |--------------------------------------------------------------------------
    | Update Fields
    |--------------------------------------------------------------------------
    */

    news.title = title;

    news.subtitle = sub_title || "";

    news.videoType = video_type;

    news.youtubeUrl = youtube_url || "";

    news.content = content || "";

    news.categories = parsedCategories;

    news.translations = parsedTranslations;

    if (slug && slug.trim()) {
      news.slug = slug.trim();
    }

    if (type !== undefined) {
      news.type = Number(type);

      news.isScheduled = Number(type) === 3;
    }

    news.scheduledAt = scheduledDate;

    /*
    |--------------------------------------------------------------------------
    | Thumbnail
    |--------------------------------------------------------------------------
    */

    if (req.file) {
      news.thumbnail = req.file.filename;
    }

    await news.save();

    /*
    |--------------------------------------------------------------------------
    | Populate Updated News
    |--------------------------------------------------------------------------
    */

    const updatedNews = await News.findById(news._id)
      .populate("author", "name email profileImage")
      .populate("categories", "name slug");

    return res.status(200).json({
      status: true,

      message: "News updated successfully",

      data: updatedNews,
    });
  } catch (error) {
    console.error("Update News Error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        status: false,
        message: "News already exists",
      });
    }

    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| DELETE NEWS
|--------------------------------------------------------------------------
*/

export const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid news ID",
      });
    }

    const news = await News.findByIdAndDelete(id);

    if (!news) {
      return res.status(404).json({
        status: false,
        message: "News not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "News deleted successfully",
    });
  } catch (error) {
    console.error("Delete News Error:", error);

    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET NEWS BY AUTHOR
|--------------------------------------------------------------------------
*/

export const getAllNewsByAuthorId = async (req, res) => {
  try {
    const { authorId, page = 1, limit = 10 } = req.query;

    if (!authorId || !mongoose.Types.ObjectId.isValid(authorId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid author ID",
      });
    }

    const pageNumber = parseInt(page);

    const limitNumber = parseInt(limit);

    const skip = (pageNumber - 1) * limitNumber;

    const query = {
      author: authorId,
    };

    const news = await News.find(query)
      .populate("author", "name email profileImage")
      .populate("categories", "name slug")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limitNumber);

    const total = await News.countDocuments(query);

    return res.status(200).json({
      status: true,

      total,

      page: pageNumber,

      limit: limitNumber,

      totalPages: Math.ceil(total / limitNumber),

      data: news,
    });
  } catch (error) {
    console.error("Get Author News Error:", error);

    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| AUTO SAVE NEWS
|--------------------------------------------------------------------------
*/

export const autoSaveNews = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      content,
      slug,
      videoType,
      categories,
      translations,
    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | Parse Translations
    |--------------------------------------------------------------------------
    */

    let parsedTranslations = {};

    try {
      parsedTranslations = JSON.parse(req.body.translations || "{}");
    } catch (err) {
      parsedTranslations = {};
    }

    /*
    |--------------------------------------------------------------------------
    | Parse Categories
    |--------------------------------------------------------------------------
    */

    let parsedCategories = [];

    try {
      parsedCategories = JSON.parse(categories || "[]");
    } catch (err) {
      parsedCategories = [];
    }

    parsedCategories = parsedCategories
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id));

    /*
    |--------------------------------------------------------------------------
    | Find Latest Draft
    |--------------------------------------------------------------------------
    */

    let draft = await News.findOne({
      author: req.body.author,
      type: 2,
    }).sort({
      updatedAt: -1,
    });

    /*
    |--------------------------------------------------------------------------
    | Slug Check
    |--------------------------------------------------------------------------
    */

    if (slug) {
      const existingSlug = await News.findOne({
        slug: slug.trim(),

        _id: {
          $ne: draft?._id,
        },
      });

      if (existingSlug) {
        return res.status(400).json({
          status: false,
          message: "Slug already exists",
        });
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Update Existing Draft
    |--------------------------------------------------------------------------
    */

    if (draft) {
      draft.title = title || "";

      draft.subtitle = subtitle || "";

      if (slug && slug.trim()) {
        draft.slug = slug.trim();
      }

      draft.categories = parsedCategories;

      draft.videoType = videoType;

      draft.translations = parsedTranslations;

      draft.content =
        typeof content === "string" ? content : JSON.stringify(content || {});

      if (req.file) {
        draft.thumbnail = req.file.filename;
      }

      await draft.save();
    } else {
      /*
    |--------------------------------------------------------------------------
    | Create New Draft
    |--------------------------------------------------------------------------
    */
      draft = await News.create({
        title: title || "",

        subtitle: subtitle || "",

        ...(slug && slug.trim()
          ? {
              slug: slug.trim(),
            }
          : {}),

        categories: parsedCategories,

        videoType,

        translations: parsedTranslations,

        content:
          typeof content === "string" ? content : JSON.stringify(content || {}),

        type: 2,

        author: req.body.author,

        thumbnail: req.file?.filename || "",

        youtubeUrl: "",
      });
    }

    return res.json({
      status: true,

      message: "Draft auto-saved",

      data: draft,
    });
  } catch (error) {
    console.error("AUTO SAVE ERROR:", error);

    return res.status(500).json({
      status: false,

      message: "Auto save failed",

      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| INCREASE VIEW
|--------------------------------------------------------------------------
*/

export const increaseView = async (req, res) => {
  try {
    const { id } = req.params;

    await News.findByIdAndUpdate(id, {
      $inc: {
        views: 1,
      },
    });

    return res.json({
      status: true,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| TRENDING NEWS
|--------------------------------------------------------------------------
*/

export const getTrendingNews = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const lang = getLanguage(req);

    /*
      |--------------------------------------------------------------------------
      | Last 7 Days
      |--------------------------------------------------------------------------
      */

    const last7Days = new Date();

    last7Days.setDate(last7Days.getDate() - 7);

    const news = await News.find({
      type: 1,

      createdAt: {
        $gte: last7Days,
      },
    })
      .populate("author", "name")
      .populate("categories", "name slug")
      .sort({
        views: -1,
        createdAt: -1,
      })
      .limit(parseInt(limit));

    const translatedNews = news.map((item) => applyTranslation(item, lang));

    return res.status(200).json({
      status: true,

      total: news.length,

      data: translatedNews,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| POPULAR NEWS
|--------------------------------------------------------------------------
*/

export const getPopularNews = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const lang = getLanguage(req);

    const news = await News.find({
      type: 1,
    })
      .populate("author", "name")
      .populate("categories", "name slug")
      .sort({
        views: -1,
        createdAt: -1,
      })
      .limit(parseInt(limit));

    const translatedNews = news.map((item) => applyTranslation(item, lang));

    return res.status(200).json({
      status: true,

      total: news.length,

      data: translatedNews,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| INCREASE SHARE
|--------------------------------------------------------------------------
*/

export const increaseShare = async (req, res) => {
  try {
    const { id } = req.params;

    await News.findByIdAndUpdate(id, {
      $inc: {
        shares: 1,
      },
    });

    return res.json({
      status: true,

      message: "Share updated",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| MOST SHARED NEWS
|--------------------------------------------------------------------------
*/

export const getMostSharedNews = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const lang = getLanguage(req);

    const news = await News.find({
      type: 1,
    })
      .populate("author", "name")
      .populate("categories", "name slug")
      .sort({
        shares: -1,
        createdAt: -1,
      })
      .limit(parseInt(limit));

    const translatedNews = news.map((item) => applyTranslation(item, lang));

    return res.status(200).json({
      status: true,

      total: news.length,

      data: translatedNews,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| VIDEO NEWS
|--------------------------------------------------------------------------
*/

export const getVideoNews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const lang = getLanguage(req);

    const pageNumber = parseInt(page);

    const limitNumber = parseInt(limit);

    const skip = (pageNumber - 1) * limitNumber;

    const query = {
      type: 1,

      videoType: 1,
    };

    const news = await News.find(query)
      .populate("author", "name")
      .populate("categories", "name slug")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limitNumber);

    const total = await News.countDocuments(query);

    const translatedNews = news.map((item) => applyTranslation(item, lang));

    return res.status(200).json({
      status: true,

      total,

      totalPages: Math.ceil(total / limitNumber),

      data: translatedNews,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| PREVIOUS / NEXT NEWS
|--------------------------------------------------------------------------
*/

export const previousNextNews = async (req, res) => {
  try {
    const { id } = req.params;

    const lang = getLanguage(req);

    const currentNews = await News.findById(id);

    if (!currentNews) {
      return res.status(404).json({
        success: false,

        message: "News not found",
      });
    }

    /*
      |--------------------------------------------------------------------------
      | Previous
      |--------------------------------------------------------------------------
      */

    const previous = await News.findOne({
      type: 1,

      createdAt: {
        $lt: currentNews.createdAt,
      },
    })
      .sort({
        createdAt: -1,
      })
      .select("_id title subtitle slug translations");

    /*
      |--------------------------------------------------------------------------
      | Next
      |--------------------------------------------------------------------------
      */

    const next = await News.findOne({
      type: 1,

      createdAt: {
        $gt: currentNews.createdAt,
      },
    })
      .sort({
        createdAt: 1,
      })
      .select("_id title subtitle slug translations");

    return res.json({
      success: true,

      previous: previous ? applyTranslation(previous, lang) : null,

      next: next ? applyTranslation(next, lang) : null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| SHARE NEWS PAGE
|--------------------------------------------------------------------------
*/

export const shareNews = async (req, res) => {
  try {
    const news = await News.findOne({
      slug: req.params.slug,

      type: 1,
    });

    if (!news) {
      return res.status(404).send("News not found");
    }

    res.render("share", {
      title: news.title,

      description: news.subtitle || news.metaDescription || "",

      image: `https://api.bharat19express.com/uploads/images/${news.thumbnail}`,

      url: `https://api.bharat19express.com/api/news/share/${news.slug}`,

      frontendUrl: `https://bharat19express.com/news/${news.slug}`,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/*
|--------------------------------------------------------------------------
| YOUTUBE LIVE STATUS
|--------------------------------------------------------------------------
*/

export const getLiveStatus = async (req, res) => {
  try {
    const API_KEY = process.env.YOUTUBE_API_KEY;

    const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

    console.log("API KEY:", API_KEY);

    console.log("CHANNEL:", CHANNEL_ID);

    const url = "https://www.googleapis.com/youtube/v3/search";

    const response = await axios.get(url, {
      params: {
        part: "snippet",

        channelId: CHANNEL_ID,

        eventType: "live",

        type: "video",

        key: API_KEY,
      },
    });

    console.log(response.data);

    /*
      |--------------------------------------------------------------------------
      | Live Found
      |--------------------------------------------------------------------------
      */

    if (response.data.items.length > 0) {
      const live = response.data.items[0];

      return res.json({
        status: true,

        isLive: true,

        videoId: live.id.videoId,

        title: live.snippet.title,

        thumbnail: live.snippet.thumbnails.high.url,
      });
    }

    /*
      |--------------------------------------------------------------------------
      | No Live Stream
      |--------------------------------------------------------------------------
      */

    return res.json({
      status: true,

      isLive: false,
    });
  } catch (error) {
    console.log("========== GOOGLE ERROR ==========");

    if (error.response) {
      console.log(error.response.status);

      console.log(JSON.stringify(error.response.data, null, 2));

      return res.status(error.response.status).json(error.response.data);
    }

    console.log(error.message);

    return res.status(500).json({
      status: false,

      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| NEWS META / SEO
|--------------------------------------------------------------------------
*/

export const newsMeta = async (req, res) => {
  try {
    const news = await News.findOne({
      slug: req.params.slug,

      type: 1,
    });

    if (!news) {
      return res.status(404).send("News not found");
    }

    const image = `https://api.bharat19express.com/uploads/images/${news.thumbnail}`;

    const url = `https://bharat19express.com/news/${news.slug}`;

    /*
      |--------------------------------------------------------------------------
      | HTML Meta Response
      |--------------------------------------------------------------------------
      */

    res.send(`
<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<title>${news.title}</title>

<meta
  name="description"
  content="${news.subtitle || ""}"
>

<meta
  property="og:type"
  content="article"
>

<meta
  property="og:title"
  content="${news.title}"
>

<meta
  property="og:description"
  content="${news.subtitle || ""}"
>

<meta
  property="og:image"
  content="${image}"
>

<meta
  property="og:url"
  content="${url}"
>

<meta
  name="twitter:card"
  content="summary_large_image"
>

<meta
  name="twitter:title"
  content="${news.title}"
>

<meta
  name="twitter:description"
  content="${news.subtitle || ""}"
>

<meta
  name="twitter:image"
  content="${image}"
>

<script>
window.location.href="${url}";
</script>

</head>

<body>

Redirecting...

</body>

</html>
`);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
