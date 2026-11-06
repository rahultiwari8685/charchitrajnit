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
import business1 from "../../../assets/img/business-1.jpg";
import business2 from "../../../assets/img/business-2.jpg";
import business3 from "../../../assets/img/business-3.jpg";
import banner2 from "../../../assets/img/ad/ad-3.png";
import BannerSection from "../../../component/BannerSection";

const businessNews = [
  {
    image: business1,
    category: "uiux.subash",
    date: "March 26, 2020",
    title: "Copa America: Luis Suarez from devastated US",
    body: "The property, complete with 30-seat screening from room, a 100-seat amphitheater and a swimming pond with…",
  },
  {
    image: business2,
    category: "uiux.subash",
    date: "March 26, 2020",
    title: "Copa America: Luis Suarez from devastated US",
    body: "The property, complete with 30-seat screening from room, a 100-seat amphitheater and a swimming pond with…",
  },
  {
    image: business3,
    category: "uiux.subash",
    date: "March 26, 2020",
    title: "Copa America: Luis Suarez from devastated US",
    body: "The property, complete with 30-seat screening from room, a 100-seat amphitheater and a swimming pond with…",
  },
  {
    image: business1,
    category: "uiux.subash",
    date: "March 26, 2020",
    title: "Copa America: Luis Suarez from devastated US",
    body: "The property, complete with 30-seat screening from room, a 100-seat amphitheater and a swimming pond with…",
  },
  {
    image: business2,
    category: "uiux.subash",
    date: "March 26, 2020",
    title: "Copa America: Luis Suarez from devastated US",
    body: "The property, complete with 30-seat screening from room, a 100-seat amphitheater and a swimming pond with…",
  },
  {
    image: business3,
    category: "uiux.subash",
    date: "March 26, 2020",
    title: "Copa America: Luis Suarez from devastated US",
    body: "The property, complete with 30-seat screening from room, a 100-seat amphitheater and a swimming pond with…",
  },
  {
    image: business2,
    category: "uiux.subash",
    date: "March 26, 2020",
    title: "Copa America: Luis Suarez from devastated US",
    body: "The property, complete with 30-seat screening from room, a 100-seat amphitheater and a swimming pond with…",
  },
  {
    image: business3,
    category: "uiux.subash",
    date: "March 26, 2020",
    title: "Copa America: Luis Suarez from devastated US",
    body: "The property, complete with 30-seat screening from room, a 100-seat amphitheater and a swimming pond with…",
  },
];

function Business() {
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

export default Business;
