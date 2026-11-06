import React from "react";
import { Link } from "react-router-dom";
import FontAwesome from "../../component/uiStyle/FontAwesome";

import trend31 from "../../assets/img/trending-thumb.jpg";
import trend32 from "../../assets/img/gallery-1.jpg";
import trend33 from "../../assets/img/gallery-2.jpg";
import trend34 from "../../assets/img/gallery-3.jpg";
import trend35 from "../../assets/img/gallery-4.jpg";
import trend36 from "../../assets/img/gallery-5.jpg";

const trendingNews = [
  {
    photo: trend32,
    title: "Copa America: Luis Suarez from devastated US",
  },
  {
    photo: trend33,
    title: "Copa America: Luis Suarez from devastated US",
  },
  {
    photo: trend34,
    title: "Copa America: Luis Suarez from devastated US",
  },
  {
    photo: trend35,
    title: "Copa America: Luis Suarez from devastated US",
  },
  {
    photo: trend36,
    title: "Copa America: Luis Suarez from devastated US",
  },
  {
    photo: trend33,
    title: "Copa America: Luis Suarez from devastated US",
  },
];
const TrendingNewsThree = () => {
  return (
    <div className="white_bg tranding3 padding20 border-radious5 mb30 shadow7">
      <div className="row">
        <div className="col-12">
          <div className="heading">
            <h2 className="widget-title">Trending News</h2>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6">
          <div className="single_post post_type3 xs-mb90 post_type15">
            <div className="post_img border-radious5">
              <div className="img_wrap">
                <Link to="/home-three">
                  <img src={trend31} alt="trend31" />
                </Link>
              </div>
              {/* <span className="tranding border_tranding">
                <FontAwesome name="bolt" />
              </span> */}
            </div>
            <div className="single_post_text">
              <div className="row">
                <div className="col-9 align-self-cnter">
                  <div className="meta3">
                    <Link to="/">TECHNOLOGY</Link>
                    <Link to="/">March 26, 2020</Link>
                  </div>
                </div>
                <div className="col-3 align-self-cnter">
                  <div className="share_meta4 text-right">
                    <ul className="inline">
                      <li>
                        <Link to="/">
                          <FontAwesome name="bookmark" />
                        </Link>
                      </li>
                      <li>
                        <Link to="/">
                          <FontAwesome name="share" />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="space-5" />
              <h4>
                <Link to="/post1">
                  Japan’s virus puzzled the world luck running out?
                </Link>
              </h4>
              <div className="space-10" />
              <p className="post-p">
                The property, complete with 30-seat screening from room, a
                100-seat amphitheater and a swimming pond with sandy shower…
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="popular_items scroll_bar">
            {trendingNews.map((item, i) => (
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
                    <div className="meta3">
                      <Link to="">TECHNOLOGY</Link>
                      <Link to="">March 26, 2020</Link>
                    </div>
                    <h4>
                      <Link to="/">{item.title}</Link>
                    </h4>
                  </div>
                </div>
                {i + 1 < trendingNews.length ? (
                  <>
                    <div className="space-5" />
                    <div className="border4" />
                    <div className="space-15" />
                  </>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingNewsThree;
