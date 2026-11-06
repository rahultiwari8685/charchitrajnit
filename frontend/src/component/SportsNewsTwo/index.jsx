import React from "react";
import { Link } from "react-router-dom";

import sports41 from "../../assets/img/finance/finance-1.jpg";
import sports42 from "../../assets/img/gallery-post/1.png";
import sports43 from "../../assets/img/gallery-post/2.png";
import sports44 from "../../assets/img/gallery-post/3.png";
import sports45 from "../../assets/img/gallery-post/4.png";
import sports46 from "../../assets/img/gallery-post/5.png";

import FontAwesome from "../uiStyle/FontAwesome";

const sportsNews = [
  {
    photo: sports42,
    title: "Copa America: Luis Suarez from devastated US",
  },
  {
    photo: sports43,
    title: "Copa America: Luis Suarez from devastated US",
  },
  {
    photo: sports44,
    title: "Copa America: Luis Suarez from devastated US",
  },
  {
    photo: sports45,
    title: "Copa America: Luis Suarez from devastated US",
  },
  {
    photo: sports46,
    title: "Copa America: Luis Suarez from devastated US",
  },
  {
    photo: sports42,
    title: "Copa America: Luis Suarez from devastated US",
  },
];

const SportsNewsTwo = () => {
  return (
    <div className="sports_wrap mb30 white_bg border-radious5 shadow7 padding20">
      <div className="finance ">
        <div className="heading">
          <h3 className="widget-title">Sports</h3>
        </div>
        <div className="single_post type18">
          <div className="post_img">
            <div className="img_wrap">
              <Link to="/">
                <img src={sports41} alt="sports41" />
              </Link>
            </div>
            <span className="batch3 date">April 26, 2020</span>
          </div>
          <div className="single_post_text py0">
            <h4>
              <Link to="/post1">
                Copa America: Luis Suarez from devastated US
              </Link>
            </h4>
            <div className="space-10" />
            <p className="post-p">
              The property, complete with seates screening from room
              amphitheater pond with sandy
            </p>
            <ul className="mt10 like_cm">
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
        <div className="space-30" />
        <div className="border4" />
        <div className="space-30" />
      </div>
      <div className="sport_buttom">
        {sportsNews.map((item, i) => (
          <div key={i}>
            <div className="single_post type10 type16 widgets_small mb15">
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
                <ul className="like_cm">
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
                </ul>
              </div>
            </div>
            {i + 1 < sportsNews.length ? (
              <>
                <div className="space-15" />
                <div className="border4" />
                <div className="space-15" />
              </>
            ) : null}
          </div>
        ))}
        <div className="space-20" />
        <Link to="/" className="showmore">
          Show more
        </Link>
      </div>
    </div>
  );
};

export default SportsNewsTwo;
