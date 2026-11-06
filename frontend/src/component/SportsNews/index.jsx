import React, { useEffect, useState } from "react";
import ProtoTypes from "prop-types";
import { Link } from "react-router-dom";
import FontAwesome from "../uiStyle/FontAwesome";
import SportsCarousel from "../SportsCarousel";

const SportsNews = ({ dark }) => {
  const [sportsNews, setSportsNews] = useState([]);

  useEffect(() => {
    getSportsNews();
  }, []);

  const getSportsNews = async () => {
    try {
      const res = await fetch(
        "https://api.bharat19express.com/api/news/category/6ab51bfc302ad805145eb3ad?limit=10",
      );

      const data = await res.json();

      if (data.status) {
        const videoPosts = data.data.filter((item) => item.videoType === 2);

        setSportsNews(videoPosts);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (!sportsNews.length) return null;

  const featured = sportsNews[0];
  const carouselNews = sportsNews.slice(1);

  return (
    <div className="row">
      <div className="col-12">
        <div className="sports">
          <div className="row">
            <div className="col-12">
              <div className="heading">
                <h2 className="widget-title">World News</h2>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Left Featured */}
            <div className="col-md-6">
              <div className="single_post post_type3 mb30">
                <div className="post_img">
                  <Link to={`/news/${featured.slug}`}>
                    <img
                      src={`https://api.bharat19express.com/uploads/images/${featured.thumbnail}`}
                      alt={featured.title}
                      style={{
                        width: "100%",
                        height: "300px",
                        objectFit: "cover",
                      }}
                    />
                  </Link>

                  {/* <span className="tranding">
                    <FontAwesome name="bolt" />
                  </span> */}
                </div>

                <div className="single_post_text">
                  <div className="meta3">
                    <Link to="#">{featured.categories?.[0]?.name}</Link>

                    <Link to="#">
                      {new Date(featured.createdAt).toLocaleDateString()}
                    </Link>
                  </div>

                  <h4>
                    <Link to={`/news/${featured.slug}`}>{featured.title}</Link>
                  </h4>

                  <div className="space-10" />

                  <p className="post-p">
                    {featured.subtitle?.substring(0, 140)}...
                  </p>

                  <div className="space-20" />

                  <Link to={`/news/${featured.slug}`} className="readmore">
                    Read More
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Slider */}
            <div className="col-md-6">
              <div className="sports_carousel nav_style1">
                <SportsCarousel dark={dark} sportsNews={carouselNews} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SportsNews;

SportsNews.propTypes = {
  dark: ProtoTypes.bool,
};
