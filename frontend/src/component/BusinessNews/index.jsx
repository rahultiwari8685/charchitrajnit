import React from "react";
import ProtoTypes from "prop-types";
import { Link } from "react-router-dom";

const BusinessNews = ({ businessNews, headerHide }) => {
  return (
    <div className="row">
      <div className="col-12">
        <div className="businerss_news">
          {!headerHide && (
            <div className="row">
              <div className="col-6 align-self-center">
                <h2 className="widget-title">National News</h2>
              </div>

              <div className="col-6 text-end align-self-center">
                <Link to="/business" className="see_all mb20">
                  See All
                </Link>
              </div>
            </div>
          )}

          <div className="row">
            <div className="col-12">
              {businessNews.map((item) => (
                <div
                  key={item._id}
                  className="single_post post_type3 post_type12 mb30"
                >
                  <div className="post_img">
                    <div className="img_wrap">
                      <Link to={`/${item.categories?.[0]?.slug}/${item.slug}`}>
                        <img
                          src={`https://api.bharat19express.com/uploads/images/${item.thumbnail}`}
                          alt={item.title}
                          style={{
                            width: "100%",
                            height: "220px",
                            objectFit: "cover",
                          }}
                        />
                      </Link>
                    </div>
                  </div>

                  <div className="single_post_text">
                    <div className="meta3">
                      <Link to="#">
                        {item.categories?.[0]?.name || "Business"}
                      </Link>

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
                      {item.subtitle
                        ? item.subtitle.substring(0, 140) + "..."
                        : ""}
                    </p>

                    <div className="space-20" />

                    <Link to={`/news/${item.slug}`} className="readmore">
                      Read More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessNews;

BusinessNews.propTypes = {
  businessNews: ProtoTypes.array,
  headerHide: ProtoTypes.bool,
};
