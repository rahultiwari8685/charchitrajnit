import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Heading from "../uiStyle/Heading";
import { Link } from "react-router-dom";
import Slider from "../Slider";
import FontAwesome from "../uiStyle/FontAwesome";

const FeatureNews = ({ className }) => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    getPopularNews();
  }, []);

  const getPopularNews = async () => {
    try {
      const res = await fetch(
        "https://api.bharat19express.com/api/news/getAllNews?limit=10",
      );

      const data = await res.json();

      // if (data.status) {
      //   setNews(data.data);
      // }
      if (data.status) {
        const videoPosts = data.data.filter((item) => item.videoType === 2);

        setNews(videoPosts);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={`feature_carousel_area mb40 ${className || ""}`}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <Heading title="Feature News" />
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="feature_carousel nav_style1">
              <Slider
                navigation={{
                  nextEl: ".swiper-button-next3",
                  prevEl: ".swiper-button-prev3",
                }}
                slidesPerView={4}
                spaceBetween={30}
                loop={true}
                breakpoints={{
                  1024: {
                    slidesPerView: 4,
                    spaceBetween: 30,
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                  },
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  320: {
                    slidesPerView: 1,
                    spaceBetween: 0,
                  },
                }}
              >
                {news.map((item) => (
                  <div
                    key={item._id}
                    className="single_post post_type6 post_type7"
                  >
                    <div className="post_img gradient1">
                      <Link to={`/${item.categories?.[0]?.slug}/${item.slug}`}>
                        <img
                          src={`https://api.bharat19express.com/uploads/images/${item.thumbnail}`}
                          alt={item.title}
                          style={{
                            width: "100%",
                            height: "220px",
                            objectFit: "cover",
                          }}
                        />
                      </Link>
                    </div>

                    <div className="single_post_text">
                      <div className="meta5">
                        <Link to="#">
                          {item.categories?.[0]?.name || "News"}
                        </Link>

                        <Link to="#">
                          {new Date(item.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )}
                        </Link>
                      </div>

                      <h4>
                        <Link
                          to={`/${item.categories?.[0]?.slug}/${item.slug}`}
                        >
                          {item.title}
                        </Link>
                      </h4>
                    </div>
                  </div>
                ))}
              </Slider>

              <div className="navBtns">
                <div className="navBtn prevtBtn swiper-button-prev3">
                  <FontAwesome name="angle-left" />
                </div>

                <div className="navBtn nextBtn swiper-button-next3">
                  <FontAwesome name="angle-right" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

FeatureNews.propTypes = {
  className: PropTypes.string,
};

export default FeatureNews;
