// import React, { useEffect, useState } from "react";
// import FontAwesome from "../uiStyle/FontAwesome";
// import { Link } from "react-router-dom";

// const API = "https://api.bharat19express.com";

// const MostViewThree = () => {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchMostView();
//   }, []);

//   const fetchMostView = async () => {
//     try {
//       const res = await fetch(`${API}/api/news/most-shared?limit=10`);
//       const data = await res.json();

//       if (data.status && Array.isArray(data.data)) {
//         const news = data.data
//           // Published news + only text news
//           .filter(
//             (item) => Number(item.type) === 1 && Number(item.videoType) === 2,
//           )
//           // Latest first
//           .sort(
//             (a, b) =>
//               new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
//           )
//           .slice(0, 3);

//         setPosts(news);
//       }
//     } catch (error) {
//       console.error("MostViewThree API Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (date) => {
//     if (!date) return "";

//     return new Date(date).toLocaleDateString("en-IN", {
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//     });
//   };

//   if (loading) {
//     return (
//       <div className="most_view3 white_bg padding20 border-radiuos5">
//         <h3 className="widget-title">Most Share</h3>

//         <div className="text-center py-3">Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="most_view3 white_bg padding20 border-radiuos5">
//       <h3 className="widget-title">Most Share</h3>

//       {posts.length === 0 ? (
//         <div className="text-center py-3">No news available</div>
//       ) : (
//         posts.map((item, i) => {
//           const image = item.thumbnail
//             ? `${API}/uploads/images/${item.thumbnail}`
//             : "";

//           const newsUrl = `/news/${item.slug}`;

//           const category = item.categories?.[0];

//           return (
//             <div key={item._id || i}>
//               <div className="single_post type18">
//                 {/* IMAGE */}
//                 <div className="post_img">
//                   <div className="img_wrap">
//                     <Link to={newsUrl}>
//                       {image && <img src={image} alt={item.title || "News"} />}
//                     </Link>
//                   </div>

//                   {/* DATE */}
//                   <span className="batch3 date">
//                     {formatDate(item.createdAt)}
//                   </span>
//                 </div>

//                 {/* CONTENT */}
//                 <div className="single_post_text">
//                   {/* TITLE */}
//                   <h4>
//                     <Link to={newsUrl}>{item.title}</Link>
//                   </h4>

//                   <div className="space-10" />

//                   {/* DESCRIPTION */}
//                   <p className="post-p">
//                     {item.description
//                       ? item.description.length > 150
//                         ? `${item.description.substring(0, 150)}...`
//                         : item.description
//                       : item.shortDescription
//                         ? item.shortDescription.length > 150
//                           ? `${item.shortDescription.substring(0, 150)}...`
//                           : item.shortDescription
//                         : "Read the latest news and updates."}
//                   </p>

//                   {/* AUTHOR / DATE */}
//                   <div className="view_author_details">
//                     <div className="space-10" />

//                     <div className="row">
//                       {/* AUTHOR */}
//                       <div className="col-6">
//                         <div className="view_author align-self-center">
//                           <FontAwesome name="user-circle mr-1" />

//                           <Link to={newsUrl}>
//                             {item.author?.name ||
//                               item.authorName ||
//                               item.createdBy?.name ||
//                               "Bharat TV Media"}
//                           </Link>
//                         </div>
//                       </div>

//                       {/* DATE */}
//                       <div className="col-6 text-right align-self-center">
//                         <p>{formatDate(item.createdAt)}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* SEPARATOR */}
//               {i + 1 < posts.length && (
//                 <>
//                   <div className="space-20" />
//                   <div className="border_black" />
//                   <div className="space-20" />
//                 </>
//               )}
//             </div>
//           );
//         })
//       )}

//       <div className="space-20" />

//       {/* SHOW MORE */}
//       <Link to="/news" className="showmore">
//         Show more
//       </Link>
//     </div>
//   );
// };

// export default MostViewThree;

import React, { useEffect, useState } from "react";
import FontAwesome from "../uiStyle/FontAwesome";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const API = "https://api.bharat19express.com";

const MostViewThree = () => {
  const { i18n, t } = useTranslation();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const language = i18n.resolvedLanguage || "en";

  useEffect(() => {
    fetchMostView();
  }, [language]);

  const fetchMostView = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API}/api/news/most-shared?limit=10&lang=${language}`,
      );

      const data = await res.json();

      if (data.status && Array.isArray(data.data)) {
        const news = data.data
          // Published news + only text news
          .filter(
            (item) => Number(item.type) === 1 && Number(item.videoType) === 2,
          )
          // Latest first
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 3);

        setPosts(news);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error("MostViewThree API Error:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
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

  const getDescription = (item) => {
    // Prefer translated subtitle from backend
    const description =
      item.subtitle ||
      item.description ||
      item.shortDescription ||
      t("readLatestNews", "Read the latest news and updates.");

    return description.length > 150
      ? `${description.substring(0, 150)}...`
      : description;
  };

  if (loading) {
    return (
      <div className="most_view3 white_bg padding20 border-radiuos5">
        <h3 className="widget-title">{t("mostShare", "Most Share")}</h3>

        <div className="text-center py-3">{t("loading", "Loading...")}</div>
      </div>
    );
  }

  return (
    <div className="most_view3 white_bg padding20 border-radiuos5">
      <h3 className="widget-title">{t("mostShare", "Most Share")}</h3>

      {posts.length === 0 ? (
        <div className="text-center py-3">
          {t("noNewsAvailable", "No news available")}
        </div>
      ) : (
        posts.map((item, i) => {
          const image = item.thumbnail
            ? `${API}/uploads/images/${item.thumbnail}`
            : "";

          const newsUrl = `/news/${item.slug}`;

          const category = item.categories?.[0];

          return (
            <div key={item._id || i}>
              <div className="single_post type18">
                {/* IMAGE */}
                <div className="post_img">
                  <div className="img_wrap">
                    <Link to={newsUrl}>
                      {image && (
                        <img
                          src={image}
                          alt={item.title || t("news", "News")}
                        />
                      )}
                    </Link>
                  </div>

                  {/* DATE */}
                  <span className="batch3 date">
                    {formatDate(item.createdAt)}
                  </span>
                </div>

                {/* CONTENT */}
                <div className="single_post_text">
                  {/* TITLE */}
                  <h4>
                    <Link to={newsUrl}>{item.title}</Link>
                  </h4>

                  <div className="space-10" />

                  {/* DESCRIPTION */}
                  <p className="post-p">{getDescription(item)}</p>
                     <div className="space-10" />

                  {/* AUTHOR / DATE */}
                  <div className="view_author_details">
                    <div className="space-10" />

                    <div className="row">
                      {/* AUTHOR */}
                      <div className="col-6">
                        <div className="view_author align-self-center">
                          <FontAwesome name="user-circle mr-1" />

                          <Link to={newsUrl}>
                            {item.author?.name ||
                              item.authorName ||
                              item.createdBy?.name ||
                              t("bharatTvMedia", "Bharat TV Media")}
                          </Link>
                        </div>
                      </div>

                      {/* DATE */}
                      <div className="col-6 text-right align-self-center">
                        <p>{formatDate(item.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SEPARATOR */}
              {i + 1 < posts.length && (
                <>
                  <div className="space-20" />
                  <div className="border_black" />
                  <div className="space-20" />
                </>
              )}
            </div>
          );
        })
      )}

      <div className="space-20" />

      {/* SHOW MORE */}
      <Link to="/news" className="showmore">
        {t("showMore", "Show more")}
      </Link>
    </div>
  );
};

export default MostViewThree;
