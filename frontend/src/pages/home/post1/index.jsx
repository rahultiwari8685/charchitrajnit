import React, { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";
import BreadCrumb from "../../../component/BreadCrumb";
import FontAwesome from "../../../component/uiStyle/FontAwesome";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  LinkedinShareButton,
  RedditShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  TelegramIcon,
  LinkedinIcon,
  RedditIcon,
  EmailIcon,
} from "react-share";
import WidgetTab from "../../../component/WidgetTab";
import WidgetTrendingNews from "../../../component/WidgetTrendingNews";
import NewsLetter from "../../../component/NewsLetter";
import MostShareWidget from "../../../component/MostShareWidget";
import FollowUs from "../../../component/FollowUs";
import BannerSection from "../../../component/BannerSection";
import PostOnePagination from "../../../component/PostOnePagination";
import { useTranslation } from "react-i18next";
// images
import banner2 from "../../../assets/img/ad/ad-2.jpg";
import big2 from "../../../assets/img/post-thumb-4.png";
import author2 from "../../../assets/img/comments-1.png";
import quote from "../../../assets/img/icon/q.png";
import quote_1 from "../../../assets/img/post-quote.jpg";
import big1 from "../../../assets/img/post-thumb-3.jpg";
import smail1 from "../../../assets/img/post-thumb-2.png";
import single_post1 from "../../../assets/img/post-thumb-5.png";
import OurBlogSection from "../../../component/OurBlogSection";
import BlogComment from "../../../component/BlogComment";

const decodeHtmlEntities = (value = "") => {
  if (typeof document === "undefined") return value;

  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
};

function Post1() {
  const API = "https://api.bharat19express.com";

  const { categorySlug, slug } = useParams();
  const [news, setNews] = useState(null);
  const { t, i18n } = useTranslation();
  const [banners, setBanners] = useState({});

  const [canEditNews, setCanEditNews] = useState(false);

useEffect(() => {
  const verifyEditor = async () => {
    try {
      // This token must be available to the public site.
      // The admin's secureLocalStorage is not shared across domains.
      const token = localStorage.getItem("adminToken");

      if (!token) {
        setCanEditNews(false);
        return;
      }

      const response = await fetch(
        "https://api.bharat19express.com/api/auth/verify-editor",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      setCanEditNews(response.ok && result.authenticated === true);
    } catch (error) {
      setCanEditNews(false);
    }
  };

  verifyEditor();
}, []);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setNews(null);

        const language = i18n.resolvedLanguage || "en";

        const res = await fetch(
          `${API}/api/news/slug/${slug}?lang=${language}`,
        );

        const data = await res.json();

        if (data.status) {
          setNews(data.data);

          increaseView(data.data._id);
        }
      } catch (err) {
        console.log("News Detail Error:", err);
      }
    };

    if (slug) {
      loadNews();
    }
  }, [slug, i18n.resolvedLanguage]);

  const getAdvertisements = async () => {
    try {
      const res = await fetch(
        "https://api.bharat19express.com/api/advertisements",
      );

      const data = await res.json();

      if (data.success) {
        const ads = {};

        data.data.forEach((item) => {
          if (item.status) {
            ads[item.position] = item;
          }
        });

        setBanners(ads);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAdvertisements();
  }, []);

  if (!news) {
    return <h2 className="text-center mt-5">{t("loading") || "Loading..."}</h2>;
  }


    const shareUrl = `https://api.bharat19express.com/api/news/share/${news?.slug || ""}`;

    const shareTitle = decodeHtmlEntities(news?.title || "");

    const shareImage = news?.thumbnail
      ? `${API}/uploads/images/${news.thumbnail}`
      : "https://bharat19express.com/default-news-image.jpg";

  const cleanContent = news?.content
    ?.replace(/style="[^"]*"/g, "")
    ?.replace(/<p><br><\/p>/g, "");

  const getYoutubeId = (url) => {
    if (!url) return "";

    const regExp =
      /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;

    const match = url.match(regExp);

    return match && match[1].length === 11 ? match[1] : "";
  };

  const increaseShare = async () => {
    try {
      await fetch(`${API}/api/news/share/${news._id}`, {
        method: "POST",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const increaseView = async (id) => {
    try {
      await fetch(`${API}/api/news/view/${id}`, {
        method: "POST",
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="archives post post1">
        <BreadCrumb
          className="shadow5 padding-top-10"
          // title={`${news.categories?.[0]?.name || "News"} / ${news.title}`}
          title={`${news.categories?.[0]?.name || t("latest")} / ${decodeHtmlEntities(news.title)}`}
        />
        <span className="space-10" />
        <div className="container">
       
<div className="row">
  <div className="col-md-6 col-lg-8">
    <div className="row">
      <div className="col-11">
        <div className="page_category">
          <div className="share-section mt-1" />
        </div>
      </div>
    </div>

    <div className="single_post_heading">
      <h1>{decodeHtmlEntities(news.title)}</h1>
      <div className="space-10" />
    </div>

    {/* Author profile + social icons in the same row */}
    <div className="author-social-row">
      <div className="author-social-profile">
        <div className="author">
          <div className="author_img">
            <div className="author_img_wrap">
              <img
                src={
                  news.author?.profileImage
                    ? `${API}/uploads/images/${news.author.profileImage}`
                    : author2
                }
                alt={news.author?.name || "Author"}
              />
            </div>
          </div>

          <Link to="#" className="author-name-link">
            <span>{news.author?.name || "Admin"}</span>

            {news.author?.isVerified === true && (
              <svg
                className="verified-author-badge"
                viewBox="0 0 24 24"
                width="19"
                height="19"
                aria-label="Verified author"
                role="img"
                title="Verified author"
              >
                <path
                  fill="currentColor"
                  d="M12 1.5 14.8 3l3.2-.1 1.4 2.9 2.9 1.4-.1 3.2 1.5 2.8-1.5 2.8.1 3.2-2.9 1.4-1.4 2.9-3.2-.1-2.8 1.5-2.8-1.5-3.2.1-1.4-2.9-2.9-1.4.1-3.2L1.5 12l1.5-2.8-.1-3.2 2.9-1.4 1.4-2.9 3.2.1z"
                />
                <path
                  d="m7.5 12.2 3 3 6-6"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </Link>
        </div>
      </div>

      <div className="author-social-icons">
        <FacebookShareButton
          url={shareUrl}
          quote={shareTitle}
          onClick={increaseShare}
          hashtag="#hindustantvlive"
          aria-label="Share on Facebook"
        >
          <FacebookIcon size={42} round />
        </FacebookShareButton>

        <TwitterShareButton
          url={shareUrl}
          title={shareTitle}
          onClick={increaseShare}
          aria-label="Share on X"
        >
          <TwitterIcon size={42} round />
        </TwitterShareButton>

        <WhatsappShareButton
          url={shareUrl}
          title={shareTitle}
          onClick={increaseShare}
          aria-label="Share on WhatsApp"
        >
          <WhatsappIcon size={42} round />
        </WhatsappShareButton>

        <TelegramShareButton
          url={shareUrl}
          title={shareTitle}
          onClick={increaseShare}
          aria-label="Share on Telegram"
        >
          <TelegramIcon size={42} round />
        </TelegramShareButton>
      </div>
    </div>

    <div className="space-40" />

    {/* <img
      src={
        news.thumbnail
          ? `${API}/uploads/images/${news.thumbnail}`
          : `https://img.youtube.com/vi/${getYoutubeId(
              news.youtubeUrl,
            )}/hqdefault.jpg`
      }
      alt={news.title}
    /> */}

    <div className="news-thumbnail">
  <img
    src={
      news.thumbnail
        ? `${API}/uploads/images/${news.thumbnail}`
        : `https://img.youtube.com/vi/${getYoutubeId(
            news.youtubeUrl,
          )}/hqdefault.jpg`
    }
    alt={news.title}
  />

  {news.thumbnailCaption && (
    <p className="thumbnail-caption">
      {news.thumbnailCaption}
    </p>
  )}
</div>

    <div
      className="article-content mt-4"
      dangerouslySetInnerHTML={{
        __html: cleanContent,
      }}
    />

{canEditNews && (
  <div className="edit-news-wrapper">
    <a
      href={`https://admin.bharat19express.com/UpdateNews/${news._id}`}
      className="edit-news-button"
      target="_blank"
      rel="noopener noreferrer"
    >
      ✏️ Edit News
    </a>
  </div>
)}

    <div className="tags">
      <ul className="inline">
        <li className="tag_list">
          <FontAwesome name="tag" /> {t("categories")}
        </li>

        {news.categories?.map((cat) => (
          <li key={cat._id}>
            <Link to={`/category/${cat._id}`}>{cat.name}</Link>
          </li>
        ))}
      </ul>
    </div>

    <div className="space-40" />
    <div className="border_black" />
    <div className="space-40" />

    <PostOnePagination newsId={news._id} />
  </div>

  <div className="col-md-6 col-lg-4">
    <WidgetTab categoryId={news.categories?.[0]?._id} />

    <FollowUs title="Follow Us" />
    <WidgetTrendingNews />

    <div className="banner2 mb30">
      {banners.sidebar && (
        <a
          href={banners.sidebar.redirectUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={`https://api.bharat19express.com/uploads/advertisements/${banners.sidebar.image}`}
            alt={banners.sidebar.title}
            className="img-fluid"
          />
        </a>
      )}
    </div>
  </div>
</div>

        </div>
      </div>

      <OurBlogSection />

      <BannerSection />

      <style>{`

      .news-thumbnail {
  width: 100%;
  margin-bottom: 20px;
}

.news-thumbnail img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 6px;
}

.thumbnail-caption {
  margin: 0;
  padding: 8px 10px;
  background: #f5f5f5;
  color: #555;
  font-size: 14px;
  line-height: 1.6;
  text-align: center;
  font-style: italic;
}

.edit-news-wrapper {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0 30px;
}

.edit-news-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: #8b0000;
  color: #fff !important;
  text-decoration: none !important;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  transition: background 0.2s ease;
}

.edit-news-button:hover {
  background: #650000;
  color: #fff !important;
}

.edit-news-button i {
  font-size: 16px;
}


/* Author and social icons: always one horizontal row */
.author-social-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 20px;
  box-sizing: border-box;
}

.author-social-profile {
  flex: 1 1 auto;
  min-width: 0;
}

.author-social-profile .author {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  min-width: 0;
  margin: 0;
}

.author-social-profile .author-name-link {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
  min-width: 0;
  overflow-wrap: anywhere;
}

.author-social-icons {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  flex: 0 0 auto;
}

.author-social-icons button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  padding: 0;
  margin: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.author-social-icons svg {
  display: block;
}

/* Mobile */
@media (max-width: 767px) {
  .author-social-row {
    flex-direction: row;
    align-items: center;
    gap: 6px;
  }

  .author-social-profile {
    flex: 1 1 0;
  }

  .author-social-profile .author {
    gap: 5px;
  }

  .author-social-icons {
    flex: 0 0 auto;
    gap: 3px;
  }

  .author-social-icons svg {
    width: 32px;
    height: 32px;
  }
}

/* Very narrow screens */
@media (max-width: 360px) {
  .author-social-row {
    gap: 4px;
  }

  .author-social-profile .author {
    gap: 4px;
  }

  .author-social-icons {
    gap: 2px;
  }

  .author-social-icons svg {
    width: 27px;
    height: 27px;
  }
}

.share-section {
  margin: 35px 0;
}



.share-section .d-flex {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: nowrap !important;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  padding-bottom: 8px;
}

.share-section .d-flex::-webkit-scrollbar {
  height: 4px;
}

.share-section .d-flex::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
}

.share-section .d-flex > * {
  flex: 0 0 auto;
}

.author-name-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  font-weight: 600;
}

.verified-author-badge {
  display: inline-block;
  flex: 0 0 19px;
  width: 19px;
  height: 19px;
  color: #1877f2;
  vertical-align: middle;
  filter: drop-shadow(0 1px 1px rgba(24, 119, 242, 0.15));
  transition: transform 0.18s ease;
}

.author-name-link:hover .verified-author-badge {
  transform: scale(1.08);
}

.share-section button {
  flex: 0 0 auto;
}

.share-section button{
    border:none;
    background:transparent;
    cursor:pointer;
    transition:.3s;
}

.share-section button:hover{
    transform:scale(1.1);
}

.article-content{
    font-size:20px;
    line-height:1.9;
    color:#222;
}

.article-content p{
    font-size:20px;
    line-height:1.9;
    margin-bottom:20px;
}

.article-content h1{
    font-size:40px;
    font-weight:700;
    margin:30px 0 20px;
}

.article-content h2{
    font-size:34px;
    font-weight:700;
    margin:30px 0 20px;
}

.article-content h3{
    font-size:28px;
    font-weight:700;
    margin:25px 0 15px;
}

.article-content h4{
    font-size:24px;
    font-weight:700;
    margin:20px 0 15px;
}

.article-content strong{
    font-weight:700;
}

.article-content img{
    width:100%;
    height:auto;
    margin:20px 0;
    border-radius:6px;
}

.article-content iframe{
    width:100%;
    min-height:500px;
}

.article-content ul{
    padding-left:25px;
}

.article-content li{
    margin-bottom:10px;
}
`}</style>
    </>
  );
}

export default Post1;
