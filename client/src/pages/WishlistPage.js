import { useEffect, useState } from 'react';
import { Items } from '../api';
import { addWishlistItem, loadWishlist, mergeWardrobe, removeWishlistItem } from '../closetStorage';
import { sampleWardrobe } from '../sampleWardrobe';
import { CATEGORIES, colorCompatibility } from '../stylingEngine';

const emptyWish = {
  name: '',
  category: 'top',
  color: '',
  price: '',
  storeUrl: '',
  imageUrl: ''
};

function analyzeWish(item, wardrobe) {
  const sameCategory = wardrobe.filter((piece) => piece.category === item.category);
  const colorMatches = wardrobe.filter((piece) => colorCompatibility(piece.color, item.color) >= 80);
  const categoryGap = sameCategory.length === 0;
  const score = Math.min(100, 45 + (categoryGap ? 28 : 8) + Math.min(colorMatches.length * 6, 24));
  const reason = categoryGap
    ? `Fills a missing ${item.category} category and works with ${colorMatches.length} closet colors.`
    : `Adds another ${item.category} option and coordinates with ${colorMatches.length} existing pieces.`;
  return { score, reason, categoryGap, colorMatches: colorMatches.slice(0, 4) };
}

export default function WishlistPage() {
  const [wardrobe, setWardrobe] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [form, setForm] = useState(emptyWish);

  useEffect(() => {
    Items.list().then((rows) => setWardrobe(mergeWardrobe(rows))).catch(() => setWardrobe(mergeWardrobe(sampleWardrobe)));
    setWishlist(loadWishlist());
  }, []);

  const save = () => {
    if (!form.name) return;
    setWishlist(addWishlistItem(form));
    setForm(emptyWish);
  };

  return (
    <div className="container wishlist-page">
      <div className="page-kicker">Wishlist intelligence</div>
      <section className="builder-hero">
        <div>
          <h1 className="section-title">Buy with your closet in mind.</h1>
          <p className="lede">Track pieces you want and see whether they fill gaps or work with what you already own.</p>
        </div>
      </section>

      <div className="wishlist-layout">
        <section className="settings-surface profile-form">
          <h2>Add wishlist item</h2>
          <input className="input" placeholder="Item name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <div className="row">
            <select className="select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
            <input className="input" placeholder="Color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
          </div>
          <input className="input" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <input className="input" placeholder="Store URL" value={form.storeUrl} onChange={(e) => setForm({ ...form, storeUrl: e.target.value })} />
          <input className="input" placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          <button className="btn btn-primary" onClick={save}>Analyze wishlist item</button>
        </section>

        <section className="wishlist-results">
          {wishlist.length === 0 && <div className="settings-surface helper">No wishlist items yet.</div>}
          {wishlist.map((item) => {
            const analysis = analyzeWish(item, wardrobe);
            return (
              <article className="settings-surface wishlist-card" key={item.id}>
                {item.imageUrl && <img src={item.imageUrl} alt={item.name} />}
                <div>
                  <span className="page-kicker">{analysis.score}/100 closet fit</span>
                  <h2>{item.name}</h2>
                  <p>{analysis.reason}</p>
                  <div className="chip-row">
                    <span className={`chip ${analysis.categoryGap ? 'active' : ''}`}>{analysis.categoryGap ? 'fills category gap' : 'category covered'}</span>
                    <span className="chip">{item.category}</span>
                    {item.color && <span className="chip">{item.color}</span>}
                  </div>
                  <div className="planned-look">
                    {analysis.colorMatches.map((piece) => <img src={piece.imageUrl} alt={piece.name} key={piece.id} />)}
                  </div>
                  <button className="mini-btn" onClick={() => setWishlist(removeWishlistItem(item.id))}>Remove</button>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
}
