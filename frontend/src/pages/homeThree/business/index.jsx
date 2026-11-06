import React from "react";
import MainMenuThree from "../../../component/MainMenuThree";
import BannerSectionThree from "../../../component/BannerSectionThree";
import FollowUs from "../../../component/FollowUs";
import WidgetFinanceTwo from "../../../component/WidgetFinanceTwo";
import NewsLetter from "../../../component/NewsLetter";
import { Link } from "react-router-dom";
import FontAwesome from "../../../component/uiStyle/FontAwesome";
import InternationalNews from "../../../component/InternationalNews";

import banner4 from "../../../assets/img/ad/ad-3.png";
import { businessPosts, financePosts } from "../../../data/news";

function HomeThreeBusiness() {
  return (
    <>
      <MainMenuThree />
      <div className="archives layout3 post post1 padding-top-30">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="bridcrumb">
                <Link to="/">Home</Link> / Categories / Business
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
                      Category: <Link to="/">Business</Link>
                    </h5>
                  </div>
                </div>
              </div>
              <InternationalNews data={businessPosts} />
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
                <Link to="/">
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

export default HomeThreeBusiness;
