import Bookmark from "../models/Bookmark.js";
import News from "../models/News.js";

export const saveBookmark = async (req, res) => {
  try {
    const { newsId } = req.body;
    const userId = req.user.customerId;

    if (!newsId) {
      return res.status(400).json({
        status: false,
        message: "News ID is required",
      });
    }

    const news = await News.findById(newsId);

    if (!news) {
      return res.status(404).json({
        status: false,
        message: "News not found",
      });
    }

    const alreadyBookmarked = await Bookmark.findOne({
      user: userId,
      news: newsId,
    });

    if (alreadyBookmarked) {
      return res.status(200).json({
        status: true,
        message: "Already bookmarked",
      });
    }

    const bookmark = await Bookmark.create({
      user: userId,
      news: newsId,
    });

    return res.status(201).json({
      status: true,
      message: "Bookmark added successfully",
      data: bookmark,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: false,
      message: "Something went wrong",
    });
  }
};

export const removeBookmark = async (req, res) => {
  try {
    const userId = req.user.customerId;
    const { newsId } = req.params;

    const bookmark = await Bookmark.findOneAndDelete({
      user: userId,
      news: newsId,
    });

    if (!bookmark) {
      return res.status(404).json({
        status: false,
        message: "Bookmark not found",
      });
    }

    return res.json({
      status: true,
      message: "Bookmark removed successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: false,
      message: "Something went wrong",
    });
  }
};

export const getBookmarks = async (req, res) => {
  try {
    const userId = req.user.customerId;

    const bookmarks = await Bookmark.find({
      user: userId,
    })
      .populate({
        path: "news",
        populate: [
          {
            path: "author",
            select: "name",
          },
          {
            path: "categories",
            select: "name",
          },
        ],
      })
      .sort({
        createdAt: -1,
      });

    return res.json({
      status: true,
      total: bookmarks.length,
      data: bookmarks,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: false,
      message: "Something went wrong",
    });
  }
};

export const isBookmarked = async (req, res) => {
  try {
    const userId = req.user.customerId;
    const { newsId } = req.params;

    const bookmark = await Bookmark.findOne({
      user: userId,
      news: newsId,
    });

    return res.json({
      status: true,
      bookmarked: !!bookmark,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: false,
      message: "Something went wrong",
    });
  }
};

export const toggleBookmark = async (req, res) => {
  try {
    const { newsId } = req.body;
    const userId = req.user.customerId;

    const bookmark = await Bookmark.findOne({
      user: userId,
      news: newsId,
    });

    if (bookmark) {
      await bookmark.deleteOne();

      return res.json({
        status: true,
        bookmarked: false,
        message: "Bookmark removed",
      });
    }

    await Bookmark.create({
      user: userId,
      news: newsId,
    });

    return res.json({
      status: true,
      bookmarked: true,
      message: "Bookmark added",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: false,
      message: "Something went wrong",
    });
  }
};
