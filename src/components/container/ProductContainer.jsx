// components/container/ProductContainer.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ProductList from '../presentational/ProductList';
import SkeletonLoader from '../presentational/SkeletonLoader';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in ms

const ProductContainer = ({ category = '' }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  const cacheRef = useRef({ data: [], timestamp: 0 });

  const buildUrl = () => {
    const base = 'https://dummyjson.com/products';
    return category ? `${base}/category/${category}?limit=20` : `${base}?limit=20`;
  };

  const fetchProducts = useCallback(async () => {
    const now = Date.now();
    const cached = cacheRef.current;
    
    // Closure-based caching check
    if (cached.data.length > 0 && (now - cached.timestamp < CACHE_DURATION)) {
      setProducts(cached.data);
      setLoading(false);
      return;
    }

    // AbortController for race conditions & stale state
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setLoading(true);
      setError(null);
      const url = buildUrl();
      
      const response = await fetch(url, { 
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      const data = result.products || [];
      
      // Update cache closure
      cacheRef.current = { data, timestamp: now };
      
      // Only update state if not aborted (prevents stale state)
      if (!controller.signal.aborted) {
        setProducts(data);
      }
    } catch (err) {
      // Ignore abort errors (race condition handling)
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      // Only stop loading if not aborted
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [category]);

  // Effect for initial fetch + category changes (routing prep)
  useEffect(() => {
    fetchProducts();
    
    // Cleanup: abort pending requests on unmount/re-fetch
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchProducts]);

  return (
    <div className="product-container">
      {/* Attractive Hero Section */}
      <section className="hero" role="banner">
        <h1>Discover Amazing Products</h1>
        <p>Browse our curated collection of high-quality items with exclusive discounts.</p>
        {category && <p className="category-tag">Category: {category}</p>}
      </section>

      {/* Error Handling */}
      {error && (
        <div className="error-message" role="alert">
          <strong>Oops!</strong> {error}
          <button 
            className="retry-btn"
            onClick={fetchProducts}
            aria-label="Retry fetching products"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Conditional Rendering: Skeleton or Products */}
      {loading ? (
        <SkeletonLoader count={8} />
      ) : (
        <ProductList products={products} />
      )}
    </div>
  );
};

export default ProductContainer;
