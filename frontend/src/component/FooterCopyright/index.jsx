

// import React from "react";
// import { Link } from "react-router-dom";
// import { useTranslation } from "react-i18next";

// const FooterCopyright = () => {
//   const { t } = useTranslation();

//   const quick_links = [
//     {
//       name: t("about.title", "About"),
//       link: "/about",
//     },
//     {
//       name: t("privacy", "Privacy Policy"),
//       link: "/privacy",
//     },
//     {
//       name: t("contact", "Contact Us"),
//       link: "/contact",
//     },
//   ];

//   return (
//     <div className="copyright">
//       <div className="container">
//         <div className="row">
//           <div className="col-lg-6 align-self-center">
//             <p>
//               &copy; {new Date().getFullYear()} {t("copyright", "Copyright")},{" "}
//               {t("allRightsReserved", "All Rights Reserved")}
//             </p>
//           </div>

//           <div className="col-lg-6 align-self-center">
//             <div className="copyright_menus text-right">
//               <div className="language" />

//               <div className="copyright_menu inline">
//                 <ul>
//                   {quick_links.map((item) => (
//                     <li key={item.link}>
//                       <Link to={item.link}>{item.name}</Link>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FooterCopyright;



import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const FooterCopyright = () => {
  const { t } = useTranslation();

  const quick_links = [
    {
      name: t("about.title", "About"),
      link: "/about",
    },
    {
      name: t("privacy", "Privacy Policy"),
      link: "/privacy",
    },
    {
      name: t("contact", "Contact Us"),
      link: "/contact",
    },
  ];

  return (
    <div
      className="copyright"
      style={{
        backgroundColor: "#8B0000",
        color: "#ffffff",
        padding: "15px 0",
      }}
    >
      <div className="container">
        <div className="row">
        

<div className="col-lg-6 align-self-center">
  <div
    className="d-flex align-items-center flex-wrap"
    style={{ gap: "25px" }}
  >
    <p style={{ color: "#ffffff", margin: 0 }}>
      &copy; {new Date().getFullYear()}{" "}
      {t("copyright", "Copyright")},{" "}
      {t("allRightsReserved", "All Rights Reserved")}
    </p>

    <p style={{ color: "#ffffff", margin: 0 }}>
      {t("developedBy", "Developed By")}:{" "}
      <a
        href="https://techaiindia.com/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "#ffffff",
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        TechAiIndia
      </a>
    </p>
  </div>
</div>



          <div className="col-lg-6 align-self-center">
            <div className="copyright_menus text-right">
              <div className="language" />

              <div className="copyright_menu inline">
                <ul style={{ margin: 0 }}>
                  {quick_links.map((item) => (
                    <li key={item.link}>
                      <Link
                        to={item.link}
                        style={{
                          color: "#ffffff",
                          textDecoration: "none",
                        }}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterCopyright;

