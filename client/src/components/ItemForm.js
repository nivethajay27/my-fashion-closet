import { useState } from 'react';

export default function ItemForm({ onSubmit }) {
  const [form, setForm] = useState({ name: '', category: 'top', imageUrl: '' });

  const handle = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <form
      className="form"
      onSubmit={(e) => {
        e.preventDefault();
        if (!form.name || !form.imageUrl) return;
        onSubmit(form);
        setForm({ name: '', category: 'top', imageUrl: '' });
      }}
    >
      <div className="row">
        <input className="input" placeholder="Name (e.g. White Tee)" value={form.name} onChange={handle('name')} />
        <select className="select" value={form.category} onChange={handle('category')}>
          <option>top</option><option>bottom</option><option>jacket</option><option>shoes</option><option>accessory</option>
        </select>
      </div>
      <input
        className="input"
        placeholder="Image URL (e.g. https://source.unsplash.com/400x400/?dress,fashion)"
        value={form.imageUrl}
        onChange={handle('imageUrl')}
      />
      <div  style={{ textAlign: "center" }}>
        <button className="btn btn-primary" type="submit">Add Item</button>

      </div>
    </form>
  );
}
