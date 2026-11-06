import React from "react";
import FontAwesome from "../../../component/uiStyle/FontAwesome";
import { Link } from "react-router-dom";
import WidgetTab from "../../../component/WidgetTab";
import WidgetTrendingNews from "../../../component/WidgetTrendingNews";
import NewsLetter from "../../../component/NewsLetter";
import EntertainmentNews from "../../../component/EntertainmentNews";
import MostShareWidget from "../../../component/MostShareWidget";
import FollowUs from "../../../component/FollowUs";

// images
import banner2 from "../../../assets/img/ad/ad-2.jpg";
import calendar from "../../../assets/img/icon/calendar.png";
import erroImg from "../../../assets/img/404.png";
import BannerSection from "../../../component/BannerSection";
import { entertainments2 } from "../../../data/entertainments";

function Error() {
  return (
    <>
      <div className="inner_table">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="space-50" />
              <div className="area404 text-center">
                <img src={erroImg} alt="404" />
              </div>
              <div className="space-30" />
              <div className="back4040 text-center col-lg-6 m-auto">
                <h3>Page not faund</h3>
                <div className="space-10" />
                <p>
                  Sorry the page you were looking for cannot be found. Try
                  searching for the best match or browse the links below:
                </p>
                <div className="space-20" />
                <div className="button_group">
                  <Link to="/" className="cbtn2">
                    GO TO HOME
                  </Link>
                  <Link to="/contact" className="cbtn3">
                    contact us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-50" />
      </div>

      <div className="archives padding-top-30">
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-lg-8">
              <div className="row">
                <div className="col-6 align-self-center">
                  <div className="heading">
                    <h2 className="widget-title">Archive</h2>
                  </div>
                </div>
                <div className="col-6 text-right">
                  <div className="calender">
                    <img src={calendar} alt="calendar" />
                  </div>
                </div>
              </div>
              <div className="about_posts_tab">
                <div className="row justify-content-center">
                  <EntertainmentNews
                    headerHide={true}
                    entertainments={entertainments2}
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
              <FollowUs title="Follow Us" />
              <WidgetTrendingNews />
              <div className="banner2 mb30">
                <Link to="/">
                  <img src={banner2} alt="thumb" />
                </Link>
              </div>
              <MostShareWidget title="Most Share" />
              <NewsLetter />
            </div>
          </div>
        </div>
      </div>
      <div className="space-70" />
      <BannerSection />
    </>
  );
}

export default Error;
