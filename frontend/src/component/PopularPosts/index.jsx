import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FontAwesome from "../uiStyle/FontAwesome";
import Slider from "../Slider";
import "./style.scss";

const PopularPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPopularPosts();
  }, []);

  const getPopularPosts = async () => {
    try {
      const res = await fetch(
        "https://api.bharat19express.com/api/news/popular?limit=8",
      );

      const data = await res.json();

      // if (data.status) {
      //   setPosts(data.data);
      // }
      if (data.status) {
        const videoPosts = data.data.filter((item) => item.videoType === 2);

        setPosts(videoPosts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="popular_carousel_area mb30 md-mt-30">
      <h2 className="widget-title">Popular Posts</h2>

      <div className="popular_carousel pt-15 multipleRowCarousel nav_style1">
        <Slider
          navigation={{
            nextEl: ".swiper-button-next10",
            prevEl: ".swiper-button-prev10",
          }}
          loop={true}
          slidesPerView={1}
          grid={{
            rows: 6,
          }}
        >
          {posts.map((item, index) => (
            <div
              key={item._id}
              className="single_post type10 widgets_small mb15"
            >
              <div className="post_img">
                <div className="img_wrap">
                  <Link to={`/${item.categories?.[0]?.slug}/${item.slug}`}>
                    <img
                      src={`https://api.bharat19express.com/uploads/images/${item.thumbnail}`}
                      alt={item.title}
                      style={{
                        width: "90px",
                        height: "70px",
                        objectFit: "cover",
                      }}
                    />
                  </Link>
                </div>

                <span className="tranding tranding_border">{index + 1}</span>
              </div>

              <div className="single_post_text">
                <h4>
                  <Link to={`/${item.categories?.[0]?.slug}/${item.slug}`}>
                    {item.title}
                  </Link>
                </h4>

                <div className="meta4">
                  <Link to="#">{item.categories?.[0]?.name || "News"}</Link>
                </div>
              </div>
            </div>
          ))}
        </Slider>

        <div className="navBtns">
          <div className="navBtn prevtBtn swiper-button-prev10">
            <FontAwesome name="angle-left" />
          </div>

          <div className="navBtn nextBtn swiper-button-next10">
            <FontAwesome name="angle-right" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularPosts;
