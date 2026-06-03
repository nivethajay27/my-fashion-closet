import { useEffect, useState } from 'react';
import { Items } from '../api';
import ClosetGrid from '../components/ClosetGrid';
import ItemForm from '../components/ItemForm';
import { sampleWardrobe } from '../sampleWardrobe';

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Items.list()
      .then(setItems)
      .catch((e) => {
        setItems(sampleWardrobe);
        setError(`Using demo wardrobe because the API is unavailable: ${e.message}`);
      });
  }, []);

  const create = async (payload) => {
    try {
      const created = await Items.create(payload);
      setItems((prev) => [created, ...prev]);
      setError('');
    } catch (e) {
      const demoItem = { ...payload, id: Date.now() };
      setItems((prev) => [demoItem, ...prev]);
      setError(`Saved locally for this session because the API is unavailable: ${e.message}`);
    }
  };

  const remove = async (id) => {
    try {
      await Items.remove(id);
    } catch (_e) {
      // Demo fallback still removes the item from the visible closet.
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="container home-page">
      <span className="material-symbols-rounded home-decor cloud-decor" aria-hidden="true">cloud</span>
      <span className="material-symbols-rounded home-decor heart-decor" aria-hidden="true">favorite</span>
      <span className="material-symbols-rounded home-decor sparkle-decor sparkle-one" aria-hidden="true">auto_awesome</span>
      <span className="material-symbols-rounded home-decor sparkle-decor sparkle-two" aria-hidden="true">checkroom</span>
      <section className="home-hero">
        <div>
          <div className="page-kicker">Virtual closet</div>
          <h1 className="section-title">Curate pieces by style, season, and occasion.</h1>
        </div>
        <div className="hero-orbit" aria-hidden="true">
          <span className="material-symbols-rounded orbit-icon">checkroom</span>
          <span>Style</span>
          <span>Try on</span>
          <span>Score</span>
        </div>
      </section>
      <ItemForm onSubmit={create} />
      {error && <div className="notice">{error}</div>}
      <ClosetGrid items={items} onDelete={remove} />
    </div>
  );
}
