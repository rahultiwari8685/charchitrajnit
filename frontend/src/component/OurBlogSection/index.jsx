// import React, { useEffect, useState } from "react";
// import ProtoTypes from "prop-types";

// import { Link } from "react-router-dom";

// const OurBlogSection = ({ dark }) => {
//   const API = "https://api.bharat19express.com";

//   const [blogs, setBlogs] = useState([]);

//   useEffect(() => {
//     getLatestNews();
//   }, []);

//   const getLatestNews = async () => {
//     try {
//       const res = await fetch(`${API}/api/news/getAllNews?limit=3`);
//       const data = await res.json();

//       if (data.status) {
//         const videoPosts = data.data.filter((item) => item.videoType === 2);

//         setBlogs(videoPosts);
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const getYoutubeId = (url) => {
//     if (!url) return "";

//     const regExp =
//       /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;

//     const match = url.match(regExp);

//     return match && match[1].length === 11 ? match[1] : "";
//   };

//   return (
//     <div className={`${dark ? "primay_bg" : "fourth_bg"} padding6030`}>
//       <div className="container">
//         <div className="row">
//           <div className="col-12">
//             <div className="heading">
//               <h2 className="widget-title">Our Latest News</h2>
//             </div>
//           </div>
//         </div>
//         <div className="row justify-content-center">
//           {blogs.slice(0, 6).map((item) => (
//             <div className="col-md-6 col-lg-4">
//               <div className="single_post post_type3 mb30">
//                 <div className="post_img">
//                   <Link to={`/${item.categories?.[0]?.slug}/${item.slug}`}>
//                     <img
//                       src={
//                         item.thumbnail
//                           ? `${API}/uploads/images/${item.thumbnail}`
//                           : item.youtubeUrl
//                             ? `https://img.youtube.com/vi/${getYoutubeId(
//                                 item.youtubeUrl,
//                               )}/hqdefault.jpg`
//                             : "/images/no-image.jpg"
//                       }
//                       alt={item.title}
//                     />
//                   </Link>
//                 </div>
//                 <div className="single_post_text">
//                   <div className="meta3">
//                     <Link to={`/${item.categories?.[0]?.slug}/${item.slug}`}>
//                       {item.categories?.[0]?.name}
//                     </Link>
//                     <Link to={`/${item.categories?.[0]?.slug}/${item.slug}`}>
//                       {new Date(item.createdAt).toLocaleDateString()}
//                     </Link>
//                   </div>
//                   <h4>
//                     <Link to={`/${item.categories?.[0]?.slug}/${item.slug}`}>
//                       {item.title}
//                     </Link>
//                   </h4>
//                   <div className="space-10" />
//                   <p className="post-p">{item.subtitle}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OurBlogSection;

// OurBlogSection.propTypes = {
//   dark: ProtoTypes.bool,
// };

import React, { useEffect, useState } from "react";
import ProtoTypes from "prop-types";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const API = "https://api.bharat19express.com";

const OurBlogSection = ({ dark }) => {
  const { i18n, t } = useTranslation();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const language = i18n.resolvedLanguage || "en";

  useEffect(() => {
    getLatestNews();
  }, [language]);

  const getLatestNews = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API}/api/news/getAllNews?limit=3&lang=${language}`,
      );

      const data = await res.json();

      if (data.status && Array.isArray(data.data)) {
        const videoPosts = data.data.filter(
          (item) => Number(item.videoType) === 2,
        );

        setBlogs(videoPosts);
      } else {
        setBlogs([]);
      }
    } catch (err) {
      console.log("OurBlogSection API Error:", err);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const getYoutubeId = (url) => {
    if (!url) return "";

    const regExp =
      /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;

    const match = url.match(regExp);

    return match && match[1].length === 11 ? match[1] : "";
  };

  const formatDate = (date) => {
    if (!date) return "";

    const localeMap = {
      en: "en-IN",
      hi: "hi-IN",
      ur: "ur-PK",
      bn: "bn-IN",
      mr: "mr-IN",
    };

    return new Date(date).toLocaleDateString(localeMap[language] || "en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className={`${dark ? "primay_bg" : "fourth_bg"} padding6030`}>
      <div className="container">
        {/* HEADING */}
        <div className="row">
          <div className="col-12">
            <div className="heading">
              <h2 className="widget-title">
                {t("ourLatestNews", "Our Latest News")}
              </h2>
            </div>
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="row">
            <div className="col-12 text-center py-3">
              {t("loading", "Loading...")}
            </div>
          </div>
        ) : blogs.length === 0 ? (
          /* NO NEWS */
          <div className="row">
            <div className="col-12 text-center py-3">
              {t("noNews", "No news available")}
            </div>
          </div>
        ) : (
          /* NEWS */
          <div className="row justify-content-center">
            {blogs.slice(0, 6).map((item, index) => {
              const category = item.categories?.[0];

              const newsUrl = category?.slug
                ? `/${category.slug}/${item.slug}`
                : `/news/${item.slug}`;

              return (
                <div className="col-md-6 col-lg-4" key={item._id || index}>
                  <div className="single_post post_type3 mb30">
                    {/* IMAGE */}
                    <div className="post_img">
                      <Link to={newsUrl}>
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
                          alt={item.title || t("news", "News")}
                        />
                      </Link>
                    </div>

                    {/* CONTENT */}
                    <div className="single_post_text">
                      {/* CATEGORY + DATE */}
                      <div className="meta3">
                        <Link to={newsUrl}>
                          {category?.name || t("news", "News")}
                        </Link>

                        <Link to={newsUrl}>{formatDate(item.createdAt)}</Link>
                      </div>

                      {/* TITLE */}
                      <h4>
                        <Link to={newsUrl}>{item.title}</Link>
                      </h4>

                      <div className="space-10" />

                      {/* DESCRIPTION */}
                      <p className="post-p">
                        {item.subtitle ||
                          item.description ||
                          item.shortDescription ||
                          t(
                            "readLatestNews",
                            "Read the latest news and updates.",
                          )}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OurBlogSection;

OurBlogSection.propTypes = {
  dark: ProtoTypes.bool,
};
