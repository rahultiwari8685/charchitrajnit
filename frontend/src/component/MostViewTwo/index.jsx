// import React, { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import ProtoTypes from "prop-types";
// import { Link } from "react-router-dom";
// import FontAwesome from "../uiStyle/FontAwesome";
// import Slider from "../Slider";

// const MostViewTwo = ({ title }) => {
//   const { i18n, t } = useTranslation();

//   const [mostView, setMostView] = useState([]);

//   useEffect(() => {
//     getPopularNews();
//   }, [i18n.resolvedLanguage]);

//   const getPopularNews = async () => {
//     try {
//       const language = i18n.resolvedLanguage || "en";

//       const res = await fetch(
//         `https://api.bharat19express.com/api/news/popular?limit=10&lang=${language}`,
//       );

//       const data = await res.json();

//       console.log("Most View API:", data);

//       if (data.status && Array.isArray(data.data)) {
//         const videoPosts = data.data
//           .filter((item) => Number(item.videoType) === 2)
//           .slice(0, 10);

//         setMostView(videoPosts);
//       }
//     } catch (error) {
//       console.error("Most View Error:", error);
//     }
//   };

//   if (!mostView.length) return null;

//   return (
//     <div className="most_widget3 padding20 white_bg border-radious5 mb30 sm-mt30">
//       {/* HEADING */}
//       <div className="heading">
//         <h2 className="widget-title">{title || t("mostView", "Most View")}</h2>
//       </div>

//       <div className="post_type2_carousel multipleRowCarousel pt12_wrapper nav_style1">
//         {/* CAROUSEL */}
//         <Slider
//           navigation={{
//             nextEl: ".swiper-button-next9",
//             prevEl: ".swiper-button-prev9",
//           }}
//           slidesPerView={1}
//           grid={{
//             rows: 6,
//           }}
//         >
//           {mostView.map((item, index) => {
//             const category = item.categories?.[0];

//             const newsUrl = `/news/${item.slug}`;

//             const image = item.thumbnail
//               ? `https://api.bharat19express.com/uploads/images/${item.thumbnail}`
//               : "";

//             return (
//               <div
//                 key={item._id}
//                 className="single_post widgets_small type8 type17"
//               >
//                 {/* IMAGE */}
//                 <div className="post_img">
//                   <div className="img_wrap">
//                     <Link to={newsUrl}>
//                       {image && (
//                         <img
//                           src={image}
//                           alt={item.title}
//                           style={{
//                             width: "90px",
//                             height: "70px",
//                             objectFit: "cover",
//                           }}
//                         />
//                       )}
//                     </Link>
//                   </div>
//                 </div>

//                 {/* CONTENT */}
//                 <div className="single_post_text">
//                   {/* CATEGORY + DATE */}
//                   <div className="meta2">
//                     <Link
//                       to={category?.slug ? `/category/${category.slug}` : "#"}
//                     >
//                       {category?.name || t("news", "News")}
//                     </Link>

//                     <Link to={newsUrl}>
//                       {item.createdAt
//                         ? new Date(item.createdAt).toLocaleDateString("en-US", {
//                             day: "numeric",
//                             month: "short",
//                             year: "numeric",
//                           })
//                         : ""}
//                     </Link>
//                   </div>

//                   {/* TITLE */}
//                   <h4>
//                     <Link to={newsUrl}>
//                       {item.title?.length > 70
//                         ? `${item.title.substring(0, 70)}...`
//                         : item.title}
//                     </Link>
//                   </h4>
//                 </div>

//                 {/* NUMBER */}
//                 <div className="type8_count">
//                   <h2>{index + 1}</h2>
//                 </div>

//                 {/* SEPARATOR */}
//                 {index + 1 < mostView.length && (
//                   <>
//                     <div className="space-15" />
//                     <div className="border_black" />
//                     <div className="space-15" />
//                   </>
//                 )}
//               </div>
//             );
//           })}
//         </Slider>

//         {/* NAVIGATION */}
//         <div className="navBtns">
//           <div className="navBtn prevtBtn swiper-button-prev9">
//             <FontAwesome name="angle-left" />
//           </div>

//           <div className="navBtn nextBtn swiper-button-next9">
//             <FontAwesome name="angle-right" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MostViewTwo;

// MostViewTwo.propTypes = {
//   title: ProtoTypes.string,
// };

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ProtoTypes from "prop-types";
import { Link } from "react-router-dom";
import FontAwesome from "../uiStyle/FontAwesome";
import Slider from "../Slider";

const MostViewTwo = ({ title }) => {
  const { i18n, t } = useTranslation();

  const [mostView, setMostView] = useState([]);

  // Translate category names according to selected language
  const getCategoryName = (category) => {
    if (!category) return t("news", "News");

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
    getPopularNews();
  }, [i18n.resolvedLanguage]);

  const getPopularNews = async () => {
    try {
      const language = i18n.resolvedLanguage || "en";

      const res = await fetch(
        `https://api.bharat19express.com/api/news/popular?limit=10&lang=${language}`,
      );

      if (!res.ok) {
        throw new Error(`API request failed: ${res.status}`);
      }

      const data = await res.json();

      console.log("Most View API:", data);

      if (data.status && Array.isArray(data.data)) {
        const videoPosts = data.data
          .filter((item) => Number(item.videoType) === 2)
          .slice(0, 10);

        setMostView(videoPosts);
      } else {
        setMostView([]);
      }
    } catch (error) {
      console.error("Most View Error:", error);
      setMostView([]);
    }
  };

  if (!mostView.length) return null;

  return (
    <div className="most_widget3 padding20 white_bg border-radious5 mb30 sm-mt30">
      {/* LANGUAGE-WISE HEADING */}
      <div className="heading">
        {/* <h2 className="widget-title">
          {title || t("mostView", "Most Viewed")}
        </h2> */}

        <h2 className="widget-title">{t("mostView", "Most Viewed")}</h2>
      </div>

      <div className="post_type2_carousel multipleRowCarousel pt12_wrapper nav_style1">
        <Slider
          navigation={{
            nextEl: ".swiper-button-next9",
            prevEl: ".swiper-button-prev9",
          }}
          slidesPerView={1}
          grid={{
            rows: 6,
          }}
        >
          {mostView.map((item, index) => {
            const category = item.categories?.[0];
            const newsUrl = `/news/${item.slug}`;

            const image = item.thumbnail
              ? `https://api.bharat19express.com/uploads/images/${item.thumbnail}`
              : "";

            return (
              <div
                key={item._id}
                className="single_post widgets_small type8 type17"
              >
                {/* IMAGE */}
                <div className="post_img">
                  <div className="img_wrap">
                    <Link to={newsUrl}>
                      {image && (
                        <img
                          src={image}
                          alt={item.title}
                          style={{
                            width: "90px",
                            height: "70px",
                            objectFit: "cover",
                          }}
                        />
                      )}
                    </Link>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="single_post_text">
                  {/* LANGUAGE-WISE CATEGORY + DATE */}
                  <div className="meta2">
                    <Link
                      to={category?.slug ? `/category/${category.slug}` : "#"}
                    >
                      {getCategoryName(category)}
                    </Link>

                    <Link to={newsUrl}>
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
                    </Link>
                  </div>

                  {/* TITLE */}
                  <h4>
                    <Link to={newsUrl}>
                      {item.title?.length > 70
                        ? `${item.title.substring(0, 70)}...`
                        : item.title}
                    </Link>
                  </h4>
                </div>

                {/* NUMBER */}
                <div className="type8_count">
                  <h2>{index + 1}</h2>
                </div>

                {/* SEPARATOR */}
                {index + 1 < mostView.length && (
                  <>
                    <div className="space-15" />
                    <div className="border_black" />
                    <div className="space-15" />
                  </>
                )}
              </div>
            );
          })}
        </Slider>

        {/* NAVIGATION */}
        <div className="navBtns">
          <div className="navBtn prevtBtn swiper-button-prev9">
            <FontAwesome name="angle-left" />
          </div>

          <div className="navBtn nextBtn swiper-button-next9">
            <FontAwesome name="angle-right" />
          </div>
        </div>
      </div>
    </div>
  );
};

MostViewTwo.propTypes = {
  title: ProtoTypes.string,
};

export default MostViewTwo;
