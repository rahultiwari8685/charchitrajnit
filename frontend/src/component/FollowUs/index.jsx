// import React from "react";
// import ProtoTypes from "prop-types";
// import { Link } from "react-router-dom";
// import FontAwesome from "../uiStyle/FontAwesome";

// const FollowUs = ({ className = "", title }) => {
//   return (
//     <div className={`follow_box widget mb30 ${className}`}>
//       <h2 className="widget-title">{title}</h2>
//       <div className="social_shares">
//         <Link className="single_social social_facebook" to="#">
//           <span className="follow_icon">
//             <FontAwesome name="facebook-f" />
//           </span>
//           34,456 <span className="icon_text">Fans</span>
//         </Link>
//         <Link className="single_social social_twitter" to="#">
//           <span className="follow_icon">
//             <FontAwesome name="twitter" />
//           </span>
//           34,456 <span className="icon_text">Followers</span>
//         </Link>
//         <Link className="single_social social_youtube" to="#">
//           <span className="follow_icon">
//             <FontAwesome name="youtube" />
//           </span>
//           34,456 <span className="icon_text">Subscribers</span>
//         </Link>
//         <Link className="single_social social_instagram" to="#">
//           <span className="follow_icon">
//             <FontAwesome name="instagram" />
//           </span>
//           34,456 <span className="icon_text">Followers</span>
//         </Link>
//         <Link className="single_social social_vimeo" to="#">
//           <span className="follow_icon">
//             <FontAwesome name="vimeo" />
//           </span>
//           34,456 <span className="icon_text">Followers</span>
//         </Link>
//         <Link className="single_social social_medium" to="#">
//           <span className="follow_icon">
//             <FontAwesome name="medium" />
//           </span>
//           34,456 <span className="icon_text">Followers</span>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default FollowUs;

// FollowUs.propTypes = {
//   className: ProtoTypes.string,
//   title: ProtoTypes.string,
// };

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import FontAwesome from "../uiStyle/FontAwesome";

const API = "https://api.bharat19express.com";

const socialPlatforms = [
  {
    key: "facebook",
    label: "Facebook",
    icon: "facebook-f",
    className: "social_facebook",
    text: "Follow us on Facebook",
  },
  {
    key: "twitter",
    label: "Twitter / X",
    icon: "twitter",
    className: "social_twitter",
    text: "Follow us on Twitter",
  },
  {
    key: "youtube",
    label: "YouTube",
    icon: "youtube",
    className: "social_youtube",
    text: "Subscribe on YouTube",
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: "instagram",
    className: "social_instagram",
    text: "Follow us on Instagram",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: "linkedin",
    className: "social_linkedin",
    text: "Connect on LinkedIn",
  },
];

const FollowUs = ({ className = "", title = "Follow Us" }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchSettings = async () => {
      try {
        const response = await fetch(`${API}/api/site-settings`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Settings request failed: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.data) {
          setSettings(result.data);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Follow Us Settings Error:", error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchSettings();

    return () => controller.abort();
  }, []);

  const activePlatforms = socialPlatforms.filter((platform) => {
    const url = settings?.[platform.key];

    return typeof url === "string" && url.trim() !== "";
  });

  return (
    <>
      <style>{`
  .follow-us-widget {
    width: 100%;
    min-width: 0;
    padding: 20px;
    box-sizing: border-box;
    background: #fff;
    border: 1px solid #e9edf2;
    border-radius: 10px;
    box-shadow: 0 4px 16px rgba(20, 35, 55, 0.05);
  }

  .follow-us-widget .widget-title {
    margin: 0 0 18px;
    color: #17212b;
    font-size: 22px;
    font-weight: 700;
    line-height: 1.35;
  }

  .follow-us-widget .social_shares {
    display: grid !important;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    width: 100%;
    margin: 0;
  }

  .follow-us-widget .social_shares .single_social {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    justify-content: flex-start !important;
    gap: 10px !important;

    width: 100%;
    min-width: 0;
    min-height: 48px;
    margin: 0 !important;
    padding: 8px 10px !important;
    box-sizing: border-box;

    border: none;
    border-radius: 7px;
    color: #fff !important;
    font-size: 13px;
    font-weight: 600;
    line-height: 1.3;
    text-decoration: none !important;
    white-space: nowrap;
    overflow: hidden;

    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .follow-us-widget .social_shares .single_social:hover {
    color: #fff !important;
    transform: translateY(-2px);
    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.14);
  }

  .follow-us-widget .social_shares .follow_icon {
    position: static !important;
    float: none !important;
    transform: none !important;

    display: flex !important;
    align-items: center !important;
    justify-content: center !important;

    flex: 0 0 30px !important;
    width: 30px !important;
    min-width: 30px;
    height: 30px;
    margin: 0 !important;
    padding: 0 !important;
    box-sizing: border-box;

    border-radius: 6px;
    background: rgba(255, 255, 255, 0.18);
    color: #fff;
    font-size: 15px;
  }

  .follow-us-widget .social_shares .social-name {
    position: static !important;
    float: none !important;

    display: block !important;
    flex: 1 1 auto;
    min-width: 0;
    margin: 0 !important;
    padding: 0 !important;

    color: inherit;
    font-size: 13px;
    font-weight: 600;
    line-height: 1.3;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .follow-us-widget .social_facebook {
    background: #1877f2;
  }

  .follow-us-widget .social_twitter {
    background: #263746;
  }

  .follow-us-widget .social_youtube {
    background: #e62117;
  }

  .follow-us-widget .social_instagram {
    background: linear-gradient(120deg, #833ab4, #c13584);
  }

  .follow-us-widget .social_linkedin {
    background: #0a66c2;
  }

  .follow-us-widget .follow-us-loading,
  .follow-us-widget .follow-us-empty {
    margin: 0;
    color: #697586;
    font-size: 14px;
    line-height: 1.5;
  }

  @media (max-width: 480px) {
    .follow-us-widget {
      padding: 16px;
    }

    .follow-us-widget .social_shares {
      grid-template-columns: minmax(0, 1fr);
      gap: 10px;
    }

    .follow-us-widget .social_shares .single_social {
      min-height: 46px;
    }

    .follow-us-widget .social_shares .social-name {
      white-space: nowrap;
      overflow-wrap: normal;
      text-overflow: clip;
    }
  }
`}</style>

      <div className={`follow-us-widget follow_box widget mb30 ${className}`}>
        <h2 className="widget-title">{title}</h2>

        {loading ? (
          <p className="follow-us-loading">Loading social links...</p>
        ) : activePlatforms.length > 0 ? (
          <div className="social_shares">
            {activePlatforms.map((platform) => (
              <a
                key={platform.key}
                className={`single_social ${platform.className}`}
                href={settings[platform.key].trim()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={platform.text}
                title={platform.text}
              >
                <span className="follow_icon">
                  <FontAwesome name={platform.icon} />
                </span>

                <span className="social-name">{platform.label}</span>
              </a>
            ))}
          </div>
        ) : (
          <p className="follow-us-empty">
            Social links are currently unavailable.
          </p>
        )}
      </div>
    </>
  );
};

FollowUs.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
};

export default FollowUs;
