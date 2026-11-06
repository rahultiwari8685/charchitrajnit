import React, { useEffect, useState } from "react";
import ProtoTypes from "prop-types";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FontAwesome from "../uiStyle/FontAwesome";
import Slider from "../Slider";

const API = "https://api.bharat19express.com";

const Whatsnew = ({ className, title }) => {
  const { i18n, t } = useTranslation();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWhatsNew();
  }, [i18n.resolvedLanguage]);

  const getWhatsNew = async () => {
    try {
      setLoading(true);

      const language = i18n.resolvedLanguage || "en";

      const res = await fetch(
        `${API}/api/news/getAllNews?limit=8&lang=${language}`,
      );

      const data = await res.json();

      console.log("What's New API:", data);
      console.log("Current Language:", language);

      if (data.status && Array.isArray(data.data)) {
        const news = data.data
          .filter((item) => Number(item.type) === 1)
          .filter((item) => Number(item.videoType) === 2)

          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 15);

        setPosts(news);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error("WhatsNew API Error:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${
        className ? className : "white_bg padding20 border-radious5 sm-mt30"
      }`}
    >
      {/* HEADING */}
      <h2 className="widget-title">{title || t("whatsNew", "What's New")}</h2>

      <div className="popular_carousel multipleRowCarousel nav_style1">
        {loading ? (
          <div className="text-center py-3">{t("loading", "Loading...")}</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-3">
            {t("noNewsAvailable", "No news available")}
          </div>
        ) : (
          <Slider
            navigation={{
              nextEl: ".swiper-button-next18",
              prevEl: ".swiper-button-prev18",
            }}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            slidesPerView={1}
            grid={{
              rows: 6,
            }}
            loop={posts.length > 6}
          >
            {posts.map((item, i) => {
              const image = item.thumbnail
                ? `${API}/uploads/images/${item.thumbnail}`
                : "";

              const newsUrl = `/news/${item.slug}`;

              const category = item.categories?.[0];

              const categoryUrl = category?.slug
                ? `/category/${category.slug}`
                : "#";

              return (
                <div
                  key={item._id || i}
                  className="single_post type10 type16 widgets_small"
                >
                  {/* IMAGE */}
                  <div className="post_img">
                    <div className="img_wrap">
                      <Link to={newsUrl}>
                        {image && (
                          <img
                            src={image}
                            alt={item.title || t("news", "News")}
                            style={{
                              width: "100%",
                              height: "80px",
                              objectFit: "cover",
                            }}
                          />
                        )}
                      </Link>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="single_post_text">
                    {/* TITLE */}
                    <h4>
                      <Link to={newsUrl}>
                        {item.title?.length > 70
                          ? `${item.title.substring(0, 70)}...`
                          : item.title}
                      </Link>
                    </h4>

                    {/* CATEGORY */}
                    <div className="meta4">
                      <Link to={categoryUrl}>
                        {category?.name || t("news", "News")}
                      </Link>
                    </div>

                    {/* SEPARATOR */}
                    {i + 1 < posts.length && (
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
          </Slider>
        )}

        {/* NAVIGATION */}
        {posts.length > 0 && (
          <div className="navBtns">
            <div className="navBtn prevtBtn swiper-button-prev18">
              <FontAwesome name="angle-left" />
            </div>

            <div className="navBtn nextBtn swiper-button-next18">
              <FontAwesome name="angle-right" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

Whatsnew.propTypes = {
  className: ProtoTypes.string,
  title: ProtoTypes.string,
};

export default Whatsnew;
