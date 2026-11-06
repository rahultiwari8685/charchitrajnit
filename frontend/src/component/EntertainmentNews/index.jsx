import React from "react";
import ProtoTypes from "prop-types";
import { Link } from "react-router-dom";

const EntertainmentNews = ({ entertainments }) => {
  return (
    <>
      {entertainments.map((item) => (
        <div key={item._id} className="col-lg-6">
          <div className="single_post post_type3 mb30">
            <div className="post_img">
              <div className="img_wrap">
                <Link to={`/${item.categories?.[0]?.slug}/${item.slug}`}>
                  <img
                    src={`https://api.bharat19express.com/uploads/images/${item.thumbnail}`}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "260px",
                      objectFit: "cover",
                    }}
                  />
                </Link>
              </div>
            </div>

            <div className="single_post_text">
              <div className="meta3">
                <Link to="#">{item.categories?.[0]?.name || "News"}</Link>

                <Link to="#">
                  {new Date(item.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Link>
              </div>

              <h4>
                <Link to={`/${item.categories?.[0]?.slug}/${item.slug}`}>
                  {item.title}
                </Link>
              </h4>

              <div className="space-10" />

              <p className="post-p">
                {item.subtitle ? item.subtitle.substring(0, 120) + "..." : ""}
              </p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default EntertainmentNews;

EntertainmentNews.propTypes = {
  entertainments: ProtoTypes.array,
};
