import axios from "axios";



let liveCache = null;
let liveLastFetch = 0;

// Cache latest videos for 10 minutes
let videosCache = null;
let videosLastFetch = 0;

const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3";

const YOUTUBE_CHANNELS = [
  {
    name: "Bharat 19 Express Nation",
    channelId: "UC0lg7tqrUdlky_u1Wug7uEw",
  },
  {
    name: "Bharat 19 Express Regional",
    channelId: "UC7_OlirbGWvmG0-0Nc3WedA",
  },
  {
    name: "Bharat 19 Entertainment",
    channelId: "UCkJQAejO5Zx1TaQzzA_3Hvg",
  },
  {
    name: "भारत 19 एक्सप्रेस",
    channelId: "UCygk_AnahPPNje9H3NLK1tA",
  },
];

// export const checkLiveStatus = async () => {
//   if (!process.env.YOUTUBE_API_KEY || !process.env.YOUTUBE_CHANNEL_ID) {
//     console.error("Missing YouTube config");

//     return {
//       isLive: false,
//     };
//   }

//   const now = Date.now();

//   if (liveCache && now - liveLastFetch < 60000) {
//     return liveCache;
//   }

//   try {
//     const res = await axios.get(`${YOUTUBE_API_URL}/search`, {
//       timeout: 5000,
//       params: {
//         part: "snippet",
//         channelId: process.env.YOUTUBE_CHANNEL_ID,
//         eventType: "live",
//         type: "video",
//         key: process.env.YOUTUBE_API_KEY,
//       },
//     });

//     let result = {
//       isLive: false,
//     };

//     if (res?.data?.items?.length > 0) {
//       const liveVideo = res.data.items[0];

//       result = {
//         isLive: true,
//         videoId: liveVideo.id?.videoId,
//         title: liveVideo.snippet?.title,
//       };
//     }

//     liveCache = result;
//     liveLastFetch = now;

//     return result;
//   } catch (err) {
//     console.error("YouTube Live API error:", err.message);

//     return (
//       liveCache || {
//         isLive: false,
//       }
//     );
//   }
// };


export const checkLiveStatus = async () => {
  if (!process.env.YOUTUBE_API_KEY) {
    console.error("Missing YOUTUBE_API_KEY");

    return { isLive: false, videoId: null, title: null };
  }

  // Read all four channel IDs from .env
  const channelIds = (
    process.env.YOUTUBE_CHANNEL_IDS || ""
  )
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (channelIds.length === 0) {
    console.error("Missing YOUTUBE_CHANNEL_IDS");

    return { isLive: false, videoId: null, title: null };
  }

  const now = Date.now();

  // Reuse the previous result to reduce YouTube API quota usage.
  // The cache duration below is 60 minutes.
  if (liveCache && now - liveLastFetch < 60 * 60 * 1000) {
    return liveCache;
  }

  try {
    const results = await Promise.all(
      channelIds.map(async (channelId) => {
        try {
          const response = await axios.get(
            `${YOUTUBE_API_URL}/search`,
            {
              timeout: 10000,
              params: {
                part: "snippet",
                channelId,
                eventType: "live",
                type: "video",
                maxResults: 1,
                key: process.env.YOUTUBE_API_KEY,
              },
            },
          );

          const item = response.data?.items?.[0];

          if (!item?.id?.videoId) {
            return null;
          }

          return {
            isLive: true,
            videoId: item.id.videoId,
            title: item.snippet?.title || "Live Now",
            channelId,
            channelTitle: item.snippet?.channelTitle || "",
            thumbnail:
              item.snippet?.thumbnails?.high?.url ||
              item.snippet?.thumbnails?.medium?.url ||
              item.snippet?.thumbnails?.default?.url ||
              "",
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          };
        } catch (error) {
          console.error(
            `Live check failed for channel ${channelId}:`,
            error.response?.data || error.message,
          );

          return null;
        }
      }),
    );

    // If ANY channel is live, return its stream.
    const liveStream = results.find((result) => result !== null);

    const result = liveStream || {
      isLive: false,
      videoId: null,
      title: null,
      channelId: null,
      channelTitle: null,
      thumbnail: null,
      url: null,
    };

    liveCache = result;
    liveLastFetch = now;

    return result;
  } catch (error) {
    console.error(
      "YouTube live status error:",
      error.response?.data || error.message,
    );

    return (
      liveCache || {
        isLive: false,
        videoId: null,
        title: null,
      }
    );
  }
};



export const getLatestYouTubeVideos = async () => {
  if (!process.env.YOUTUBE_API_KEY) {
    throw new Error("YOUTUBE_API_KEY is missing");
  }

  const now = Date.now();

  if (videosCache && now - videosLastFetch < 10 * 60 * 1000) {
    return videosCache;
  }

  const channelIds = YOUTUBE_CHANNELS.map((channel) => channel.channelId).join(
    ",",
  );

  const channelResponse = await axios.get(`${YOUTUBE_API_URL}/channels`, {
    timeout: 10000,

    params: {
      part: "contentDetails,snippet",
      id: channelIds,
      key: process.env.YOUTUBE_API_KEY,
    },
  });

  const channelItems = channelResponse.data?.items || [];

  const channelResults = await Promise.all(
    YOUTUBE_CHANNELS.map(async (channel) => {
      const channelData = channelItems.find(
        (item) => item.id === channel.channelId,
      );

      if (!channelData) {
        return {
          channelName: channel.name,

          channelId: channel.channelId,

          channelThumbnail: "",

          videos: [],
        };
      }

      const uploadsPlaylistId =
        channelData.contentDetails?.relatedPlaylists?.uploads;

      if (!uploadsPlaylistId) {
        return {
          channelName: channel.name,

          channelId: channel.channelId,

          channelThumbnail: channelData.snippet?.thumbnails?.default?.url || "",

          videos: [],
        };
      }

      const playlistResponse = await axios.get(
        `${YOUTUBE_API_URL}/playlistItems`,
        {
          timeout: 10000,

          params: {
            part: "snippet,contentDetails",

            playlistId: uploadsPlaylistId,

            maxResults: 5,

            key: process.env.YOUTUBE_API_KEY,
          },
        },
      );

      const videos = (playlistResponse.data?.items || [])
        .map((item) => {
          const videoId = item.contentDetails?.videoId;

          if (!videoId) {
            return null;
          }

          return {
            videoId,

            title: item.snippet?.title || "",

            description: item.snippet?.description || "",

            thumbnail:
              item.snippet?.thumbnails?.high?.url ||
              item.snippet?.thumbnails?.medium?.url ||
              item.snippet?.thumbnails?.default?.url ||
              "",

            publishedAt:
              item.contentDetails?.videoPublishedAt ||
              item.snippet?.publishedAt ||
              "",

            channelName: channel.name,

            channelId: channel.channelId,
          };
        })
        .filter(Boolean);

      videos.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

      return {
        channelName: channel.name,

        channelId: channel.channelId,

        channelThumbnail:
          channelData.snippet?.thumbnails?.high?.url ||
          channelData.snippet?.thumbnails?.default?.url ||
          "",

        videos,
      };
    }),
  );

  videosCache = channelResults;

  videosLastFetch = now;

  return channelResults;
};
