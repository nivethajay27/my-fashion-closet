import { useEffect, useState } from 'react';
import { Items } from '../api';
import { mergeWardrobe } from '../closetStorage';
import { sampleWardrobe } from '../sampleWardrobe';
import { colorCompatibility } from '../stylingEngine';

const inspirationLooks = [
  {
    id: 'office-minimal',
    name: 'Soft power workday',
    occasion: 'work',
    tags: ['minimal', 'polished'],
    palette: ['white', 'blue', 'gold'],
    needs: ['top', 'bottom', 'shoes', 'accessory']
  },
  {
    id: 'weekend-denim',
    name: 'Weekend denim uniform',
    occasion: 'casual',
    tags: ['denim', 'streetwear'],
    palette: ['blue', 'white'],
    needs: ['top', 'bottom', 'shoes']
  },
  {
    id: 'date-romantic',
    name: 'Low-effort date night',
    occasion: 'date',
    tags: ['romantic', 'soft glam'],
    palette: ['pink', 'black', 'gold'],
    needs: ['dress', 'shoes', 'accessory']
  }
];

function recreateLook(look, wardrobe) {
  const selections = look.needs.map((category) => {
    const candidates = wardrobe.filter((item) => item.category === category);
    const ranked = candidates.sort((a, b) => scorePiece(b, look) - scorePiece(a, look));
    return ranked[0] || null;
  }).filter(Boolean);
  const missing = look.needs.filter((category) => !selections.some((item) => item.category === category));
  const score = Math.round(((look.needs.length - missing.length) / look.needs.length) * 70 + Math.min(selections.length * 8, 30));
  return { selections, missing, score };
}

function scorePiece(item, look) {
  const colorScore = Math.max(...look.palette.map((color) => colorCompatibility(item.color, color)));
  const tagScore = (item.tags || []).some((tag) => look.tags.includes(tag)) ? 25 : 0;
  const occasionScore = (item.occasion || []).includes(look.occasion) ? 20 : 0;
  return colorScore + tagScore + occasionScore;
}

export default function InspirationPage() {
  const [wardrobe, setWardrobe] = useState([]);

  useEffect(() => {
    Items.list().then((rows) => setWardrobe(mergeWardrobe(rows))).catch(() => setWardrobe(mergeWardrobe(sampleWardrobe)));
  }, []);

  return (
    <div className="container inspiration-page">
      <div className="page-kicker">Community inspiration</div>
      <section className="builder-hero">
        <div>
          <h1 className="section-title">Recreate the mood with your own closet.</h1>
          <p className="lede">Browse inspiration looks, then see the closest outfit your wardrobe can build right now.</p>
        </div>
      </section>

      <div className="inspo-grid">
        {inspirationLooks.map((look) => {
          const recreation = recreateLook(look, wardrobe);
          return (
            <article className="settings-surface inspo-card" key={look.id}>
              <div className="inspo-art">
                {look.palette.map((color) => <span style={{ background: color }} key={color} />)}
              </div>
              <span className="page-kicker">{look.occasion} · {recreation.score}/100 match</span>
              <h2>{look.name}</h2>
              <div className="chip-row">
                {look.tags.map((tag) => <span className="chip" key={tag}>{tag}</span>)}
              </div>
              <div className="planned-look">
                {recreation.selections.map((item) => <img src={item.imageUrl} alt={item.name} key={item.id} />)}
              </div>
              {recreation.missing.length > 0 ? (
                <p>Missing: {recreation.missing.join(', ')}. Add those to your wishlist to complete this look.</p>
              ) : (
                <p>Your closet can recreate this look today.</p>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
