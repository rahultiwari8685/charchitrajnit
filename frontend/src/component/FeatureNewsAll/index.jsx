import React from "react";
import ProtoTypes from "prop-types";
import { Link } from "react-router-dom";

const API = "https://api.bharat19express.com";

const getYoutubeId = (url) => {
  if (!url) return "";

  const regExp =
    /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;

  const match = url.match(regExp);

  return match && match[1].length === 11 ? match[1] : "";
};

const FeatureNewsAll = ({ features = [] }) => {
  return (
    <div className="row justify-content-center">
      {features.map((item) => (
        <div key={item._id} className="col-lg-6">
          <div className="single_post post_type6 post_type7 mb30">
            <div className="post_img gradient1">
              <Link to={`/${item.categories?.[0]?.slug}/${item.slug}`}>
                <img
                  src={
                    item.thumbnail
                      ? `${API}/uploads/images/${item.thumbnail}`
                      : item.youtubeUrl
                        ? `https://img.youtube.com/vi/${getYoutubeId(
                            item.youtubeUrl,
                          )}/hqdefault.jpg`
                        : "/images/no-image.jpg"
                  }
                  alt={item.title}
                />
              </Link>
            </div>

            <div className="single_post_text">
              <div className="meta5">
                <Link to={`/category/${item.categories?.[0]?._id}`}>
                  {item.categories?.[0]?.name}
                </Link>

                <Link to="#">
                  {new Date(item.createdAt).toLocaleDateString()}
                </Link>
              </div>

              <h4>
                <Link to={`/${item.categories?.[0]?.slug}/${item.slug}`}>
                  {item.title}
                </Link>
              </h4>

              {/* {item.subtitle && (
                <>
                  <div className="space-10" />
                  <p>{item.subtitle}</p>
                </>
              )}  */}
            </div>
          </div>
        </div>
      ))}

      {features.length === 0 && (
        <div className="col-12 text-center">
          <h5>No News Found</h5>
        </div>
      )}
    </div>
  );
};

export default FeatureNewsAll;

FeatureNewsAll.propTypes = {
  features: ProtoTypes.array,
};
