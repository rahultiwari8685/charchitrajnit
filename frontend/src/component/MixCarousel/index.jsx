import React, { useState } from "react";
import ProtoTypes from "prop-types";
import FontAwesome from "../uiStyle/FontAwesome";
import { Link } from "react-router-dom";
import ModalVideo from "react-modal-video";

import black_white1 from "../../assets/img/play-post-1.jpg";
import black_white2 from "../../assets/img/play-post-2.jpg";
import Slider from "../Slider";

const mixArray = [
  {
    icon: "play",
    image: black_white1,
    category: "TECHNOLOGY",
    date: "March 26, 2020",
    title: "Success is not a good food failure makes you humble",
  },
  {
    icon: "bolt",
    image: black_white2,
    category: "TECHNOLOGY",
    date: "March 26, 2020",
    title: "Success is not a good food failure makes you humble",
  },
  {
    icon: "play",
    image: black_white1,
    category: "TECHNOLOGY",
    date: "March 26, 2020",
    title: "Success is not a good food failure makes you humble",
  },
  {
    icon: "bolt",
    image: black_white2,
    category: "TECHNOLOGY",
    date: "March 26, 2020",
    title: "Success is not a good food failure makes you humble",
  },
];

const MixCarousel = ({ className, dark }) => {
  const [vModal, setvModal] = useState(false);
  const [videoId] = useState("0r6C3z3TEKw");

  return (
    <div className={`mix_area ${className ? className : ""}`}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className={`mix_carousel ${dark ? "primay_bg" : ""}`}>
              {/*CAROUSEL START*/}
              <div className="single_mix_carousel nav_style3">
                <Slider
                  slidesPerView={2}
                  spaceBetween={30}
                  loop={true}
                  navigation={{
                    nextEl: ".swiper-button-next6",
                    prevEl: ".swiper-button-prev6",
                  }}
                  breakpoints={{
                    1024: {
                      slidesPerView: 2,
                      spaceBetween: 30,
                    },
                    768: {
                      slidesPerView: 1,
                      spaceBetween: 0,
                    },
                    300: {
                      slidesPerView: 1,
                      spaceBetween: 0,
                    },
                  }}
                >
                  {mixArray.map((item, i) => (
                    <div key={i} className="single_post post_type6 post_type9">
                      <div className="post_img gradient1">
                        <div className="img_wrap">
                          <Link className="play_btn" to="/">
                            <img src={item.image} alt="news" />
                          </Link>
                        </div>
                        <span
                          onClick={() => setvModal(true)}
                          className={`tranding ${i % 2 ? "left" : ""}`}
                        >
                          <FontAwesome name={item.icon} />
                        </span>
                      </div>
                      <div className="single_post_text">
                        <div className="meta">
                          <Link to="/">{item.category}</Link>
                          <Link to="#">{item.date}</Link>
                        </div>
                        <h4>
                          <Link to="/video_post1">{item.title}</Link>
                        </h4>
                      </div>
                    </div>
                  ))}
                </Slider>
                <div className="owl-nav">
                  <div className="owl-prev swiper-button-prev6">
                    <FontAwesome name="angle-left" />
                  </div>
                  <div className="owl-next swiper-button-next6">
                    <FontAwesome name="angle-right" />
                  </div>
                </div>
              </div>
            </div>
            {/*CAROUSEL END*/}
          </div>
        </div>
      </div>
      <div className="space-30" />
      <ModalVideo
        channel="youtube"
        isOpen={vModal}
        videoId={videoId}
        onClose={() => setvModal(false)}
      />
    </div>
  );
};

export default MixCarousel;

MixCarousel.propTypes = {
  className: ProtoTypes.string,
  dark: ProtoTypes.bool,
};
