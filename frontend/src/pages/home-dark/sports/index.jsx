import React from "react";
import BreadCrumb from "../../../component/BreadCrumb";
import FontAwesome from "../../../component/uiStyle/FontAwesome";
import { Link } from "react-router-dom";
import WidgetTab from "../../../component/WidgetTab";
import WidgetTrendingNews from "../../../component/WidgetTrendingNews";
import NewsLetter from "../../../component/NewsLetter";
import FollowUs from "../../../component/FollowUs";

// images
import banner2 from "../../../assets/img/ad/ad-2.jpg";
import BannerSection from "../../../component/BannerSection";
import { sports } from "../../../data/sports";

function Sports() {
  return (
    <>
      <BreadCrumb title="Business" />
      <div className="archives padding-top-30">
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-lg-8">
              <div className="row">
                <div className="col-12 align-self-center">
                  <div className="categories_title">
                    <h5>
                      Category: <Link to="/">Sports</Link>
                    </h5>
                  </div>
                </div>
              </div>
              <div className="row justify-content-center">
                {sports.map((item, i) => (
                  <div key={i} className="col-lg-6">
                    <div className="single_post post_type3 mb30">
                      <div className="post_img">
                        <Link to="/">
                          <img src={item.image} alt="sportsbig1" />
                        </Link>{" "}
                        <span className="tranding">
                          <FontAwesome name="bolt" />
                        </span>
                      </div>
                      <div className="single_post_text">
                        <div className="meta3">
                          <Link to="/">{item.category}</Link>
                          <Link to="/">{item.date}</Link>
                        </div>
                        <h4>
                          <Link to="/post1">{item.title}</Link>
                        </h4>
                        <div className="space-10" />
                        <p className="post-p">{item.description}</p>
                        <div className="space-20" />
                        <Link to="/" className="readmore">
                          Read More
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
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
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <WidgetTab />
              <WidgetTrendingNews />
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
      <BannerSection />
    </>
  );
}

export default Sports;
