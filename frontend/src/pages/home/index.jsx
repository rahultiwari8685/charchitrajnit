import React, { useEffect, useState } from "react";
import PostCarousel from "../../component/PostCarousel";
import PostGallery from "../../component/PostGallery";
import FeatureNews from "../../component/FeatureNews";
import TrendingNews from "../../component/TrendingNews";
import FollowUs from "../../component/FollowUs";
import MostView from "../../component/MostView";
import MixCarousel from "../../component/MixCarousel";
import VideoPost from "../../component/VideoPost";
import EntertainmentNews from "../../component/EntertainmentNews";
import SportsNews from "../../component/SportsNews";
import BusinessNews from "../../component/BusinessNews";
import MostShareWidget from "../../component/MostShareWidget";
import UpcomingMatches from "../../component/UpcomingMatches";
import NewsLetter from "../../component/NewsLetter";
import CategoriesWidget from "../../component/CategoriesWidget";

import banner1 from "../../assets/img/ad/ad-1.png";
import banner2 from "../../assets/img/ad/ad-2.jpg";
import { Link } from "react-router-dom";
import { businessNews, entertainments } from "../../data/entertainments";

function Home() {
  const [entertainments, setEntertainments] = useState([]);
  const [businessNews, setBusinessNews] = useState([]);

  const [banners, setBanners] = useState({});

  useEffect(() => {
    getEntertainmentNews();
    getBusinessNews();
    getAdvertisements();
  }, []);

  const getEntertainmentNews = async () => {
    try {
      const res = await fetch(
        "https://api.bharat19express.com/api/news/category/6ab5133ae0146bb0a4a80e48?limit=4",
      );

      const data = await res.json();

      // if (data.status) {
      //   setEntertainments(data.data);
      // }

      if (data.status) {
        const videoPosts = data.data.filter((item) => item.videoType === 2);

        setEntertainments(videoPosts);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getBusinessNews = async () => {
    try {
      const res = await fetch(
        "https://api.bharat19express.com/api/news/category/6ab3e06740046655dd2db1e5?limit=2",
      );

      const data = await res.json();

      // if (data.status) {
      //   setBusinessNews(data.data);
      // }

      if (data.status) {
        const videoPosts = data.data.filter((item) => item.videoType === 2);

        setBusinessNews(videoPosts);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getAdvertisements = async () => {
    try {
      const res = await fetch(
        "https://api.bharat19express.com/api/advertisements",
      );

      const data = await res.json();

      if (data.success) {
        const ads = {};

        data.data.forEach((item) => {
          if (item.status) {
            ads[item.position] = item;
          }
        });

        setBanners(ads);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <PostCarousel className="fifth_bg" />
      {/* <PostGallery className="fifth_bg" /> */}

      {/* <MixCarousel className="half_bg1" /> */}

      <div className="entertrainments">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="row">
                <div className="col-12">
                  <div className="heading">
                    <h2 className="widget-title">Uttar Pradesh</h2>
                  </div>
                </div>
              </div>
              {/*CAROUSEL START*/}
              <div className="entertrainment_carousel mb30">
                <div className="entertrainment_item">
                  <div className="row justify-content-center">
                    <EntertainmentNews entertainments={entertainments} />
                  </div>
                </div>
              </div>
              {/*CAROUSEL END*/}

              <BusinessNews businessNews={businessNews} />
              <SportsNews />
              <div className="banner_area mt50 mb60 xs-mt60">
                {banners.homepage_middle && (
                  <a
                    href={banners.homepage_middle.redirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={`https://api.bharat19express.com/uploads/advertisements/${banners.homepage_middle.image}`}
                      alt={banners.homepage_middle.title}
                      className="img-fluid"
                    />
                  </a>
                )}
              </div>
            </div>
            <div className="col-lg-4">
              <div className="row">
                <div className="col-lg-12">
                  <MostShareWidget title="Most share" />
                </div>
                <FollowUs title="Follow Us" />
                {/* <div className="col-lg-12">
                  <UpcomingMatches />
                </div> */}
                {/* <div className="col-lg-12">
                  <NewsLetter />
                </div> */}
                <div className="col-lg-12">
                  <div className="banner2 mb30">
                    {banners.sidebar && (
                      <a
                        href={banners.sidebar.redirectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={`https://api.bharat19express.com/uploads/advertisements/${banners.sidebar.image}`}
                          alt={banners.sidebar.title}
                          className="img-fluid"
                        />
                      </a>
                    )}
                  </div>
                </div>
                <div className="col-lg-12">
                  <CategoriesWidget />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <VideoPost className="pt30 half_bg60" />
      <FeatureNews />

      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <TrendingNews />
          </div>
          <div className="col-md-12 col-lg-4">
            <div className="col-lg-12">
              <div className="banner2 mb30">
                {banners.sidebar && (
                  <a
                    href={banners.sidebar.redirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={`https://api.bharat19express.com/uploads/advertisements/${banners.sidebar.image}`}
                      alt={banners.sidebar.title}
                      className="img-fluid"
                    />
                  </a>
                )}
              </div>
            </div>

            <MostView />
          </div>
        </div>
      </div>
      <div className="space-70" />
    </>
  );
}

export default Home;
