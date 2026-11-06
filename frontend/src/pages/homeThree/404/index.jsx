import React from "react";
import FontAwesome from "../../../component/uiStyle/FontAwesome";
import { Link } from "react-router-dom";
import NewsLetter from "../../../component/NewsLetter";
import FollowUs from "../../../component/FollowUs";
import BannerSection from "../../../component/BannerSection";
import MainMenuThree from "../../../component/MainMenuThree";
import CategoryFour from "../../../component/CategoryFour";
import WidgetFinanceTwo from "../../../component/WidgetFinanceTwo";

// images
import erroImg from "../../../assets/img/404.png";
import banner4 from "../../../assets/img/ad/ad-3.png";
import calendarImg from "../../../assets/img/icon/calendar.png";
import { financePosts, news } from "../../../data/news";

function HomeThreeError() {
  return (
    <>
      <MainMenuThree />
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
                  <Link to="/" className="cbtn4">
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
                    <img src={calendarImg} alt="icon" />
                  </div>
                </div>
              </div>
              <div className="row justify-content-center">
                {news.map((item, i) => (
                  <div key={i} className="col-lg-6">
                    <div className="single_post post_type3 shadow7 mb30 post_type15 border-radious5">
                      <div className="post_img border-radious5">
                        <div className="img_wrap">
                          <img src={item.photo} alt="thumb" />
                        </div>
                        <span className="tranding border_tranding">
                          <FontAwesome name="bolt" />
                        </span>
                      </div>
                      <div className="single_post_text padding20 white_bg">
                        <Link to="/post1">{item.title}</Link>
                        <div className="space-10" />
                        <p className="post-p">{item.body}</p>
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
              <CategoryFour />
            </div>
          </div>
        </div>
      </div>
      <div className="space-70" />
      <BannerSection />
    </>
  );
}

export default HomeThreeError;
