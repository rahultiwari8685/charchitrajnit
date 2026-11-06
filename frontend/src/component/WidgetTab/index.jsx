// import React, { useState, useEffect } from "react";
// import ProtoTypes from "prop-types";
// import { TabContent, TabPane, Nav, NavItem, Fade } from "reactstrap";
// import classnames from "classnames";
// import { Link } from "react-router-dom";

// import thumb1 from "../../assets/img/gallery-1.jpg";
// import thumb2 from "../../assets/img/gallery-2.jpg";
// import thumb3 from "../../assets/img/gallery-3.jpg";
// import thumb4 from "../../assets/img/gallery-4.jpg";
// import thumb5 from "../../assets/img/gallery-5.jpg";

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
//         {arr.map((item, i) => (
//           <div key={i}>
//             <div className="single_post widgets_small">
//               <div className="post_img">
//                 <div className="img_wrap">
//                   <Link to={`/${item.categories?.[0]?.slug}/${item.slug}`}>
//                     <img
//                       src={
//                         item.thumbnail
//                           ? `${API}/uploads/images/${item.thumbnail}`
//                           : getYoutubeId(item.youtubeUrl)
//                             ? `https://img.youtube.com/vi/${getYoutubeId(item.youtubeUrl)}/hqdefault.jpg`
//                             : "/images/no-image.jpg"
//                       }
//                       alt={item.title}
//                     />
//                   </Link>
//                 </div>
//               </div>
//               <div className="single_post_text">
//                 <div className="meta2 meta_separator1">
//                   <Link to="#">{item.categories?.[0]?.name}</Link>
//                   <Link to="#">
//                     {new Date(item.createdAt).toLocaleDateString()}
//                   </Link>
//                 </div>
//                 <h4>
//                   <Link to={`/${item.categories?.[0]?.slug}/${item.slug}`}>
//                     {item.title}
//                   </Link>
//                 </h4>
//               </div>
//             </div>
//             <div className="space-15" />
//             {dark ? (
//               <div className="border_white" />
//             ) : (
//               <div className="border_black" />
//             )}
//             <div className="space-15" />
//           </div>
//         ))}
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

// const WidgetTab = ({ categoryId, className, dark }) => {
//   const [activeTab, setActiveTab] = useState("1");

//   const [related, setRelated] = useState([]);
//   const [latest, setLatest] = useState([]);
//   const [popular, setPopular] = useState([]);

//   useEffect(() => {
//     getLatest();
//     getPopular();

//     if (categoryId) {
//       getRelated();
//     }
//   }, [categoryId]);

//   const getRelated = async () => {
//     const res = await fetch(`${API}/api/news/category/${categoryId}?limit=5`);

//     const data = await res.json();

//     // if (data.status) {
//     //   setRelated(data.data);
//     // }

//     if (data.status) {
//       const videoPosts = data.data.filter((item) => item.videoType === 2);

//       setRelated(videoPosts);
//     }
//   };

//   const getLatest = async () => {
//     const res = await fetch(`${API}/api/news/getAllNews?limit=5`);

//     const data = await res.json();

//     // if (data.status) {
//     //   setLatest(data.data);
//     // }
//     if (data.status) {
//       const videoPosts = data.data.filter((item) => item.videoType === 2);

//       setLatest(videoPosts);
//     }
//   };

//   const getPopular = async () => {
//     const res = await fetch(`${API}/api/news/popular?limit=5`);

//     const data = await res.json();

//     // if (data.status) {
//     //   setPopular(data.data);
//     // }

//     if (data.status) {
//       const videoPosts = data.data.filter((item) => item.videoType === 2);

//       setPopular(videoPosts);
//     }
//   };

//   const toggle = (tab) => {
//     if (activeTab !== tab) setActiveTab(tab);
//   };

//   return (
//     <div className={`widget_tab md-mt-30 ${className}`}>
//       <Nav tabs>
//         <NavItem>
//           <a
//             href="#"
//             className={classnames({ active: activeTab === "1" })}
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
//             className={classnames({ active: activeTab === "2" })}
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
//             className={classnames({ active: activeTab === "3" })}
//             onClick={(e) => {
//               e.preventDefault();
//               toggle("3");
//             }}
//           >
//             POPULAR
//           </a>
//         </NavItem>
//       </Nav>
//       <TabContent activeTab={activeTab}>
//         <TabPane tabId="1">
//           <WidgetTabPane dark={dark} a_id={activeTab} id="1" arr={related} />
//         </TabPane>
//         <TabPane tabId="2">
//           <WidgetTabPane dark={dark} a_id={activeTab} id="2" arr={latest} />
//         </TabPane>
//         <TabPane tabId="3">
//           <WidgetTabPane dark={dark} a_id={activeTab} id="3" arr={popular} />
//         </TabPane>
//       </TabContent>
//     </div>
//   );
// };

// export default WidgetTab;

// WidgetTab.propTypes = {
//   categoryId: ProtoTypes.string,
//   className: ProtoTypes.string,
//   dark: ProtoTypes.bool,
// };

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
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
  return (
    <Fade in={id === a_id}>
      <div className="widget tab_widgets">
        {arr.map((item, i) => (
          <div key={i}>
            <div className="single_post widgets_small">
              <div className="post_img">
                <div className="img_wrap">
                  <Link to={`/news/${item.slug}`}>
                    <img
                      src={
                        item.thumbnail
                          ? `${API}/uploads/images/${item.thumbnail}`
                          : getYoutubeId(item.youtubeUrl)
                            ? `https://img.youtube.com/vi/${getYoutubeId(
                                item.youtubeUrl,
                              )}/hqdefault.jpg`
                            : "/images/no-image.jpg"
                      }
                      alt={item.title}
                    />
                  </Link>
                </div>
              </div>

              <div className="single_post_text">
                <div className="meta2 meta_separator1">
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

            <div className="space-15" />

            {dark ? (
              <div className="border_white" />
            ) : (
              <div className="border_black" />
            )}

            <div className="space-15" />
          </div>
        ))}
      </div>
    </Fade>
  );
};

WidgetTabPane.propTypes = {
  arr: PropTypes.array,
  a_id: PropTypes.string,
  id: PropTypes.string,
  dark: PropTypes.bool,
};

const WidgetTab = ({ categoryId, className, dark }) => {
  const { t, i18n } = useTranslation();

  const [activeTab, setActiveTab] = useState("1");

  const [related, setRelated] = useState([]);
  const [latest, setLatest] = useState([]);
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    getLatest();
    getPopular();

    if (categoryId) {
      getRelated();
    } else {
      setRelated([]);
    }
  }, [categoryId, i18n.resolvedLanguage]);

  const getRelated = async () => {
    try {
      const language = i18n.resolvedLanguage || "en";

      const res = await fetch(
        `${API}/api/news/category/${categoryId}?limit=5&lang=${language}`,
      );

      const data = await res.json();

      if (data.status) {
        const videoPosts = data.data.filter((item) => item.videoType === 2);

        setRelated(videoPosts);
      } else {
        setRelated([]);
      }
    } catch (error) {
      console.log("Related News Error:", error);
      setRelated([]);
    }
  };

  const getLatest = async () => {
    try {
      const language = i18n.resolvedLanguage || "en";

      const res = await fetch(
        `${API}/api/news/getAllNews?limit=5&lang=${language}`,
      );

      const data = await res.json();

      if (data.status) {
        const videoPosts = data.data.filter((item) => item.videoType === 2);

        setLatest(videoPosts);
      } else {
        setLatest([]);
      }
    } catch (error) {
      console.log("Latest News Error:", error);
      setLatest([]);
    }
  };

  const getPopular = async () => {
    try {
      const language = i18n.resolvedLanguage || "en";

      const res = await fetch(
        `${API}/api/news/popular?limit=5&lang=${language}`,
      );

      const data = await res.json();

      if (data.status) {
        const videoPosts = data.data.filter((item) => item.videoType === 2);

        setPopular(videoPosts);
      } else {
        setPopular([]);
      }
    } catch (error) {
      console.log("Popular News Error:", error);
      setPopular([]);
    }
  };

  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <div className={`widget_tab md-mt-30 ${className || ""}`}>
      <Nav tabs>
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
            {t("related") || "RELATED"}
          </a>
        </NavItem>

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
            {t("latest") || "LATEST"}
          </a>
        </NavItem>

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
            {t("popular") || "POPULAR"}
          </a>
        </NavItem>
      </Nav>

      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <WidgetTabPane dark={dark} a_id={activeTab} id="1" arr={related} />
        </TabPane>

        <TabPane tabId="2">
          <WidgetTabPane dark={dark} a_id={activeTab} id="2" arr={latest} />
        </TabPane>

        <TabPane tabId="3">
          <WidgetTabPane dark={dark} a_id={activeTab} id="3" arr={popular} />
        </TabPane>
      </TabContent>
    </div>
  );
};

export default WidgetTab;

WidgetTab.propTypes = {
  categoryId: PropTypes.string,
  className: PropTypes.string,
  dark: PropTypes.bool,
};
