// import React, { useEffect, useState } from "react";
// import ProtoTypes from "prop-types";
// import FontAwesome from "../uiStyle/FontAwesome";
// import { Link } from "react-router-dom";

// const API = "https://api.bharat19express.com";

// const getYoutubeId = (url) => {
//   if (!url) return "";

//   const regExp =
//     /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;

//   const match = url.match(regExp);

//   return match && match[1].length === 11 ? match[1] : "";
// };

// const WidgetTrendingNews = ({ dark }) => {
//   const [news, setNews] = useState([]);

//   useEffect(() => {
//     getTrendingNews();
//   }, []);

//   const getTrendingNews = async () => {
//     try {
//       const res = await fetch(`${API}/api/news/trending?limit=4`);
//       const data = await res.json();

//       // if (data.status) {
//       //   setNews(data.data);
//       // }

//       if (data.status) {
//         const videoPosts = data.data.filter((item) => item.videoType === 2);

//         setNews(videoPosts);
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   if (news.length === 0) return null;

//   const firstNews = news[0];
//   const otherNews = news.slice(1);

//   return (
//     <div className="trending_widget mb30">
//       <h2 className="widget-title">Trending News</h2>

//       {/* First Big News */}

//       <div className="single_post post_type3">
//         <div className="post_img">
//           <div className="img_wrap">
//             <Link to={`/news/${firstNews.slug}`}>
//               <img
//                 src={
//                   firstNews.thumbnail
//                     ? `${API}/uploads/images/${firstNews.thumbnail}`
//                     : `https://img.youtube.com/vi/${getYoutubeId(
//                         firstNews.youtubeUrl,
//                       )}/hqdefault.jpg`
//                 }
//                 alt={firstNews.title}
//               />
//             </Link>
//           </div>

//           <span className="tranding">
//             <FontAwesome name="bolt" />
//           </span>
//         </div>

//         <div className="single_post_text">
//           <div className="meta3">
//             <Link to={`/category/${firstNews.categories?.[0]?._id}`}>
//               {firstNews.categories?.[0]?.name}
//             </Link>

//             <Link to="#">
//               {new Date(firstNews.createdAt).toLocaleDateString()}
//             </Link>
//           </div>

//           <h4>
//             <Link to={`/news/${firstNews.slug}`}>{firstNews.title}</Link>
//           </h4>

//           <div className="space-10" />

//           <p className="post-p">{firstNews.subtitle?.slice(0, 120)}...</p>
//         </div>
//       </div>

//       {/* Remaining News */}

//       {otherNews.map((item) => (
//         <div key={item._id}>
//           <div className="space-15" />

//           {dark ? (
//             <div className="border_white" />
//           ) : (
//             <div className="border_black" />
//           )}

//           <div className="space-30" />

//           <div className="single_post widgets_small">
//             <div className="post_img">
//               <div className="img_wrap">
//                 <Link to={`/${item.categories?.[0]?.slug}/${item.slug}`}>
//                   <img
//                     src={
//                       item.thumbnail
//                         ? `${API}/uploads/images/${item.thumbnail}`
//                         : `https://img.youtube.com/vi/${getYoutubeId(
//                             item.youtubeUrl,
//                           )}/hqdefault.jpg`
//                     }
//                     alt={item.title}
//                   />
//                 </Link>
//               </div>

//               <span className="tranding">
//                 <FontAwesome name="bolt" />
//               </span>
//             </div>

//             <div className="single_post_text">
//               <div className="meta2">
//                 <Link to={`/category/${item.categories?.[0]?._id}`}>
//                   {item.categories?.[0]?.name}
//                 </Link>

//                 <Link to="#">
//                   {new Date(item.createdAt).toLocaleDateString()}
//                 </Link>
//               </div>

//               <h4>
//                 <Link to={`/${item.categories?.[0]?.slug}/${item.slug}`}>
//                   {item.title}
//                 </Link>
//               </h4>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default WidgetTrendingNews;

// WidgetTrendingNews.propTypes = {
//   dark: ProtoTypes.bool,
// };

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import FontAwesome from "../uiStyle/FontAwesome";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const API = "https://api.bharat19express.com";

const getYoutubeId = (url) => {
  if (!url) return "";

  const regExp =
    /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;

  const match = url.match(regExp);

  return match && match[1].length === 11 ? match[1] : "";
};

const WidgetTrendingNews = ({ dark }) => {
  const { t, i18n } = useTranslation();

  const [news, setNews] = useState([]);

  useEffect(() => {
    getTrendingNews();
  }, [i18n.resolvedLanguage]);

  const getTrendingNews = async () => {
    try {
      const language = i18n.resolvedLanguage || "en";

      const res = await fetch(
        `${API}/api/news/trending?limit=4&lang=${language}`,
      );

      const data = await res.json();

      if (data.status) {
        const videoPosts = data.data.filter((item) => item.videoType === 2);

        setNews(videoPosts);
      } else {
        setNews([]);
      }
    } catch (err) {
      console.log("Trending News Error:", err);
      setNews([]);
    }
  };

  if (news.length === 0) return null;

  const firstNews = news[0];
  const otherNews = news.slice(1);

  return (
    <div className="trending_widget mb30">
      <h2 className="widget-title">{t("trending") || "Trending News"}</h2>

      {/* First Big News */}

      <div className="single_post post_type3">
        <div className="post_img">
          <div className="img_wrap">
            <Link to={`/news/${firstNews.slug}`}>
              <img
                src={
                  firstNews.thumbnail
                    ? `${API}/uploads/images/${firstNews.thumbnail}`
                    : `https://img.youtube.com/vi/${getYoutubeId(
                        firstNews.youtubeUrl,
                      )}/hqdefault.jpg`
                }
                alt={firstNews.title}
              />
            </Link>
          </div>

          <span className="tranding">
            <FontAwesome name="bolt" />
          </span>
        </div>

        <div className="single_post_text">
          <div className="meta3">
            <Link to={`/category/${firstNews.categories?.[0]?._id}`}>
              {firstNews.categories?.[0]?.name}
            </Link>

            <Link to="#">
              {new Date(firstNews.createdAt).toLocaleDateString()}
            </Link>
          </div>

          <h4>
            <Link to={`/news/${firstNews.slug}`}>{firstNews.title}</Link>
          </h4>

          <div className="space-10" />

          <p className="post-p">
            {firstNews.subtitle?.slice(0, 120)}
            {firstNews.subtitle?.length > 120 ? "..." : ""}
          </p>
        </div>
      </div>

      {/* Remaining News */}

      {otherNews.map((item) => (
        <div key={item._id}>
          <div className="space-15" />

          {dark ? (
            <div className="border_white" />
          ) : (
            <div className="border_black" />
          )}

          <div className="space-30" />

          <div className="single_post widgets_small">
            <div className="post_img">
              <div className="img_wrap">
                <Link to={`/news/${item.slug}`}>
                  <img
                    src={
                      item.thumbnail
                        ? `${API}/uploads/images/${item.thumbnail}`
                        : `https://img.youtube.com/vi/${getYoutubeId(
                            item.youtubeUrl,
                          )}/hqdefault.jpg`
                    }
                    alt={item.title}
                  />
                </Link>
              </div>

              <span className="tranding">
                <FontAwesome name="bolt" />
              </span>
            </div>

            <div className="single_post_text">
              <div className="meta2">
                <Link to={`/category/${item.categories?.[0]?._id}`}>
                  {item.categories?.[0]?.name}
                </Link>

                <Link to="#">
                  {new Date(item.createdAt).toLocaleDateString()}
                </Link>
              </div>

              <h4>
                <Link to={`/news/${item.slug}`}>{item.title}</Link>
              </h4>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WidgetTrendingNews;

WidgetTrendingNews.propTypes = {
  dark: PropTypes.bool,
};
