import { useEffect, useMemo, useState } from 'react';
import { Items, Outfits } from '../api';
import OutfitResultsPage from '../components/OutfitResultsPage';
import StylePreferencesSettings from '../components/StylePreferencesSettings';
import { CATEGORIES, cycleCategory, generateStyledOutfit, scoreOutfit } from '../stylingEngine';
import { sampleWardrobe } from '../sampleWardrobe';

const defaultPreferences = {
  preferredStyles: ['minimal'],
  dislikedColors: [],
  bodyType: '',
  fashionGoals: ['casual']
};

const defaultContext = {
  weather: 'spring',
  occasion: 'casual',
  timeOfDay: 'day'
};

export default function BuilderPage() {
  const [items, setItems] = useState([]);
  const [result, setResult] = useState(null);
  const [lockedIds, setLockedIds] = useState([]);
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [context, setContext] = useState(defaultContext);

  useEffect(() => {
    Items.list().then(setItems).catch(() => setItems(sampleWardrobe));
  }, []);
  const byCat = useMemo(
    () => Object.fromEntries(CATEGORIES.map((c) => [c, items.filter((i) => i.category === c)])),
    [items]
  );

  const lockedItems = useMemo(
    () => items.filter((item) => lockedIds.includes(item.id)),
    [items, lockedIds]
  );

  const regenerate = () => {
    setResult(generateStyledOutfit(preferences, items, context, lockedItems));
  };

  useEffect(() => {
    if (items.length) setResult(generateStyledOutfit(preferences, items, context, lockedItems));
  }, [items, preferences, context, lockedItems]);

  const selectItem = (item) => {
    const nextOutfit = [
      ...(result?.outfit || []).filter((current) => current.category !== item.category),
      item
    ];
    const scored = scoreOutfit(nextOutfit, preferences, context);
    setResult({
      outfit: nextOutfit,
      scoreBreakdown: scored.breakdown,
      rating: scored.rating,
      explanation: `Manually selected ${item.name}. Scores were recalculated against your current stylist brief.`
    });
  };

  const save = async () => {
    if (!result?.outfit?.length) return;
    const name = `Styled Outfit ${new Date().toLocaleString()}`;
    const payload = {
      name,
      items: result.outfit.map((item) => item.id),
      rating: result.rating,
      scoreBreakdown: result.scoreBreakdown,
      explanation: result.explanation
    };
    try {
      await Outfits.create(payload);
    } catch (_e) {
      const saved = JSON.parse(localStorage.getItem('savedOutfits') || '[]');
      localStorage.setItem('savedOutfits', JSON.stringify([{ ...payload, id: Date.now(), items: result.outfit }, ...saved]));
    }
    alert('Saved!');
  };

  const toggleLock = (id) => {
    setLockedIds((ids) => ids.includes(id) ? ids.filter((lockedId) => lockedId !== id) : [...ids, id]);
  };

  const swap = (category) => {
    if (!result?.outfit?.length) return;
    const nextOutfit = cycleCategory(result.outfit, items, category);
    const scored = scoreOutfit(nextOutfit, preferences, context);
    setResult({
      outfit: nextOutfit,
      scoreBreakdown: scored.breakdown,
      rating: scored.rating,
      explanation: `Swapped the ${category} and recalculated the outfit rating.`
    });
  };

  return (
    <div className="container">
      <div className="page-kicker">Intelligent outfit styling</div>
      <div className="builder-hero">
        <div>
          <h1 className="section-title">Generate a complete look and preview it on-body.</h1>
          <p className="lede">Rules keep every outfit valid. Scoring ranks color harmony, occasion fit, season match, and style consistency.</p>
        </div>
        <button className="btn btn-primary" onClick={regenerate}>Instant regenerate</button>
      </div>

      <div className="stylist-layout">
        <StylePreferencesSettings
          preferences={preferences}
          context={context}
          onPreferencesChange={setPreferences}
          onContextChange={setContext}
        />
        <OutfitResultsPage
          result={result}
          lockedIds={lockedIds}
          onToggleLock={toggleLock}
          onSwap={swap}
          onRegenerate={regenerate}
          onSave={save}
        />
      </div>

      <div className="builder-grid closet-picker">
        {CATEGORIES.map((c) => (
          <div className="panel" key={c}>
            <h3>{c}</h3>
            <div className="swatch-grid">
              {(byCat[c] || []).map((i) => (
                <img
                  key={i.id}
                  src={i.imageUrl}
                  alt={i.name}
                  title={i.name}
                  className={`swatch ${result?.outfit?.some((item) => item.id === i.id) ? 'selected' : ''}`}
                  onClick={() => selectItem(i)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
