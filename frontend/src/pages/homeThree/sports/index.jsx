import React from "react";
import MainMenuThree from "../../../component/MainMenuThree";
import BannerSectionThree from "../../../component/BannerSectionThree";
import FollowUs from "../../../component/FollowUs";
import WidgetFinanceTwo from "../../../component/WidgetFinanceTwo";
import NewsLetter from "../../../component/NewsLetter";
import { Link } from "react-router-dom";
import FontAwesome from "../../../component/uiStyle/FontAwesome";

import banner4 from "../../../assets/img/ad/ad-3.png";
import { financePosts } from "../../../data/news";
import { featurePosts } from "../../../data/features";

function HomeThreeSports() {
  return (
    <>
      <MainMenuThree />
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
              <div className="row">
                <div className="col-12">
                  <div className="categories_title">
                    <h5>
                      Category: <Link to="">Sports</Link>
                    </h5>
                  </div>
                </div>
              </div>

              <div className="row justify-content-center">
                {featurePosts.map((item, i) => (
                  <div key={i} className="col-lg-6">
                    <div
                      className={`single_post post_type3 xs-mb90 post_type15 ${
                        i + 1 < featurePosts.length ? "mb30" : ""
                      }`}
                    >
                      <div className="post_img border-radious5">
                        <div className="img_wrap">
                          <Link to="">
                            <img src={item.photo} alt="thumb" />
                          </Link>
                        </div>
                        <span className="tranding border_tranding">
                          <FontAwesome name="bolt" />
                        </span>
                      </div>
                      <div className="single_post_text">
                        <div className="row">
                          <div className="col-9 align-self-cnter">
                            <div className="meta3">
                              <Link to="">TECHNOLOGY</Link>
                              <Link to="">March 26, 2020</Link>
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
                          <Link to="/post1">{item.title}</Link>
                        </h4>
                        <div className="space-10" />
                        <p className="post-p">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cpagination v4 padding5050">
                <nav aria-label="Page navigation example">
                  <ul className="pagination">
                    <li className="page-item">
                      <Link className="page-link" to="/" aria-label="Previous">
                        <span aria-hidden="true">
                          <FontAwesome name="caret-left" />
                        </span>
                      </Link>
                    </li>
                    <li className="page-item">
                      <Link className="page-link" to="/">
                        1
                      </Link>
                    </li>
                    <li className="page-item">
                      <Link className="page-link" to="/">
                        ..
                      </Link>
                    </li>
                    <li className="page-item">
                      <Link className="page-link" to="/">
                        5
                      </Link>
                    </li>
                    <li className="page-item">
                      <Link className="page-link" to="/" aria-label="Next">
                        <span aria-hidden="true">
                          <FontAwesome name="caret-right" />
                        </span>
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <FollowUs title="Follow Us" />
              <div className="banner2 mb30 border-radious5">
                <Link to="">
                  <img src={banner4} alt="banner4" />
                </Link>
              </div>
              <WidgetFinanceTwo data={financePosts} title="Finance" />
              <NewsLetter
                titleClass="white"
                className="news_letter4 border-radious5"
              />
            </div>
          </div>
        </div>
      </div>
      <BannerSectionThree />
    </>
  );
}

export default HomeThreeSports;
