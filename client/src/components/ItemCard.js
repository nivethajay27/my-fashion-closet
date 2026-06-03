export default function ItemCard({ item, onDelete }) {
    return (
      <article className="card">
        <img className="thumb" src={item.imageUrl} alt={item.name} />
        <div className="card-body">
          <div>
            <div className="card-title">{item.name}</div>
            <div className="meta-line">{item.category} · {item.color || 'open color'}</div>
          </div>
          <button className="btn btn-danger" onClick={onDelete}>Delete</button>
        </div>
        <div className="tag-strip">
          {(item.occasion || []).slice(0, 2).map((tag) => <span className="badge" key={tag}>{tag}</span>)}
          {(item.tags || []).slice(0, 2).map((tag) => <span className="badge soft" key={tag}>{tag}</span>)}
        </div>
      </article>
    );
  }
  
