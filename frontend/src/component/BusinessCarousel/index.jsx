import React from "react";
import { Link } from "react-router-dom";
import smslide41 from "../../assets/img/international-1.jpg";
import smslide42 from "../../assets/img/international-2.jpg";

import Slider from "../Slider";
import FontAwesome from "../uiStyle/FontAwesome";

const businessPosts = [
  {
    photo: smslide41,
    category: "Technology",
    title:
      "Why clinician spiritual health matters in the covid-19 crisis: you can’t pour from an empty cup…",
    description:
      "The property, complete with seat screening from room, a 100-seat amphitheater and a swimming pond with",
  },
  {
    photo: smslide42,
    category: "Technology",
    title:
      "Why clinician spiritual health matters in the covid-19 crisis: you can’t pour from an empty cup…",
    description:
      "The property, complete with seat screening from room, a 100-seat amphitheater and a swimming pond with",
  },
  {
    photo: smslide41,
    category: "Technology",
    title:
      "Why clinician spiritual health matters in the covid-19 crisis: you can’t pour from an empty cup…",
    description:
      "The property, complete with seat screening from room, a 100-seat amphitheater and a swimming pond with",
  },
];
const BusinessCarousel = () => {
  return (
    <div className="business_carousel nav_style4 mb30 ">
      <Slider
        navigation={{
          nextEl: ".swiper-button-next1",
          prevEl: ".swiper-button-prev1",
        }}
        slidesPerView={2}
        spaceBetween={30}
        loop={true}
        breakpoints={{
          1024: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
          320: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
        }}
      >
        {businessPosts.map((item, i) => (
          <div
            key={i}
            className="business_carousel_items white_bg padding20 shadow7"
          >
            <div className="single_international">
              <p className="meta before">{item.category}</p>
              <h4>
                <Link to="/">{item.title}</Link>
              </h4>
              <div className="row">
                <div className="col-8 align-self-center">
                  <p>{item.description}</p>
                </div>
                <div className="col-4 align-self-center">
                  <div className="img_wrap">
                    <Link to="/">
                      <img src={item.photo} alt="thumb" />
                    </Link>
                  </div>
                </div>
              </div>
              <ul className="mt20 like_cm">
                <li>
                  <Link to="/">
                    <FontAwesome name="eye" /> 6745
                  </Link>
                </li>
                <li>
                  <Link to="/">
                    <FontAwesome name="heart" /> 6745
                  </Link>
                </li>
                <li>
                  <Link to="/">
                    <FontAwesome name="share" /> 6745
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        ))}
      </Slider>
      <div className="owl-nav">
        <div className="swiper-button-prev1">
          <FontAwesome name="angle-left" />
        </div>
        <div className="swiper-button-next1">
          <FontAwesome name="angle-right" />
        </div>
      </div>
    </div>
  );
};

export default BusinessCarousel;
