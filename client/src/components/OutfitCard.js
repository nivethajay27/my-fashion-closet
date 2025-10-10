import { useState } from "react";

export default function OutfitCard({ outfit, onDelete }) {
  const [open, setOpen] = useState(false);
  const items = outfit.items || [];
  const fallback = "https://placehold.co/400x400?text=No+Image";

  return (
    <>
      <article className="card" onClick={() => setOpen(true)}>
        <div className="collage">
          {items.slice(0, 4).map((it, i) => (
            <img
              key={i}
              src={it.imageUrl || fallback}
              alt={it.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = fallback;
              }}
            />
          ))}
        </div>
        <div className="card-body">
          <div>
            <div className="card-title">{outfit.name}</div>
            <div className="badge">{items.length} item(s)</div>
          </div>
          <button
            className="btn btn-danger"
            onClick={(e) => {
              e.stopPropagation(); // don’t trigger modal
              onDelete();
            }}
          >
            Delete
          </button>
        </div>
      </article>

      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{outfit.name}</h2>
            <div className="modal-grid">

              {items.map((it, i) => (
                 <div key={i}>
                <img
                  key={i}
                  src={it.imageUrl || fallback}
                  alt={it.name}
                  title={it.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = fallback;
                  }}

                />
                 </div>
              ))}
            </div>
            <div style={{ textAlign: "right", marginTop: 12 }}>
              <button className="btn" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
