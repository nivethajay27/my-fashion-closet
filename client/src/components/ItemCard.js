export default function ItemCard({ item, onDelete }) {
    return (
      <article className="card">
        <img className="thumb" src={item.imageUrl} alt={item.name} />
        <div className="card-body">
          <div>
            <div className="card-title">{item.name}</div>
            <div className="badge">{item.category}</div>
          </div>
          <button className="btn btn-danger" onClick={onDelete}>Delete</button>
        </div>
      </article>
    );
  }
  