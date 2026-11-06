import { getLatestYouTubeVideos } from "../services/youtubeService.js";

export const getYouTubeVideos = async (req, res) => {
  try {
    const data = await getLatestYouTubeVideos();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("YouTube Controller Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch YouTube videos",
    });
  }
};
