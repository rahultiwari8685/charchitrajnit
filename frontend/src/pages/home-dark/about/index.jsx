import React, { useState } from "react";
import BreadCrumb from "../../../component/BreadCrumb";
import FontAwesome from "../../../component/uiStyle/FontAwesome";
import { Link } from "react-router-dom";
import WidgetTab from "../../../component/WidgetTab";
import WidgetTrendingNews from "../../../component/WidgetTrendingNews";
import NewsLetter from "../../../component/NewsLetter";
import EntertainmentNews from "../../../component/EntertainmentNews";
import { Fade, Nav, NavItem, TabContent, TabPane } from "reactstrap";
import MostShareWidget from "../../../component/MostShareWidget";
import BannerSection from "../../../component/BannerSection";

// images
import banner2 from "../../../assets/img/ad/ad-2.jpg";
import author1 from "../../../assets/img/author.png";
import calendar from "../../../assets/img/icon/calendar.png";
import { entertainments2 } from "../../../data/entertainments";

function About() {
  const [activeTab, setActiveTab] = useState("1");

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  return (
    <>
      <BreadCrumb className="shadow5" title="Archive">
        <>
          <div className="space-50" />
          <div className="row">
            <div className="col-12">
              <div className="author_about">
                <div className="author_img">
                  <div className="author_wrap">
                    <img src={author1} alt="author1" />
                  </div>
                </div>
                <div className="author_content">
                  <Link to="/">QuomodoSoft</Link>
                  <ul className="inline">
                    <li>News Writer</li>
                    <li>Since: April 25, 2020</li>
                  </ul>
                </div>
                <p>
                  QuomodoSoft is an investigative reporter for Newspark, based
                  in Bangladesh. He started at The Times in 1999 covering Mayor
                  Rudolph W. Giuliani and then the Sept. 11, 2001, attacks.
                </p>
                <br />
                <p>
                  He is a three-time winner of the Pulitzer Prize for
                  explanatory reporting, investigative reporting and as part of
                  team for foreign reporting. He previously worked at The
                  Bangladesh Post and The Hartford Courant.
                </p>
              </div>
            </div>
          </div>
          <div className="space-50" />
        </>
      </BreadCrumb>
      <div className="archives padding-top-30">
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-lg-8">
              <div className="row">
                <div className="col-10 align-self-center">
                  <div className="about_post_list">
                    <Nav tabs>
                      <NavItem>
                        <div
                          className={activeTab === "1" ? "active" : ""}
                          onClick={() => {
                            toggle("1");
                          }}
                        >
                          Latest news
                        </div>
                      </NavItem>
                      <NavItem>
                        <div
                          className={activeTab === "2" ? "active" : ""}
                          onClick={() => {
                            toggle("2");
                          }}
                        >
                          Popular news
                        </div>
                      </NavItem>
                    </Nav>
                  </div>
                </div>
                <div className="col-2 text-right align-self-center">
                  <div className="calender mb20">
                    <img src={calendar} alt="calendar" />
                  </div>
                </div>
              </div>
              <div className="about_posts_tab">
                <TabContent activeTab={activeTab}>
                  <TabPane tabId="1">
                    <Fade in={activeTab === "1"}>
                      <div className="row justify-content-center">
                        <EntertainmentNews
                          headerHide={true}
                          entertainments={entertainments2}
                        />
                      </div>
                    </Fade>
                  </TabPane>
                  <TabPane tabId="2">
                    <Fade in={activeTab === "2"}>
                      <div className="row justify-content-center">
                        <EntertainmentNews
                          headerHide={true}
                          entertainments={entertainments2}
                        />
                      </div>
                    </Fade>
                  </TabPane>
                </TabContent>
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

export default About;
