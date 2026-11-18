import React, { useState } from 'react';
import { getBankProducts } from '../api/bankRepository';
import { PRODUCT_CATEGORIES, filterProducts } from '../domain/productFilter';

export function ProductsGrid() {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');

  const allProducts = getBankProducts();
  const filtered = filterProducts(allProducts, { searchQuery, category });

  return (
    <section id="products" className="products-section">
      <div className="filter-bar">
        <div className="pill-group">
          {PRODUCT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={category === cat.id ? 'pill active' : 'pill'}
              onClick={() => setCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <input
          type="text"
          className="search-input"
          placeholder="Поиск по продуктам..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">Ничего не найдено по запросу «{searchQuery}»</div>
      ) : (
        <div className="products-grid">
          {filtered.map((item) => (
            <div className="product-card" key={item.title}>
              <div className="product-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <span className="product-link">{item.cta}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}