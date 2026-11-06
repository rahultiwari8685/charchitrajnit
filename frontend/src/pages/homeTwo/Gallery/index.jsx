import React, { useCallback, useEffect, useRef, useState } from "react";

const API = "https://api.bharat19express.com";

const FILTERS = [
  { label: "Images", value: "image", icon: "▧" },
  { label: "Videos", value: "video", icon: "▶" },
];

export default function Gallery() {
  const [media, setMedia] = useState([]);
  const [filter, setFilter] = useState("image");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  const videoRefs = useRef(new Map());

  const fetchGallery = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API}/api/gallery`, { signal });

      if (!response.ok) {
        throw new Error(`Request failed (${response.status})`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Unable to load gallery.");
      }

      setMedia(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "Unable to connect to the server.");
      }
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetchGallery(controller.signal);

    return () => controller.abort();
  }, [fetchGallery, retry]);

  const getMediaType = (item) => {
    if (item.mediaType === "image" || item.mediaType === "video") {
      return item.mediaType;
    }

    // Backward compatibility with older gallery records.
    return item.mimeType?.startsWith("image/") ? "image" : "video";
  };

  const getMediaUrl = (item) =>
    item.mediaUrl ||
    item.videoUrl ||
    (item.filename
      ? `${API}/uploads/gallery/${encodeURIComponent(item.filename)}`
      : "");

  const filteredMedia = media.filter((item) => {
    return filter === "all" || getMediaType(item) === filter;
  });

  useEffect(() => {
    const videos = [...videoRefs.current.values()].filter(Boolean);

    if (!videos.length) return;

    if (!("IntersectionObserver" in window)) {
      videos.forEach((video) => {
        video.pause();
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;

          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            video.muted = true;
            video.play().catch(() => {
              // Autoplay may be blocked by the browser.
            });
          } else {
            video.pause();
          }
        });
      },
      { threshold: [0, 0.6] },
    );

    videos.forEach((video) => observer.observe(video));

    return () => {
      observer.disconnect();
      videos.forEach((video) => video.pause());
    };
  }, [filteredMedia, loading]);

  useEffect(() => {
    return () => {
      videoRefs.current.forEach((video) => video?.pause());
      videoRefs.current.clear();
    };
  }, [filter]);

  const counts = {
    all: media.length,
    image: media.filter((item) => getMediaType(item) === "image").length,
    video: media.filter((item) => getMediaType(item) === "video").length,
  };

  return (
    <main className="bm-gallery">
      <style>{`
        .bm-gallery {
          --bm-red: #c91f2c;
          --bm-text: #182230;
          --bm-muted: #667085;
          --bm-border: #e5e7eb;
          max-width: 1320px;
          margin: 0 auto;
          padding: 34px 22px 64px;
          color: var(--bm-text);
          font-family: Inter, system-ui, -apple-system, sans-serif;
        }

        .bm-gallery * { box-sizing: border-box; }

        .bm-gallery-hero {
          position: relative;
          padding: 30px 30px 27px;
          margin-bottom: 26px;
          overflow: hidden;
          background: linear-gradient(120deg, #fff5f5, #fff 68%);
          border: 1px solid #f2d9dc;
          border-radius: 17px;
        }

        .bm-gallery-kicker {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--bm-red);
          text-transform: uppercase;
          letter-spacing: 1.5px;
          font-size: 11px;
          font-weight: 800;
          margin-bottom: 11px;
        }

        .bm-gallery-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--bm-red);
        }

        .bm-gallery-hero h1 {
          margin: 0 0 10px;
          font-size: clamp(29px, 4.5vw, 43px);
          line-height: 1.15;
          letter-spacing: -1.2px;
          font-weight: 850;
        }

        .bm-gallery-hero p {
          max-width: 650px;
          margin: 0;
          color: var(--bm-muted);
          font-size: 15px;
          line-height: 1.7;
        }

      .bm-gallery-toolbar {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  gap: 16px;
  margin: 28px 0 22px;
  flex-wrap: wrap;
}

.bm-gallery-filters {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  width: 100%;
}

.bm-gallery-summary {
  position: absolute;
  right: 0;
  color: var(--bm-muted);
  font-size: 13px;
}

        .bm-gallery-filter {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 42px;
          padding: 10px 16px;
          border: 1px solid var(--bm-border);
          border-radius: 9px;
          background: #fff;
          color: #475467;
          font-size: 13px;
          font-weight: 750;
          cursor: pointer;
          transition: background .2s, color .2s, border-color .2s;
        }

        .bm-gallery-filter:hover {
          border-color: #e7a6ab;
          color: var(--bm-red);
        }

        .bm-gallery-filter.active {
          color: #fff;
          background: var(--bm-red);
          border-color: var(--bm-red);
          box-shadow: 0 3px 8px rgba(201,31,44,.16);
        }

        .bm-gallery-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 23px;
          height: 22px;
          padding: 0 6px;
          border-radius: 6px;
          background: rgba(255,255,255,.22);
          font-size: 11px;
        }

        .bm-gallery-filter:not(.active) .bm-gallery-count {
          background: #f2f4f7;
          color: #475467;
        }

        .bm-gallery-summary {
          color: var(--bm-muted);
          font-size: 13px;
        }

  .bm-gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 400px));
  justify-content: center;
  gap: 22px;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  align-items: start;
}

        .bm-gallery-card {
          min-width: 0;
          overflow: hidden;
          border: 1px solid var(--bm-border);
          border-radius: 13px;
          background: #fff;
          box-shadow: 0 3px 12px rgba(16,24,40,.035);
          transition: transform .2s, box-shadow .2s;
        }

        .bm-gallery-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(16,24,40,.09);
        }

       .bm-gallery-media {
  position: relative;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: #f2f4f7;
  box-sizing: border-box;
}

 .bm-gallery-image,
.bm-gallery-video {
  display: block;
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: #fff;
}

.bm-gallery-image {
  object-fit: contain;
}

.bm-gallery-video {
  object-fit: cover;
  background: #111;
}

        .bm-gallery-image {
          transition: transform .35s;
        }

        .bm-gallery-card:hover .bm-gallery-image {
          transform: scale(1.035);
        }

        .bm-gallery-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 9px;
          border: 1px solid rgba(255,255,255,.65);
          border-radius: 7px;
          background: rgba(20,24,32,.75);
          color: #fff;
          font-size: 11px;
          font-weight: 750;
          backdrop-filter: blur(8px);
        }

        .bm-gallery-card-body {
          padding: 15px 16px 17px;
        }

        .bm-gallery-card-title {
          margin: 0;
          color: var(--bm-text);
          font-size: 16px;
          font-weight: 750;
          line-height: 1.5;
          overflow-wrap: anywhere;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .bm-gallery-empty {
          padding: 65px 18px;
          text-align: center;
          border: 1px dashed #d0d5dd;
          border-radius: 14px;
          background: #fcfcfd;
        }

        .bm-gallery-empty-icon {
          display: grid;
          place-items: center;
          width: 60px;
          height: 60px;
          margin: 0 auto 17px;
          border-radius: 17px;
          background: #fff0f1;
          color: var(--bm-red);
          font-size: 27px;
        }

        .bm-gallery-empty h2 {
          margin: 0 0 8px;
          font-size: 19px;
        }

        .bm-gallery-empty p {
          max-width: 430px;
          margin: 0 auto;
          color: var(--bm-muted);
          font-size: 14px;
          line-height: 1.7;
        }

        .bm-gallery-retry {
          margin-top: 17px;
          padding: 10px 16px;
          border: 0;
          border-radius: 8px;
          background: var(--bm-red);
          color: #fff;
          font-weight: 750;
          cursor: pointer;
        }

        .bm-gallery-error {
          border-color: #fecdca;
          background: #fff7f6;
        }

        .bm-gallery-skeleton {
          height: 280px;
          border: 1px solid var(--bm-border);
          border-radius: 13px;
          background: linear-gradient(90deg, #f2f4f7 25%, #fafafa 50%, #f2f4f7 75%);
          background-size: 200% 100%;
          animation: bm-gallery-shimmer 1.4s infinite linear;
        }

        @keyframes bm-gallery-shimmer {
          from { background-position: 100% 0; }
          to { background-position: -100% 0; }
        }

        @media (max-width: 950px) {
          .bm-gallery-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 17px;
          }
        }

        @media (max-width: 580px) {
          .bm-gallery { padding: 20px 12px 40px; }

          .bm-gallery-hero {
            padding: 23px 18px;
            border-radius: 13px;
          }

          .bm-gallery-hero p { font-size: 13px; }

          // .bm-gallery-toolbar {
          //   align-items: flex-start;
          //   flex-direction: column;
          //   margin: 22px 0 17px;
          // }

          .bm-gallery-toolbar {
  flex-direction: column;
  align-items: center;
}

.bm-gallery-filters {
  width: 100%;
}

.bm-gallery-summary {
  position: static;
  text-align: center;
}

          .bm-gallery-filters { width: 100%; }

          .bm-gallery-filter {
            flex: 1;
            padding: 9px 8px;
            font-size: 12px;
            gap: 5px;
          }

          .bm-gallery-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 11px;
          }

          .bm-gallery-media { aspect-ratio: 4 / 3; }

          .bm-gallery-card { border-radius: 10px; }

          .bm-gallery-card-body { padding: 10px; }

          .bm-gallery-card-title { font-size: 13px; }

          .bm-gallery-badge {
            top: 7px;
            left: 7px;
            padding: 5px 7px;
            font-size: 10px;
          }

          .bm-gallery-skeleton { height: 190px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .bm-gallery-card,
          .bm-gallery-image {
            transition: none;
          }

          .bm-gallery-skeleton { animation: none; }
        }
      `}</style>

      <div className="bm-gallery-toolbar">
        <div
          className="bm-gallery-filters"
          role="group"
          aria-label="Filter gallery media"
        >
          {FILTERS.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`bm-gallery-filter ${filter === item.value ? "active" : ""}`}
              aria-pressed={filter === item.value}
              onClick={() => setFilter(item.value)}
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
              <span className="bm-gallery-count">{counts[item.value]}</span>
            </button>
          ))}
        </div>

        <div className="bm-gallery-summary" aria-live="polite">
          {loading
            ? "Loading media…"
            : `${filteredMedia.length} ${
                filteredMedia.length === 1 ? "item" : "items"
              }`}
        </div>
      </div>

      {error && (
        <div className="bm-gallery-empty bm-gallery-error" role="alert">
          <div className="bm-gallery-empty-icon">!</div>
          <h2>Unable to load gallery</h2>
          <p>{error}. Please check your connection and try again.</p>
          <button
            className="bm-gallery-retry"
            type="button"
            onClick={() => setRetry((value) => value + 1)}
          >
            Try again
          </button>
        </div>
      )}

      {loading && !error && (
        <div className="bm-gallery-grid" aria-label="Loading gallery">
          {Array.from({ length: 6 }, (_, index) => (
            <div className="bm-gallery-skeleton" key={index} />
          ))}
        </div>
      )}

      {!loading && !error && filteredMedia.length === 0 && (
        <div className="bm-gallery-empty">
          <div className="bm-gallery-empty-icon" aria-hidden="true">
            {filter === "image" ? "▧" : filter === "video" ? "▶" : "▦"}
          </div>
          <h2>
            {filter === "image"
              ? "No images available yet"
              : filter === "video"
                ? "No videos available yet"
                : "Gallery is empty"}
          </h2>
          <p>
            {filter === "image"
              ? "Published gallery images will appear here. Try Videos or All Media to explore other content."
              : filter === "video"
                ? "Published videos will appear here as soon as they are available."
                : "Newly published images and videos will appear here."}
          </p>
          {filter !== "all" && (
            <button
              type="button"
              className="bm-gallery-retry"
              onClick={() => setFilter("all")}
            >
              View all media
            </button>
          )}
        </div>
      )}

      {!loading && !error && filteredMedia.length > 0 && (
        <section className="bm-gallery-grid" aria-label={`${filter} gallery`}>
          {filteredMedia.map((item) => {
            const type = getMediaType(item);
            const url = getMediaUrl(item);

            return (
              <article className="bm-gallery-card" key={item._id}>
                <div className="bm-gallery-media">
                  {type === "image" ? (
                    <img
                      className="bm-gallery-image"
                      src={url}
                      alt={item.title || "Gallery image"}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <video
                      ref={(element) => {
                        if (element) {
                          videoRefs.current.set(item._id, element);
                        } else {
                          videoRefs.current.delete(item._id);
                        }
                      }}
                      className="bm-gallery-video"
                      src={url}
                      muted
                      loop
                      playsInline
                      controls
                      preload="metadata"
                      title={item.title}
                    >
                      Your browser does not support video playback.
                    </video>
                  )}

                  <span className="bm-gallery-badge">
                    <span aria-hidden="true">
                      {type === "image" ? "▧" : "▶"}
                    </span>
                    {type === "image" ? "PHOTO" : "VIDEO"}
                  </span>
                </div>

                <div className="bm-gallery-card-body">
                  <h2 className="bm-gallery-card-title">
                    {item.title || "Untitled media"}
                  </h2>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
