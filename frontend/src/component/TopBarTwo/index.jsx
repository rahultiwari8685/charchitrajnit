import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FontAwesome from "../uiStyle/FontAwesome";
import Slider from "../Slider";
import { NavLink } from "react-router-dom";
import { FaXTwitter } from "react-icons/fa6";

const topBarResponsiveStyles = `
  /* Keep top bar visible on all screen sizes */
  .topbar {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
  }

  @media (max-width: 767px) {
    .topbar {
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      position: relative !important;
      height: auto !important;
      min-height: 45px !important;
      max-height: none !important;
      overflow: visible !important;
    }

    .topbar > .container {
      display: block !important;
      width: 100% !important;
      max-width: 100% !important;
      padding: 0 10px !important;
      overflow: visible !important;
    }

    .topbar-inner {
      display: flex !important;
      flex-direction: column !important;
      align-items: stretch !important;
      justify-content: center !important;
      gap: 8px !important;
      width: 100% !important;
      min-height: 45px !important;
      padding: 8px 0 !important;
      box-sizing: border-box !important;
    }

    .topbar-left {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      flex-wrap: wrap !important;
      width: 100% !important;
      gap: 6px !important;
      font-size: 11px !important;
      line-height: 1.5 !important;
    }

    .topbar-right {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      flex-wrap: wrap !important;
      width: 100% !important;
      margin-left: 0 !important;
      gap: 8px !important;
    }

    .topbar-right a,
    .topbar-right button,
    .topbar-right select {
      font-size: 11px !important;
    }
  }
`;



const TopBarTwo = () => {
  const API = "https://api.bharat19express.com";

  const { t, i18n } = useTranslation();

  useEffect(() => {
    const savedLanguage = localStorage.getItem("i18nextLng");
    const language = savedLanguage || "hi";

    if (i18n.resolvedLanguage !== language) {
      i18n.changeLanguage(language);
    }

    document.documentElement.lang = language;
    document.documentElement.dir = language === "ur" ? "rtl" : "ltr";

    if (!savedLanguage) {
      localStorage.setItem("i18nextLng", "hi");
    }
  }, [i18n]);

  const [trendingNews, setTrendingNews] = useState([]);
  const [showYoutubeMenu, setShowYoutubeMenu] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);


  
const [weather, setWeather] = useState(null);
const [aqi, setAqi] = useState(null);

useEffect(() => {
  let cancelled = false;

  const fetchWeatherAndAQI = async () => {
    try {
      const [weatherResponse, airResponse] = await Promise.all([
        fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=26.8467&longitude=80.9462&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code&timezone=Asia%2FKolkata"
        ),
        fetch(
          "https://air-quality-api.open-meteo.com/v1/air-quality?latitude=26.8467&longitude=80.9462&current=us_aqi,pm2_5&timezone=Asia%2FKolkata"
        ),
      ]);

      if (!weatherResponse.ok || !airResponse.ok) {
        throw new Error("Weather or AQI API request failed");
      }

      const weatherData = await weatherResponse.json();
      const airData = await airResponse.json();

      if (cancelled) return;

      setWeather(weatherData.current || null);
      setAqi(airData.current || null);
    } catch (error) {
      console.error("Weather/AQI Error:", error);
    }
  };

  fetchWeatherAndAQI();

  // Refresh every 10 minutes.
  const intervalId = setInterval(fetchWeatherAndAQI, 10 * 60 * 1000);

  return () => {
    cancelled = true;
    clearInterval(intervalId);
  };
}, []);

const getWeatherDescription = (code) => {
  if (code === 0) return "Clear sky";
  if ([1, 2, 3].includes(code)) return "Partly cloudy";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rain";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snow";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Current weather";
};

const getAqiLabel = (value) => {
  if (value == null) return "";

  if (value <= 50) return "Good";
  if (value <= 100) return "Moderate";
  if (value <= 150) return "Unhealthy for sensitive groups";
  if (value <= 200) return "Unhealthy";
  if (value <= 300) return "Very unhealthy";
  return "Hazardous";
};


  useEffect(() => {
    getTrendingNews();
  }, [i18n.resolvedLanguage]);

  const getTrendingNews = async () => {
    try {
      const language = i18n.resolvedLanguage || "hi";

      const res = await fetch(
        `${API}/api/news/trending?limit=10&lang=${language}`,
      );

      const data = await res.json();

      if (data.status) {
        setTrendingNews(data.data || []);
      }
    } catch (error) {
      console.error("Trending News Error:", error);
    }
  };

  const changeLanguage = async (language) => {
    try {
      setTrendingNews([]);

      localStorage.setItem("i18nextLng", language);

      await i18n.changeLanguage(language);

      document.documentElement.lang = language;

      if (language === "ur") {
        document.documentElement.dir = "rtl";
      } else {
        document.documentElement.dir = "ltr";
      }

      console.log("Selected Language:", language);
      console.log("i18n Language:", i18n.language);
      console.log("Resolved Language:", i18n.resolvedLanguage);
    } catch (error) {
      console.error("Language change error:", error);
    }
  };

 return (
  <>
    <style>{topBarResponsiveStyles}</style>

    <div
      className="topbar"
      id="top"
      style={{
        background: "#f1f1f1",
        color: "#fff",
        minHeight: "45px",
        fontSize: "12px",
        padding: 0,
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto",
          padding: "0 15px",
          background: "#a90000",
          borderBottom: "3px solid #e4b8b8",
          boxSizing: "border-box",
        }}
      >
        {/* <div
          style={{
            minHeight: "42px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
            flexWrap: "nowrap",
            width: "100%",
            boxSizing: "border-box",
          }}
        > */}

        <div
  className="topbar-inner"
  style={{
    minHeight: "42px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    flexWrap: "wrap",
    width: "100%",
    boxSizing: "border-box",
  }}
>
          {/* LEFT: Date, weather and AQI */}
       <div
  className="topbar-left"
  style={{
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  }}
>
            <div
              style={{ position: "relative", display: "inline-block" }}
              onMouseEnter={() => setShowCalendar(true)}
              onMouseLeave={() => setShowCalendar(false)}
            >
              <span
                style={{
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                }}
              >
                <FontAwesome name="calendar" />{" "}
                {new Date().toLocaleDateString(
                  {
                    en: "en-IN",
                    hi: "hi-IN",
                    bn: "bn-BD",
                    mr: "mr-IN",
                  }[i18n.resolvedLanguage] || "en-IN",
                  {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    weekday: "long",
                  },
                )}
              </span>

              {showCalendar && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    marginTop: "8px",
                    width: "280px",
                    background: "#fff",
                    color: "#222",
                    padding: "15px",
                    borderRadius: "8px",
                    boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
                    zIndex: 99999,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "16px",
                      marginBottom: "10px",
                    }}
                  >
                    {new Date().toLocaleDateString(
                      i18n.resolvedLanguage || "en-IN",
                      { month: "long", year: "numeric" },
                    )}
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(7, 1fr)",
                      gap: "5px",
                      textAlign: "center",
                      fontSize: "12px",
                    }}
                  >
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                      <div
                        key={day}
                        style={{ fontWeight: 700, padding: "5px 0" }}
                      >
                        {day}
                      </div>
                    ))}

                    {Array.from(
                      {
                        length: new Date(
                          new Date().getFullYear(),
                          new Date().getMonth(),
                          1,
                        ).getDay(),
                      },
                      (_, i) => (
                        <div key={`empty-${i}`} />
                      ),
                    )}

                    {Array.from(
                      {
                        length: new Date(
                          new Date().getFullYear(),
                          new Date().getMonth() + 1,
                          0,
                        ).getDate(),
                      },
                      (_, i) => {
                        const day = i + 1;
                        const isToday = day === new Date().getDate();

                        return (
                          <div
                            key={day}
                            style={{
                              padding: "6px 0",
                              borderRadius: "50%",
                              background: isToday ? "#a90000" : "transparent",
                              color: isToday ? "#fff" : "#222",
                              fontWeight: isToday ? 700 : 400,
                            }}
                          >
                            {day}
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              )}
            </div>

            <span style={{ opacity: 0.8 }}>|</span>

          
{/* <span
  style={{ whiteSpace: "nowrap" }}
  title={
    weather
      ? getWeatherDescription(weather.weather_code)
      : "Loading weather"
  }
>
  <FontAwesome name="map-marker" /> {t("lucknow", "लखनऊ")}{" "}
  {weather?.temperature_2m != null
    ? `${Math.round(weather.temperature_2m)}°C`
    : "--°C"}

</span> */}

<span
  style={{ whiteSpace: "nowrap" }}
  title={
    weather
      ? t(
          `weather.${weather.weather_code}`,
          getWeatherDescription(weather.weather_code)
        )
      : t("weather.loading", "Loading weather")
  }
>
  <FontAwesome name="map-marker" />{" "}
  {t("lucknow", "लखनऊ")}{" "}
  {weather?.temperature_2m != null
    ? `${Math.round(weather.temperature_2m)}°C`
    : "--°C"}
  {weather && (
    <span>
      {" · "}
      {t(
        `weather.${weather.weather_code}`,
        getWeatherDescription(weather.weather_code)
      )}
    </span>
  )}
</span>

<span
  style={{ whiteSpace: "nowrap" }}
  title={
    aqi?.us_aqi != null
      ? `US AQI: ${aqi.us_aqi}; PM2.5: ${
          aqi.pm2_5 ?? "Unavailable"
        } µg/m³`
      : "Loading air quality"
  }
>
  <FontAwesome name="cloud" /> AQI{" "}
  {aqi?.us_aqi != null ? Math.round(aqi.us_aqi) : "--"}
  {aqi?.us_aqi != null && (
    <span> ({getAqiLabel(aqi.us_aqi)})</span>
  )}
</span>

          </div>

          {/* RIGHT: Preserve previous header actions */}
       <div
  className="topbar-right"
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "12px",
    flexWrap: "wrap",
    marginLeft: "auto",
  }}
>
            <NavLink
              to="/epaper"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                minHeight: "34px",
                padding: "0 13px",
                borderRadius: "5px",
             background: "#ffffff",
color: "#000000",
border: "1px solid #dddddd",
                fontSize: "12px",
                fontWeight: "800",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              <FontAwesome name="newspaper-o" />
              <span>{t("epaper", "Epaper")}</span>
            </NavLink>

            <NavLink
              to="/gallery"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                minHeight: "34px",
                padding: "0 13px",
                borderRadius: "5px",
                background: "#130d0d",
                color: "#fff",
                fontSize: "12px",
                fontWeight: "800",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              <FontAwesome name="newspaper-o" />
              <span>{t("gallery", "Gallery")}</span>
            </NavLink>

            <NavLink
              to="/login"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                minHeight: "34px",
                padding: "0 13px",
                borderRadius: "5px",
              background: "#ffffff",
color: "#000000",
border: "1px solid #dddddd",
                fontSize: "12px",
                fontWeight: "800",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              <FontAwesome name="newspaper-o" />
              <span>{t("subscribe", "Subscribe")}</span>
            </NavLink>
            {/* YouTube dropdown */}
            <div
              style={{ position: "relative", flexShrink: 0 }}
              onMouseEnter={() => setShowYoutubeMenu(true)}
              onMouseLeave={() => setShowYoutubeMenu(false)}
            >
              <button
                type="button"
                onClick={() => setShowYoutubeMenu((prev) => !prev)}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#fff",
                  padding: 0,
                  fontSize: "14px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                <FontAwesome name="youtube-play" />
              </button>

              {showYoutubeMenu && (
                <div
                  style={{
                    position: "absolute",
                    top: "25px",
                    right: 0,
                    width: "230px",
                    background: "#fff",
                    borderRadius: "5px",
                    boxShadow: "0 5px 20px rgba(0,0,0,0.25)",
                    zIndex: 99999,
                    overflow: "hidden",
                    textAlign: "left",
                  }}
                >
                  {[
                    {
                      label: t("channelNation", "Bharat 19 Express Nation"),
                      url: "https://www.youtube.com/channel/UC0lg7tqrUdlky_u1Wug7uEw",
                    },
                    {
                      label: t("channelRegional", "Bharat 19 Express Regional"),
                      url: "https://www.youtube.com/channel/UC7_OlirbGWvmG0-0Nc3WedA",
                    },
                    {
                      label: t(
                        "channelEntertainment",
                        "Bharat 19 Entertainment",
                      ),
                      url: "https://www.youtube.com/channel/UCkJQAejO5Zx1TaQzzA_3Hvg",
                    },
                    {
                      label: t("channelMain", "Bharat 19 Express"),
                      url: "https://www.youtube.com/channel/UCygk_AnahPPNje9H3NLK1tA",
                    },
                  ].map((channel) => (
                    <a
                      key={channel.url}
                      href={channel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "block",
                        padding: "10px 14px",
                        color: "#333",
                        textDecoration: "none",
                        fontSize: "13px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {channel.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/login"
              style={{
                color: "#fff",
                textDecoration: "none",
                fontSize: "14px",
                whiteSpace: "nowrap",
              }}
            >
              <FontAwesome name="user-circle" /> {t("login", "Login")}
            </Link>

            {[
              { icon: "facebook-f", url: "https://www.facebook.com/" },
              { icon: "instagram", url: "https://www.instagram.com/" },
              { icon: "x-twitter", url: "https://x.com/" },
              { icon: "whatsapp", url: "https://wa.me/" },
            ].map((item) => (
              <a
                key={item.icon}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.icon}
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: "14px",
                  flexShrink: 0,
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                {item.icon === "x-twitter" ? (
                  <FaXTwitter />
                ) : (
                  <FontAwesome name={item.icon} />
                )}
              </a>
            ))}

            {/* Language selector */}
            <select
              value={i18n.resolvedLanguage || "hi"}
              onChange={(e) => changeLanguage(e.target.value)}
              aria-label="Select language"
              style={{
                border: "none",
                background: "transparent",
                color: "#fff",
                cursor: "pointer",
                outline: "none",
                fontSize: "12px",
                maxWidth: "85px",
              }}
            >
              <option value="en" style={{ color: "#222" }}>
                English
              </option>
              <option value="hi" style={{ color: "#222" }}>
                हिन्दी
              </option>
              <option value="bn" style={{ color: "#222" }}>
                বাংলা
              </option>
              <option value="mr" style={{ color: "#222" }}>
                मराठी
              </option>
            </select>
          </div>
        </div>
      </div>
 </div>
  </>
  );
};

export default TopBarTwo;
