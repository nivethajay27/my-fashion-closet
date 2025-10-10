import { useEffect, useMemo, useState } from 'react';
import { Items, Outfits } from '../api';

const CATS = ['top', 'bottom', 'jacket','shoes', 'accessory'];

export default function BuilderPage() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => { Items.list().then(setItems); }, []);
  const byCat = useMemo(
    () => Object.fromEntries(CATS.map((c) => [c, items.filter((i) => i.category === c)])),
    [items]
  );

  const toggle = (id) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);

  const randomize = () => {
    const picks = CATS.map((c) => {
      const arr = byCat[c] || [];
      return arr.length ? arr[Math.floor(Math.random() * arr.length)].id : null;
    }).filter(Boolean);
    setSelected(picks);
  };

  const save = async () => {
    const name = `Outfit ${new Date().toLocaleString()}`;
    await Outfits.create({ name, items: selected });
    setSelected([]);
    alert('Saved!');
  };

  return (
    <div className="container">
      <h1 className="section-title">Outfit Builder</h1>
      <div className="builder-controls">
        <button className="btn" onClick={randomize}>🎲 Randomize</button>
        <button className="btn btn-primary" onClick={save} disabled={!selected.length}>Save Outfit</button>
      </div>

      <div className="builder-grid">
        {CATS.map((c) => (
          <div className="panel" key={c}>
            <h3>{c.toUpperCase()}</h3>
            <div className="swatch-grid">
              {(byCat[c] || []).map((i) => (
                <img
                  key={i.id}
                  src={i.imageUrl}
                  alt={i.name}
                  title={i.name}
                  className={`swatch ${selected.includes(i.id) ? 'selected' : ''}`}
                  onClick={() => toggle(i.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
