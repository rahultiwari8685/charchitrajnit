import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import TrendingCarousel from "../TrendingCarousel";
import FontAwesome from "../uiStyle/FontAwesome";

const TrendingNewsTwo = () => {
  const { i18n, t } = useTranslation();
  const [featuredNews, setFeaturedNews] = useState(null);
  const [upNews, setUpNews] = useState([]);

  useEffect(() => {
    getUPNews();
  }, [i18n.resolvedLanguage]);

  const getUPNews = async () => {
    try {
      const language = i18n.resolvedLanguage || "en";

      const res = await fetch(
        `https://api.bharat19express.com/api/news/category/6ab5133ae0146bb0a4a80e48?limit=10&lang=${language}`,
      );

      if (!res.ok) {
        throw new Error(`API request failed: ${res.status}`);
      }

      const data = await res.json();

      console.log("UP News API response:", data);

      if (data.status && Array.isArray(data.data)) {
        console.log("Available videoType values:", [
          ...new Set(data.data.map((item) => item.videoType)),
        ]);

        const news = data.data
          .filter((item) => Number(item.type) === 1)
          .filter((item) => item.isDeleted !== true)
          .filter((item) => Number(item.videoType) === 2)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );

        setUpNews(news);
        setFeaturedNews(news[0] || null);
      } else {
        setUpNews([]);
        setFeaturedNews(null);
        console.error("Unexpected API response:", data);
      }
    } catch (error) {
      console.error("Uttar Pradesh News Error:", error);
      setUpNews([]);
      setFeaturedNews(null);
    }
  };

  if (!featuredNews) {
    return (
      <div className="white_bg tranding3 padding20 border-radious5 mb30">
        <h2 className="widget-title">{t("uttarPradesh", "Uttar Pradesh")}</h2>
        <p className="text-muted mb-0">
          {t("noNewsAvailable", "No news available at the moment.")}
        </p>
      </div>
    );
  }

  const image = featuredNews.thumbnail
    ? `https://api.bharat19express.com/uploads/images/${featuredNews.thumbnail}`
    : "";

  const newsUrl = `/news/${featuredNews.slug}`;

  const category = featuredNews.categories?.[0];

  const getCategoryName = (category) => {
    if (!category) return t("uttarPradesh", "Uttar Pradesh");

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

    const key = categoryTranslations[category.name];

    return key ? t(key, category.name) : category.name;
  };

  return (
    <div className="white_bg tranding3 padding20 border-radious5 mb30">
      {/* HEADING */}
      <div className="row">
        <div className="col-12">
          <div className="heading">
            <h2 className="widget-title">{getCategoryName(category)}</h2>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="single_post post_type3 xs-mb90 post_type15">
            {/* IMAGE */}
            <div className="post_img border-radious5">
              <Link to={newsUrl}>
                {image && (
                  <img
                    src={image}
                    alt={featuredNews.title}
                    style={{
                      width: "100%",
                      height: "300px",
                      objectFit: "cover",
                    }}
                  />
                )}
              </Link>

              <span className="tranding border_tranding">
                <FontAwesome name="bolt" />
              </span>
            </div>

            {/* CONTENT */}
            <div className="single_post_text">
              <h4>
                <Link to={newsUrl}>{featuredNews.title}</Link>
              </h4>

              <div className="space-10" />

              <p className="post-p">
                {featuredNews.subtitle
                  ? featuredNews.subtitle.substring(0, 160) + "..."
                  : ""}
              </p>

              <div className="space-20" />

              <div className="meta3">
                <Link to={category?.slug ? `/category/${category.slug}` : "#"}>
                  {getCategoryName(category)}
                </Link>

                <Link to={newsUrl}>
                  {new Date(featuredNews.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    },
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <TrendingCarousel news={upNews.slice(0, 10)} />
        </div>
      </div>
    </div>
  );
};

export default TrendingNewsTwo;
