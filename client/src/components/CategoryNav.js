import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Filter(props) {
  let [categories, setCategories] = useState("");

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = () => {
    fetch(`/categories`)
      .then((response) => response.json())
      .then((response) => {
        setCategories(response);
      });
  };

  return (
    <div className="d-flex justify-content-around align-items-end border-bottom py-3">
      {categories &&
        categories.map((category) => (
          <Link to={`/category/${category.id}`} key={category.id}>
            {category.name}
          </Link>
        ))}
    </div>
  );
}