import React from "react";
import MainMenuThree from "../../component/MainMenuThree";
import HeroArea from "../../component/HeroArea";
import TrendingNewsThree from "../../component/TrendingNewsThree";
import BusinessCarousel from "../../component/BusinessCarousel";
import BusinessImageCarousel from "../../component/BusinessImageCarousel";
import WidgetFinanceTwo from "../../component/WidgetFinanceTwo";
import { Link } from "react-router-dom";
import VIdeoNewsSection from "../../component/VIdeoNewsSection";
import InternationalNews from "../../component/InternationalNews";
import ScienceNews from "../../component/ScienceNews";
import SportsNewsTwo from "../../component/SportsNewsTwo";
import GalleryCarousel from "../../component/GalleryCarousel";
import WidgetTabThree from "../../component/WidgetTabThree";
import FollowUs from "../../component/FollowUs";
import WidgetOpinionNews from "../../component/WidgetOpinionNews";
import NewsLetter from "../../component/NewsLetter";
import CategoryFour from "../../component/CategoryFour";

import banner4 from "../../assets/img/ad/ad-3.png";
import banner42 from "../../assets/img/ad/ad-1.png";

import {
  financePosts,
  financePosts2,
  internationalPosts,
} from "../../data/homeNews";

function HomeThree() {
  return (
    <>
      <div className="wrapper_welcome">
        <MainMenuThree className="home4menu" />
        <HeroArea />
        <div className="bg4">
          <div className="space-60" />
          <div className="total3 mb30">
            <div className="container">
              <div className="row">
                <div className="col-md-12 col-xl-8">
                  <TrendingNewsThree />
                  <BusinessCarousel />
                  <BusinessImageCarousel />
                </div>
                <div className="col-md-6 col-xl-4 d-md-none d-xl-block">
                  <WidgetFinanceTwo data={financePosts} title="Finance" />
                  <div className="banner2 mb30 border-radious5">
                    <Link to="/">
                      <img src={banner4} alt="banner4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <VIdeoNewsSection />
          </div>
          <div className="inernational4">
            <div className="container">
              <div className="row">
                <div className="col-md-12 col-xl-8">
                  <InternationalNews
                    data={internationalPosts}
                    className="mb30"
                    title={true}
                    showMore={true}
                  />
                  <div className="banner_area mb30 xs-mt60">
                    <Link to="/">
                      <img src={banner42} alt="banner42" />
                    </Link>
                  </div>
                  <ScienceNews />
                  <div className="row">
                    <div className="col-md-6">
                      <SportsNewsTwo />
                    </div>
                    <div className="col-md-6">
                      <GalleryCarousel />
                      <WidgetTabThree />
                    </div>
                  </div>
                </div>
                <div className="col-md-12 col-xl-4">
                  <div className="row">
                    <div className="col-lg-6 col-xl-12 col-md-6">
                      <FollowUs
                        className="padding20 white_bg shadow7"
                        title="Follow Us"
                      />
                      <WidgetOpinionNews />
                    </div>
                    <div className="col-md-6 col-xl-12">
                      <NewsLetter
                        titleClass="white"
                        className="news_letter4 border-radious5"
                      />
                      <CategoryFour />
                      <WidgetFinanceTwo
                        data={financePosts2}
                        title="Inernational"
                      />
                      <div className="banner2 mb30 border-radious5  d-md-none d-xl-block">
                        <Link to="/">
                          <img src={banner4} alt="banner4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-60" />
        </div>
      </div>
    </>
  );
}

export default HomeThree;
