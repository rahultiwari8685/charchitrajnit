import React from "react";
import BreadCrumb from "../../../component/BreadCrumb";
import BusinessNews from "../../../component/BusinessNews";
import FontAwesome from "../../../component/uiStyle/FontAwesome";
import { Link } from "react-router-dom";
import WidgetTab from "../../../component/WidgetTab";
import WidgetTrendingNews from "../../../component/WidgetTrendingNews";
import NewsLetter from "../../../component/NewsLetter";
import FollowUs from "../../../component/FollowUs";

// images

import banner2 from "../../../assets/img/ad/ad-2.jpg";
import BannerSection from "../../../component/BannerSection";
import { businessNews } from "../../../data/businessNews";

function HomeDarkBusiness() {
  return (
    <>
      <BreadCrumb title="Business" />
      <div className="archives padding-top-30">
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-lg-8">
              <div className="businerss_news">
                <div className="row">
                  <div className="col-12 align-self-center">
                    <div className="categories_title">
                      <h5>
                        Category: <Link to="/">Business</Link>
                      </h5>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <BusinessNews
                      headerHide={true}
                      businessNews={businessNews}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="cpagination">
                      <nav aria-label="Page navigation example">
                        <ul className="pagination">
                          <li className="page-item">
                            <Link
                              className="page-link"
                              to="/"
                              aria-label="Previous"
                            >
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
                            <Link
                              className="page-link"
                              to="/"
                              aria-label="Next"
                            >
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
            </div>
            <div className="col-md-6 col-lg-4">
              <WidgetTab dark={true} />
              <WidgetTrendingNews dark={true} />
              <NewsLetter />
              <FollowUs title="Follow Us" />
              <div className="banner2 mb30">
                <Link to="/">
                  <img src={banner2} alt="thumb" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="space-70" />
      <BannerSection className="parimay_bg padding5050" />
    </>
  );
}

export default HomeDarkBusiness;
