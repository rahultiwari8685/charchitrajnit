import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const API_URL = "https://api.bharat19express.com/api/youtube/videos";

const YouTubeChannelSlider = () => {
  const { i18n, t } = useTranslation();

  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllVideos, setShowAllVideos] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchVideos = async () => {
      try {
        setLoading(true);

        const language = i18n.resolvedLanguage || "en";
        const response = await fetch(
          `${API_URL}?lang=${encodeURIComponent(language)}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch YouTube videos");
        }

        const result = await response.json();

        if (isMounted && result.success) {
          setChannels(result.data || []);
        }
      } catch (error) {
        console.error("YouTube Error:", error);
        if (isMounted) setChannels([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchVideos();

    return () => {
      isMounted = false;
    };
  }, [i18n.resolvedLanguage]);

  if (loading) {
    return (
      <>
        <section className="youtube-section">
          <div className="container">
            <div className="youtube-heading">
              <h2>{t("videosNews", "Video News")}</h2>
            </div>

            <div className="youtube-loading">
              {t("loadingVideos", "Loading videos...")}
            </div>
          </div>
        </section>
        <YouTubeStyles />
      </>
    );
  }

  if (!channels.length) return null;

  // Combine videos from all channels, keeping the existing order.
  const maxVideos = Math.max(
    ...channels.map((channel) => channel.videos?.length || 0),
  );

  const videos = [];

  for (let index = 0; index < maxVideos; index++) {
    channels.forEach((channel) => {
      const video = channel.videos?.[index];
      if (video) videos.push(video);
    });
  }

  if (!videos.length) return null;

  // Reusable card for both the slider and expanded grid.
  const renderVideoCard = (video) => (
    <div className="youtube-card">
      <div className="youtube-channel-top">
        <div className="youtube-channel-icon">▶</div>
        <div className="youtube-channel-title">
          {video.channelName || "YouTube"}
        </div>
      </div>

      <a
        href={`https://www.youtube.com/watch?v=${video.videoId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="youtube-thumbnail-link"
        aria-label={`Watch ${video.title || "video"} on YouTube`}
      >
        <div className="youtube-thumbnail">
          <img
            src={video.thumbnail}
            alt={video.title || "YouTube video"}
            loading="lazy"
          />

          <div className="youtube-play">
            <span>▶</span>
          </div>
        </div>
      </a>

      <div className="youtube-content">
        <h3>{video.title}</h3>

        {video.publishedAt && (
          <div className="youtube-date">
            {new Date(video.publishedAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <section className="youtube-section">
        <div className="container">
          <div className="youtube-heading">
            <div>
              <h2>{t("videosNews", "Video News")}</h2>
            </div>

            {videos.length > 0 && (
              <button
                type="button"
                className="youtube-see-more"
                onClick={() => setShowAllVideos((prev) => !prev)}
                aria-expanded={showAllVideos}
              >
                {showAllVideos
                  ? t("showLess", "Show Less")
                  : t("seeMore", "See More")}

                <span>{showAllVideos ? "↑" : "→"}</span>
              </button>
            )}
          </div>

          {showAllVideos ? (
            // Expanded view: show all videos in a responsive grid.
            <div className="youtube-video-grid">
              {videos.map((video, index) => (
                <div
                  className="youtube-grid-item"
                  key={`${video.videoId}-${index}`}
                >
                  {renderVideoCard(video)}
                </div>
              ))}
            </div>
          ) : (
            // Default view: show videos in the Swiper slider.
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={20}
              slidesPerView={4}
              slidesPerGroup={4}
              loop={false}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                  slidesPerGroup: 1,
                  spaceBetween: 15,
                },
                576: {
                  slidesPerView: 2,
                  slidesPerGroup: 2,
                  spaceBetween: 15,
                },
                992: {
                  slidesPerView: 3,
                  slidesPerGroup: 3,
                  spaceBetween: 20,
                },
                1200: {
                  slidesPerView: 4,
                  slidesPerGroup: 4,
                  spaceBetween: 20,
                },
              }}
            >
              {videos.map((video, index) => (
                <SwiperSlide key={`${video.videoId}-${index}`}>
                  {renderVideoCard(video)}
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </section>

      <YouTubeStyles />
    </>
  );
};

const YouTubeStyles = () => (
  <style>
    {`
      .youtube-section {
        width: 100%;
        padding: 40px 0;
        background: #f5f5f5;
      }

      .youtube-heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        width: 100%;
        margin-bottom: 25px;
      }

      .youtube-heading > div {
        min-width: 0;
      }

      .youtube-heading h2 {
        margin: 0;
        padding: 0;
        font-size: 28px;
        line-height: 1.2;
        font-weight: 700;
        color: #111;
      }

      .youtube-see-more {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        flex-shrink: 0;
        padding: 6px 0 6px 8px;
        border: none;
        background: transparent;
        color: #e60000;
        font-family: inherit;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        white-space: nowrap;
      }

      .youtube-see-more:hover {
        color: #a80000;
        text-decoration: underline;
      }

      .youtube-see-more span {
        font-size: 17px;
      }

      /* Expanded responsive grid */
      .youtube-video-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 20px;
        width: 100%;
      }

      .youtube-grid-item {
        display: flex;
        min-width: 0;
      }

      .youtube-grid-item .youtube-card {
        width: 100%;
      }

      .youtube-channel-top {
        width: 100%;
        min-height: 48px;
        padding: 10px 12px;
        display: flex;
        align-items: center;
        gap: 10px;
        background: #fff;
        border-bottom: 1px solid #eee;
      }

      .youtube-channel-icon {
        width: 30px;
        height: 30px;
        flex: 0 0 30px;
        border-radius: 50%;
        background: #ff0000;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        padding-left: 2px;
      }

      .youtube-channel-title {
        flex: 1;
        min-width: 0;
        font-size: 14px;
        font-weight: 700;
        color: #111;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .youtube-channel-top::after {
        content: "";
        width: 4px;
        height: 30px;
        flex-shrink: 0;
        background: #ff0000;
        border-radius: 3px;
        order: -1;
      }

      .youtube-card {
        width: 100%;
        height: 100%;
        background: #fff;
        border-radius: 6px;
        overflow: hidden;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .youtube-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.14);
      }

      .youtube-thumbnail-link {
        display: block;
        width: 100%;
        text-decoration: none;
      }

      .youtube-thumbnail {
        position: relative;
        width: 100%;
        aspect-ratio: 16 / 9;
        overflow: hidden;
        background: #111;
      }

      .youtube-thumbnail img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
        transition: transform 0.4s ease;
      }

      .youtube-card:hover .youtube-thumbnail img {
        transform: scale(1.05);
      }

      .youtube-play {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 54px;
        height: 54px;
        transform: translate(-50%, -50%);
        background: #ff0000;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        transition: transform 0.3s ease;
      }

      .youtube-card:hover .youtube-play {
        transform: translate(-50%, -50%) scale(1.1);
      }

      .youtube-play span {
        font-size: 19px;
        line-height: 1;
        margin-left: 3px;
      }

      .youtube-content {
        padding: 15px;
      }

      .youtube-content h3 {
        margin: 0;
        padding: 0;
        font-size: 16px;
        line-height: 1.45;
        font-weight: 600;
        color: #111;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .youtube-date {
        margin-top: 10px;
        font-size: 12px;
        line-height: 1.2;
        color: #888;
      }

      /* Slider navigation */
      .youtube-section .swiper-button-prev,
      .youtube-section .swiper-button-next {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #fff;
        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
      }

      .youtube-section .swiper-button-prev::after,
      .youtube-section .swiper-button-next::after {
        font-size: 15px;
        font-weight: 700;
        color: #222;
      }

      .youtube-section .swiper-pagination {
        position: relative;
        margin-top: 20px;
        bottom: auto;
      }

      .youtube-section .swiper-pagination-bullet {
        width: 8px;
        height: 8px;
        opacity: 0.5;
      }

      .youtube-section .swiper-pagination-bullet-active {
        opacity: 1;
      }

      .youtube-loading {
        width: 100%;
        padding: 40px;
        background: #fff;
        border-radius: 6px;
        text-align: center;
        color: #777;
      }

      @media (max-width: 1199px) {
        .youtube-video-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }

      @media (max-width: 991px) {
        .youtube-section {
          padding: 30px 0;
        }

        .youtube-heading h2 {
          font-size: 24px;
        }

        .youtube-video-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 767px) {
        .youtube-section {
          padding: 25px 0;
        }

        .youtube-heading {
          margin-bottom: 20px;
        }

        .youtube-heading h2 {
          font-size: 22px;
        }

        .youtube-content {
          padding: 13px;
        }

        .youtube-content h3 {
          font-size: 15px;
        }
      }

      @media (max-width: 575px) {
        .youtube-section {
          padding: 25px 0;
        }

        .youtube-heading h2 {
          font-size: 21px;
        }

        .youtube-see-more {
          font-size: 12px;
        }

        .youtube-video-grid {
          grid-template-columns: 1fr;
          gap: 15px;
        }

        .youtube-play {
          width: 48px;
          height: 48px;
        }

        .youtube-content h3 {
          font-size: 15px;
        }
      }
    `}
  </style>
);

export default YouTubeChannelSlider;
