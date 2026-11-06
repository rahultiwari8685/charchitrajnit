// import React, { useEffect, useState } from "react";
// import PropTypes from "prop-types";
// import { Link } from "react-router-dom";

// const API = "https://api.bharat19express.com";

// const PostOnePagination = ({ newsId, className }) => {
//   const [previous, setPrevious] = useState(null);
//   const [next, setNext] = useState(null);

//   useEffect(() => {
//     if (newsId) {
//       getNews();
//     }
//   }, [newsId]);

//   const getNews = async () => {
//     try {
//       const res = await fetch(`${API}/api/news/previous-next/${newsId}`);

//       const data = await res.json();

//       // if (data.success) {
//       //   setPrevious(data.previous);
//       //   setNext(data.next);
//       // }
//       if (data.status) {
//         const videoPosts = data.data.filter((item) => item.videoType === 2);

//         setPrevious(videoPosts.previous);
//         setNext(videoPosts.next);
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <div className="next_prev">
//       <div className="row">
//         <div className="col-lg-6">
//           {previous && (
//             <div className={className || "next_prv_single border_left3"}>
//               <p>PREVIOUS NEWS</p>

//               <h3>
//                 <Link to={`/news/${previous.slug || previous._id}`}>
//                   {previous.title}
//                 </Link>
//               </h3>
//             </div>
//           )}
//         </div>

//         <div className="col-lg-6">
//           {next && (
//             <div className={className || "next_prv_single border_left3"}>
//               <p>NEXT NEWS</p>

//               <h3>
//                 <Link to={`/news/${next.slug || next._id}`}>{next.title}</Link>
//               </h3>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PostOnePagination;

// PostOnePagination.propTypes = {
//   newsId: PropTypes.string.isRequired,
//   className: PropTypes.string,
// };

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const API = "https://api.bharat19express.com";

const PostOnePagination = ({ newsId, className }) => {
  const { t, i18n } = useTranslation();

  const [previous, setPrevious] = useState(null);
  const [next, setNext] = useState(null);

  useEffect(() => {
    if (newsId) {
      getNews();
    }
  }, [newsId, i18n.resolvedLanguage]);

  const getNews = async () => {
    try {
      const language = i18n.resolvedLanguage || "en";

      const res = await fetch(
        `${API}/api/news/previous-next/${newsId}?lang=${language}`,
      );

      const data = await res.json();

      if (data.success) {
        setPrevious(data.previous || null);
        setNext(data.next || null);
      } else {
        setPrevious(null);
        setNext(null);
      }
    } catch (err) {
      console.log("Previous Next News Error:", err);

      setPrevious(null);
      setNext(null);
    }
  };

  return (
    <div className="next_prev">
      <div className="row">
        {/* PREVIOUS */}
        <div className="col-lg-6">
          {previous && (
            <div className={className || "next_prv_single border_left3"}>
              <p>{t("previous") || "PREVIOUS NEWS"}</p>

              <h3>
                <Link to={`/news/${previous.slug || previous._id}`}>
                  {previous.title}
                </Link>
              </h3>
            </div>
          )}
        </div>

        {/* NEXT */}
        <div className="col-lg-6">
          {next && (
            <div className={className || "next_prv_single border_left3"}>
              <p>{t("next") || "NEXT NEWS"}</p>

              <h3>
                <Link to={`/news/${next.slug || next._id}`}>{next.title}</Link>
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostOnePagination;

PostOnePagination.propTypes = {
  newsId: PropTypes.string.isRequired,
  className: PropTypes.string,
};
