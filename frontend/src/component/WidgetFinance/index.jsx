// import React, { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import FontAwesome from "../uiStyle/FontAwesome";
// import { Link } from "react-router-dom";

// const WidgetFinance = () => {
//   const { i18n, t } = useTranslation();

//   const [worldNews, setWorldNews] = useState([]);

//   useEffect(() => {
//     getWorldNews();
//   }, [i18n.resolvedLanguage]);

//   const getWorldNews = async () => {
//     try {
//       const language = i18n.resolvedLanguage || "en";

//       const res = await fetch(
//         `https://api.bharat19express.com/api/news/category/6ab51bfc302ad805145eb3ad?limit=10&lang=${language}`,
//       );

//       const data = await res.json();

//       console.log("World News API:", data);
//       console.log("Current Language:", language);

//       if (data.status && Array.isArray(data.data)) {
//         const news = data.data
//           .filter((item) => Number(item.videoType) === 2)
//           .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//           .slice(0, 4);

//         setWorldNews(news);
//       }
//     } catch (error) {
//       console.error("World News Error:", error);
//     }
//   };

//   if (!worldNews.length) return null;

//   return (
//     <div className="finance mb30 white_bg border-radious5 padding20 sm-mt30">
//       {/* HEADING */}
//       <div className="heading">
//         <h3 className="widget-title">{t("world", "World")}</h3>
//       </div>

//       {/* WORLD NEWS */}
//       {worldNews.map((item) => {
//         const newsUrl = `/news/${item.slug}`;

//         const image = item.thumbnail
//           ? `https://api.bharat19express.com/uploads/images/${item.thumbnail}`
//           : "";

//         return (
//           <div key={item._id} className="single_post mb30 type18">
//             {/* IMAGE */}
//             <div className="post_img">
//               <div className="img_wrap">
//                 <Link to={newsUrl}>
//                   {image && (
//                     <img
//                       src={image}
//                       alt={item.title}
//                       style={{
//                         width: "100%",
//                         height: "220px",
//                         objectFit: "cover",
//                       }}
//                     />
//                   )}
//                 </Link>
//               </div>

//               {/* DATE */}
//               <span className="batch3 date">
//                 {item.createdAt
//                   ? new Date(item.createdAt).toLocaleDateString("en-US", {
//                       day: "numeric",
//                       month: "short",
//                       year: "numeric",
//                     })
//                   : ""}
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

//               <div className="space-10" />

//               {/* DESCRIPTION */}
//               <p className="post-p">
//                 {item.subtitle
//                   ? item.subtitle.length > 150
//                     ? `${item.subtitle.substring(0, 150)}...`
//                     : item.subtitle
//                   : ""}
//               </p>

//               {/* META */}
//               <ul className="mt20 like_cm">
//                 {/* VIEWS */}
//                 <li>
//                   <Link to={newsUrl}>
//                     <FontAwesome name="eye" /> {item.views || 0}
//                   </Link>
//                 </li>

//                 {/* HEART */}
//                 <li>
//                   <Link to={newsUrl}>
//                     <FontAwesome name="heart" /> {item.shares || 0}
//                   </Link>
//                 </li>

//                 {/* SHARE */}
//                 <li>
//                   <Link to={newsUrl}>
//                     <FontAwesome name="share" /> {item.shares || 0}
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         );
//       })}

//       {/* SHOW MORE */}
//       <Link to="/category/world" className="showmore">
//         {t("showMore", "Show more")}
//       </Link>
//     </div>
//   );
// };

// export default WidgetFinance;

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FontAwesome from "../uiStyle/FontAwesome";
import { Link } from "react-router-dom";

const WidgetFinance = () => {
  const { i18n, t } = useTranslation();

  const [worldNews, setWorldNews] = useState([]);

  useEffect(() => {
    getWorldNews();
  }, [i18n.resolvedLanguage]);

  const getWorldNews = async () => {
    try {
      const language = i18n.resolvedLanguage || "en";

      const res = await fetch(
        `https://api.bharat19express.com/api/news/category/6ab51bfc302ad805145eb3ad?limit=10&lang=${language}`,
      );

      if (!res.ok) {
        throw new Error(`API request failed: ${res.status}`);
      }

      const data = await res.json();

      console.log("World News API:", data);
      console.log("Current Language:", language);

      if (data.status && Array.isArray(data.data)) {
        const news = data.data
          .filter((item) => Number(item.videoType) === 2)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 5);

        setWorldNews(news);
      } else {
        setWorldNews([]);
      }
    } catch (error) {
      console.error("World News Error:", error);
      setWorldNews([]);
    }
  };

  if (!worldNews.length) return null;

  return (
    <div className="finance mb30 white_bg border-radious5 padding20 sm-mt30">
      {/* LANGUAGE-WISE HEADING */}
      <div className="heading">
        <h3 className="widget-title">{t("world", "World")}</h3>
      </div>

      {/* WORLD NEWS */}
      {worldNews.map((item) => {
        const newsUrl = `/news/${item.slug}`;

        const image = item.thumbnail
          ? `https://api.bharat19express.com/uploads/images/${item.thumbnail}`
          : "";

        return (
          <div key={item._id} className="single_post mb30 type18">
            {/* IMAGE */}
            <div className="post_img">
              <div className="img_wrap">
                <Link to={newsUrl}>
                  {image && (
                    <img
                      src={image}
                      alt={item.title}
                      style={{
                        width: "100%",
                        height: "220px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </Link>
              </div>

              {/* LANGUAGE-BASED DATE */}
              <span className="batch3 date">
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

              {/* <div className="space-10" /> */}

              {/* DESCRIPTION */}
              <p className="post-p">
                {item.subtitle
                  ? item.subtitle.length > 150
                    ? `${item.subtitle.substring(0, 150)}...`
                    : item.subtitle
                  : ""}
              </p>

              {/* META */}
              <ul className="mt20 like_cm">
                {/* VIEWS */}
                <li>
                  <Link to={newsUrl}>
                    <FontAwesome name="eye" /> {item.views || 0}
                  </Link>
                </li>

                {/* HEART */}
                <li>
                  <Link to={newsUrl}>
                    <FontAwesome name="heart" /> {item.shares || 0}
                  </Link>
                </li>

                {/* SHARE */}
                <li>
                  <Link to={newsUrl}>
                    <FontAwesome name="share" /> {item.shares || 0}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        );
      })}

      {/* LANGUAGE-WISE SHOW MORE */}
      {/* <Link to="/category/world" className="showmore">
        {t("showMore", "Show more")}
      </Link> */}
    </div>
  );
};

export default WidgetFinance;
