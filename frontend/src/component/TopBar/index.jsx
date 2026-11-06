import React, { useEffect, useState } from "react";
import ProtoTypes from "prop-types";
import { Link } from "react-router-dom";
import FontAwesome from "../uiStyle/FontAwesome";
import Slider from "../Slider";

const TopBar = ({ className, dark }) => {
  const [trendingNews, setTrendingNews] = useState([]);

  useEffect(() => {
    getTrendingNews();
  }, []);

  const getTrendingNews = async () => {
    try {
      const res = await fetch(
        "https://api.bharat19express.com/api/news/trending?limit=10",
      );

      const data = await res.json();

      if (data.status) {
        setTrendingNews(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`topbar ${className || ""}`} id="top">
      <div className="container">
        <div className="row">
          <div className="col-md-8 align-self-center">
            <div
              className={`trancarousel_area ${dark ? "white" : ""}`}
              style={{ display: "flex" }}
            >
              <p className="trand">Trending</p>

              <div className="nav_style1" style={{ width: "80%" }}>
                <Slider
                  navigation={{
                    nextEl: ".swiper-button-next14",
                    prevEl: ".swiper-button-prev14",
                  }}
                  className="trancarousel"
                  slidesPerView={1}
                  loop={true}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                >
                  {trendingNews.map((news) => (
                    <div className="trancarousel_item" key={news._id}>
                      <p>
                        {/* <Link to={`/news/${news.slug}`}>{news.title}</Link> */}

                        <Link
                          to={`/${news.categories?.[0]?.slug}/${news.slug}`}
                        >
                          {news.title}
                        </Link>
                      </p>
                    </div>
                  ))}
                </Slider>

                <div className="navBtns">
                  <button className="navBtn prevBtn swiper-button-prev14">
                    <FontAwesome name="angle-left" />
                  </button>

                  <button className="navBtn nextBtn swiper-button-next14">
                    <FontAwesome name="angle-right" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 align-self-center">
            <div className="top_date_social text-right">
              <div className={`paper_date ${dark ? "white" : ""}`}>
                <p>
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className={`social1 ${dark ? "white" : ""}`}>
                <ul className="inline">
                  <li>
                    <Link to="#">
                      <FontAwesome name="twitter" />
                    </Link>
                  </li>

                  <li>
                    <Link to="#">
                      <FontAwesome name="facebook-f" />
                    </Link>
                  </li>

                  <li>
                    <Link to="#">
                      <FontAwesome name="youtube-play" />
                    </Link>
                  </li>

                  <li>
                    <Link to="#">
                      <FontAwesome name="instagram" />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

TopBar.propTypes = {
  className: ProtoTypes.string,
  dark: ProtoTypes.bool,
};

export default TopBar;
