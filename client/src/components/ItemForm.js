import { useState } from 'react';
import { CATEGORIES, OCCASIONS, SEASONS } from '../stylingEngine';

const emptyForm = {
  name: '',
  category: 'top',
  color: '',
  material: '',
  season: ['all'],
  occasion: ['casual'],
  tags: '',
  imageUrl: ''
};

export default function ItemForm({ onSubmit }) {
  const [form, setForm] = useState(emptyForm);

  const handle = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const handleMulti = (key) => (event) => {
    const values = [...event.target.selectedOptions].map((option) => option.value);
    setForm({ ...form, [key]: values });
  };

  return (
    <form
      className="form"
      onSubmit={(e) => {
        e.preventDefault();
        if (!form.name || !form.imageUrl) return;
        onSubmit({
          ...form,
          tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
        });
        setForm(emptyForm);
      }}
    >
      <div className="row">
        <input className="input" placeholder="Name (e.g. White Tee)" value={form.name} onChange={handle('name')} />
        <select className="select" value={form.category} onChange={handle('category')}>
          {CATEGORIES.map((category) => <option key={category}>{category}</option>)}
        </select>
      </div>
      <div className="row">
        <input className="input" placeholder="Color (e.g. white)" value={form.color} onChange={handle('color')} />
        <input className="input" placeholder="Material (e.g. cotton)" value={form.material} onChange={handle('material')} />
      </div>
      <div className="row">
        <label className="compact-label">
          Season
          <select className="select" multiple value={form.season} onChange={handleMulti('season')}>
            {SEASONS.map((season) => <option key={season}>{season}</option>)}
          </select>
        </label>
        <label className="compact-label">
          Occasion
          <select className="select" multiple value={form.occasion} onChange={handleMulti('occasion')}>
            {OCCASIONS.map((occasion) => <option key={occasion}>{occasion}</option>)}
          </select>
        </label>
      </div>
      <input
        className="input"
        placeholder="Tags, comma separated (streetwear, minimal, vintage)"
        value={form.tags}
        onChange={handle('tags')}
      />
      <input
        className="input"
        placeholder="Image URL (e.g. https://source.unsplash.com/400x400/?dress,fashion)"
        value={form.imageUrl}
        onChange={handle('imageUrl')}
      />
      <div className="form-actions">
        <button className="btn btn-primary" type="submit">Add Item</button>
      </div>
    </form>
  );
}
