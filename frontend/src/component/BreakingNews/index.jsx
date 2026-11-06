import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Slider from "../Slider";

const API = "https://api.bharat19express.com";

const BreakingNews = () => {
  const { i18n } = useTranslation();
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const language = i18n.resolvedLanguage || "en";
        const response = await fetch(
          `${API}/api/news/trending?limit=10&lang=${language}`,
        );
        const result = await response.json();

        if (result.status) {
          setNews(result.data || []);
        }
      } catch (error) {
        console.error("Breaking News Error:", error);
      }
    };

    fetchNews();
  }, [i18n.resolvedLanguage]);

  return (
    <>
      {/* <style>{`
     

.breaking-news-container {
  width: 100%;
  max-width: 1200px;
  height: 36px;
  min-height: 36px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  overflow: hidden;
  box-sizing: border-box;
  background: #fff;
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
  font-family: Arial, sans-serif;
}



    
.breaking-news-label {
  height: 36px;
  padding: 0 20px 0 12px;
  display: flex;
  align-items: center;
  gap: 7px;
  flex-shrink: 0;
  background: #c9151e;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
  position: relative;
  z-index: 2;
  clip-path: polygon(0 0, 100% 0, 90% 50%, 100% 100%, 0 100%);
}


        .breaking-news-dot {
          width: 8px;
          height: 8px;
          flex-shrink: 0;
          background: #fff;
          border-radius: 50%;
        }

      
.breaking-news-headlines {
  flex: 1;
  min-width: 0;
  padding: 0 10px;
  overflow: hidden;
}

.breaking-news-slider,
.breaking-news-slider .swiper-wrapper,
.breaking-news-slider .swiper-slide {
  height: 38px;
}

.breaking-news-item {
  height: 38px;
  line-height: 38px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.breaking-news-item a {
  color: #222;
  font-size: 13px;
  text-decoration: none;
  font-weight: 600;
}

.breaking-news-item a:hover {
  color: #c9151e;
}


        .breaking-news-item a {
          color: #222;
          font-size: 13px;
          text-decoration: none;
          font-weight: 500;
        }

        .breaking-news-item a:hover {
          color: #c9151e;
        }

     
.breaking-news-controls {
  height: 38px;
  padding: 0 7px;
  display: flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
  background: #fff;
}

.breaking-news-controls button {
  width: 16px;
  height: 24px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #333;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
}

.breaking-news-controls button:hover {
  color: #c9151e;
}


        .breaking-news-controls button:hover {
          color: #c9151e;
        }

     
@media (max-width: 576px) {
  .breaking-news-container {
    width: 100%;
    height: 32px;
    min-height: 32px;
  }

  .breaking-news-label {
    height: 32px;
    padding: 0 14px 0 8px;
    font-size: 9px;
  }

  .breaking-news-headlines {
    padding: 0 5px;
  }

  .breaking-news-slider,
  .breaking-news-slider .swiper-wrapper,
  .breaking-news-slider .swiper-slide {
    height: 30px;
  }

  .breaking-news-item {
    height: 30px;
    line-height: 30px;
  }

  .breaking-news-item a {
    font-size: 11px;
  }

  .breaking-news-controls {
    padding: 0 4px;
    gap: 2px;
  }
}

      `}</style> */}

      <style>{`
  .breaking-news-container {
    width: 100%;
    max-width: 1200px;
    height: 44px;
    min-height: 44px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    overflow: hidden;
    box-sizing: border-box;
    background: #fff;
    border-top: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
    font-family: Arial, sans-serif;
  }

  .breaking-news-label {
    height: 44px;
    padding: 0 24px 0 14px;
    display: flex;
    align-items: center;
    gap: 9px;
    flex-shrink: 0;
    background: #c9151e;
    color: #fff;
    font-size: 14px;
    font-weight: 800;
    white-space: nowrap;
    position: relative;
    z-index: 2;
    clip-path: polygon(0 0, 100% 0, 90% 50%, 100% 100%, 0 100%);
  }

  .breaking-news-dot {
    width: 9px;
    height: 9px;
    flex-shrink: 0;
    background: #fff;
    border-radius: 50%;
  }

  .breaking-news-headlines {
    flex: 1;
    min-width: 0;
    padding: 0 12px;
    overflow: hidden;
  }

  .breaking-news-slider,
  .breaking-news-slider .swiper-wrapper,
  .breaking-news-slider .swiper-slide {
    height: 44px;
  }

  .breaking-news-item {
    height: 44px;
    line-height: 44px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .breaking-news-item a {
    color: #222;
    font-size: 17px;
    font-weight: 700;
    text-decoration: none;
  }

  .breaking-news-item a:hover {
    color: #c9151e;
  }

  .breaking-news-controls {
    height: 44px;
    padding: 0 9px;
    display: flex;
    align-items: center;
    gap: 7px;
    flex-shrink: 0;
    background: #fff;
  }

  .breaking-news-controls button {
    width: 20px;
    height: 28px;
    padding: 0;
    border: 0;
    background: transparent;
    color: #333;
    font-size: 23px;
    line-height: 1;
    cursor: pointer;
  }

  .breaking-news-controls button:hover {
    color: #c9151e;
  }

  @media (max-width: 576px) {
    .breaking-news-container {
      height: 38px;
      min-height: 38px;
    }

    .breaking-news-label {
      height: 38px;
      padding: 0 15px 0 9px;
      gap: 6px;
      font-size: 11px;
    }

    .breaking-news-dot {
      width: 7px;
      height: 7px;
    }

    .breaking-news-headlines {
      padding: 0 5px;
    }

    .breaking-news-slider,
    .breaking-news-slider .swiper-wrapper,
    .breaking-news-slider .swiper-slide {
      height: 38px;
    }

    .breaking-news-item {
      height: 38px;
      line-height: 38px;
    }

    .breaking-news-item a {
      font-size: 13px;
      font-weight: 700;
    }

    .breaking-news-controls {
      height: 38px;
      padding: 0 4px;
      gap: 2px;
    }

    .breaking-news-controls button {
      width: 17px;
      font-size: 19px;
    }
  }
`}</style>

      <div className="breaking-news-container">
        <div className="breaking-news-label">
          <span className="breaking-news-dot" />
          BREAKING NEWS
        </div>

        <div className="breaking-news-headlines">
          <Slider
            className="breaking-news-slider"
            slidesPerView={1}
            loop={news.length > 1}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            navigation={{
              nextEl: ".breaking-news-next",
              prevEl: ".breaking-news-prev",
            }}
          >
            {news.map((item) => (
              <div className="breaking-news-item" key={item._id}>
                <Link
                  to={`/${item.categories?.[0]?.slug || "news"}/${item.slug}`}
                >
                  {item.title}
                </Link>
              </div>
            ))}
          </Slider>
        </div>

        <div className="breaking-news-controls">
          <button
            className="breaking-news-prev"
            type="button"
            aria-label="Previous headline"
          >
            ‹
          </button>
          <button
            className="breaking-news-next"
            type="button"
            aria-label="Next headline"
          >
            ›
          </button>

          <button
            type="button"
            aria-label="Pause headlines"
            title="Pause headlines"
            onClick={(e) => {
              const swiper = e.currentTarget
                .closest(".breaking-news-container")
                ?.querySelector(".breaking-news-slider")?.swiper;

              if (swiper?.autoplay?.running) {
                swiper.autoplay.stop();
                e.currentTarget.textContent = "▶";
                e.currentTarget.setAttribute("aria-label", "Play headlines");
              } else if (swiper?.autoplay) {
                swiper.autoplay.start();
                e.currentTarget.textContent = "Ⅱ";
                e.currentTarget.setAttribute("aria-label", "Pause headlines");
              }
            }}
          >
            Ⅱ
          </button>
        </div>
      </div>
    </>
  );
};

export default BreakingNews;
