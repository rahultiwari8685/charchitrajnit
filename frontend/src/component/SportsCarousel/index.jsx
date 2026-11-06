import React from "react";
import ProtoTypes from "prop-types";
import { Link } from "react-router-dom";
import FontAwesome from "../uiStyle/FontAwesome";
import Slider from "../Slider";

const SportsCarousel = ({ dark, sportsNews }) => {
  return (
    <div className="widget tab_widgets">
      <div className="post_type2_carousel multipleRowCarousel nav_style1">
        <Slider
          navigation={{
            nextEl: ".swiper-button-next13",
            prevEl: ".swiper-button-prev13",
          }}
          slidesPerView={1}
          grid={{
            rows: 6,
          }}
        >
          {sportsNews.map((item, index) => (
            <div key={item._id} className="single_post2_carousel">
              <div className="single_post widgets_small">
                <div className="post_img">
                  <div className="img_wrap">
                    <Link to={`/${item.categories?.[0]?.slug}/${item.slug}`}>
                      <img
                        src={`https://api.bharat19express.com/uploads/images/${item.thumbnail}`}
                        alt={item.title}
                        style={{
                          width: "100%",
                          height: "90px",
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
                    <Link to="#">{item.categories?.[0]?.name || "Sports"}</Link>

                    <Link to="#">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </Link>
                  </div>

                  <h4>
                    <Link to={`/${item.categories?.[0]?.slug}/${item.slug}`}>
                      {item.title}
                    </Link>
                  </h4>
                </div>
              </div>

              {index !== sportsNews.length - 1 && (
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
          <div className="navBtn prevtBtn swiper-button-prev13">
            <FontAwesome name="angle-left" />
          </div>

          <div className="navBtn nextBtn swiper-button-next13">
            <FontAwesome name="angle-right" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SportsCarousel;

SportsCarousel.propTypes = {
  dark: ProtoTypes.bool,
  sportsNews: ProtoTypes.array,
};

SportsCarousel.defaultProps = {
  sportsNews: [],
};
