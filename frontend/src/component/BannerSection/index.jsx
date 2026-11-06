import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const BannerSection = ({ className }) => {
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    getBanner();
  }, []);

  const getBanner = async () => {
    try {
      const res = await fetch(
        "https://api.bharat19express.com/api/advertisements",
      );

      const result = await res.json();

      if (result.success) {
        const homeTop = result.data
          .filter((item) => item.position === "homepage_middle" && item.status === true)
          .sort((a, b) => (a.priority || 0) - (b.priority || 0))[0];

        setBanner(homeTop || null);
      }
    } catch (err) {
      console.error("Advertisement Error:", err);
      setBanner(null);
    }
  };

  if (!banner) return null;

  return (
    <>
      <div className={className || ""}>
        <div className="banner-container-custom mb20 mt20">
          <a
            href={banner.redirectUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="banner-link-custom"
          >
            <img
              src={`https://api.bharat19express.com/uploads/advertisements/${banner.image}`}
              alt={banner.title || "Advertisement"}
              className="banner-image-custom"
            />
          </a>
        </div>
      </div>

      <style>
        {`
          .banner-container-custom {
            width: 100%;
            max-width: 1215px;
            margin-left: auto;
            margin-right: auto;
            padding-left: 0;
            padding-right: 0;
          }

          .banner-link-custom {
            display: block;
            width: 100%;
            margin: 0;
            padding: 0;
          }

          .banner-image-custom {
            display: block;
            width: 100%;
            max-width: 100%;
            height: 100px;
            object-fit: cover;
            margin: 0;
            padding: 0;
          }

          @media (max-width: 1250px) {
            .banner-container-custom {
              width: calc(100% - 30px);
            }
          }

          @media (max-width: 767px) {
            .banner-image-custom {
              height: 80px;
            }

            .banner-container-custom {
              width: calc(100% - 20px);
            }
          }

          @media (max-width: 480px) {
            .banner-image-custom {
              height: 70px;
            }
          }
        `}
      </style>
    </>
  );
};

BannerSection.propTypes = {
  className: PropTypes.string,
};

export default BannerSection;
