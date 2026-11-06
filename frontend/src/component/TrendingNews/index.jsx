import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import Heading from "../uiStyle/Heading";
import TrendingNewsSlider from "../TrendingNewsSlider";
import FontAwesome from "../uiStyle/FontAwesome";

const API = "https://api.bharat19express.com";

const TrendingNews = ({ dark }) => {
  const [trendingNews, setTrendingNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getTrendingNews();
  }, []);

  const getTrendingNews = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/api/news/trending?limit=6`);
      const data = await res.json();

      if (data.status) {
        setTrendingNews(data.data || []);
      } else {
        setError("Unable to load trending news.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const renderNews = (news) =>
    news.map((item) => (
      <div key={item._id}>
        <div className="single_post widgets_small">
          <div className="post_img">
            <div className="img_wrap">
              <img
                loading="lazy"
                src={
                  item.thumbnail
                    ? `${API}/uploads/images/${item.thumbnail}`
                    : "/images/no-image.jpg"
                }
                alt={item.title}
                style={{
                  width: "120px",
                  height: "90px",
                  objectFit: "cover",
                }}
              />
            </div>

            {/* <span className="tranding">
              <FontAwesome name="bolt" />
            </span> */}
          </div>

          <div className="single_post_text">
            <div className="meta2">
              <Link
                to={
                  item.categories?.[0]
                    ? `/category/${item.categories[0]._id}`
                    : "#"
                }
              >
                {item.categories?.[0]?.name || "News"}
              </Link>

              <span>
                {item.createdAt &&
                  new Date(item.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
              </span>
            </div>

            <h4>
              <Link to={`/${item.categories?.[0]?.slug}/${item.slug}`}>
                {item.title}
              </Link>
            </h4>
          </div>
        </div>

        <div className="space-15" />

        {dark ? (
          <div className="border_white" />
        ) : (
          <div className="border_black" />
        )}

        <div className="space-15" />
      </div>
    ));

  if (loading) {
    return (
      <>
        <Heading title="Trending News" />
        <p className="text-center py-5">Loading...</p>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Heading title="Trending News" />
        <p className="text-danger text-center py-5">{error}</p>
      </>
    );
  }

  return (
    <>
      <Heading title="Trending News" />

      <TrendingNewsSlider />

      {dark ? (
        <div className="border_white" />
      ) : (
        <div className="border_black" />
      )}

      <div className="space-30" />

      <div className="row">
        <div className="col-lg-6">{renderNews(trendingNews.slice(0, 3))}</div>

        <div className="col-lg-6">{renderNews(trendingNews.slice(3, 6))}</div>
      </div>
    </>
  );
};

export default TrendingNews;

TrendingNews.propTypes = {
  dark: PropTypes.bool,
};
