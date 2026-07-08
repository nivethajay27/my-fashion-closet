import { useEffect, useState } from 'react';
import { Items } from '../api';
import ClosetGrid from '../components/ClosetGrid';
import ItemForm from '../components/ItemForm';
import { sampleWardrobe } from '../sampleWardrobe';
import { addLocalWardrobeItem, mergeWardrobe, removeLocalWardrobeItem } from '../closetStorage';

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Items.list()
      .then((rows) => setItems(mergeWardrobe(rows)))
      .catch((e) => {
        setItems(mergeWardrobe(sampleWardrobe));
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
      addLocalWardrobeItem(demoItem);
      setItems((prev) => [demoItem, ...prev]);
      setError(`Saved locally for this session because the API is unavailable: ${e.message}`);
    }
  };

  const remove = async (id) => {
    try {
      await Items.remove(id);
    } catch (_e) {
      // Demo fallback still removes the item from the visible closet.
      removeLocalWardrobeItem(id);
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="container home-page">
      <section className="home-hero">
        <div>
          <div className="page-kicker">Virtual closet</div>
          <h1 className="section-title">Curate pieces by style, season, and occasion.</h1>
        </div>
      </section>
      <ItemForm onSubmit={create} />
      {error && <div className="notice">{error}</div>}
      <ClosetGrid items={items} onDelete={remove} />
    </div>
  );
}
