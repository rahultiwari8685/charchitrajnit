import React from "react";
import { Link } from "react-router-dom";

import pop51 from "../../assets/img/trending-business/1.jpg";
import pop52 from "../../assets/img/trending-business/2.jpg";
import pop53 from "../../assets/img/trending-business/3.jpg";
import pop54 from "../../assets/img/trending-business/4.jpg";
import pop56 from "../../assets/img/trending-business/5.jpg";
import gallery42 from "../../assets/img/trending-image-post-2.jpg";
import Slider from "../Slider";
import FontAwesome from "../uiStyle/FontAwesome";

const populerPosts = [
  {
    photo: pop51,
    title: "The city with highest quality of life in world.",
  },
  {
    photo: pop52,
    title: "The city with highest quality of life in world.",
  },
  {
    photo: pop53,
    title: "The city with highest quality of life in world.",
  },
  {
    photo: pop54,
    title: "The city with highest quality of life in world.",
  },
  {
    photo: pop56,
    title: "The city with highest quality of life in world.",
  },
];

const galleryPosts = [
  {
    photo: gallery42,
    title:
      "apan’s virus success has puzzled the world. Is its luck running out?",
  },
  {
    photo: gallery42,
    title:
      "apan’s virus success has puzzled the world. Is its luck running out?",
  },
  {
    photo: gallery42,
    title:
      "apan’s virus success has puzzled the world. Is its luck running out?",
  },
];

const BusinessImageCarousel = () => {
  return (
    <div className="row">
      <div className="col-lg-7">
        <div className="image_carousel nav_style4 mb30">
          <Slider
            navigation={{
              nextEl: ".swiper-button-next2",
              prevEl: ".swiper-button-prev2",
            }}
            slidesPerView={1}
            loop={true}
          >
            {galleryPosts.map((item, i) => (
              <div
                key={i}
                className="single_post gradient1 post_type6 border-radious7 xs-mb30"
              >
                <div className="post_img gradient1">
                  <div className="img_wrap">
                    <Link to="/">
                      <img src={item.photo} alt="thumb" />
                    </Link>
                  </div>
                </div>
                <div className="single_post_text">
                  <p className="meta meta_style4">
                    Business <span>&nbsp;| &nbsp; March 26, 2020</span>
                  </p>
                  <h4>
                    <Link to="/video_post1">{item.title}</Link>
                  </h4>
                </div>
              </div>
            ))}
          </Slider>
          <div className="owl-nav">
            <div className="swiper-button-prev2">
              <FontAwesome name="angle-left" />
            </div>
            <div className="swiper-button-next2">
              <FontAwesome name="angle-right" />
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-5">
        <div className="padding20 white_bg border-radious5 mb30">
          <p className="meta before">Technology</p>
          <div className="space-15" />
          {populerPosts.map((item, i) => (
            <div key={i}>
              <div className="single_post type10 type16 type22 widgets_small mb15">
                <div className="post_img">
                  <div className="img_wrap">
                    <Link to="/">
                      <img src={item.photo} alt="thumb" />
                    </Link>
                  </div>
                </div>
                <div className="single_post_text">
                  <h4>
                    <Link to="/">{item.title}</Link>
                  </h4>
                </div>
              </div>
              {i + 1 < populerPosts.length ? (
                <>
                  <div className="space-15" />
                  <div className="border4" />
                  <div className="space-15" />
                </>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusinessImageCarousel;
