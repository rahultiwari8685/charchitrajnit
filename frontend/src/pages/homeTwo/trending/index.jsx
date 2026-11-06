import React from "react";
import Whatsnew from "../../../component/Whatsnew";
import { Link } from "react-router-dom";
import NewsLetter from "../../../component/NewsLetter";
import FollowUs from "../../../component/FollowUs";
import FontAwesome from "../../../component/uiStyle/FontAwesome";
import BannerSection from "../../../component/BannerSection";
import WidgetTrendingNewsTwo from "../../../component/WidgetTrendingNewsTwo";

import sd_banner_img from "../../../assets/img/ad/ad-3.png";
import { trendings_news } from "../../../data/trandings";

function HomeTwoTrending() {
  return (
    <>
      <div className="archives layout3 post post1 padding-top-30">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="bridcrumb">
                <Link to="/">Home</Link> / Categories / Sports
              </div>
            </div>
          </div>
          <div className="space-30" />
          <div className="row">
            <div className="col-md-6 col-lg-8">
              <div className="white_bg border-radious5 padding20">
                <div className="row">
                  <div className="col-12">
                    <div className="categories_title">
                      <h5>
                        Category: <Link to="/">Sports</Link>
                      </h5>
                    </div>
                  </div>
                </div>
                <div className="row">
                  {trendings_news.map((item, i) => (
                    <div key={i} className="col-lg-6">
                      <div className="single_post post_type3 xs-mb90 post_type15">
                        <div className="post_img border-radious5">
                          <Link to="/">
                            <img src={item.photo} alt="thumb" />
                          </Link>
                          {/* <span className="tranding border_tranding">
                            <FontAwesome name="bolt" />
                          </span> */}
                        </div>
                        <div className="single_post_text">
                          <h4>
                            <Link to="/post1">{item.title}</Link>
                          </h4>
                          <div className="space-10" />
                          <p className="post-p">{item.desc}</p>
                          <div className="space-20" />
                          <div className="meta3">
                            <Link to="/">{item.category}</Link>
                            <Link to="/">{item.date}</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="cpagination v3 padding5050">
                    <nav aria-label="Page navigation example">
                      <ul className="pagination">
                        <li>
                          <Link to="/" aria-label="Previous">
                            {" "}
                            <span aria-hidden="true">
                              <FontAwesome name="caret-left" />
                            </span>
                          </Link>
                        </li>
                        <li>
                          <Link to="/">1</Link>
                        </li>
                        <li>
                          <Link to="/">..</Link>
                        </li>
                        <li>
                          <Link to="/">5</Link>
                        </li>
                        <li>
                          <Link to="/" aria-label="Next">
                            {" "}
                            <span aria-hidden="true">
                              <FontAwesome name="caret-right" />
                            </span>
                          </Link>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <FollowUs
                title="Contact Us"
                className="follow_box widget sociai_style3 mb30 white_bg padding20 white_bg border-radious5 inner_socail4"
              />
              <WidgetTrendingNewsTwo />
              <div className="banner2 mb30">
                <Link to="/">
                  <img
                    className="border-radious5"
                    src={sd_banner_img}
                    alt="sd_banner_img"
                  />
                </Link>
              </div>
              <Whatsnew
                className="most_widget3 white_bg mb30 padding20 border-radious5"
                title="Most View"
              />
              <NewsLetter className="mb-0 news3bg padding20 white_bg border-radious5" />
            </div>
          </div>
        </div>
      </div>
      <BannerSection className="padding5050 theme3_bg layout3" />
    </>
  );
}

export default HomeTwoTrending;
