// import React from "react";
// import ProtoTypes from "prop-types";
// import { Link } from "react-router-dom";
// import FontAwesome from "../uiStyle/FontAwesome";
// import Slider from "../Slider";

// const TrendingCarousel = ({ news = [] }) => {
//   if (!news.length) return null;

//   return (
//     <div className="popular_carousel multipleRowCarousel nav_style1">
//       <Slider
//         navigation={{
//           nextEl: ".swiper-button-next16",
//           prevEl: ".swiper-button-prev16",
//         }}
//         slidesPerView={1}
//         grid={{
//           rows: 6,
//         }}
//       >
//         {news.map((item, i) => {
//           const newsUrl = `/news/${item.slug}`;

//           const category = item.categories?.[0];

//           const image = item.thumbnail
//             ? `https://api.bharat19express.com/uploads/images/${item.thumbnail}`
//             : "";

//           return (
//             <div
//               key={item._id}
//               className={`single_post type10 type16 widgets_small ${
//                 i + 2 < news.length ? "mb15" : ""
//               }`}
//             >
//               {/* IMAGE */}
//               <div className="post_img">
//                 <div className="img_wrap">
//                   <Link to={newsUrl}>
//                     {image && (
//                       <img
//                         src={image}
//                         alt={item.title}
//                         style={{
//                           width: "100%",
//                           height: "80px",
//                           objectFit: "cover",
//                         }}
//                       />
//                     )}
//                   </Link>
//                 </div>
//               </div>

//               {/* CONTENT */}
//               <div className="single_post_text">
//                 <h4>
//                   <Link to={newsUrl}>
//                     {item.title?.length > 70
//                       ? `${item.title.substring(0, 70)}...`
//                       : item.title}
//                   </Link>
//                 </h4>

//                 <div className="meta4">
//                   <Link
//                     to={category?.slug ? `/category/${category.slug}` : "#"}
//                   >
//                     {category?.name || "Uttar Pradesh"}
//                   </Link>
//                 </div>

//                 {i + 2 < news.length && (
//                   <>
//                     <div className="space-10" />
//                     <div className="border_black" />
//                     <div className="space-10" />
//                   </>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </Slider>

//       {/* NAVIGATION */}
//       <div className="navBtns">
//         <div className="navBtn prevtBtn swiper-button-prev16">
//           <FontAwesome name="angle-left" />
//         </div>

//         <div className="navBtn nextBtn swiper-button-next16">
//           <FontAwesome name="angle-right" />
//         </div>
//       </div>
//     </div>
//   );
// };

// TrendingCarousel.propTypes = {
//   news: ProtoTypes.array,
// };

// export default TrendingCarousel;

import React from "react";
import ProtoTypes from "prop-types";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FontAwesome from "../uiStyle/FontAwesome";
import Slider from "../Slider";

const TrendingCarousel = ({ news = [] }) => {
  const { t } = useTranslation();

  const getCategoryName = (category) => {
    if (!category) return t("uttarPradesh", "Uttar Pradesh");

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

  if (!news.length) return null;

  return (
    <div className="popular_carousel multipleRowCarousel nav_style1">
      <Slider
        navigation={{
          nextEl: ".swiper-button-next16",
          prevEl: ".swiper-button-prev16",
        }}
        slidesPerView={1}
        grid={{
          rows: 6,
        }}
      >
        {news.map((item, i) => {
          const newsUrl = `/news/${item.slug}`;
          const category = item.categories?.[0];

          const image = item.thumbnail
            ? `https://api.bharat19express.com/uploads/images/${item.thumbnail}`
            : "";

          return (
            <div
              key={item._id}
              className={`single_post type10 type16 widgets_small ${
                i + 2 < news.length ? "mb15" : ""
              }`}
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
                          width: "100%",
                          height: "80px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </Link>
                </div>
              </div>

              {/* CONTENT */}
              <div className="single_post_text">
                <h4>
                  <Link to={newsUrl}>
                    {item.title?.length > 70
                      ? `${item.title.substring(0, 70)}...`
                      : item.title}
                  </Link>
                </h4>

                <div className="meta4">
                  <Link
                    to={category?.slug ? `/category/${category.slug}` : "#"}
                  >
                    {getCategoryName(category)}
                  </Link>
                </div>

                {i + 2 < news.length && (
                  <>
                    <div className="space-10" />
                    <div className="border_black" />
                    <div className="space-10" />
                  </>
                )}
              </div>
            </div>
          );
        })}
      </Slider>

      {/* NAVIGATION */}
      <div className="navBtns">
        <div className="navBtn prevtBtn swiper-button-prev16">
          <FontAwesome name="angle-left" />
        </div>

        <div className="navBtn nextBtn swiper-button-next16">
          <FontAwesome name="angle-right" />
        </div>
      </div>
    </div>
  );
};

TrendingCarousel.propTypes = {
  news: ProtoTypes.array,
};

export default TrendingCarousel;
