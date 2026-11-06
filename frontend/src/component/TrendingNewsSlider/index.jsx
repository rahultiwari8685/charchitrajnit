import React, { useEffect, useState } from "react";
import FontAwesome from "../uiStyle/FontAwesome";
import { Link } from "react-router-dom";
import Slider from "../Slider";

const TrendingNewsSlider = () => {
  const [trendingNews, setTrendingNews] = useState([]);

  useEffect(() => {
    getTrendingNews();
  }, []);

  const getTrendingNews = async () => {
    try {
      const res = await fetch(
        "https://api.bharat19express.com/api/news/trending?limit=3",
      );

      const data = await res.json();

      if (data.status) {
        setTrendingNews(data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="carousel_post2_type3 nav_style1">
      <Slider
        className="trancarousel"
        slidesPerView={2}
        spaceBetween={20}
        loop={true}
        navigation={{
          nextEl: ".swiper-button-next17",
          prevEl: ".swiper-button-prev17",
        }}
        breakpoints={{
          1024: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          300: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
        }}
      >
        {trendingNews.map((item) => (
          <div key={item._id} className="single_post post_type3">
            <div className="post_img">
              <div className="img_wrap">
                <img
                  src={`https://api.bharat19express.com/uploads/images/${item.thumbnail}`}
                  alt={item.title}
                  style={{
                    width: "100%",
                    height: "260px",
                    objectFit: "cover",
                  }}
                />
              </div>

              {/* <span className="tranding">
                <FontAwesome name="bolt" />
              </span> */}
            </div>

            <div className="single_post_text">
              <div className="meta3">
                <Link to="#">{item.categories?.[0]?.name || "News"}</Link>

                <Link to="#">
                  {new Date(item.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Link>
              </div>

              <h4>
                <Link to={`/${item.categories?.[0]?.slug}/${item.slug}`}>
                  {item.title}
                </Link>
              </h4>

              <div className="space-10" />

              <p className="post-p">
                {item.subtitle ? item.subtitle.substring(0, 120) + "..." : ""}
              </p>
            </div>
          </div>
        ))}
      </Slider>

      <div className="navBtns">
        <div className="navBtn prevtBtn swiper-button-prev17">
          <FontAwesome name="angle-left" />
        </div>

        <div className="navBtn nextBtn swiper-button-next17">
          <FontAwesome name="angle-right" />
        </div>
      </div>
    </div>
  );
};

export default TrendingNewsSlider;
