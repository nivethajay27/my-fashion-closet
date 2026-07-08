import { useEffect, useState } from 'react';
import { Items, Outfits } from '../api';
import OutfitResultsPage from '../components/OutfitResultsPage';
import { sampleWardrobe } from '../sampleWardrobe';
import { getTodayIsoDate, loadStyleProfile, upsertPlannedOutfit } from '../styleProfile';
import { cycleCategory, generateStyledOutfit, scoreOutfit } from '../stylingEngine';
import { mergeWardrobe } from '../closetStorage';

const defaultContext = {
  weather: 'spring',
  occasion: 'work',
  timeOfDay: 'day'
};

export default function TodayPage() {
  const [items, setItems] = useState([]);
  const [context, setContext] = useState(defaultContext);
  const [result, setResult] = useState(null);
  const [lockedIds, setLockedIds] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    Items.list().then((rows) => setItems(mergeWardrobe(rows))).catch(() => setItems(mergeWardrobe(sampleWardrobe)));
  }, []);

  useEffect(() => {
    if (!items.length) return;
    setResult(generateStyledOutfit(loadStyleProfile(), items, context, items.filter((item) => lockedIds.includes(item.id))));
  }, [items, context, lockedIds]);

  const regenerate = () => {
    setResult(generateStyledOutfit(loadStyleProfile(), items, context, items.filter((item) => lockedIds.includes(item.id))));
  };

  const save = async () => {
    if (!result?.outfit?.length) return;
    const payload = {
      name: `Daily Look ${new Date().toLocaleDateString()}`,
      items: result.outfit.map((item) => item.id),
      rating: result.rating,
      scoreBreakdown: result.scoreBreakdown,
      explanation: result.explanation
    };
    try {
      await Outfits.create(payload);
      setStatus('Saved to outfits.');
    } catch (_e) {
      const saved = JSON.parse(localStorage.getItem('savedOutfits') || '[]');
      localStorage.setItem('savedOutfits', JSON.stringify([{ ...payload, id: Date.now(), items: result.outfit }, ...saved]));
      setStatus('Saved locally to outfits.');
    }
  };

  const planToday = () => {
    if (!result?.outfit?.length) return;
    upsertPlannedOutfit({
      id: Date.now(),
      date: getTodayIsoDate(),
      occasion: context.occasion,
      weather: context.weather,
      outfit: result,
      wornStatus: 'planned'
    });
    setStatus('Planned for today.');
  };

  const swap = (category) => {
    if (!result?.outfit?.length) return;
    const nextOutfit = cycleCategory(result.outfit, items, category);
    const scored = scoreOutfit(nextOutfit, loadStyleProfile(), context);
    setResult({
      outfit: nextOutfit,
      scoreBreakdown: scored.breakdown,
      rating: scored.rating,
      explanation: `Swapped the ${category} for today's context and recalculated the rating.`
    });
  };

  return (
    <div className="container today-page">
      <div className="page-kicker">Today's stylist</div>
      <section className="today-hero">
        <div>
          <h1 className="section-title">Your best outfit for right now.</h1>
          <p className="lede">A daily recommendation based on your closet, goals, occasion, and weather.</p>
        </div>
        <div className="daily-context">
          <label>
            Occasion
            <select className="select" value={context.occasion} onChange={(e) => setContext({ ...context, occasion: e.target.value })}>
              <option value="work">work</option>
              <option value="casual">casual</option>
              <option value="date">date</option>
              <option value="party">party</option>
              <option value="travel">travel</option>
              <option value="formal">formal</option>
            </select>
          </label>
          <label>
            Weather
            <select className="select" value={context.weather} onChange={(e) => setContext({ ...context, weather: e.target.value })}>
              <option value="spring">spring</option>
              <option value="summer">summer</option>
              <option value="fall">fall</option>
              <option value="winter">winter</option>
              <option value="hot">hot</option>
              <option value="cold">cold</option>
              <option value="rainy">rainy</option>
            </select>
          </label>
          <label>
            Time
            <select className="select" value={context.timeOfDay} onChange={(e) => setContext({ ...context, timeOfDay: e.target.value })}>
              <option value="day">day</option>
              <option value="evening">evening</option>
              <option value="night">night</option>
            </select>
          </label>
        </div>
      </section>

      <div className="builder-controls today-actions">
        <button className="btn btn-primary" onClick={regenerate}>Regenerate today</button>
        <button className="btn" onClick={planToday}>Plan today</button>
        {status && <span className="helper">{status}</span>}
      </div>

      <OutfitResultsPage
        result={result}
        lockedIds={lockedIds}
        onToggleLock={(id) => setLockedIds((ids) => ids.includes(id) ? ids.filter((lockedId) => lockedId !== id) : [...ids, id])}
        onSwap={swap}
        onRegenerate={regenerate}
        onSave={save}
      />
    </div>
  );
}
