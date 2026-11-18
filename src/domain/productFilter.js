export const PRODUCT_CATEGORIES = [
  { id: 'all', label: 'Все продукты' },
  { id: 'cards', label: 'Карты' },
  { id: 'deposits', label: 'Депозиты' },
  { id: 'loans', label: 'Кредиты' },
  { id: 'accounts', label: 'Счета' },
];

export function filterProducts(products, { searchQuery, category }) {
  const query = searchQuery.trim().toLowerCase();

  return products.filter((item) => {
    const matchesCategory = category === 'all' || item.category === category;
    const matchesSearch =
      !query ||
      item.title.toLowerCase().includes(query) ||
      item.desc.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });
}