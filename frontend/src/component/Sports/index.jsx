// import React, { useEffect, useState } from "react";
// import FontAwesome from "../uiStyle/FontAwesome";
// import { Link } from "react-router-dom";

// const API = "https://api.bharat19express.com";

// const Sports = () => {
//   const [sports, setSports] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchSportsNews();
//   }, []);

//   const fetchSportsNews = async () => {
//     try {
//       const res = await fetch(
//         `${API}/api/news/category/6ab8fe27302ad805145ed91f?limit=10`,
//       );

//       const data = await res.json();

//       if (data.status && Array.isArray(data.data)) {
//         const news = data.data
//           // Published news
//           .filter((item) => Number(item.type) === 1)
//           // Video news
//           .filter((item) => Number(item.videoType) === 2)
//           // Latest first
//           .sort(
//             (a, b) =>
//               new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
//           )
//           .slice(0, 6);

//         setSports(news);
//       }
//     } catch (error) {
//       console.error("Sports News API Error:", error);
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
//       <div className="sport_side3 white_bg padding20 border-radious5">
//         <h3 className="widget-title">Sports</h3>

//         <div className="text-center py-3">Loading...</div>
//       </div>
//     );
//   }

//   if (sports.length === 0) {
//     return (
//       <div className="sport_side3 white_bg padding20 border-radious5">
//         <h3 className="widget-title">Sports</h3>

//         <div className="text-center py-3">No sports news available</div>
//       </div>
//     );
//   }

//   const featured = sports[0];

//   const remainingNews = sports.slice(1);

//   const featuredImage = featured.thumbnail
//     ? `${API}/uploads/images/${featured.thumbnail}`
//     : "/images/no-image.jpg";

//   const featuredUrl = `/news/${featured.slug}`;

//   return (
//     <div className="sport_side3 white_bg padding20 border-radious5">
//       <h3 className="widget-title">Sports</h3>

//       <div className="single_post mb30 type18">
//         <div className="post_img">
//           <div className="img_wrap">
//             <Link to={featuredUrl}>
//               <img src={featuredImage} alt={featured.title || "Sports News"} />
//             </Link>
//           </div>

//           {/* DATE */}
//           <span className="batch3 date">{formatDate(featured.createdAt)}</span>
//         </div>

//         <div className="single_post_text">
//           <h4>
//             <Link to={featuredUrl}>{featured.title}</Link>
//           </h4>

//           <div className="space-10" />

//           <p className="post-p">
//             {featured.description
//               ? featured.description.length > 180
//                 ? `${featured.description.substring(0, 180)}...`
//                 : featured.description
//               : featured.shortDescription
//                 ? featured.shortDescription.length > 180
//                   ? `${featured.shortDescription.substring(0, 180)}...`
//                   : featured.shortDescription
//                 : "Read the latest sports news and updates."}
//           </p>

//           <ul className="mt20 like_cm">
//             <li>
//               <Link to={featuredUrl}>
//                 <FontAwesome name="eye" /> {featured.views || 0}
//               </Link>
//             </li>

//             <li>
//               <Link to={featuredUrl}>
//                 <FontAwesome name="heart" /> {featured.likes || 0}
//               </Link>
//             </li>
//           </ul>
//         </div>
//       </div>

//       {remainingNews.map((item, i) => {
//         const image = item.thumbnail
//           ? `${API}/uploads/images/${item.thumbnail}`
//           : "/images/no-image.jpg";

//         const newsUrl = `/news/${item.slug}`;

//         const category = item.categories?.[0];

//         return (
//           <div
//             key={item._id || i}
//             className="single_post type10 type16 widgets_small mb15"
//           >
//             {/* IMAGE */}
//             <div className="post_img">
//               <div className="img_wrap">
//                 <Link to={newsUrl}>
//                   <img src={image} alt={item.title || "Sports News"} />
//                 </Link>
//               </div>
//             </div>

//             {/* CONTENT */}
//             <div className="single_post_text">
//               {/* TITLE */}
//               <h4>
//                 <Link to={newsUrl}>
//                   {item.title?.length > 75
//                     ? `${item.title.substring(0, 75)}...`
//                     : item.title}
//                 </Link>
//               </h4>

//               {/* CATEGORY */}
//               <p className="meta meta2">
//                 <Link to={category?.slug ? `/category/${category.slug}` : "#"}>
//                   {category?.name || "Sports"}
//                 </Link>
//               </p>

//               {/* SEPARATOR */}
//               {i + 1 < remainingNews.length && (
//                 <>
//                   <div className="space-5" />
//                   <div className="border_black" />
//                   <div className="space-15" />
//                 </>
//               )}
//             </div>
//           </div>
//         );
//       })}

//       <div className="space-20" />

//       {/* SHOW MORE */}
//       <Link to="/category/sports" className="showmore">
//         Show more
//       </Link>
//     </div>
//   );
// };

// export default Sports;

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FontAwesome from "../uiStyle/FontAwesome";
import { Link } from "react-router-dom";

const API = "https://api.bharat19express.com";

const Sports = () => {
  const { i18n, t } = useTranslation();

  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSportsNews();
  }, [i18n.resolvedLanguage]);

  const fetchSportsNews = async () => {
    try {
      setLoading(true);

      const language = i18n.resolvedLanguage || "en";

      const res = await fetch(
        `${API}/api/news/category/6ab8fe27302ad805145ed91f?limit=10&lang=${language}`,
      );

      const data = await res.json();

      console.log("Sports News API:", data);
      console.log("Current Language:", language);

      if (data.status && Array.isArray(data.data)) {
        const news = data.data
          // Published news
          .filter((item) => Number(item.type) === 1)
          // Video news
          .filter((item) => Number(item.videoType) === 2)
          // Latest first
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 7);

        setSports(news);
      } else {
        setSports([]);
      }
    } catch (error) {
      console.error("Sports News API Error:", error);
      setSports([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    const language = i18n.resolvedLanguage || "en";

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

  if (loading) {
    return (
      <div className="sport_side3 white_bg padding20 border-radious5">
        <h3 className="widget-title">{t("sports", "Sports")}</h3>

        <div className="text-center py-3">{t("loading", "Loading...")}</div>
      </div>
    );
  }

  if (sports.length === 0) {
    return (
      <div className="sport_side3 white_bg padding20 border-radious5">
        <h3 className="widget-title">{t("sports", "Sports")}</h3>

        <div className="text-center py-3">
          {t("noSportsNews", "No sports news available")}
        </div>
      </div>
    );
  }

  const featured = sports[0];

  const remainingNews = sports.slice(1);

  const featuredImage = featured.thumbnail
    ? `${API}/uploads/images/${featured.thumbnail}`
    : "/images/no-image.jpg";

  const featuredUrl = `/news/${featured.slug}`;

  const featuredCategory = featured.categories?.[0];

  return (
    <div className="sport_side3 white_bg padding20 border-radious5">
      {/* HEADING */}
      <h3 className="widget-title">{t("sports", "Sports")}</h3>

      {/* FEATURED NEWS */}
      <div className="single_post mb30 type18">
        <div className="post_img">
          <div className="img_wrap">
            <Link to={featuredUrl}>
              <img
                src={featuredImage}
                alt={featured.title || t("sportsNews", "Sports News")}
              />
            </Link>
          </div>

          {/* DATE */}
          <span className="batch3 date">{formatDate(featured.createdAt)}</span>
        </div>

        <div className="single_post_text">
          {/* TITLE */}
          <h4>
            <Link to={featuredUrl}>{featured.title}</Link>
          </h4>

          <div className="space-10" />

          {/* DESCRIPTION */}
          <p className="post-p">
            {featured.description
              ? featured.description.length > 180
                ? `${featured.description.substring(0, 180)}...`
                : featured.description
              : featured.shortDescription
                ? featured.shortDescription.length > 180
                  ? `${featured.shortDescription.substring(0, 180)}...`
                  : featured.shortDescription
                : featured.subtitle
                  ? featured.subtitle.length > 180
                    ? `${featured.subtitle.substring(0, 180)}...`
                    : featured.subtitle
                  : t(
                      "latestSportsUpdates",
                      "Read the latest sports news and updates.",
                    )}
          </p>

          {/* META */}
          {/* <ul className="mt20 like_cm">
            <li>
              <Link to={featuredUrl}>
                <FontAwesome name="eye" /> {featured.views || 0}
              </Link>
            </li>

            <li>
              <Link to={featuredUrl}>
                <FontAwesome name="heart" /> {featured.likes || 0}
              </Link>
            </li>
          </ul> */}
        </div>
      </div>

      {/* REMAINING NEWS */}
      {remainingNews.map((item, i) => {
        const image = item.thumbnail
          ? `${API}/uploads/images/${item.thumbnail}`
          : "/images/no-image.jpg";

        const newsUrl = `/news/${item.slug}`;

        const category = item.categories?.[0];

        return (
          <div
            key={item._id || i}
            className="single_post type10 type16 widgets_small mb15"
          >
            {/* IMAGE */}
            <div className="post_img">
              <div className="img_wrap">
                <Link to={newsUrl}>
                  <img
                    src={image}
                    alt={item.title || t("sportsNews", "Sports News")}
                  />
                </Link>
              </div>
            </div>

            {/* CONTENT */}
            <div className="single_post_text">
              {/* TITLE */}
              <h4>
                <Link to={newsUrl}>
                  {item.title?.length > 75
                    ? `${item.title.substring(0, 75)}...`
                    : item.title}
                </Link>
              </h4>

              {/* CATEGORY */}
              <p className="meta meta2">
                <Link to={category?.slug ? `/category/${category.slug}` : "#"}>
                  {category?.name || t("sports", "Sports")}
                </Link>
              </p>

              {/* SEPARATOR */}
              {i + 1 < remainingNews.length && (
                <>
                  <div className="space-5" />
                  <div className="border_black" />
                  <div className="space-15" />
                </>
              )}
            </div>
          </div>
        );
      })}

      {/* <div className="space-20" /> */}

      {/* SHOW MORE */}
      <Link to="/category/sports" className="showmore">
        {t("showMore", "Show more")}
      </Link>
    </div>
  );
};

export default Sports;
