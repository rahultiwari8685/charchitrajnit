import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const API = "https://api.bharat19express.com";

const EpaperReader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const viewerRef = useRef(null);

  const [epaper, setEpaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [error, setError] = useState("");

  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const fetchEpaper = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API}/api/magazines/${id}`);
        const result = await response.json();

        if (result.success && result.data) {
          setEpaper(result.data);
        } else {
          setError("Epaper not found.");
        }
      } catch (err) {
        console.error("Epaper Reader Error:", err);
        setError("Unable to load epaper.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEpaper();
    }
  }, [id]);

  const pdfUrl = epaper?.pdfFile
    ? `${API}/uploads/magazines/${epaper.pdfFile}`
    : "";

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setPdfLoading(false);
  };

  const previousPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const nextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.6));
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 2));
  };

  const resetZoom = () => {
    setScale(1);
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await viewerRef.current?.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const downloadPdf = () => {
    if (!pdfUrl) return;

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  };

  if (loading) {
    return (
      <>
        <div style={styles.loadingPage}>
          <div style={styles.spinner}></div>

          <p style={styles.loadingText}>Loading Epaper...</p>
        </div>

        <style>
          {`
            @keyframes epaperReaderSpin {
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
  }

  if (error || !epaper) {
    return (
      <div style={styles.errorPage}>
        <div style={styles.errorIcon}>📰</div>

        <h2 style={styles.errorTitle}>Epaper Not Found</h2>

        <p style={styles.errorText}>
          {error || "This epaper is not available."}
        </p>

        <button onClick={() => navigate("/epaper")} style={styles.backButton}>
          ← Back to Epaper
        </button>
      </div>
    );
  }

  return (
    <div
      ref={viewerRef}
      style={{
        ...styles.page,
        ...(isFullscreen ? styles.fullscreenPage : {}),
      }}
    >
      <div style={styles.header}>
        <div style={styles.headerInner}>
          {/* BACK */}

          <button onClick={() => navigate("/epaper")} style={styles.backBtn}>
            ←<span>Back</span>
          </button>

          {/* TITLE */}

          <div style={styles.titleArea}>
            <div style={styles.category}>{epaper.category}</div>

            <h1 style={styles.title}>{epaper.title}</h1>
          </div>

          {/* DOWNLOAD */}

          <button onClick={downloadPdf} style={styles.downloadBtn}>
            ↓<span>Download</span>
          </button>
        </div>
      </div>

      <div style={styles.toolbar}>
        <div style={styles.toolbarInner}>
          {/* PREVIOUS */}

          <button
            onClick={previousPage}
            disabled={pageNumber <= 1}
            style={{
              ...styles.controlBtn,
              ...(pageNumber <= 1 ? styles.disabledBtn : {}),
            }}
          >
            ← Previous
          </button>

          {/* PAGE NUMBER */}

          <div style={styles.pageInfo}>
            <input
              type="number"
              min="1"
              max={numPages || 1}
              value={pageNumber}
              onChange={(e) => {
                const value = Number(e.target.value);

                if (value >= 1 && value <= numPages) {
                  setPageNumber(value);
                }
              }}
              style={styles.pageInput}
            />

            <span>/ {numPages || 0}</span>
          </div>

          {/* NEXT */}

          <button
            onClick={nextPage}
            disabled={pageNumber >= numPages || numPages === 0}
            style={{
              ...styles.controlBtn,
              ...(pageNumber >= numPages ? styles.disabledBtn : {}),
            }}
          >
            Next →
          </button>

          {/* DIVIDER */}

          <div style={styles.divider}></div>

          {/* ZOOM */}

          <button onClick={zoomOut} style={styles.iconBtn}>
            −
          </button>

          <button onClick={resetZoom} style={styles.zoomText}>
            {Math.round(scale * 100)}%
          </button>

          <button onClick={zoomIn} style={styles.iconBtn}>
            +
          </button>

          {/* FULLSCREEN */}

          <button onClick={toggleFullscreen} style={styles.fullscreenBtn}>
            {isFullscreen ? "⛶ Exit" : "⛶ Fullscreen"}
          </button>
        </div>
      </div>

      <div style={styles.viewer}>
        {pdfLoading && (
          <div style={styles.pdfLoading}>
            <div style={styles.spinner}></div>

            <p style={styles.loadingText}>Preparing PDF...</p>
          </div>
        )}

        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) => {
            console.error("PDF Load Error:", error);

            setPdfLoading(false);
            setError("Unable to load this PDF.");
          }}
          loading=""
        >
          <div style={styles.pageWrapper}>
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </div>
        </Document>
      </div>

      <div style={styles.bottomBar}>
        <button
          onClick={previousPage}
          disabled={pageNumber <= 1}
          style={{
            ...styles.bottomBtn,
            ...(pageNumber <= 1 ? styles.disabledBtn : {}),
          }}
        >
          ← Previous
        </button>

        <span style={styles.bottomPage}>
          Page {pageNumber} of {numPages}
        </span>

        <button
          onClick={nextPage}
          disabled={pageNumber >= numPages || numPages === 0}
          style={{
            ...styles.bottomBtn,
            ...(pageNumber >= numPages ? styles.disabledBtn : {}),
          }}
        >
          Next →
        </button>
      </div>

      <style>
        {`
          * {
            box-sizing: border-box;
          }

          .react-pdf__Page {
            margin: 0 auto;
          }

          .react-pdf__Page canvas {
            display: block;
            max-width: 100%;
            height: auto !important;
          }

          @media (max-width: 768px) {
            .epaper-mobile-hide {
              display: none;
            }
          }

          @keyframes epaperReaderSpin {
            0% {
              transform: rotate(0deg);
            }

            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#202020",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
  },

  fullscreenPage: {
    width: "100vw",
    height: "100vh",
    background: "#111",
  },

  header: {
    background: "#151515",
    borderBottom: "1px solid #333",
    flexShrink: 0,
  },

  headerInner: {
    maxWidth: "1400px",
    width: "100%",
    minHeight: "70px",
    margin: "0 auto",
    padding: "10px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
  },

  backBtn: {
    border: "none",
    background: "transparent",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "10px",
    whiteSpace: "nowrap",
  },

  titleArea: {
    flex: 1,
    textAlign: "center",
    minWidth: 0,
  },

  category: {
    color: "#e31e24",
    fontSize: "10px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    marginBottom: "3px",
  },

  title: {
    margin: 0,
    color: "#fff",
    fontSize: "18px",
    fontWeight: "800",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  downloadBtn: {
    border: "none",
    borderRadius: "5px",
    background: "#e31e24",
    color: "#fff",
    padding: "10px 14px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    whiteSpace: "nowrap",
  },

  toolbar: {
    background: "#252525",
    borderBottom: "1px solid #3a3a3a",
    flexShrink: 0,
  },

  toolbarInner: {
    maxWidth: "1000px",
    margin: "0 auto",
    minHeight: "58px",
    padding: "8px 15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    flexWrap: "wrap",
  },

  controlBtn: {
    border: "1px solid #555",
    background: "#333",
    color: "#fff",
    borderRadius: "5px",
    minHeight: "36px",
    padding: "0 13px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },

  disabledBtn: {
    opacity: 0.35,
    cursor: "not-allowed",
  },

  pageInfo: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "#ddd",
    fontSize: "13px",
    fontWeight: "700",
  },

  pageInput: {
    width: "48px",
    height: "36px",
    border: "1px solid #555",
    borderRadius: "5px",
    background: "#333",
    color: "#fff",
    textAlign: "center",
    fontSize: "13px",
    fontWeight: "700",
    outline: "none",
  },

  divider: {
    width: "1px",
    height: "28px",
    background: "#444",
    margin: "0 5px",
  },

  iconBtn: {
    width: "36px",
    height: "36px",
    border: "1px solid #555",
    borderRadius: "5px",
    background: "#333",
    color: "#fff",
    fontSize: "20px",
    cursor: "pointer",
  },

  zoomText: {
    minWidth: "55px",
    height: "36px",
    border: "none",
    background: "transparent",
    color: "#fff",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },

  fullscreenBtn: {
    border: "1px solid #555",
    background: "#333",
    color: "#fff",
    borderRadius: "5px",
    minHeight: "36px",
    padding: "0 12px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },

  viewer: {
    flex: 1,
    overflow: "auto",
    padding: "35px 15px 50px",
    background: "#303030",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },

  pageWrapper: {
    background: "#fff",
    boxShadow: "0 8px 35px rgba(0,0,0,.45)",
    margin: "0 auto",
  },

  pdfLoading: {
    position: "absolute",
    top: "180px",
    left: "50%",
    transform: "translateX(-50%)",
    textAlign: "center",
  },

  spinner: {
    width: "40px",
    height: "40px",
    margin: "0 auto",
    border: "3px solid #555",
    borderTop: "3px solid #e31e24",
    borderRadius: "50%",
    animation: "epaperReaderSpin .8s linear infinite",
  },

  loadingPage: {
    minHeight: "100vh",
    background: "#202020",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },

  loadingText: {
    marginTop: "15px",
    color: "#bbb",
    fontSize: "14px",
  },

  errorPage: {
    minHeight: "100vh",
    background: "#f6f7f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    textAlign: "center",
    padding: "30px",
  },

  errorIcon: {
    fontSize: "55px",
    marginBottom: "15px",
  },

  errorTitle: {
    margin: "0 0 8px",
    color: "#222",
    fontSize: "24px",
  },

  errorText: {
    margin: "0 0 20px",
    color: "#777",
    fontSize: "14px",
  },

  backButton: {
    border: "none",
    borderRadius: "5px",
    background: "#e31e24",
    color: "#fff",
    padding: "11px 18px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },

  bottomBar: {
    minHeight: "58px",
    background: "#151515",
    borderTop: "1px solid #333",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    padding: "8px 15px",
    flexShrink: 0,
  },

  bottomBtn: {
    border: "1px solid #555",
    background: "#333",
    color: "#fff",
    borderRadius: "5px",
    padding: "8px 14px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },

  bottomPage: {
    color: "#ccc",
    fontSize: "12px",
    fontWeight: "700",
  },
};

export default EpaperReader;
