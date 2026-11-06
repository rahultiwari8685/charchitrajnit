import React, { useState, useEffect } from "react";
import PostGalleryTwo from "../../component/PostGalleryTwo";
import TrendingNewsTwo from "../../component/TrendingNewsTwo";
import FeatureNewsTwo from "../../component/FeatureNewsTwo";
import BusinessNewsTwo from "../../component/BusinessNewsTwo";
import MostViewTwo from "../../component/MostViewTwo";
import banner2 from "../../assets/img/ad/ad-3.png";
import banner3 from "../../assets/img/ad/ad-1.png";
import WidgetFinance from "../../component/WidgetFinance";
import VideoNews from "../../component/VideoNews";
import WidgetTabTwo from "../../component/WidgetTabTwo";
import Opinion from "../../component/Opinion";
import Whatsnew from "../../component/Whatsnew";
import { Link } from "react-router-dom";
import NewsLetter from "../../component/NewsLetter";
import FollowUs from "../../component/FollowUs";
import MostViewThree from "../../component/MostViewThree";
import Sports from "../../component/Sports";
import International from "../../component/International";
import BannerSection from "../../component/BannerSection";
import YouTubeChannelSlider from "../../component/YouTubeChannelSlider";
import { useTranslation } from "react-i18next";
function HomeTwo() {
  const categoryId = "6ab5133ae0146bb0a4a80e48";
  const { t, i18n } = useTranslation();

  const [banner, setBanner] = useState(null);
  const [bannerMiddle, setBannerMiddle] = useState(null);

  useEffect(() => {
    getBanner();
    getBannerMiddle();
  }, []);

  const getBanner = async () => {
    try {
      const res = await fetch(
        "https://api.bharat19express.com/api/advertisements",
      );

      const result = await res.json();

      if (result.success) {
        const ads = result.data
          .filter((item) => item.status === true && item.position === "sidebar")
          .sort((a, b) => (a.priority || 0) - (b.priority || 0));

        setBanner(ads[0] || null);
      }
    } catch (err) {
      console.error("Advertisement Error:", err);
      setBanner(null);
    }
  };
  const getBannerMiddle = async () => {
    try {
      const res = await fetch(
        "https://api.bharat19express.com/api/advertisements",
      );

      const result = await res.json();

      if (result.success) {
        const ads = result.data
          .filter(
            (item) =>
              item.status === true && item.position === "homepage_bottom",
          )
          .sort((a, b) => (a.priority || 0) - (b.priority || 0));

        setBannerMiddle(ads[0] || null);
      }
    } catch (err) {
      console.error("Advertisement Error:", err);
      setBannerMiddle(null);
    }
  };

  return (
    <>
      <PostGalleryTwo />
      <BannerSection className="theme3_bg mb10" />
      <YouTubeChannelSlider />
      <div className="total3 ">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-lg-8">
              <TrendingNewsTwo />
              <FeatureNewsTwo />
              <BusinessNewsTwo />
            </div>
            <div className="col-lg-4">
              <div className="row justify-content-center">
                <div className="col-md-6 col-lg-12">
                  <MostViewTwo />
                </div>
                {banner && (
                  <div className="col-md-6 col-lg-12 d-md-none d-lg-block">
                    <div className="banner2 mb30 border-radious5">
                      <a
                        href={banner.link || "#"}
                        target={banner.link ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                      >
                        <img
                          src={`https://api.bharat19express.com/uploads/advertisements/${banner.image}`}
                          alt={banner.title || "Advertisement"}
                          style={{
                            width: "100%",
                            height: "auto",
                            display: "block",
                          }}
                        />
                      </a>
                    </div>
                  </div>
                )}

                {/* <div className="col-md-6 col-lg-12 d-md-none d-lg-block">
                  <div className="banner2 mb30 border-radious5">
                    <Link to="/">
                      <img src={banner2} alt="thumb" />
                    </Link>
                  </div>
                </div> */}

                <div className="col-md-6 col-lg-12">
                  <WidgetFinance />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <VideoNews /> */}
      <div className="mix3 mb30">
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-xl-3">
              {/* <WidgetTabTwo className="sm-mt0 md-mt0" /> */}
              <WidgetTabTwo categoryId={categoryId} className="sm-mt0 md-mt0" />
            </div>
            <div className="col-md-6 col-xl-5 d-lg-none d-xl-block">
              <Opinion />
            </div>
            <div className="col-lg-6 col-xl-4">
              <Whatsnew title={t("entertainment", "Entertainment")} />
            </div>
          </div>
        </div>
      </div>
      <div className="mix_elements">
        <div className="container">
          <div className="row">
            <div className="col-xl-8 col-md-12">
              {/* <div className="banner_area mb30 xs-mt60">
                <Link to="/">
                  <img src={banner3} alt="banner3" />
                </Link>
              </div> */}

              {bannerMiddle && (
                <div
                  className="banner_area mb30 xs-mt60"
                  style={{
                    width: "100%",
                    maxWidth: "100%",
                    marginLeft: 0,
                    marginRight: 0,
                    paddingLeft: 0,
                    paddingRight: 0,
                    display: "block",
                  }}
                >
                  <a
                    href={bannerMiddle.link || "#"}
                    target={bannerMiddle.link ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    style={{
                      display: "block",
                      width: "100%",
                      maxWidth: "100%",
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    <img
                      src={`https://api.bharat19express.com/uploads/advertisements/${bannerMiddle.image}`}
                      alt={bannerMiddle.title || "Advertisement"}
                      style={{
                        width: "100%",
                        maxWidth: "100%",
                        height: "auto",
                        display: "block",
                        margin: 0,
                        padding: 0,
                      }}
                    />
                  </a>
                </div>
              )}

              <div className="row">
                <div className="col-md-6">
                  <NewsLetter className="white_bg border-radious5" />
                  <Sports />
                </div>
                <div className="col-md-6">
                  <MostViewThree />
                </div>
              </div>
            </div>
            <div className="col-xl-4 d-md-none d-xl-block col-md-12">
              <div className="row">
                <div className="col-md-6 col-lg-12">
                  <FollowUs
                    title="Contact Us"
                    className="border-radious5 white_bg padding20 sm-mt30"
                  />
                </div>
                <div className="col-md-6 col-lg-12">
                  <International />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="space-70" />
    </>
  );
}

export default HomeTwo;
