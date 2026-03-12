// components/presentational/SkeletonLoader.jsx
import React from 'react';

const SkeletonLoader = ({ count = 8 }) => (
  <div className="skeleton-grid" role="status" aria-label="Loading products...">
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="skeleton-card" aria-hidden="true">
        <div className="skeleton-image" />
        <div className="skeleton-body">
          <div className="skeleton-line title" />
          <div className="skeleton-line price" />
          <div className="skeleton-line meta" />
        </div>
      </div>
    ))}
  </div>
);

export default SkeletonLoader;
