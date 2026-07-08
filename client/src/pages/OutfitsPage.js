import { useEffect, useState } from 'react';
import { Outfits } from '../api';
import OutfitCard from '../components/OutfitCard';
import { loadPlannedOutfits, savePlannedOutfits, upsertPlannedOutfit } from '../styleProfile';

function getWeekDays() {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    const iso = date.toISOString().slice(0, 10);
    return {
      iso,
      label: date.toLocaleDateString(undefined, { weekday: 'short' }),
      date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    };
  });
}

export default function OutfitsPage() {
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [selectedOutfitId, setSelectedOutfitId] = useState('');

  useEffect(() => {
    Outfits.list()
      .then((rows) => {
        setOutfits(rows);
        setSelectedOutfitId(rows[0]?.id || '');
      })
      .catch(() => {
        const saved = JSON.parse(localStorage.getItem('savedOutfits') || '[]');
        setOutfits(saved);
        setSelectedOutfitId(saved[0]?.id || '');
      })
      .finally(() => {
        setPlans(loadPlannedOutfits());
        setLoading(false);
      });
  }, []);

  const remove = async (id) => {
    try {
      await Outfits.remove(id);
    } catch (_e) {
      localStorage.setItem('savedOutfits', JSON.stringify(outfits.filter((o) => o.id !== id)));
    }
    setOutfits((prev) => prev.filter((o) => o.id !== id));
  };

  const planOutfit = (date) => {
    const outfit = outfits.find((item) => String(item.id) === String(selectedOutfitId));
    if (!outfit) return;
    const next = upsertPlannedOutfit({
      id: Date.now(),
      date,
      occasion: outfit.items?.[0]?.occasion?.[0] || 'planned',
      weather: 'forecast',
      outfit: {
        outfit: outfit.items || [],
        rating: outfit.rating || 82,
        scoreBreakdown: outfit.scoreBreakdown || {},
        explanation: outfit.explanation || `${outfit.name} is planned for this day.`
      },
      outfitName: outfit.name,
      wornStatus: 'planned'
    });
    setPlans(next);
  };

  const toggleWorn = (date) => {
    const next = plans.map((plan) => (
      plan.date === date
        ? { ...plan, wornStatus: plan.wornStatus === 'worn' ? 'planned' : 'worn' }
        : plan
    ));
    setPlans(next);
    savePlannedOutfits(next);
  };

  const weekDays = getWeekDays();

  return (
    <div className="container planner-page">
      <div className="page-kicker">Outfit calendar</div>
      <div className="builder-hero">
        <div>
          <h1 className="section-title">Plan looks before the week starts.</h1>
          <p className="lede">Assign saved outfits to upcoming days, then log what you actually wore.</p>
        </div>
        <div className="planner-select">
          <label>
            Look to plan
            <select className="select" value={selectedOutfitId} onChange={(e) => setSelectedOutfitId(e.target.value)}>
              {outfits.map((outfit) => (
                <option value={outfit.id} key={outfit.id}>{outfit.name}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {loading && <div className="helper">Loading outfits…</div>}

      {!loading && outfits.length === 0 && (
        <div className="panel">
          <div className="helper">
            No outfits yet. Go to <strong>Today</strong> or <strong>Stylist</strong> and save a look.
          </div>
        </div>
      )}

      <section className="calendar-board">
        {weekDays.map((day) => {
          const plan = plans.find((item) => item.date === day.iso);
          return (
            <article className="day-card" key={day.iso}>
              <div>
                <span>{day.label}</span>
                <strong>{day.date}</strong>
              </div>
              {plan ? (
                <>
                  <div className="planned-look">
                    {(plan.outfit?.outfit || []).slice(0, 3).map((item) => (
                      <img src={item.imageUrl} alt={item.name} key={item.id} />
                    ))}
                  </div>
                  <p>{plan.outfitName || plan.outfit?.outfit?.map((item) => item.name).join(', ')}</p>
                  <button className={`mini-btn ${plan.wornStatus === 'worn' ? 'locked' : ''}`} onClick={() => toggleWorn(day.iso)}>
                    {plan.wornStatus === 'worn' ? 'Worn' : 'Mark worn'}
                  </button>
                </>
              ) : (
                <>
                  <p className="helper">No look planned.</p>
                  <button className="mini-btn" onClick={() => planOutfit(day.iso)} disabled={!selectedOutfitId}>Plan look</button>
                </>
              )}
            </article>
          );
        })}
      </section>

      <div className="section-row">
        <div>
          <div className="page-kicker">Saved looks</div>
          <h2>Ready to schedule</h2>
        </div>
      </div>

      <div className="grid">
        {outfits.map((o) => (
          <OutfitCard key={o.id} outfit={o} onDelete={() => remove(o.id)} />
        ))}
      </div>
    </div>
  );
}
