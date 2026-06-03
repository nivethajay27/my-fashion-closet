import { useMemo, useState } from 'react';

const layerOrder = ['bottom', 'top', 'dress', 'outerwear', 'accessory', 'shoes'];
const layerClass = {
  bottom: 'try-layer bottom-layer',
  top: 'try-layer top-layer',
  dress: 'try-layer dress-layer',
  outerwear: 'try-layer outerwear-layer',
  accessory: 'try-layer accessory-layer',
  shoes: 'try-layer shoes-layer'
};

export default function TryOnPreview({ outfit, lockedIds, onToggleLock, onSwap }) {
  const [avatar, setAvatar] = useState('');
  const ordered = useMemo(
    () => [...outfit].sort((a, b) => layerOrder.indexOf(a.category) - layerOrder.indexOf(b.category)),
    [outfit]
  );

  return (
    <section className="tryon-shell">
      <div className="tryon-stage" aria-label="Virtual try-on preview">
        {avatar ? <img className="avatar-photo" src={avatar} alt="Uploaded avatar" /> : <div className="avatar-figure" />}
        {ordered.map((item) => (
          <img
            key={item.id}
            className={layerClass[item.category] || 'try-layer'}
            src={item.imageUrl}
            alt={item.name}
            title={item.name}
          />
        ))}
      </div>

      <div className="tryon-controls">
        <label className="upload-control">
          Upload body image
          <input
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) setAvatar(URL.createObjectURL(file));
            }}
          />
        </label>

        {outfit.map((item) => (
          <div className="tryon-item-control" key={item.id}>
            <span>{item.category}: {item.name}</span>
            <div>
              <button type="button" className="mini-btn" onClick={() => onSwap(item.category)}>Swap</button>
              <button
                type="button"
                className={`mini-btn ${lockedIds.includes(item.id) ? 'locked' : ''}`}
                onClick={() => onToggleLock(item.id)}
              >
                {lockedIds.includes(item.id) ? 'Locked' : 'Lock'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
