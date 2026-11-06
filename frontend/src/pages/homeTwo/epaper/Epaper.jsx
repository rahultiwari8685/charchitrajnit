import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
const API = "https://api.bharat19express.com";

const Epaper = () => {
  const [epapers, setEpapers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    fetchEpapers();
  }, []);

  const fetchEpapers = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API}/api/magazines`);

      const result = await response.json();

      if (result.success) {
        setEpapers(result.data || []);
      } else {
        setEpapers([]);
      }
    } catch (error) {
      console.error("Epaper Error:", error);
      setEpapers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredEpapers = useMemo(() => {
    let data = [...epapers];

    // Only published/active epapers
    data = data.filter((item) => item.status === true);

    // Filter by category
    if (filter !== "all") {
      data = data.filter(
        (item) => item.category?.toLowerCase() === filter.toLowerCase(),
      );
    }

    // Latest first
    return data.sort((a, b) => {
      const dateA = new Date(a.issueDate || a.createdAt || 0);

      const dateB = new Date(b.issueDate || b.createdAt || 0);

      return dateB - dateA;
    });
  }, [epapers, filter]);

  const getImageUrl = (item) => {
    if (!item.coverImage) {
      return "/assets/images/placeholder.jpg";
    }

    return `${API}/uploads/magazines/${item.coverImage}`;
  };

  const getPdfUrl = (item) => {
    if (!item.pdfFile) {
      return "#";
    }

    return `${API}/uploads/magazines/${item.pdfFile}`;
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      {/* =================================================
          EPAPER PAGE
      ================================================= */}

      <div
        style={{
          background: "#f6f7f9",
          minHeight: "100vh",
          padding: "55px 0 80px",
        }}
      >
        <div
          className="container"
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {/* =================================================
              HEADER
          ================================================= */}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: "30px",
              marginBottom: "30px",
              flexWrap: "wrap",
            }}
          >
            {/* LEFT */}

            <div
              style={{
                flex: "1 1 500px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  color: "#e31e24",
                  fontSize: "12px",
                  fontWeight: "800",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                DIGITAL EDITION
              </span>

              <h1
                style={{
                  margin: "0 0 8px",
                  fontSize: "42px",
                  lineHeight: "1.15",
                  fontWeight: "800",
                  color: "#151515",
                }}
              >
                Epaper
              </h1>

              <p
                style={{
                  margin: 0,
                  color: "#777",
                  fontSize: "15px",
                  lineHeight: "1.7",
                }}
              >
                Read the latest newspaper and magazine editions online.
              </p>
            </div>

            {/* =================================================
                DROPDOWN
            ================================================= */}

            <div
              style={{
                width: "230px",
                flexShrink: 0,
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "7px",
                  color: "#555",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                Epaper Type
              </label>

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{
                  width: "100%",
                  height: "46px",
                  padding: "0 14px",
                  border: "1px solid #ddd",
                  borderRadius: "7px",
                  background: "#fff",
                  color: "#222",
                  fontSize: "14px",
                  fontWeight: "600",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="all">All Epaper</option>

                <option value="newspaper">Newspaper</option>

                <option value="magazine">Magazine</option>
              </select>
            </div>
          </div>

          {/* =================================================
              FILTER BUTTONS
          ================================================= */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "32px",
              paddingBottom: "15px",
              borderBottom: "1px solid #e5e5e5",
              overflowX: "auto",
            }}
          >
            {[
              {
                value: "all",
                label: "All Epaper",
              },
              {
                value: "newspaper",
                label: "Newspaper",
              },
              {
                value: "magazine",
                label: "Magazine",
              },
            ].map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setFilter(tab.value)}
                style={{
                  flexShrink: 0,
                  border:
                    filter === tab.value
                      ? "1px solid #e31e24"
                      : "1px solid #ddd",

                  borderRadius: "30px",

                  padding: "9px 18px",

                  background: filter === tab.value ? "#e31e24" : "#fff",

                  color: filter === tab.value ? "#fff" : "#555",

                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer",

                  transition: "all .25s ease",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (
            <div
              style={{
                minHeight: "300px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  border: "3px solid #ddd",
                  borderTop: "3px solid #e31e24",
                  borderRadius: "50%",
                  animation: "epaperSpin .8s linear infinite",
                }}
              />

              <p
                style={{
                  marginTop: "15px",
                  color: "#777",
                  fontSize: "14px",
                }}
              >
                Loading Epaper...
              </p>
            </div>
          )}

          {/* =================================================
              EMPTY
          ================================================= */}

          {!loading && epapers.length === 0 && (
            <div
              style={{
                padding: "75px 20px",
                border: "1px solid #eee",
                borderRadius: "12px",
                background: "#fff",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "46px",
                  marginBottom: "12px",
                }}
              >
                📰
              </div>

              <h3
                style={{
                  margin: "0 0 8px",
                  color: "#222",
                  fontSize: "22px",
                }}
              >
                No Epaper Found
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#777",
                  fontSize: "14px",
                }}
              >
                No epaper is available for the selected category.
              </p>
            </div>
          )}

          {/* =================================================
              EPAPER GRID
          ================================================= */}

          {!loading && filteredEpapers.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "28px",
              }}
            >
              {filteredEpapers.map((item) => (
                <article
                  key={`${item.category}-${item._id}`}
                  style={{
                    overflow: "hidden",
                    border: "1px solid #e8e8e8",
                    borderRadius: "12px",
                    background: "#fff",
                    boxShadow: "0 3px 15px rgba(0,0,0,.04)",
                    transition: "all .3s ease",
                  }}
                >
                  {/* =================================================
                        IMAGE
                    ================================================= */}

                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "350px",
                      overflow: "hidden",
                      background: "#eee",
                    }}
                  >
                    <img
                      src={getImageUrl(item)}
                      alt={item.title}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />

                    {/* TYPE */}

                    <span
                      style={{
                        position: "absolute",
                        top: "14px",
                        left: "14px",
                        padding: "6px 11px",
                        borderRadius: "4px",
                        background: "rgba(0,0,0,.82)",
                        color: "#fff",
                        fontSize: "10px",
                        fontWeight: "800",
                        textTransform: "uppercase",
                      }}
                    >
                      {item.category}
                    </span>

                    {/* FEATURED */}

                    {item.featured && (
                      <span
                        style={{
                          position: "absolute",
                          top: "14px",
                          right: "14px",
                          padding: "6px 11px",
                          borderRadius: "4px",
                          background: "#e31e24",
                          color: "#fff",
                          fontSize: "10px",
                          fontWeight: "800",
                          textTransform: "uppercase",
                        }}
                      >
                        Featured
                      </span>
                    )}
                  </div>

                  {/* =================================================
                        CONTENT
                    ================================================= */}

                  <div
                    style={{
                      padding: "20px",
                    }}
                  >
                    {/* DATE */}

                    <div
                      style={{
                        marginBottom: "8px",
                        color: "#e31e24",
                        fontSize: "12px",
                        fontWeight: "700",
                      }}
                    >
                      {formatDate(item.issueDate || item.createdAt)}
                    </div>

                    {/* TITLE */}

                    <h2
                      style={{
                        margin: "0 0 10px",
                        color: "#161616",
                        fontSize: "20px",
                        lineHeight: "1.35",
                        fontWeight: "750",
                      }}
                    >
                      {item.title}
                    </h2>

                    {/* DESCRIPTION */}

                    {item.description && (
                      <p
                        style={{
                          margin: "0 0 18px",
                          minHeight: "45px",
                          color: "#777",
                          fontSize: "13px",
                          lineHeight: "1.7",
                        }}
                      >
                        {item.description.length > 115
                          ? `${item.description.substring(0, 115)}...`
                          : item.description}
                      </p>
                    )}

                    {/* =================================================
                          FOOTER
                      ================================================= */}

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px",
                        paddingTop: "15px",
                        borderTop: "1px solid #eee",
                      }}
                    >
                      <span
                        style={{
                          color: "#777",
                          fontSize: "12px",
                          fontWeight: "600",
                          textTransform: "capitalize",
                        }}
                      >
                        {item.category}
                      </span>

                      {/* PDF BUTTON */}

                      {item.pdfFile && (
                        <button
                          type="button"
                          onClick={() => navigate(`/epaper/read/${item._id}`)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "7px",
                            minHeight: "36px",
                            padding: "0 14px",
                            border: "none",
                            borderRadius: "5px",
                            background: "#151515",
                            color: "#fff",
                            fontSize: "12px",
                            fontWeight: "700",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Read Epaper
                          <span
                            style={{
                              fontSize: "16px",
                            }}
                          >
                            →
                          </span>
                        </button>
                      )}

                      {/* {item.pdfFile && (
                        <a
                          href={getPdfUrl(item)}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "7px",
                            minHeight: "36px",
                            padding: "0 14px",
                            borderRadius: "5px",
                            background: "#151515",
                            color: "#fff",
                            fontSize: "12px",
                            fontWeight: "700",
                            textDecoration: "none",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Read Epaper
                          <span
                            style={{
                              fontSize: "16px",
                            }}
                          >
                            →
                          </span>
                        </a>
                      )} */}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* =================================================
          ANIMATION
      ================================================= */}

      <style>
        {`
          @keyframes epaperSpin {
            0% {
              transform: rotate(0deg);
            }

            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </>
  );
};

export default Epaper;
