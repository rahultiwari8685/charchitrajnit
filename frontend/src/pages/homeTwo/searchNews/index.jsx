import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

const API = "https://api.bharat19express.com";

export default function SearchNews() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("q") || "");
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const query = searchParams.get("q")?.trim() || "";
    setKeyword(query);

    if (!query) {
      setNews([]);
      setLoading(false);
      setError("");
      return;
    }

    const controller = new AbortController();

    const searchNews = async () => {
      try {
        setLoading(true);
        setError("");

        // Replace this URL with your actual backend search endpoint.
        const response = await fetch(
          `${API}/api/news/search?q=${encodeURIComponent(query)}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Unable to fetch search results.");
        }

        const result = await response.json();

        setNews(result.data || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Unable to load news. Please try again.");
          setNews([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    searchNews();

    return () => controller.abort();
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const query = keyword.trim();

    if (!query) return;

    setSearchParams({ q: query });
  };

  return (
    <div className="container py-4">
      <h2 className="mb-3">Search News</h2>

      <form onSubmit={handleSubmit} className="d-flex gap-2 mb-4">
        <input
          type="search"
          className="form-control"
          placeholder="Search news..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <button type="submit" className="btn btn-danger">
          Search
        </button>
      </form>

      {loading && <p>Searching news...</p>}

      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && searchParams.get("q") && news.length === 0 && (
        <p>No news found.</p>
      )}

      <div className="row">
        {news.map((item) => (
          <div className="col-md-6 mb-3" key={item._id}>
            <div className="card h-100">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="card-img-top"
                  style={{ height: 220, objectFit: "cover" }}
                />
              )}

              <div className="card-body">
                <h5 className="card-title">{item.title}</h5>

                {item.sub_title && (
                  <p className="card-text">{item.sub_title}</p>
                )}

                <Link
                  to={`/news/${item.slug}`}
                  className="btn btn-outline-danger btn-sm"
                >
                  Read More
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
