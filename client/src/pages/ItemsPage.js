import { useEffect, useState } from 'react';
import { Items } from '../api';
import ItemCard from '../components/ItemCard';
import ItemForm from '../components/ItemForm';

export default function ItemsPage() {
  const [items, setItems] = useState([]);

  useEffect(() => { Items.list().then(setItems); }, []);

  const create = async (payload) => {
    const created = await Items.create(payload);
    setItems((prev) => [created, ...prev]);
  };

  const remove = async (id) => {
    await Items.remove(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="container">
      <h1 className="section-title">Items</h1>
      <ItemForm onSubmit={create} />
      <div className="grid">
        {items.map((i) => (
          <ItemCard key={i.id} item={i} onDelete={() => remove(i.id)} />
        ))}
      </div>
    </div>
  );
}

