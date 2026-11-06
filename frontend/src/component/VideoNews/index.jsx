import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FontAwesome from "../uiStyle/FontAwesome";
import ModalVideo from "react-modal-video";

const API = "https://api.bharat19express.com";

const VideoNews = () => {
  const { i18n, t } = useTranslation();

  const [vModal, setVModal] = useState(false);
  const [videoId, setVideoId] = useState("");
  const [videoNews, setVideoNews] = useState(null);
  const [sideNews, setSideNews] = useState([]);

  useEffect(() => {
    getVideoNews();
  }, [i18n.resolvedLanguage]);

  const getYoutubeId = (url) => {
    if (!url) return "";

    try {
      const urlObj = new URL(url);

      if (
        urlObj.hostname.includes("youtube.com") &&
        urlObj.pathname === "/watch"
      ) {
        return urlObj.searchParams.get("v") || "";
      }

      if (
        urlObj.hostname.includes("youtube.com") &&
        urlObj.pathname.startsWith("/shorts/")
      ) {
        return urlObj.pathname.split("/shorts/")[1];
      }

      if (
        urlObj.hostname.includes("youtube.com") &&
        urlObj.pathname.startsWith("/embed/")
      ) {
        return urlObj.pathname.split("/embed/")[1];
      }

      if (urlObj.hostname === "youtu.be") {
        return urlObj.pathname.substring(1);
      }
    } catch (error) {
      console.error("Invalid YouTube URL:", url);
    }

    return "";
  };

  const getThumbnail = (news) => {
    if (news?.thumbnail && news.thumbnail.trim() !== "") {
      return `${API}/uploads/images/${news.thumbnail}`;
    }

    const id = getYoutubeId(news?.youtubeUrl);

    if (id) {
      return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    }

    return "/images/no-image.jpg";
  };

  const getVideoNews = async () => {
    try {
      const language = i18n.resolvedLanguage || "en";

      const res = await fetch(
        `${API}/api/news/videos?limit=10&lang=${language}`,
      );

      const data = await res.json();

      console.log("VIDEO API:", data);
      console.log("CURRENT LANGUAGE:", language);

      if (data.status && Array.isArray(data.data)) {
        const videos = data.data
          .filter((item) => Number(item.type) === 1)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );

        console.log("VIDEO NEWS:", videos);

        if (videos.length > 0) {
          const featured = videos[0];

          console.log("FEATURED VIDEO:", featured);
          console.log("YOUTUBE URL:", featured.youtubeUrl);
          console.log("YOUTUBE ID:", getYoutubeId(featured.youtubeUrl));

          setVideoNews(featured);
          setVideoId(getYoutubeId(featured.youtubeUrl));
          setSideNews(videos.slice(1, 7));
        } else {
          setVideoNews(null);
          setSideNews([]);
        }
      }
    } catch (error) {
      console.error("Video News API Error:", error);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    const language = i18n.resolvedLanguage || "en";

    const localeMap = {
      en: "en-IN",
      hi: "hi-IN",
      ur: "ur-PK",
      bn: "bn-IN",
      mr: "mr-IN",
    };

    return new Date(date).toLocaleDateString(localeMap[language] || "en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (!videoNews) {
    return null;
  }

  const featuredUrl = `/news/${videoNews.slug}`;

  const featuredCategory = videoNews.categories?.[0];

  const getCategoryName = (category) => {
    if (!category) return t("video", "Video");

    const categoryTranslations = {
      "Uttar Pradesh": "uttarPradesh",
      "उत्तर प्रदेश": "uttarPradesh",
      National: "national",
      राष्ट्रीय: "national",
      International: "international",
      अंतरराष्ट्रीय: "international",
      Politics: "politics",
      राजनीति: "politics",
      Entertainment: "entertainment",
      मनोरंजन: "entertainment",
      Sports: "sports",
      खेल: "sports",
      Business: "business",
      व्यापार: "business",
    };

    const key = categoryTranslations[category.name?.trim()];

    return key ? t(key, category.name) : category.name;
  };

  return (
    <>
      <div className="mb30">
        <div className="container">
          <div className="video_posts padding20 white_bg border-radious5">
            {/* HEADING */}
            <div className="row">
              <div className="col-12">
                <div className="heading">
                  <h2 className="widget-title">
                    {t("videoNews", "Video News")}
                  </h2>
                </div>
              </div>
            </div>

            <div className="row">
              {/* FEATURED VIDEO */}
              <div className="col-lg-8">
                <div className="single_post post_type3 post_type11 post_type21 xs-mb30">
                  {/* IMAGE */}
                  <div className="post_img border-radious7">
                    <div
                      className="img_wrap"
                      style={{
                        position: "relative",
                        cursor: videoId ? "pointer" : "default",
                      }}
                      onClick={() => {
                        if (videoId) {
                          setVModal(true);
                        }
                      }}
                    >
                      <img
                        src={getThumbnail(videoNews)}
                        alt={videoNews.title || t("videoNews", "Video News")}
                        style={{
                          width: "100%",
                          height: "420px",
                          objectFit: "cover",
                        }}
                      />

                      {videoId && (
                        <p
                          className="youtube_middle"
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          <FontAwesome name="youtube-play" />
                        </p>
                      )}
                    </div>

                    {/* CATEGORY + DATE */}
                    <div className="sport_meta_ab inline">
                      <ul>
                        <li>{getCategoryName(featuredCategory)}</li>{" "}
                        <li>{featuredCategory?.name || t("video", "VIDEO")}</li>
                        <li>{formatDate(videoNews.createdAt)}</li>
                      </ul>
                    </div>

                    {/* SOCIAL */}
                    <div className="social_share">
                      <ul className="meta_share inline">
                        <li>
                          <Link to={featuredUrl}>
                            <FontAwesome name="bookmark" />
                          </Link>
                        </li>

                        <li>
                          <Link to={featuredUrl}>
                            <FontAwesome name="share" />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* TITLE */}
                  <div className="single_post_text">
                    <h4>
                      <Link to={featuredUrl}>{videoNews.title}</Link>
                    </h4>

                    <div className="space-10" />

                    {/* VIEWS / LIKES */}
                    <ul className="like_cm">
                      <li>
                        <Link to={featuredUrl}>
                          <FontAwesome name="eye" /> {videoNews.views || 0}
                        </Link>
                      </li>

                      <li>
                        <Link to={featuredUrl}>
                          <FontAwesome name="heart" /> {videoNews.likes || 0}
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* SIDE VIDEOS */}
              <div className="col-lg-4">
                {sideNews.map((item, i) => {
                  const newsUrl = `/news/${item.slug}`;

                  const category = item.categories?.[0];

                  const itemVideoId = getYoutubeId(item.youtubeUrl);

                  return (
                    <div
                      key={item._id || i}
                      className="single_post type14 type22 widgets_small sm-mt30"
                    >
                      {/* IMAGE */}
                      <div className="post_img">
                        <div
                          className="img_wrap"
                          style={{
                            position: "relative",
                            cursor: itemVideoId ? "pointer" : "default",
                          }}
                          onClick={() => {
                            if (itemVideoId) {
                              setVideoId(itemVideoId);
                              setVModal(true);
                            }
                          }}
                        >
                          <img
                            src={getThumbnail(item)}
                            alt={item.title || t("videoNews", "Video News")}
                            style={{
                              width: "100%",
                              height: "80px",
                              objectFit: "cover",
                            }}
                          />

                          {/* PLAY ICON */}
                          {itemVideoId && (
                            <span
                              className="youtube_small"
                              style={{
                                cursor: "pointer",
                              }}
                            >
                              <FontAwesome name="youtube-play" />
                            </span>
                          )}
                        </div>
                      </div>

                      {/* CONTENT */}
                      <div className="single_post_text">
                        <h4>
                          <Link to={newsUrl}>
                            {item.title?.length > 65
                              ? `${item.title.substring(0, 65)}...`
                              : item.title}
                          </Link>
                        </h4>

                        <div className="meta2">
                          <Link
                            to={
                              category?.slug
                                ? `/category/${category.slug}`
                                : "#"
                            }
                          >
                            {category?.name || t("video", "Video")}
                          </Link>

                          <Link to={newsUrl}>{formatDate(item.createdAt)}</Link>
                        </div>

                        {/* BORDER */}
                        {i + 1 < sideNews.length && (
                          <>
                            <div className="space-5" />
                            <div className="border_black" />
                            <div className="space-15" />
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VIDEO MODAL */}
      {videoId && (
        <ModalVideo
          channel="youtube"
          isOpen={vModal}
          videoId={videoId}
          onClose={() => {
            setVModal(false);
          }}
        />
      )}
    </>
  );
};

export default VideoNews;
