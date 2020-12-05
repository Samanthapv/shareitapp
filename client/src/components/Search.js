import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProductGrid from "./ProductGrid";
import { getFilteredProducts } from "../services/requests";
import queryString from "query-string";
import Footer from "./Footer";

export default function Search() {
  const [products, setProducts] = useState([]);
  const { search } = useLocation();
  const parsed = queryString.parse(search);
  const [loadMore, setLoadMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const offset = 9;

  // Fetch products every time the query string changes

  useEffect(() => {
    setIsLoading(true);
    searchProducts();
  }, [search]);

  const searchProducts = async () => {
    try {
      const res = await getFilteredProducts(parsed);
      setProducts(res.data);
      setIsLoading(false);

      // Set boolean for load more button
      if (res.data.length < offset) setLoadMore(false);
      else setLoadMore(true);
    } catch (error) {
      console.log(error);
    }
  };

  // Load more products

  const loadMoreProducts = async () => {
    const params = { ...parsed, offset };

    try {
      const res = await getFilteredProducts(params);
      setProducts((products) => [...products, ...res.data]);
      if (res.data.length < offset) setLoadMore(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="mb-10 min-h-screen">
        <ProductGrid isLoading={isLoading} products={products} />
        {loadMore && (
          <button
            onClick={loadMoreProducts}
            className="btn btn-primary mx-auto mb-5 block"
          >
            Load more
          </button>
        )}
        {isLoading && (
          <div className="text-center">
            <i className="fas fa-spinner fa-pulse fa-3x"></i>
          </div>
        )}
      </div>
<Footer />
    </div>
  );
}
