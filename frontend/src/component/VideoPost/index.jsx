import React, { useEffect, useState } from "react";
import ProtoTypes from "prop-types";
import { Link } from "react-router-dom";
import FontAwesome from "../uiStyle/FontAwesome";
import ModalVideo from "react-modal-video";
import PopularPosts from "../PopularPosts";

const API = "https://api.bharat19express.com";

const VideoPost = ({ className, dark }) => {
  const [vModal, setvModal] = useState(false);
  const [videoId, setVideoId] = useState("");
  const [videoNews, setVideoNews] = useState(null);

  useEffect(() => {
    getVideoNews();
  }, []);

  const getVideoNews = async () => {
    try {
      const res = await fetch(`${API}/api/news/videos?limit=1`);
      const data = await res.json();

      if (data.status && data.data.length > 0) {
        setVideoNews(data.data[0]);

        setVideoId(getYoutubeId(data.data[0].youtubeUrl));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getThumbnail = (news) => {
    // Uploaded thumbnail exists
    if (news.thumbnail && news.thumbnail.trim() !== "") {
      return `${API}/uploads/images/${news.thumbnail}`;
    }

    // Otherwise use YouTube thumbnail
    const id = getYoutubeId(news.youtubeUrl);

    if (!id) {
      return "/images/no-image.jpg"; // optional fallback image
    }

    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  };

  const getYoutubeId = (url) => {
    if (!url) return "";

    const regExp =
      /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([^?&/]+)/;

    const match = url.match(regExp);

    return match ? match[1] : "";
  };

  const getYoutubeThumbnail = (url) => {
    const id = getYoutubeId(url);

    if (!id) {
      return "https://via.placeholder.com/800x450?text=No+Video";
    }

    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  };

  if (!videoNews) return null;

  return (
    <div className={`video_posts ${className || ""}`}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="heading white">
              <h2 className="widget-title">Video News</h2>
            </div>
          </div>
        </div>

        <div className="space-50" />

        <div className={`viceo_posts_wrap ${dark ? "primay_bg" : ""}`}>
          <div className="row">
            <div className="col-lg-8">
              <div className="single_post post_type3 post_type11 margintop-60- xs-mb30">
                <div className="post_img">
                  <div className="img_wrap">
                    <Link to={`/news/${videoNews.slug}`}>
                      <img
                        src={getYoutubeThumbnail(videoNews.youtubeUrl)}
                        alt={videoNews.title}
                        style={{
                          width: "100%",
                          height: "420px",
                          objectFit: "cover",
                        }}
                      />
                    </Link>
                  </div>

                  <p className="youtube_middle" onClick={() => setvModal(true)}>
                    <FontAwesome name="youtube-play" />
                  </p>
                </div>

                <div
                  className={`single_post_text padding30 ${
                    dark ? "dark-2" : "fourth_bg"
                  }`}
                >
                  <div className="meta3">
                    <Link to="#">{videoNews.categories?.[0]?.name}</Link>

                    <Link to="#">
                      {new Date(videoNews.createdAt).toLocaleDateString()}
                    </Link>
                  </div>

                  <h4>
                    <Link to={`/news/${videoNews.slug}`}>
                      {videoNews.title}
                    </Link>
                  </h4>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <PopularPosts />
            </div>
          </div>
        </div>
      </div>

      <ModalVideo
        channel="youtube"
        isOpen={vModal}
        videoId={videoId}
        onClose={() => setvModal(false)}
      />
    </div>
  );
};

export default VideoPost;

VideoPost.propTypes = {
  className: ProtoTypes.string,
  dark: ProtoTypes.bool,
};
