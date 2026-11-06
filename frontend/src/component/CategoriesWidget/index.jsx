import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = "https://api.bharat19express.com";

const CategoriesWidget = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      const res = await fetch(`${API}/api/categories/getAllCategory`);
      const data = await res.json();

      if (data.success) {
        setCategories(data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="widget category mb30">
      <div className="row">
        <div className="col-6 align-self-center">
          <h2 className="widget-title">Categories</h2>
        </div>

        <div className="col-6 text-right align-self-center">
          <Link to="/categories" className="see_all mb20">
            See All
          </Link>
        </div>
      </div>

      <ul>
        {categories.map((item) => (
          <li key={item._id}>
            <Link
              to={`/category/${item._id}`}
              style={{
                backgroundImage: item.image
                  ? `url(${API}/uploads/categories/${item.image})`
                  : "linear-gradient(135deg,#d32f2f,#b71c1c)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesWidget;
