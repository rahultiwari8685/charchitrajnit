// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import arrow3 from "../../assets/img/icon/arrow3.png";
// import FontAwesome from "../uiStyle/FontAwesome";

// const BusinessNewsTwo = () => {
//   const { i18n, t } = useTranslation();

//   const [businessNews, setBusinessNews] = useState([]);

//   useEffect(() => {
//     getTrendingNews();
//   }, [i18n.resolvedLanguage]);

//   const getTrendingNews = async () => {
//     try {
//       const language = i18n.resolvedLanguage || "en";

//       const res = await fetch(
//         `https://api.bharat19express.com/api/news/popular?limit=6&lang=${language}`,
//       );

//       const data = await res.json();

//       console.log("Trending News API:", data);
//       console.log("Current Language:", language);

//       if (data.status && Array.isArray(data.data)) {
//         const news = data.data
//           .filter((item) => Number(item.videoType) === 2)
//           .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//           .slice(0, 6);

//         setBusinessNews(news);
//       }
//     } catch (error) {
//       console.error("Trending News Error:", error);
//     }
//   };

//   if (!businessNews.length) return null;

//   return (
//     <div className="business3 padding20 mb20 white_bg border-radious5">
//       {/* HEADING */}
//       <h4 className="widget-title">{t("trendingNews", "Trending News")}</h4>

//       {businessNews.map((item, i) => {
//         const newsUrl = `/news/${item.slug}`;

//         const image = item.thumbnail
//           ? `https://api.bharat19express.com/uploads/images/${item.thumbnail}`
//           : "";

//         const category = item.categories?.[0];

//         return (
//           <div key={item._id} className="single_post post_type12 type20">
//             {/* IMAGE */}
//             <div className="post_img border-radious5">
//               <div className="img_wrap">
//                 <Link to={newsUrl}>
//                   {image && (
//                     <img
//                       src={image}
//                       alt={item.title}
//                       style={{
//                         width: "100%",
//                         height: "200px",
//                         objectFit: "cover",
//                       }}
//                     />
//                   )}
//                 </Link>
//               </div>

//               {/* TRENDING ICON */}
//               <span className="tranding border_tranding">
//                 <FontAwesome name="bolt" />
//               </span>
//             </div>

//             {/* CONTENT */}
//             <div className="single_post_text">
//               {/* TITLE */}
//               <h4>
//                 <Link to={newsUrl}>
//                   {item.title?.length > 100
//                     ? `${item.title.substring(0, 100)}...`
//                     : item.title}
//                 </Link>
//               </h4>

//               {/* DATE + SHARE */}
//               <div className="row">
//                 <div className="col-6 align-self-center">
//                   <div className="meta_col">
//                     <p>
//                       {item.createdAt
//                         ? new Date(item.createdAt).toLocaleDateString("en-US", {
//                             day: "numeric",
//                             month: "short",
//                             year: "numeric",
//                           })
//                         : ""}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="col-6 text-right align-self-center">
//                   <ul className="meta_share inline">
//                     {/* BOOKMARK */}
//                     <li>
//                       <Link to={newsUrl}>
//                         <FontAwesome name="bookmark" />
//                       </Link>
//                     </li>

//                     {/* SHARE */}
//                     <li>
//                       <Link to={newsUrl}>
//                         <FontAwesome name="share" />
//                       </Link>
//                     </li>
//                   </ul>
//                 </div>
//               </div>

//               {/* DESCRIPTION */}
//               <p className="post-p">
//                 {item.subtitle
//                   ? item.subtitle.length > 160
//                     ? `${item.subtitle.substring(0, 160)}...`
//                     : item.subtitle
//                   : ""}
//               </p>

//               <div className="space-10" />

//               {/* CATEGORY */}
//               {category && (
//                 <div className="meta_col">
//                   <p>{category.name || t("trendingNews", "Trending News")}</p>
//                 </div>
//               )}

//               {/* READ MORE */}
//               <Link to={newsUrl} className="readmore3">
//                 {t("readMore", "Read more")}

//                 <img src={arrow3} alt="arrow3" />
//               </Link>

//               {/* SEPARATOR */}
//               {i + 1 < businessNews.length && (
//                 <>
//                   <div className="space-10" />
//                   <div className="border_black" />
//                   <div className="space-15" />
//                 </>
//               )}
//             </div>
//           </div>
//         );
//       })}

//       {/* SHOW MORE */}
//       <Link to="/category/trending" className="showmore">
//         {t("showMore", "Show more")}
//       </Link>
//     </div>
//   );
// };

// export default BusinessNewsTwo;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import arrow3 from "../../assets/img/icon/arrow3.png";
import FontAwesome from "../uiStyle/FontAwesome";

const BusinessNewsTwo = () => {
  const { i18n, t } = useTranslation();

  const [businessNews, setBusinessNews] = useState([]);

  // Translate category names according to the selected language
  const getCategoryName = (category) => {
    if (!category) {
      return t("trendingNews", "Trending News");
    }

    const categoryTranslations = {
      "Uttar Pradesh": "uttarPradesh",
      "उत्तर प्रदेश": "uttarPradesh",
      National: "national",
      राष्ट्रीय: "national",
      International: "international",
      अंतरराष्ट्रीय: "international",
      Politics: "politics",
      राजनीति: "politics",
      Entertainment: "entertainment",
      मनोरंजन: "entertainment",
      Sports: "sports",
      खेल: "sports",
      Business: "business",
      व्यापार: "business",
    };

    const key = categoryTranslations[category.name?.trim()];

    return key ? t(key, category.name) : category.name;
  };

  useEffect(() => {
    getTrendingNews();
  }, [i18n.resolvedLanguage]);

  const getTrendingNews = async () => {
    try {
      const language = i18n.resolvedLanguage || "en";

      const res = await fetch(
        `https://api.bharat19express.com/api/news/popular?limit=6&lang=${language}`,
      );

      if (!res.ok) {
        throw new Error(`API request failed: ${res.status}`);
      }

      const data = await res.json();

      console.log("Trending News API:", data);
      console.log("Current Language:", language);

      if (data.status && Array.isArray(data.data)) {
        const news = data.data
          .filter((item) => Number(item.videoType) === 2)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 6);

        setBusinessNews(news);
      } else {
        setBusinessNews([]);
      }
    } catch (error) {
      console.error("Trending News Error:", error);
      setBusinessNews([]);
    }
  };

  if (!businessNews.length) return null;

  return (
    <div className="business3 padding20 mb20 white_bg border-radious5">
      {/* HEADING */}
      <h4 className="widget-title">{t("trendingNews", "Trending News")}</h4>

      {businessNews.map((item, i) => {
        const newsUrl = `/news/${item.slug}`;

        const image = item.thumbnail
          ? `https://api.bharat19express.com/uploads/images/${item.thumbnail}`
          : "";

        const category = item.categories?.[0];

        return (
          <div key={item._id} className="single_post post_type12 type20">
            {/* IMAGE */}
            <div className="post_img border-radious5">
              <div className="img_wrap">
                <Link to={newsUrl}>
                  {image && (
                    <img
                      src={image}
                      alt={item.title}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </Link>
              </div>

              {/* TRENDING ICON */}
              <span className="tranding border_tranding">
                <FontAwesome name="bolt" />
              </span>
            </div>

            {/* CONTENT */}
            <div className="single_post_text">
              {/* TITLE */}
              <h4>
                <Link to={newsUrl}>
                  {item.title?.length > 100
                    ? `${item.title.substring(0, 100)}...`
                    : item.title}
                </Link>
              </h4>

              {/* DATE + SHARE */}
              <div className="row">
                <div className="col-6 align-self-center">
                  <div className="meta_col">
                    <p>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString(
                            i18n.resolvedLanguage || "en",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )
                        : ""}
                    </p>
                  </div>
                </div>

                <div className="col-6 text-right align-self-center">
                  <ul className="meta_share inline">
                    {/* BOOKMARK */}
                    <li>
                      <Link to={newsUrl}>
                        <FontAwesome name="bookmark" />
                      </Link>
                    </li>

                    {/* SHARE */}
                    <li>
                      <Link to={newsUrl}>
                        <FontAwesome name="share" />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* DESCRIPTION */}
              <p className="post-p">
                {item.subtitle
                  ? item.subtitle.length > 160
                    ? `${item.subtitle.substring(0, 160)}...`
                    : item.subtitle
                  : ""}
              </p>

              <div className="space-10" />

              {/* LANGUAGE-WISE CATEGORY */}
              {category && (
                <div className="meta_col">
                  <p>{getCategoryName(category)}</p>
                </div>
              )}

              {/* READ MORE */}
              <Link to={newsUrl} className="readmore3">
                {t("readMore", "Read more")}
                <img src={arrow3} alt="arrow3" />
              </Link>

              {/* SEPARATOR */}
              {i + 1 < businessNews.length && (
                <>
                  <div className="space-10" />
                  <div className="border_black" />
                  <div className="space-15" />
                </>
              )}
            </div>
          </div>
        );
      })}

      {/* SHOW MORE */}
      <Link to="/category/trending" className="showmore">
        {t("showMore", "Show more")}
      </Link>
    </div>
  );
};

export default BusinessNewsTwo;
