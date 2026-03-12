// components/presentational/ProductList.jsx
import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products }) => (
  <section className="product-grid" role="list">
    {products.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))}
  </section>
);

export default ProductList;
