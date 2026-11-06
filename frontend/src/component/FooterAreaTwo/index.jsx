// import React from "react";
// import { Link } from "react-router-dom";
// import { useTranslation } from "react-i18next";

// import FooterCopyright from "../FooterCopyright";
// import FollowUs from "../FollowUs";
// import NewsLetter from "../NewsLetter";
// import FontAwesome from "../uiStyle/FontAwesome";
// import WidgetMorenews from "../WidgetMorenews";
// import TwitterfeedTwo from "../TwitterfeedTwo";

// import logo from "../../assets/img/ch_logo.png";
// import banner from "../../assets/img/ad/ad-3.png";
// import phone_black from "../../assets/img/icon/phone_black.png";
// import speaker_black from "../../assets/img/icon/speaker_black.png";
// import envelope_black from "../../assets/img/icon/envelope_black.png";

// const FooterAreaTwo = () => {
//   const { t, i18n } = useTranslation();

//   return (
//     <div className="footer footer_area3 white_bg">
//       <div className="container">
//         <div className="row">
//           {/* LEFT SECTION */}
//           <div className="col-md-6 col-lg-4">
//             <div className="single_footer3 mb30">
//               <div className="logo">
//                 <Link to="/">
//                   <img src={logo} alt="Bharat 19 Express" />
//                 </Link>

//                 <div className="space-20" />
//               </div>

//               <p>
//                 <span>Bharat 19 Express</span>{" "}
//                 {t(
//                   "footerDescription",
//                   "एक भरोसेमंद हिंदी न्यूज़ प्लेटफॉर्म है, हमारा उद्देश्य महत्वपूर्ण खबरों को सरल, स्पष्ट और तेज़ तरीके से आप तक पहुँचाना है।",
//                 )}
//               </p>
//             </div>
//           </div>

//           {/* RIGHT SECTION */}
//           <div className="col-lg-8 col-md-6">
//             <div className="contacts3">
//               {/* PHONE */}
//               <div className="single_contact3">
//                 <h6>{t("letsTalk", "Let's Talk")}</h6>

//                 <Link to="/">+918542822407</Link>
//                 <br />
//                 <Link to="/">+918707386745</Link>
//               </div>

//               {/* EMAIL */}
//               <div className="single_contact3">
//                 <h6>{t("letsChat", "Let's Chat")}</h6>

//                 <a href="mailto:hello@newspark.com">hello@newspark.com</a>

//                 <a href="mailto:adsales@newspark.com">adsales@newspark.com</a>
//               </div>

//               {/* HEADQUARTERS */}
//               <div className="single_contact3">
//                 <h6>{t("headquarters", "Headquarters")}</h6>

//                 <p>
//                   Shop No. 8, Rail Nagar, Sector J,
//                   <br />
//                   Ashiyana, Lucknow(UP)-226012
//                 </p>
//               </div>
//             </div>

//             <div className="space-30" />
//             <div className="space-30" />

//             {/* APP DOWNLOAD */}
//             <div className="download_btn">
//               <div className="space-15" />
//               <div className="border_black" />
//               <div className="space-15" />

//               <div className="row">
//                 <div className="col-lg-6">
//                   <h3 className="widget-title">
//                     {t("appDownload", "Bharat19Express app download")}
//                   </h3>

//                   <p>
//                     {t(
//                       "freeSignDownload",
//                       "Free sign & download, iOS & Android app",
//                     )}
//                   </p>
//                 </div>

//                 <div className="col-lg-6">
//                   <div className="download_btn_group">
//                     {/* GOOGLE PLAY */}
//                     <Link className="app_btn" to="/">
//                       <FontAwesome name="google-play" />
//                       {t("downloadOnThe", "Download on the")}{" "}
//                       <span>{t("googlePlay", "google play")}</span>
//                     </Link>

//                     {/* APP STORE */}
//                     <Link className="app_btn" to="/">
//                       <FontAwesome name="apple" />
//                       {t("downloadOnThe", "Download on the")}{" "}
//                       <span>{t("appStore", "app store")}</span>
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <FooterCopyright />
//     </div>
//   );
// };

// export default FooterAreaTwo;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import FooterCopyright from "../FooterCopyright";
import FontAwesome from "../uiStyle/FontAwesome";

const API = "https://api.bharat19express.com";

const FooterAreaTwo = () => {
  const { t } = useTranslation();

  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  const fetchSiteSettings = async () => {
    try {
      const res = await fetch(`${API}/api/site-settings`);
      const data = await res.json();

      if (data.success && data.data) {
        setSettings(data.data);
      }
    } catch (error) {
      console.error("Site Settings API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const footerLogo = settings?.footerLogo
    ? `${API}/uploads/images/${settings.footerLogo}`
    : "";

  const phoneNumbers = settings?.phone
    ? settings.phone
        .split(",")
        .map((phone) => phone.trim())
        .filter(Boolean)
    : [];

  const emails = settings?.email
    ? settings.email
        .split(",")
        .map((email) => email.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="footer footer_area3 white_bg">
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-lg-4">
            <div className="single_footer3 mb30">
              {/* LOGO */}
              <div className="logo">
                <Link to="/">
                  {footerLogo ? (
                    <img
                      src={footerLogo}
                      alt={settings?.siteName || "Bharat 19 Express"}
                    />
                  ) : (
                    <h3>{settings?.siteName || "Bharat 19 Express"}</h3>
                  )}
                </Link>

                <div className="space-20" />
              </div>

              {/* DESCRIPTION */}
              <p>
                {/* <span>{settings?.siteName || "Bharat 19 Express"}</span>{" "} */}
                {t(
                  "footerDescription",
                  "एक भरोसेमंद हिंदी न्यूज़ प्लेटफॉर्म है, हमारा उद्देश्य महत्वपूर्ण खबरों को सरल, स्पष्ट और तेज़ तरीके से आप तक पहुँचाना है।",
                )}
              </p>
            </div>
          </div>

          <div className="col-lg-8 col-md-6">
            <div className="contacts3">
              <div className="single_contact3">
                <h6>{t("letsTalk", "Let's Talk")}</h6>

                {phoneNumbers.length > 0 ? (
                  phoneNumbers.map((phone, index) => (
                    <React.Fragment key={index}>
                      <a href={`tel:${phone}`}>{phone}</a>

                      {index < phoneNumbers.length - 1 && <br />}
                    </React.Fragment>
                  ))
                ) : (
                  <span>-</span>
                )}
              </div>

              <div className="single_contact3">
                <h6>{t("letsChat", "Let's Chat")}</h6>

                {emails.length > 0 ? (
                  emails.map((email, index) => (
                    <React.Fragment key={index}>
                      <a href={`mailto:${email}`}>{email}</a>

                      <br />
                    </React.Fragment>
                  ))
                ) : (
                  <span>-</span>
                )}
              </div>

              <div className="single_contact3">
                <h6>{t("headquarters", "Headquarters")}</h6>

                <p>{settings?.address || "-"}</p>
              </div>
            </div>

            {/* <div className="space-30" />
            <div className="space-30" /> */}

            {/* <div className="download_btn">
              <div className="space-15" />

              <div className="border_black" />

              <div className="space-15" />

              <div className="row">
                <div className="col-lg-6">
                  <h3 className="widget-title">
                    {t("appDownload", "Bharat19Express app download")}
                  </h3>

                  <p>
                    {t(
                      "freeSignDownload",
                      "Free sign up & download, iOS & Android app",
                    )}
                  </p>
                </div>

                <div className="col-lg-6">
                  <div className="download_btn_group">
                 
                    <Link className="app_btn" to="/">
                      <FontAwesome name="google-play" />
                      {t("downloadOnThe", "Download on the")}{" "}
                      <span>{t("googlePlay", "Google Play")}</span>
                    </Link>

                  
                    <Link className="app_btn" to="/">
                      <FontAwesome name="apple" />
                      {t("downloadOnThe", "Download on the")}{" "}
                      <span>{t("appStore", "App Store")}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <FooterCopyright />
    </div>
  );
};

export default FooterAreaTwo;
