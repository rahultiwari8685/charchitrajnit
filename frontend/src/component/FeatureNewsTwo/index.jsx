// import React, { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import { Link } from "react-router-dom";
// import Slider from "../Slider";
// import FontAwesome from "../uiStyle/FontAwesome";

// const FeatureNewsTwo = () => {
//   const [politicsNews, setPoliticsNews] = useState([]);
//   const { i18n, t } = useTranslation();

//   useEffect(() => {
//     getPoliticsNews();
//   }, [i18n.resolvedLanguage]);

//   const getPoliticsNews = async () => {
//     try {
//       const language = i18n.resolvedLanguage || "en";

//       const res = await fetch(
//         `https://api.bharat19express.com/api/news/category/6ab3d6db40046655dd2db091?limit=10&lang=${language}`,
//       );

//       const data = await res.json();

//       console.log("Politics News API:", data);

//       if (data.status && Array.isArray(data.data)) {
//         const news = data.data
//           .filter((item) => Number(item.videoType) === 2)
//           .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//           .slice(0, 6);

//         setPoliticsNews(news);
//       }
//     } catch (error) {
//       console.error("Politics News Error:", error);
//     }
//   };

//   if (!politicsNews.length) return null;

//   return (
//     <>
//       <div className="feature3 mb30">
//         {/* HEADING */}
//         <div className="row">
//           <div className="col-12">
//             <div className="heading padding20 white_bg mb20 border-radious5">
//               <h3 className="widget-title margin0">
//                 {t("politics", "Politics")}
//               </h3>
//             </div>
//           </div>
//         </div>

//         {/* CAROUSEL */}
//         <div className="feature3_carousel owl-carousel nav_style1">
//           <Slider
//             navigation={{
//               nextEl: ".swiper-button-next4",
//               prevEl: ".swiper-button-prev4",
//             }}
//             slidesPerView={3}
//             spaceBetween={25}
//             breakpoints={{
//               1024: {
//                 slidesPerView: 3,
//                 spaceBetween: 25,
//               },
//               768: {
//                 slidesPerView: 2,
//                 spaceBetween: 25,
//               },
//               640: {
//                 slidesPerView: 2,
//                 spaceBetween: 20,
//               },
//               320: {
//                 slidesPerView: 1,
//                 spaceBetween: 0,
//               },
//             }}
//           >
//             {politicsNews.map((item) => {
//               const newsUrl = `/news/${item.slug}`;

//               const category = item.categories?.[0];

//               const image = item.thumbnail
//                 ? `https://api.bharat19express.com/uploads/images/${item.thumbnail}`
//                 : "";

//               return (
//                 <div
//                   key={item._id}
//                   className="single_post type19 border-radious5 white_bg"
//                 >
//                   {/* IMAGE */}
//                   <div className="post_img">
//                     <div className="img_wrap">
//                       <Link to={newsUrl}>
//                         {image && (
//                           <img
//                             src={image}
//                             alt={item.title}
//                             style={{
//                               width: "100%",
//                               height: "220px",
//                               objectFit: "cover",
//                             }}
//                           />
//                         )}
//                       </Link>
//                     </div>

//                     {/* CATEGORY */}
//                     <span className="batch3 date">
//                       {category?.name || t("politics", "Politics")}
//                     </span>
//                   </div>

//                   {/* TITLE */}
//                   <div className="single_post_text padding20">
//                     <p className="post-p">
//                       <Link to={newsUrl}>{item.title}</Link>
//                     </p>
//                   </div>
//                 </div>
//               );
//             })}
//           </Slider>

//           {/* NAVIGATION */}
//           <div className="navBtns">
//             <div className="navBtn prevtBtn swiper-button-prev4">
//               <FontAwesome name="angle-left" />
//             </div>

//             <div className="navBtn nextBtn swiper-button-next4">
//               <FontAwesome name="angle-right" />
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default FeatureNewsTwo;

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Slider from "../Slider";
import FontAwesome from "../uiStyle/FontAwesome";

const FeatureNewsTwo = () => {
  const [politicsNews, setPoliticsNews] = useState([]);
  const { i18n, t } = useTranslation();

  const getCategoryName = (category) => {
    if (!category) return t("politics", "Politics");

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
    getPoliticsNews();
  }, [i18n.resolvedLanguage]);

  const getPoliticsNews = async () => {
    try {
      const language = i18n.resolvedLanguage || "en";

      const res = await fetch(
        `https://api.bharat19express.com/api/news/category/6ab3d6db40046655dd2db091?limit=10&lang=${language}`,
      );

      if (!res.ok) {
        throw new Error(`API request failed: ${res.status}`);
      }

      const data = await res.json();

      console.log("Politics News API:", data);

      if (data.status && Array.isArray(data.data)) {
        const news = data.data
          .filter((item) => Number(item.videoType) === 2)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 6);

        setPoliticsNews(news);
      } else {
        setPoliticsNews([]);
      }
    } catch (error) {
      console.error("Politics News Error:", error);
      setPoliticsNews([]);
    }
  };

  if (!politicsNews.length) return null;

  return (
    <div className="feature3 mb30">
      {/* HEADING */}
      <div className="row">
        <div className="col-12">
          <div className="heading padding20 white_bg mb20 border-radious5">
            <h3 className="widget-title margin0">
              {t("politics", "Politics")}
            </h3>
          </div>
        </div>
      </div>

      {/* CAROUSEL */}
      <div className="feature3_carousel owl-carousel nav_style1">
        <Slider
          navigation={{
            nextEl: ".swiper-button-next4",
            prevEl: ".swiper-button-prev4",
          }}
          slidesPerView={3}
          spaceBetween={25}
          breakpoints={{
            1024: {
              slidesPerView: 3,
              spaceBetween: 25,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 25,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            320: {
              slidesPerView: 1,
              spaceBetween: 0,
            },
          }}
        >
          {politicsNews.map((item) => {
            const newsUrl = `/news/${item.slug}`;
            const category = item.categories?.[0];

            const image = item.thumbnail
              ? `https://api.bharat19express.com/uploads/images/${item.thumbnail}`
              : "";

            return (
              <div
                key={item._id}
                className="single_post type19 border-radious5 white_bg"
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
                            height: "220px",
                            objectFit: "cover",
                          }}
                        />
                      )}
                    </Link>
                  </div>

                  {/* LANGUAGE-WISE CATEGORY */}
                  <span className="batch3 date">
                    {getCategoryName(category)}
                  </span>
                </div>

                {/* TITLE */}
                <div className="single_post_text padding20">
                  <p className="post-p">
                    <Link to={newsUrl}>{item.title}</Link>
                  </p>
                </div>
              </div>
            );
          })}
        </Slider>

        {/* NAVIGATION */}
        <div className="navBtns">
          <div className="navBtn prevtBtn swiper-button-prev4">
            <FontAwesome name="angle-left" />
          </div>

          <div className="navBtn nextBtn swiper-button-next4">
            <FontAwesome name="angle-right" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureNewsTwo;
