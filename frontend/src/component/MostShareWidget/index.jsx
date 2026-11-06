import React, { useEffect, useState } from "react";
import ProtoTypes from "prop-types";
import { Link } from "react-router-dom";
import FontAwesome from "../uiStyle/FontAwesome";
import Slider from "../Slider";

const API = "https://api.bharat19express.com";

const MostShareWidget = ({ title, dark }) => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetchMostShared();
  }, []);

  const fetchMostShared = async () => {
    try {
      const res = await fetch(`${API}/api/news/most-shared?limit=10`);

      const data = await res.json();

      if (data.status) {
        setNews(data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="widget tab_widgets mb30">
      <h2 className="widget-title">{title || "Most Shared"}</h2>

      <div className="post_type2_carousel multipleRowCarousel nav_style1">
        <Slider
          navigation={{
            nextEl: ".swiper-button-next7",
            prevEl: ".swiper-button-prev7",
          }}
          slidesPerView={1}
          grid={{
            rows: 6,
          }}
        >
          {news.map((item, index) => (
            <div key={item._id} className="carousel_items">
              <div className="single_post widgets_small widgets_type4">
                <div className="post_img number">
                  <h2>{index + 1}</h2>
                </div>

                <div className="single_post_text">
                  <div className="meta2">
                    <Link to="#">{item.categories?.[0]?.name}</Link>

                    {/* <Link to="#">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </Link> */}
                  </div>

                  <h4>
                    <Link to={`/${item.categories?.[0]?.slug}/${item.slug}`}>
                      {item.title}
                    </Link>
                  </h4>

                  <ul className="inline socail_share">
                    <li>
                      <FontAwesome name="share-alt" /> {item.shares || 0}
                    </li>
                  </ul>

                  <div className="space-15" />

                  {dark ? (
                    <div className="border_white" />
                  ) : (
                    <div className="border_black" />
                  )}
                </div>
              </div>

              <div className="space-15" />
            </div>
          ))}
        </Slider>

        <div className="navBtns">
          <div className="navBtn prevtBtn swiper-button-prev7">
            <FontAwesome name="angle-left" />
          </div>

          <div className="navBtn nextBtn swiper-button-next7">
            <FontAwesome name="angle-right" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MostShareWidget;

MostShareWidget.propTypes = {
  title: ProtoTypes.string,
  dark: ProtoTypes.bool,
};
