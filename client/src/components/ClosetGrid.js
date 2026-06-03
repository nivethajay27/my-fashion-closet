import { useMemo, useState } from 'react';
import ItemCard from './ItemCard';
import { CATEGORIES, OCCASIONS, SEASONS, filterWardrobe } from '../stylingEngine';

export default function ClosetGrid({ items, onDelete }) {
  const [filters, setFilters] = useState({ category: '', occasion: '', season: '', color: '' });
  const colors = useMemo(
    () => [...new Set(items.map((item) => item.color).filter(Boolean))].sort(),
    [items]
  );
  const visible = useMemo(() => filterWardrobe(items, filters), [items, filters]);
  const setFilter = (key) => (event) => setFilters((prev) => ({ ...prev, [key]: event.target.value }));

  return (
    <section className="closet-section">
      <div className="filter-bar">
        <select className="select" value={filters.category} onChange={setFilter('category')} aria-label="Filter category">
          <option value="">All categories</option>
          {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
        </select>
        <select className="select" value={filters.occasion} onChange={setFilter('occasion')} aria-label="Filter occasion">
          <option value="">Any occasion</option>
          {OCCASIONS.map((occasion) => <option key={occasion} value={occasion}>{occasion}</option>)}
        </select>
        <select className="select" value={filters.season} onChange={setFilter('season')} aria-label="Filter season">
          <option value="">Any season</option>
          {SEASONS.map((season) => <option key={season} value={season}>{season}</option>)}
        </select>
        <select className="select" value={filters.color} onChange={setFilter('color')} aria-label="Filter color">
          <option value="">Any color match</option>
          {colors.map((color) => <option key={color} value={color}>{color}</option>)}
        </select>
      </div>

      <div className="closet-count">{visible.length} piece{visible.length === 1 ? '' : 's'} in view</div>
      <div className="grid">
        {visible.map((item) => (
          <ItemCard key={item.id} item={item} onDelete={() => onDelete(item.id)} />
        ))}
      </div>
    </section>
  );
}
