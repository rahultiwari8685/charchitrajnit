// // import React, { useState } from "react";
// // import ProtoTypes from "prop-types";
// // import { TabContent, TabPane, Nav, NavItem, NavLink, Fade } from "reactstrap";
// // import classnames from "classnames";
// // import { Link } from "react-router-dom";

// // import tab21 from "../../assets/img/tab-post/1.png";
// // import tab22 from "../../assets/img/tab-post/2.png";
// // import tab23 from "../../assets/img/tab-post/3.png";
// // import tab24 from "../../assets/img/tab-post/4.png";
// // import tab25 from "../../assets/img/tab-post/5.png";

// // const data = [
// //   {
// //     image: tab21,
// //     title: "The city with highest quality of life in world.",
// //     category: "TECHNOLOGY",
// //     date: "March 26, 2020",
// //   },
// //   {
// //     image: tab22,
// //     title: "The city with highest quality of life in world.",
// //     category: "TECHNOLOGY",
// //     date: "March 26, 2020",
// //   },
// //   {
// //     image: tab23,
// //     title: "The city with highest quality of life in world.",
// //     category: "TECHNOLOGY",
// //     date: "March 26, 2020",
// //   },
// //   {
// //     image: tab24,
// //     title: "The city with highest quality of life in world.",
// //     category: "TECHNOLOGY",
// //     date: "March 26, 2020",
// //   },
// //   {
// //     image: tab25,
// //     title: "The city with highest quality of life in world.",
// //     category: "TECHNOLOGY",
// //     date: "March 26, 2020",
// //   },
// // ];

// // const WidgetTabPane = ({ arr, a_id, id }) => {
// //   return (
// //     <Fade in={id === a_id}>
// //       <div className="widget tab_widgets">
// //         {arr.map((item, i) => (
// //           <div key={i}>
// //             <div className="single_post widgets_small type8 type17">
// //               <div className="post_img">
// //                 <div className="img_wrap">
// //                   <Link to="/">
// //                     <img src={item.image} alt="thumb" />
// //                   </Link>
// //                 </div>
// //               </div>
// //               <div className="single_post_text">
// //                 <h4>
// //                   <Link to="/post1">{item.title}</Link>
// //                 </h4>
// //                 <div className="meta4">
// //                   <Link to="#">{item.category}</Link>
// //                 </div>
// //                 {i + 1 < arr.length ? (
// //                   <>
// //                     <div className="space-5" />
// //                     <div className="border_black" />
// //                     <div className="space-15" />
// //                   </>
// //                 ) : null}
// //               </div>
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </Fade>
// //   );
// // };

// // WidgetTabPane.propTypes = {
// //   arr: ProtoTypes.array,
// //   a_id: ProtoTypes.string,
// //   id: ProtoTypes.string,
// // };

// // const WidgetTabTwo = ({ className }) => {
// //   const [activeTab, setActiveTab] = useState("1");

// //   const toggle = (tab) => {
// //     if (activeTab !== tab) setActiveTab(tab);
// //   };

// //   return (
// //     <div
// //       className={`widget_tab tab3 border-radious5 ${
// //         className ? className : ""
// //       }`}
// //     >
// //       <Nav tabs className="white_bg">
// //         <NavItem>
// //           <NavLink
// //             className={classnames({ active: activeTab === "1" })}
// //             onClick={() => {
// //               toggle("1");
// //             }}
// //           >
// //             RELATED
// //           </NavLink>
// //         </NavItem>
// //         <NavItem>
// //           <NavLink
// //             className={classnames({ active: activeTab === "2" })}
// //             onClick={() => {
// //               toggle("2");
// //             }}
// //           >
// //             LATEST
// //           </NavLink>
// //         </NavItem>
// //         <NavItem>
// //           <NavLink
// //             className={classnames({ active: activeTab === "3" })}
// //             onClick={() => {
// //               toggle("3");
// //             }}
// //           >
// //             POPULAR
// //           </NavLink>
// //         </NavItem>
// //       </Nav>
// //       <TabContent activeTab={activeTab} className="padding15 white_bg">
// //         <TabPane tabId="1">
// //           <WidgetTabPane a_id={activeTab} id="1" arr={data} />
// //         </TabPane>
// //         <TabPane tabId="2">
// //           <WidgetTabPane a_id={activeTab} id="2" arr={data} />
// //         </TabPane>
// //         <TabPane tabId="3">
// //           <WidgetTabPane a_id={activeTab} id="3" arr={data} />
// //         </TabPane>
// //       </TabContent>
// //     </div>
// //   );
// // };

// // export default WidgetTabTwo;

// // WidgetTabTwo.propTypes = {
// //   className: ProtoTypes.string,
// // };

// import React, { useState, useEffect } from "react";
// import ProtoTypes from "prop-types";
// import { TabContent, TabPane, Nav, NavItem, Fade } from "reactstrap";
// import classnames from "classnames";
// import { Link } from "react-router-dom";

// const API = "https://api.bharat19express.com";

// const getYoutubeId = (url) => {
//   if (!url) return "";

//   const regExp =
//     /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;

//   const match = url.match(regExp);

//   return match && match[1].length === 11 ? match[1] : "";
// };

// const WidgetTabPane = ({ arr, a_id, id, dark }) => {
//   return (
//     <Fade in={id === a_id}>
//       <div className="widget tab_widgets">
//         {arr.map((item, i) => {
//           const category = item.categories?.[0];

//           const newsUrl = `/news/${item.slug}`;

//           const categoryUrl = category?.slug
//             ? `/category/${category.slug}`
//             : "#";

//           const youtubeId = getYoutubeId(item.youtubeUrl);

//           const image = item.thumbnail
//             ? `${API}/uploads/images/${item.thumbnail}`
//             : youtubeId
//               ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
//               : "/images/no-image.jpg";

//           return (
//             <div key={item._id || i}>
//               <div className="single_post widgets_small type8 type17">
//                 {/* IMAGE */}
//                 <div className="post_img">
//                   <div className="img_wrap">
//                     <Link to={newsUrl}>
//                       <img src={image} alt={item.title || "News"} />
//                     </Link>
//                   </div>
//                 </div>

//                 {/* CONTENT */}
//                 <div className="single_post_text">
//                   {/* CATEGORY + DATE */}
//                   <div className="meta2 meta_separator1">
//                     <Link to={categoryUrl}>{category?.name || "News"}</Link>

//                     <Link to={newsUrl}>
//                       {item.createdAt
//                         ? new Date(item.createdAt).toLocaleDateString("en-IN", {
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
//                       {item.title?.length > 80
//                         ? `${item.title.substring(0, 80)}...`
//                         : item.title}
//                     </Link>
//                   </h4>
//                 </div>
//               </div>

//               {/* SEPARATOR */}
//               {i + 1 < arr.length && (
//                 <>
//                   <div className="space-5" />

//                   {dark ? (
//                     <div className="border_white" />
//                   ) : (
//                     <div className="border_black" />
//                   )}

//                   <div className="space-15" />
//                 </>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </Fade>
//   );
// };

// WidgetTabPane.propTypes = {
//   arr: ProtoTypes.array,
//   a_id: ProtoTypes.string,
//   id: ProtoTypes.string,
//   dark: ProtoTypes.bool,
// };

// const WidgetTabTwo = ({ categoryId, className, dark }) => {
//   const [activeTab, setActiveTab] = useState("3");

//   const [related, setRelated] = useState([]);
//   const [latest, setLatest] = useState([]);
//   const [popular, setPopular] = useState([]);

//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     getLatest();
//     getPopular();

//     if (categoryId) {
//       getRelated();
//     }
//   }, [categoryId]);

//   const getRelated = async () => {
//     try {
//       const res = await fetch(`${API}/api/news/category/${categoryId}?limit=3`);

//       const data = await res.json();

//       if (data.status && Array.isArray(data.data)) {
//         const videoPosts = data.data
//           .filter((item) => Number(item.type) === 1)
//           .filter((item) => Number(item.videoType) === 2);

//         setRelated(videoPosts);
//       }
//     } catch (error) {
//       console.error("Related News Error:", error);
//     }
//   };

//   const getLatest = async () => {
//     try {
//       setLoading(true);

//       const res = await fetch(`${API}/api/news/getAllNews?limit=3`);

//       const data = await res.json();

//       if (data.status && Array.isArray(data.data)) {
//         const videoPosts = data.data
//           .filter((item) => Number(item.type) === 1)
//           .filter((item) => Number(item.videoType) === 2)
//           .sort(
//             (a, b) =>
//               new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
//           )
//           .slice(0, 5);

//         setLatest(videoPosts);
//       }
//     } catch (error) {
//       console.error("Latest News Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getPopular = async () => {
//     try {
//       const res = await fetch(`${API}/api/news/popular?limit=3`);

//       const data = await res.json();

//       if (data.status && Array.isArray(data.data)) {
//         const videoPosts = data.data
//           .filter((item) => Number(item.type) === 1)
//           .filter((item) => Number(item.videoType) === 2)
//           .slice(0, 5);

//         setPopular(videoPosts);
//       }
//     } catch (error) {
//       console.error("Popular News Error:", error);
//     }
//   };

//   const toggle = (tab) => {
//     if (activeTab !== tab) {
//       setActiveTab(tab);
//     }
//   };

//   return (
//     <div
//       className={`widget_tab tab3 border-radious5 ${
//         className ? className : ""
//       }`}
//     >
//       <Nav tabs className="white_bg">
//         <NavItem>
//           <a
//             href="#"
//             className={classnames({
//               active: activeTab === "1",
//             })}
//             onClick={(e) => {
//               e.preventDefault();
//               toggle("1");
//             }}
//           >
//             RELATED
//           </a>
//         </NavItem>

//         <NavItem>
//           <a
//             href="#"
//             className={classnames({
//               active: activeTab === "2",
//             })}
//             onClick={(e) => {
//               e.preventDefault();
//               toggle("2");
//             }}
//           >
//             LATEST
//           </a>
//         </NavItem>

//         <NavItem>
//           <a
//             href="#"
//             className={classnames({
//               active: activeTab === "3",
//             })}
//             onClick={(e) => {
//               e.preventDefault();
//               toggle("3");
//             }}
//           >
//             POPULAR
//           </a>
//         </NavItem>
//       </Nav>

//       <TabContent activeTab={activeTab} className="padding15 white_bg">
//         <TabPane tabId="1">
//           {related.length > 0 ? (
//             <WidgetTabPane dark={dark} a_id={activeTab} id="1" arr={related} />
//           ) : (
//             <div className="text-center py-3">
//               {categoryId
//                 ? "No related news available"
//                 : "No category selected"}
//             </div>
//           )}
//         </TabPane>

//         <TabPane tabId="2">
//           {latest.length > 0 ? (
//             <WidgetTabPane dark={dark} a_id={activeTab} id="2" arr={latest} />
//           ) : (
//             <div className="text-center py-3">
//               {loading ? "Loading..." : "No latest news available"}
//             </div>
//           )}
//         </TabPane>

//         <TabPane tabId="3">
//           {popular.length > 0 ? (
//             <WidgetTabPane dark={dark} a_id={activeTab} id="3" arr={popular} />
//           ) : (
//             <div className="text-center py-3">No popular news available</div>
//           )}
//         </TabPane>
//       </TabContent>
//     </div>
//   );
// };

// export default WidgetTabTwo;

// WidgetTabTwo.propTypes = {
//   categoryId: ProtoTypes.string,
//   className: ProtoTypes.string,
//   dark: ProtoTypes.bool,
// };

import React, { useState, useEffect } from "react";
import ProtoTypes from "prop-types";
import { TabContent, TabPane, Nav, NavItem, Fade } from "reactstrap";
import classnames from "classnames";
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


const WidgetTabPane = ({ arr, a_id, id, dark }) => {
  const { i18n, t } = useTranslation();

  const language = i18n.resolvedLanguage || "en";

  const localeMap = {
    en: "en-IN",
    hi: "hi-IN",
    ur: "ur-PK",
    bn: "bn-IN",
    mr: "mr-IN",
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString(localeMap[language] || "en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Fade in={id === a_id}>
      <div className="widget tab_widgets">
        {arr.map((item, i) => {
          const category = item.categories?.[0];

          const newsUrl = `/news/${item.slug}`;

          const categoryUrl = category?.slug
            ? `/category/${category.slug}`
            : "#";

          const youtubeId = getYoutubeId(item.youtubeUrl);

          const image = item.thumbnail
            ? `${API}/uploads/images/${item.thumbnail}`
            : youtubeId
              ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
              : "/images/no-image.jpg";

          return (
            <div key={item._id || i}>
              <div className="single_post widgets_small type8 type17">
                {/* IMAGE */}
                <div className="post_img">
                  <div className="img_wrap">
                    <Link to={newsUrl}>
                      <img src={image} alt={item.title || t("news", "News")} />
                    </Link>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="single_post_text">
                  {/* CATEGORY + DATE */}
                  <div className="meta2 meta_separator1">
                    <Link to={categoryUrl}>
                      {category?.name || t("news", "News")}
                    </Link>

                    <Link to={newsUrl}>{formatDate(item.createdAt)}</Link>
                  </div>

                  {/* TITLE */}
                  <h4>
                    <Link to={newsUrl}>
                      {item.title?.length > 80
                        ? `${item.title.substring(0, 80)}...`
                        : item.title}
                    </Link>
                  </h4>
                </div>
              </div>

              {/* SEPARATOR */}
              {i + 1 < arr.length && (
                <>
                  <div className="space-5" />

                  {dark ? (
                    <div className="border_white" />
                  ) : (
                    <div className="border_black" />
                  )}

                  <div className="space-15" />
                </>
              )}
            </div>
          );
        })}
      </div>
    </Fade>
  );
};

WidgetTabPane.propTypes = {
  arr: ProtoTypes.array,
  a_id: ProtoTypes.string,
  id: ProtoTypes.string,
  dark: ProtoTypes.bool,
};

/* =========================================================
   MAIN WIDGET
========================================================= */

const WidgetTabTwo = ({ categoryId, className, dark }) => {
  const { i18n, t } = useTranslation();

  const [activeTab, setActiveTab] = useState("3");

  const [related, setRelated] = useState([]);
  const [latest, setLatest] = useState([]);
  const [popular, setPopular] = useState([]);

  const [loading, setLoading] = useState(false);

  /* =========================================================
     LANGUAGE CHANGE
  ========================================================= */

  useEffect(() => {
    getLatest();
    getPopular();

    if (categoryId) {
      getRelated();
    } else {
      setRelated([]);
    }
  }, [categoryId, i18n.resolvedLanguage]);

  /* =========================================================
     RELATED NEWS
  ========================================================= */

  const getRelated = async () => {
    try {
      const language = i18n.resolvedLanguage || "en";

      const res = await fetch(
        `${API}/api/news/category/${categoryId}?limit=3&lang=${language}`,
      );

      const data = await res.json();

      console.log("Related News:", data);
      console.log("Related Language:", language);

      if (data.status && Array.isArray(data.data)) {
        const videoPosts = data.data
          .filter((item) => Number(item.type) === 1)
          .filter((item) => Number(item.videoType) === 2);

        setRelated(videoPosts);
      } else {
        setRelated([]);
      }
    } catch (error) {
      console.error("Related News Error:", error);
      setRelated([]);
    }
  };

  /* =========================================================
     LATEST NEWS
  ========================================================= */

  const getLatest = async () => {
    try {
      setLoading(true);

      const language = i18n.resolvedLanguage || "en";

      const res = await fetch(
        `${API}/api/news/getAllNews?limit=3&lang=${language}`,
      );

      const data = await res.json();

      console.log("Latest News:", data);
      console.log("Latest Language:", language);

      if (data.status && Array.isArray(data.data)) {
        const videoPosts = data.data
          .filter((item) => Number(item.type) === 1)
          .filter((item) => Number(item.videoType) === 2)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 5);

        setLatest(videoPosts);
      } else {
        setLatest([]);
      }
    } catch (error) {
      console.error("Latest News Error:", error);
      setLatest([]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     POPULAR NEWS
  ========================================================= */

  const getPopular = async () => {
    try {
      const language = i18n.resolvedLanguage || "en";

      const res = await fetch(
        `${API}/api/news/popular?limit=3&lang=${language}`,
      );

      const data = await res.json();

      console.log("Popular News:", data);
      console.log("Popular Language:", language);

      if (data.status && Array.isArray(data.data)) {
        const videoPosts = data.data
          .filter((item) => Number(item.type) === 1)
          .filter((item) => Number(item.videoType) === 2)
          .slice(0, 5);

        setPopular(videoPosts);
      } else {
        setPopular([]);
      }
    } catch (error) {
      console.error("Popular News Error:", error);
      setPopular([]);
    }
  };

  /* =========================================================
     TAB TOGGLE
  ========================================================= */

  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <div
      className={`widget_tab tab3 border-radious5 ${
        className ? className : ""
      }`}
    >
    

      <Nav tabs className="white_bg">
        {/* RELATED */}
        <NavItem>
          <a
            href="#"
            className={classnames({
              active: activeTab === "1",
            })}
            onClick={(e) => {
              e.preventDefault();
              toggle("1");
            }}
          >
            {t("related", "RELATED")}
          </a>
        </NavItem>

        {/* LATEST */}
        <NavItem>
          <a
            href="#"
            className={classnames({
              active: activeTab === "2",
            })}
            onClick={(e) => {
              e.preventDefault();
              toggle("2");
            }}
          >
            {t("latest", "LATEST")}
          </a>
        </NavItem>

        {/* POPULAR */}
        <NavItem>
          <a
            href="#"
            className={classnames({
              active: activeTab === "3",
            })}
            onClick={(e) => {
              e.preventDefault();
              toggle("3");
            }}
          >
            {t("popular", "POPULAR")}
          </a>
        </NavItem>
      </Nav>

    

      <TabContent activeTab={activeTab} className="padding15 white_bg">
        {/* RELATED */}
        <TabPane tabId="1">
          {related.length > 0 ? (
            <WidgetTabPane dark={dark} a_id={activeTab} id="1" arr={related} />
          ) : (
            <div className="text-center py-3">
              {categoryId
                ? t("noRelatedNews", "No related news available")
                : t("noCategorySelected", "No category selected")}
            </div>
          )}
        </TabPane>

        {/* LATEST */}
        <TabPane tabId="2">
          {latest.length > 0 ? (
            <WidgetTabPane dark={dark} a_id={activeTab} id="2" arr={latest} />
          ) : (
            <div className="text-center py-3">
              {loading
                ? t("loading", "Loading...")
                : t("noLatestNews", "No latest news available")}
            </div>
          )}
        </TabPane>

        {/* POPULAR */}
        <TabPane tabId="3">
          {popular.length > 0 ? (
            <WidgetTabPane dark={dark} a_id={activeTab} id="3" arr={popular} />
          ) : (
            <div className="text-center py-3">
              {t("noPopularNews", "No popular news available")}
            </div>
          )}
        </TabPane>
      </TabContent>
    </div>
  );
};

export default WidgetTabTwo;

WidgetTabTwo.propTypes = {
  categoryId: ProtoTypes.string,
  className: ProtoTypes.string,
  dark: ProtoTypes.bool,
};
