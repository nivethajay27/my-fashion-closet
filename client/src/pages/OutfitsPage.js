import { useEffect, useState } from 'react';
import { Outfits } from '../api';
import OutfitCard from '../components/OutfitCard';

export default function OutfitsPage() {
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Outfits.list()
      .then(setOutfits)
      .finally(() => setLoading(false));
  }, []);

  const remove = async (id) => {
    await Outfits.remove(id);
    setOutfits((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <div className="container">
      <h1 className="section-title">Saved Outfits</h1>

      {loading && <div className="helper">Loading outfits…</div>}

      {!loading && outfits.length === 0 && (
        <div className="panel">
          <div className="helper">
            No outfits yet. Go to <strong>Builder</strong> and click <em>Save Outfit</em>.
          </div>
        </div>
      )}

      <div className="grid">
        {outfits.map((o) => (
          <OutfitCard key={o.id} outfit={o} onDelete={() => remove(o.id)} />
        ))}
      </div>
    </div>
  );
}
