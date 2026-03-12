// components/presentational/ProductCard.jsx
import React from 'react';

const ProductCard = ({ product }) => (
  <article className="product-card">
    <img src={product.thumbnail} alt={product.title} loading="lazy" />
    <div className="card-body">
      <h3 className="title">{product.title}</h3>
      <p className="price">${parseFloat(product.price).toFixed(2)}</p>
      <div className="meta">
        <span className="rating">{product.rating}⭐ ({product.discountPercentage}% off)</span>
        <span className={`stock ${product.stock === 0 ? 'out' : 'in'}`}>
          {product.stock > 0 ? `${product.stock} left` : 'Out of Stock'}
        </span>
      </div>
    </div>
  </article>
);

export default ProductCard;
