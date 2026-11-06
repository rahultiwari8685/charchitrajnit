import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FontAwesome from "../uiStyle/FontAwesome";
import Slider from "../Slider";
import ModalVideo from "react-modal-video";
import "react-modal-video/css/modal-video.min.css";
import { useTranslation } from "react-i18next";
import big_img from "../../assets/img/gallery-post-2.jpg";
import col26 from "../../assets/img/post-news-thumb-1.png";
import col21 from "../../assets/img/post-news/1.jpg";

const PostGalleryTwo = () => {
  const navigate = useNavigate();

  const API = "https://api.bharat19express.com";

  // Uttar Pradesh category ID
  const UP_CATEGORY_ID = "6ab5133ae0146bb0a4a80e48";
  const NATIONAL_CATEGORY_ID = "6ab3e06740046655dd2db1e5";

  const [videoNews, setVideoNews] = useState(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [videoId, setVideoId] = useState("");
  const { t, i18n } = useTranslation();
  const [isYoutubeLive, setIsYoutubeLive] = useState(false);
  const [youtubeLiveId, setYoutubeLiveId] = useState("");
  const [youtubeLiveTitle, setYoutubeLiveTitle] = useState("");
  const [liveLoading, setLiveLoading] = useState(true);
  const [sliderNews, setSliderNews] = useState([]);

  const [textNews, setTextNews] = useState([]);

  const [activePoll, setActivePoll] = useState(null);
  const [pollLoading, setPollLoading] = useState(true);
  const [pollVoting, setPollVoting] = useState(false);
  const [pollVoted, setPollVoted] = useState(false);

  const [latestNews, setLatestNews] = useState([]);
  const [latestNewsLoading, setLatestNewsLoading] = useState(false);

  useEffect(() => {
    checkYoutubeLive();
    getVideoNews();
    getTextNews();
    getSliderNews();
    getActivePoll();

    const interval = setInterval(() => {
      checkYoutubeLive();
    }, 60000);

    return () => clearInterval(interval);
  }, [i18n.resolvedLanguage]);

  const checkYoutubeLive = async () => {
    try {
      setLiveLoading(true);

      const res = await fetch(`${API}/api/youtube/live`);
      const data = await res.json();

      console.log("YouTube Live Status:", data);

      if (data.status && data.isLive && data.videoId) {
        setIsYoutubeLive(true);
        setYoutubeLiveId(data.videoId);
        setYoutubeLiveTitle(data.title || "Live News");
      } else {
        setIsYoutubeLive(false);
        setYoutubeLiveId("");
        setYoutubeLiveTitle("");
      }
    } catch (error) {
      console.error("YouTube Live Error:", error);

      setIsYoutubeLive(false);
      setYoutubeLiveId("");
      setYoutubeLiveTitle("");
    } finally {
      setLiveLoading(false);
    }
  };

  const getYoutubeId = (url) => {
    if (!url) return "";

    try {
      const parsedUrl = new URL(url);

      if (parsedUrl.searchParams.get("v")) {
        return parsedUrl.searchParams.get("v");
      }

      if (parsedUrl.hostname.includes("youtu.be")) {
        return parsedUrl.pathname.replace("/", "");
      }

      if (parsedUrl.pathname.includes("/shorts/")) {
        return parsedUrl.pathname.split("/shorts/")[1].split("/")[0];
      }

      if (parsedUrl.pathname.includes("/embed/")) {
        return parsedUrl.pathname.split("/embed/")[1].split("/")[0];
      }

      return "";
    } catch (error) {
      return "";
    }
  };

  const getVideoNews = async () => {
    try {
      // const res = await fetch(`${API}/api/news/videos?limit=10`);

      const language = i18n.resolvedLanguage || "en";

      const res = await fetch(
        `${API}/api/news/videos?limit=10&lang=${language}`,
      );
      const data = await res.json();

      console.log("Video News API:", data);

      if (data.status) {
        const videos = (data.data || [])
          .filter((item) => Number(item.type) === 1)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );

        if (videos.length > 0) {
          setVideoNews(videos[0]);
        }
      }
    } catch (error) {
      console.error("Video News Error:", error);
    }
  };

  const getTextNews = async () => {
    try {
      // const res = await fetch(`${API}/api/news/getAllNews?limit=15`);
      const language = i18n.resolvedLanguage || "en";

      const res = await fetch(
        `${API}/api/news/category/${NATIONAL_CATEGORY_ID}?limit=10&lang=${language}`,
      );
      const data = await res.json();

      console.log("Text News API:", data);

      if (data.status) {
        const news = (data.data || [])
          .filter((item) => {
            if (Number(item.type) !== 1) return false;

            return Number(item.videoType) === 2;
          })
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 3);

        setTextNews(news);
      }
    } catch (error) {
      console.error("Text News Error:", error);
    }
  };

  const getSliderNews = async () => {
    try {
      // const res = await fetch(`${API}/api/news/getAllNews?limit=10`);

      const language = i18n.resolvedLanguage || "en";

      const res = await fetch(
        `${API}/api/news/getAllNews?limit=10&lang=${language}`,
      );
      const data = await res.json();

      if (data.status && Array.isArray(data.data)) {
        const news = data.data
          .filter((item) => Number(item.type) === 1)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 5);

        setSliderNews(news);
      } else {
        setSliderNews([]);
      }
    } catch (error) {
      console.error("Slider News Error:", error);
      setSliderNews([]);
    }
  };

  const getShortDescription = (description, limit = 170) => {
    if (!description) return "";

    const text = String(description)
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim();

    return text.length > limit ? `${text.substring(0, limit)}...` : text;
  };

  const getActivePoll = async () => {
    try {
      setPollLoading(true);

      const res = await fetch(`${API}/api/polls/active`);
      const data = await res.json();

      if (data.success && data.data) {
        // Active poll found
        setActivePoll(data.data);
      } else {
        // No active poll
        setActivePoll(null);

        // Show latest news instead
        getLatestNews();
      }
    } catch (error) {
      console.error("Poll Error:", error);

      setActivePoll(null);

      // If poll API fails, show latest news
      getLatestNews();
    } finally {
      setPollLoading(false);
    }
  };

  const getLatestNews = async () => {
    try {
      setLatestNewsLoading(true);

      const language = i18n.resolvedLanguage || "en";

      const res = await fetch(
        `${API}/api/news/category/${UP_CATEGORY_ID}?limit=10&lang=${language}`,
      );

      const data = await res.json();

      if (data.status && Array.isArray(data.data)) {
        const news = data.data
          // Only published news
          .filter((item) => Number(item.type) === 1)
          // Latest news first
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 3);

        setLatestNews(news);
      } else {
        setLatestNews([]);
      }
    } catch (error) {
      console.error("Uttar Pradesh News API Error:", error);
      setLatestNews([]);
    } finally {
      setLatestNewsLoading(false);
    }
  };

  const votePoll = async (optionIndex) => {
    if (!activePoll || pollVoting || pollVoted) {
      return;
    }

    try {
      const loginInfo = JSON.parse(localStorage.getItem("logininfo") || "null");

      const token = loginInfo?.token;

      // Customer is not logged in
      if (!token) {
        alert("Please login to vote.");
        navigate("/login");
        return;
      }

      setPollVoting(true);

      const res = await fetch(`${API}/api/polls/${activePoll._id}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          option_index: optionIndex,
        }),
      });

      const data = await res.json();

      console.log("Poll Vote Response:", data);

      // Token expired / invalid
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("logininfo");

        alert(data.message || "Your login has expired. Please login again.");

        navigate("/login");
        return;
      }

      // Backend error
      if (!data.success) {
        alert(data.message || "Unable to submit vote.");
        return;
      }

      // Vote successful
      setPollVoted(true);

      // Get updated poll results
      const resultRes = await fetch(
        `${API}/api/polls/${activePoll._id}/results`,
      );

      const resultData = await resultRes.json();

      console.log("Poll Result Response:", resultData);

      if (resultData.success) {
        setActivePoll(resultData.data);
      }
    } catch (error) {
      console.error("Vote Error:", error);

      alert(error?.message || "Something went wrong while voting.");
    } finally {
      setPollVoting(false);
    }
  };

  const youtubeId = videoNews ? getYoutubeId(videoNews.youtubeUrl) : "";

  const videoImage = videoNews?.thumbnail
    ? `${API}/uploads/images/${videoNews.thumbnail}`
    : youtubeId
      ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
      : big_img;

  const videoCategory = videoNews?.categories?.[0];

  const videoCategoryUrl = videoCategory?.slug
    ? `/category/${videoCategory.slug}`
    : "#";

  const videoNewsUrl = videoNews?.slug ? `/news/${videoNews.slug}` : "#";

  const openVideo = () => {
    if (!youtubeId) return;

    setVideoId(youtubeId);
    setIsVideoOpen(true);
  };

  return (
    <>
      <ModalVideo
        channel="youtube"
        youtube={{ autoplay: 1 }}
        isOpen={isVideoOpen}
        videoId={videoId}
        onClose={() => setIsVideoOpen(false)}
      />

      <div className="post_gallary_area theme3_bg mb10 padding-top-10">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-xl-6">
              <div className="single_post post_type6 border-radious7 xs-mb30">
                <div className="post_img gradient1">
                  <div className="img_wrap">
                    {liveLoading ? (
                      <div
                        style={{
                          width: "100%",
                          height: "350px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "#111",
                          color: "#fff",
                          fontSize: "16px",
                        }}
                      >
                        Loading...
                      </div>
                    ) : isYoutubeLive && youtubeLiveId ? (
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          height: "350px",
                          background: "#000",
                        }}
                      >
                        {/* LIVE BADGE */}
                        <div
                          style={{
                            position: "absolute",
                            top: "12px",
                            left: "12px",
                            zIndex: 10,
                            background: "#e31e24",
                            color: "#fff",
                            padding: "5px 10px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "800",
                          }}
                        >
                          ● LIVE
                        </div>

                        <iframe
                          width="100%"
                          height="350"
                          src={`https://www.youtube.com/embed/${youtubeLiveId}?autoplay=1&mute=1&rel=0&playsinline=1`}
                          title={youtubeLiveTitle || "Live News"}
                          frameBorder="0"
                          allow="autoplay; encrypted-media; picture-in-picture"
                          allowFullScreen
                          style={{
                            width: "100%",
                            height: "350px",
                            display: "block",
                            border: "none",
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          height: "350px",
                          overflow: "hidden",
                        }}
                      >
                        {sliderNews.length > 0 ? (
                          <Slider
                            slidesPerView={1}
                            spaceBetween={0}
                            loop={sliderNews.length > 1}
                            autoplay={{
                              delay: 4000,
                              disableOnInteraction: false,
                            }}
                            navigation={{
                              nextEl: ".hero-news-next",
                              prevEl: ".hero-news-prev",
                            }}
                          >
                            {sliderNews.map((item) => {
                              const image =
                                item.thumbnail ||
                                item.big_img ||
                                item.image ||
                                "";

                              return (
                                <div
                                  key={item._id}
                                  style={{
                                    position: "relative",
                                    width: "100%",
                                    height: "350px",
                                    overflow: "hidden",
                                    background: "#111",
                                    borderRadius: "6px",
                                  }}
                                >
                                  <Link
                                    to={`/news/${item.slug}`}
                                    style={{
                                      display: "block",
                                      width: "100%",
                                      height: "100%",
                                      position: "relative",
                                      textDecoration: "none",
                                    }}
                                  >
                                    {/* IMAGE */}
                                    <img
                                      src={`${API}/uploads/images/${image}`}
                                      alt={item.title || "News"}
                                      style={{
                                        width: "100%",
                                        height: "350px",
                                        objectFit: "cover",
                                        display: "block",
                                      }}
                                    />

                                    {/* PREMIUM DARK GRADIENT */}
                                    <div
                                      style={{
                                        position: "absolute",
                                        inset: 0,
                                        background:
                                          "linear-gradient(to bottom, rgba(0,0,0,0.02) 20%, rgba(0,0,0,0.15) 38%, rgba(0,0,0,0.72) 70%, rgba(0,0,0,0.96) 100%)",
                                        zIndex: 1,
                                      }}
                                    />

                                    {/* NEWS CONTENT */}
                                    <div
                                      style={{
                                        position: "absolute",
                                        left: "22px",
                                        right: "22px",
                                        bottom: "18px",
                                        zIndex: 3,
                                        color: "#fff",
                                      }}
                                    >
                                      {/* CATEGORY + DATE */}
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "10px",
                                          marginBottom: "9px",
                                          minHeight: "24px",
                                          flexWrap: "wrap",
                                        }}
                                      >
                                        {/* CATEGORY */}
                                        <span
                                          style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            background: "#e31e24",
                                            color: "#fff",
                                            padding: "4px 9px",
                                            borderRadius: "3px",
                                            fontSize: "10px",
                                            fontWeight: "800",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.4px",
                                            lineHeight: "1",
                                            whiteSpace: "nowrap",
                                          }}
                                        >
                                          {item.categories?.[0]?.name ||
                                            item.category?.name ||
                                            item.categoryName ||
                                            "News"}
                                        </span>

                                        {/* DATE */}
                                        <span
                                          style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "4px",
                                            color: "rgba(255,255,255,0.9)",
                                            fontSize: "11px",
                                            fontWeight: "500",
                                            whiteSpace: "nowrap",
                                            lineHeight: "1",
                                          }}
                                        >
                                          <FontAwesome name="calendar" />

                                          {item.createdAt
                                            ? new Date(
                                                item.createdAt,
                                              ).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                              })
                                            : ""}
                                        </span>
                                      </div>
                                      {/* TITLE */}
                                      {/* <h2
                                        style={{
                                          margin: "0 0 8px 0",
                                          padding: 0,
                                          color: "#fff",
                                          fontSize: "clamp(20px, 2.2vw, 28px)",
                                          lineHeight: "1.18",
                                          fontWeight: "800",
                                          letterSpacing: "-0.2px",
                                          textShadow:
                                            "0 2px 5px rgba(0,0,0,0.5)",
                                          display: "-webkit-box",
                                          WebkitLineClamp: 3,
                                          WebkitBoxOrient: "vertical",
                                          overflow: "hidden",
                                        }}
                                      >
                                        {item.title || "Latest News"}
                                      </h2> */}

                                      <h2
                                        style={{
                                          margin: "0 0 8px 0",
                                          padding: "4px 0 2px",
                                          color: "#fff",
                                          fontSize: "clamp(20px, 2.2vw, 28px)",
                                          lineHeight: "1.3",
                                          fontWeight: "800",
                                          letterSpacing: "0",
                                          textShadow:
                                            "0 2px 5px rgba(0,0,0,0.5)",
                                          display: "-webkit-box",
                                          WebkitLineClamp: 3,
                                          WebkitBoxOrient: "vertical",
                                          lineClamp: 3,
                                          overflow: "hidden",
                                        }}
                                      >
                                        {item.title || "Latest News"}
                                      </h2>

                                      {/* SHORT DESCRIPTION */}
                                      {item.description && (
                                        <p
                                          style={{
                                            margin: 0,
                                            padding: 0,
                                            maxWidth: "92%",
                                            color: "rgba(255,255,255,0.88)",
                                            fontSize: "13px",
                                            lineHeight: "1.45",
                                            fontWeight: "400",
                                            textShadow:
                                              "0 1px 3px rgba(0,0,0,0.6)",
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                          }}
                                        >
                                          {getShortDescription(
                                            item.description,
                                            170,
                                          )}
                                        </p>
                                      )}
                                    </div>
                                  </Link>
                                </div>
                              );
                            })}
                          </Slider>
                        ) : (
                          <div
                            style={{
                              height: "350px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "#111",
                              color: "#fff",
                            }}
                          >
                            No latest news available
                          </div>
                        )}

                        {/* SLIDER BUTTONS */}
                        {sliderNews.length > 1 && (
                          <>
                            {/* PREVIOUS */}
                            <button
                              className="hero-news-prev"
                              type="button"
                              aria-label="Previous news"
                              style={{
                                position: "absolute",
                                left: "12px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                zIndex: 10,
                                width: "38px",
                                height: "38px",
                                border: "1px solid rgba(255,255,255,0.35)",
                                borderRadius: "50%",
                                background: "rgba(0,0,0,0.45)",
                                backdropFilter: "blur(5px)",
                                WebkitBackdropFilter: "blur(5px)",
                                color: "#fff",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "16px",
                                transition: "all 0.2s ease",
                              }}
                            >
                              ❮
                            </button>

                            {/* NEXT */}
                            <button
                              className="hero-news-next"
                              type="button"
                              aria-label="Next news"
                              style={{
                                position: "absolute",
                                right: "12px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                zIndex: 10,
                                width: "38px",
                                height: "38px",
                                border: "1px solid rgba(255,255,255,0.35)",
                                borderRadius: "50%",
                                background: "rgba(0,0,0,0.45)",
                                backdropFilter: "blur(5px)",
                                WebkitBackdropFilter: "blur(5px)",
                                color: "#fff",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "16px",
                                transition: "all 0.2s ease",
                              }}
                            >
                              ❯
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {isYoutubeLive && (
                  <div className="single_post_text">
                    {/* <h4>
                      <span>🔴 {youtubeLiveTitle || "Live News"}</span>
                    </h4> */}
                  </div>
                )}
              </div>
            </div>

            <div className="d-none d-xl-block col-xl-3">
              <div className="white_bg padding15 border-radious5 sm-mt30">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4
                    style={{
                      margin: 0,
                      fontSize: "20px",
                      fontWeight: "700",
                    }}
                  >
                    {t("nationalNews", "National News")}
                  </h4>
                </div>
                {textNews.length > 0 ? (
                  textNews.map((item, i) => {
                    const newsUrl = `/news/${item.slug}`;

                    const category = item.categories?.[0];

                    const categoryUrl = category?.slug
                      ? `/category/${category.slug}`
                      : "#";

                    const image = item.thumbnail
                      ? `${API}/uploads/images/${item.thumbnail}`
                      : col21;

                    return (
                      <div
                        key={item._id}
                        className="single_post type14 widgets_small"
                      >
                        {/* IMAGE */}
                        <div className="post_img">
                          <div className="img_wrap">
                            <Link to={newsUrl}>
                              <img
                                src={image}
                                alt={item.title}
                                style={{
                                  width: "100%",
                                  height: "100px",
                                  objectFit: "cover",
                                }}
                              />
                            </Link>
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

                          <div className="meta4">
                            <Link to={categoryUrl}>
                              {category?.name || "News"}
                            </Link>
                          </div>

                          {i + 1 < textNews.length && (
                            <>
                              <div className="space-5" />
                              <div className="border_black" />
                              <div className="space-15" />
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p>Loading news...</p>
                )}
              </div>
            </div>

            <div className="d-none d-lg-block col-lg-4 col-xl-3">
              <div
                className="white_bg padding15 border-radious5 sm-mt10"
                style={{
                  border: "1px solid #e5e5e5",
                }}
              >
                {pollLoading ? (
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h4
                        style={{
                          margin: 0,
                          fontSize: "20px",
                          fontWeight: "700",
                        }}
                      >
                        Poll
                      </h4>
                    </div>

                    <p className="mb-0">Loading...</p>
                  </>
                ) : activePoll ? (
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h4
                        style={{
                          margin: 0,
                          fontSize: "20px",
                          fontWeight: "700",
                        }}
                      >
                        Poll
                      </h4>

                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "600",
                          padding: "4px 9px",
                          borderRadius: "20px",
                          background: "#f1f1f1",
                        }}
                      >
                        VOTE
                      </span>
                    </div>

                    {/* QUESTION */}

                    <h5
                      style={{
                        fontSize: "17px",
                        lineHeight: "1.5",
                        fontWeight: "700",
                        marginBottom: "18px",
                      }}
                    >
                      {activePoll.question}
                    </h5>

                    {/* OPTIONS */}

                    {!pollVoted ? (
                      <div>
                        {activePoll.options?.map((option, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => votePoll(index)}
                            disabled={pollVoting}
                            style={{
                              width: "100%",
                              textAlign: "left",
                              border: "1px solid #ddd",
                              background: "#fff",
                              borderRadius: "6px",
                              padding: "11px 12px",
                              marginBottom: "10px",
                              cursor: pollVoting ? "not-allowed" : "pointer",
                              fontSize: "14px",
                              fontWeight: "600",
                              transition: "0.2s",
                            }}
                          >
                            {option.text}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div>
                        {activePoll.options?.map((option, index) => (
                          <div
                            key={index}
                            style={{
                              marginBottom: "15px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "5px",
                                fontSize: "13px",
                                fontWeight: "600",
                              }}
                            >
                              <span>{option.text}</span>

                              <span>{option.percentage || 0}%</span>
                            </div>

                            <div
                              style={{
                                width: "100%",
                                height: "8px",
                                background: "#e9ecef",
                                borderRadius: "10px",
                                overflow: "hidden",
                              }}
                            >
                              <div
                                style={{
                                  width: `${option.percentage || 0}%`,
                                  height: "100%",
                                  background: "#111",
                                  borderRadius: "10px",
                                  transition: "width 0.5s ease",
                                }}
                              />
                            </div>

                            <div
                              style={{
                                marginTop: "3px",
                                fontSize: "11px",
                                color: "#777",
                              }}
                            >
                              {option.votes || 0} votes
                            </div>
                          </div>
                        ))}

                        <div
                          style={{
                            borderTop: "1px solid #eee",
                            paddingTop: "10px",
                            marginTop: "10px",
                            fontSize: "12px",
                            color: "#777",
                          }}
                        >
                          Total Votes: {activePoll.totalVotes || 0}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h4
                        style={{
                          margin: 0,
                          fontSize: "20px",
                          fontWeight: "700",
                        }}
                      >
                        {t("uttarPradesh", "Uttar Pradesh")}
                      </h4>
                    </div>

                    {latestNewsLoading ? (
                      <p className="mb-0">Loading latest news...</p>
                    ) : latestNews.length > 0 ? (
                      latestNews.map((item, index) => {
                        const newsUrl = `/news/${item.slug}`;

                        const image = item.thumbnail
                          ? `${API}/uploads/images/${item.thumbnail}`
                          : col21;

                        const category = item.categories?.[0];

                        return (
                          <div key={item._id || index}>
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                alignItems: "center",
                              }}
                            >
                              {/* IMAGE */}

                              <div
                                style={{
                                  width: "75px",
                                  height: "60px",
                                  flexShrink: 0,
                                  overflow: "hidden",
                                  borderRadius: "5px",
                                }}
                              >
                                <Link to={newsUrl}>
                                  <img
                                    src={image}
                                    alt={item.title || "Latest News"}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                  />
                                </Link>
                              </div>

                              <div>
                                <p
                                  style={{
                                    margin: "0 0 4px",
                                    fontSize: "10px",
                                    fontWeight: "700",
                                    color: "#e31e24",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {category?.name || "News"}
                                </p>

                                <h5
                                  style={{
                                    margin: 0,
                                    fontSize: "13px",
                                    lineHeight: "1.4",
                                    fontWeight: "700",
                                  }}
                                >
                                  <Link
                                    to={newsUrl}
                                    style={{
                                      color: "#222",
                                      textDecoration: "none",
                                    }}
                                  >
                                    {item.title?.length > 70
                                      ? `${item.title.substring(0, 70)}...`
                                      : item.title}
                                  </Link>
                                </h5>
                              </div>
                            </div>

                            {/* SEPARATOR */}

                            {index + 1 < latestNews.length && (
                              <>
                                <div className="space-10" />
                                <div className="border_black" />
                                <div className="space-10" />
                              </>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="mb-0">No latest news available.</p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostGalleryTwo;
