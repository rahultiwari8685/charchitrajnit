import React, { useEffect, useState } from "react";
import ProtoTypes from "prop-types";
import { Link } from "react-router-dom";
import FontAwesome from "../uiStyle/FontAwesome";
import Slider from "../Slider";

const MostView = ({ no_margin, title, dark }) => {
  const [mostView, setMostView] = useState([]);

  useEffect(() => {
    getPopularNews();
  }, []);

  const getPopularNews = async () => {
    try {
      const res = await fetch(
        "https://api.bharat19express.com/api/news/popular?limit=8",
      );

      const data = await res.json();

      // if (data.status) {
      //   setMostView(data.data);
      // }

      if (data.status) {
        const videoPosts = data.data.filter((item) => item.videoType === 2);

        setMostView(videoPosts);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={`widget tab_widgets ${no_margin ? "" : "mb30"}`}>
      <h2 className="widget-title">{title || "Most View"}</h2>

      <div className="post_type2_carousel multipleRowCarousel nav_style1">
        <Slider
          navigation={{
            nextEl: ".swiper-button-next8",
            prevEl: ".swiper-button-prev8",
          }}
          slidesPerView={1}
          grid={{
            rows: 6,
          }}
        >
          {mostView.map((item, index) => (
            <div key={item._id} className="single_post2_carousel">
              <div className="single_post widgets_small type8">
                <div className="post_img">
                  <div className="img_wrap">
                    <Link to={`/${item.categories?.[0]?.slug}/${item.slug}`}>
                      <img
                        src={`https://api.bharat19express.com/uploads/images/${item.thumbnail}`}
                        alt={item.title}
                        style={{
                          width: "90px",
                          height: "70px",
                          objectFit: "cover",
                        }}
                      />
                    </Link>
                  </div>

                  {/* <span className="tranding">
                    <FontAwesome name="bolt" />
                  </span> */}
                </div>

                <div className="single_post_text">
                  <div className="meta2">
                    <Link to="#">{item.categories?.[0]?.name || "News"}</Link>

                    <Link to="#">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </Link>
                  </div>

                  <h4>
                    <Link to={`/${item.categories?.[0]?.slug}/${item.slug}`}>
                      {item.title}
                    </Link>
                  </h4>
                </div>

                <div className="type8_count">
                  <h2>{index + 1}</h2>
                </div>
              </div>

              {index + 1 < mostView.length && (
                <>
                  <div className="space-15" />

                  {dark ? (
                    <div className="border_white" />
                  ) : (
                    <div className="border_black" />
                  )}

                  <div className="space-15" />
                </>
              )}
            </div>
          ))}
        </Slider>

        <div className="navBtns">
          <div className="navBtn prevtBtn swiper-button-prev8">
            <FontAwesome name="angle-left" />
          </div>

          <div className="navBtn nextBtn swiper-button-next8">
            <FontAwesome name="angle-right" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MostView;

MostView.propTypes = {
  no_margin: ProtoTypes.bool,
  title: ProtoTypes.string,
  dark: ProtoTypes.bool,
};
