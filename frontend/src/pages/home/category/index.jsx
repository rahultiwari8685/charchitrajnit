// import React, { useState, useEffect } from "react";
// import { Link, useParams } from "react-router-dom";

// import BreadCrumb from "../../../component/BreadCrumb";
// import FontAwesome from "../../../component/uiStyle/FontAwesome";
// import WidgetTab from "../../../component/WidgetTab";
// import WidgetTrendingNews from "../../../component/WidgetTrendingNews";
// import NewsLetter from "../../../component/NewsLetter";
// import FollowUs from "../../../component/FollowUs";
// import FeatureNewsAll from "../../../component/FeatureNewsAll";
// import BannerSection from "../../../component/BannerSection";

// // Image
// import banner2 from "../../../assets/img/ad/ad-2.jpg";

// const API = "https://api.bharat19express.com";

// function Category() {
//   const { categoryId } = useParams();

//   const [news, setNews] = useState([]);
//   const [categoryName, setCategoryName] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchCategoryNews();
//   }, [categoryId]);

//   const fetchCategoryNews = async () => {
//     try {
//       setLoading(true);

//       const res = await fetch(
//         `${API}/api/news/category/${categoryId}?page=1&limit=10`,
//       );

//       const data = await res.json();

//       // if (data.status) {
//       //   setNews(data.data);

//       if (data.status) {
//         const videoPosts = data.data.filter((item) => item.videoType === 2);

//         setNews(videoPosts);

//         if (data.data.length > 0) {
//           const currentCategory = data.data[0].categories.find(
//             (cat) => cat._id === categoryId,
//           );

//           setCategoryName(
//             currentCategory?.name || data.data[0].categories[0].name,
//           );
//         }
//       }
//     } catch (err) {
//       console.log(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="container text-center py-5">
//         <h3>Loading...</h3>
//       </div>
//     );
//   }

//   return (
//     <>
//       <BreadCrumb title={categoryName} />

//       <div className="archives padding-top-30">
//         <div className="container">
//           <div className="row">
//             {/* Left Side */}

//             <div className="col-md-6 col-lg-8">
//               <div className="row">
//                 <div className="col-12">
//                   <div className="categories_title">
//                     <h5>
//                       Category :<Link to="#"> {categoryName}</Link>
//                     </h5>
//                   </div>
//                 </div>
//               </div>

//               <FeatureNewsAll features={news} />
//             </div>

//             {/* Right Side */}

//             <div className="col-md-6 col-lg-4">
//               <WidgetTab categoryId={categoryId} />

//               <WidgetTrendingNews />

//               {/* <NewsLetter />

//               <FollowUs title="Follow Us" />

//               <div className="banner2 mb30">
//                 <Link to="/">
//                   <img src={banner2} alt="banner" />
//                 </Link>
//               </div> */}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="space-70" />

//       <BannerSection />
//     </>
//   );
// }

// export default Category;

import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import BreadCrumb from "../../../component/BreadCrumb";
import FontAwesome from "../../../component/uiStyle/FontAwesome";
import WidgetTab from "../../../component/WidgetTab";
import WidgetTrendingNews from "../../../component/WidgetTrendingNews";
import NewsLetter from "../../../component/NewsLetter";
import FollowUs from "../../../component/FollowUs";
import FeatureNewsAll from "../../../component/FeatureNewsAll";
import BannerSection from "../../../component/BannerSection";

import banner2 from "../../../assets/img/ad/ad-2.jpg";

const API = "https://api.bharat19express.com";

function Category() {
  const { categoryId } = useParams();

  const { t, i18n } = useTranslation();

  const [news, setNews] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryNews();
  }, [categoryId, i18n.resolvedLanguage]);

  const fetchCategoryNews = async () => {
    try {
      setLoading(true);

      const language = i18n.resolvedLanguage || "en";

      const res = await fetch(
        `${API}/api/news/category/${categoryId}?page=1&limit=10&lang=${language}`,
      );

      const data = await res.json();

      if (data.status) {
        const videoPosts = data.data.filter((item) => item.videoType === 2);

        setNews(videoPosts);

        if (data.data.length > 0) {
          const currentCategory = data.data[0].categories?.find(
            (cat) => cat._id === categoryId,
          );

          setCategoryName(
            currentCategory?.name || data.data[0].categories?.[0]?.name || "",
          );
        } else {
          setCategoryName("");
        }
      } else {
        setNews([]);
        setCategoryName("");
      }
    } catch (err) {
      console.log("Category News Error:", err);
      setNews([]);
      setCategoryName("");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <h3>{t("loading") || "Loading..."}</h3>
      </div>
    );
  }

  return (
    <>
      <BreadCrumb title={categoryName} />

      <div className="archives padding-top-30">
        <div className="container">
          <div className="row">
            {/* Left Side */}
            <div className="col-md-6 col-lg-8">
              <div className="row">
                <div className="col-12">
                  <div className="categories_title">
                    <h5>
                      {t("category") || "Category"} :
                      <Link to="#"> {categoryName}</Link>
                    </h5>
                  </div>
                </div>
              </div>

              <FeatureNewsAll features={news} />
            </div>

            {/* Right Side */}
            <div className="col-md-6 col-lg-4">
              <WidgetTab categoryId={categoryId} />

              <WidgetTrendingNews />

              {/* <NewsLetter />

              <FollowUs title="Follow Us" />

              <div className="banner2 mb30">
                <Link to="/">
                  <img src={banner2} alt="banner" />
                </Link>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      <div className="space-70" />

      <BannerSection />
    </>
  );
}

export default Category;
