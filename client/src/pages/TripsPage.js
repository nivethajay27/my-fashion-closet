import { useEffect, useState } from 'react';
import { Items } from '../api';
import { mergeWardrobe } from '../closetStorage';
import { sampleWardrobe } from '../sampleWardrobe';
import { loadStyleProfile } from '../styleProfile';
import { generateStyledOutfit } from '../stylingEngine';

const tripTemplates = ['work', 'casual', 'date', 'travel', 'formal', 'party'];

function datesBetween(start, days) {
  return Array.from({ length: Number(days) || 1 }, (_, index) => {
    const date = new Date(start || new Date());
    date.setDate(date.getDate() + index);
    return date.toISOString().slice(0, 10);
  });
}

export default function TripsPage() {
  const [items, setItems] = useState([]);
  const [trip, setTrip] = useState({
    destination: 'New York',
    startDate: new Date().toISOString().slice(0, 10),
    days: 3,
    weather: 'spring',
    activities: ['travel', 'work', 'casual']
  });
  const [plan, setPlan] = useState([]);

  useEffect(() => {
    Items.list().then((rows) => setItems(mergeWardrobe(rows))).catch(() => setItems(mergeWardrobe(sampleWardrobe)));
  }, []);

  const generateTrip = () => {
    const profile = loadStyleProfile();
    const activities = trip.activities.length ? trip.activities : ['travel'];
    const next = datesBetween(trip.startDate, trip.days).map((date, index) => {
      const occasion = activities[index % activities.length];
      return {
        date,
        occasion,
        result: generateStyledOutfit(profile, items, { weather: trip.weather, occasion, timeOfDay: 'day' })
      };
    });
    setPlan(next);
  };

  const packedItems = Array.from(new Map(plan.flatMap((day) => day.result.outfit).map((item) => [item.id, item])).values());

  return (
    <div className="container trips-page">
      <div className="page-kicker">Trip planner</div>
      <section className="builder-hero">
        <div>
          <h1 className="section-title">Pack once, dress well all trip.</h1>
          <p className="lede">Generate outfits for each day and turn them into a packing list without duplicate pieces.</p>
        </div>
        <button className="btn btn-primary" onClick={generateTrip}>Generate packing plan</button>
      </section>

      <section className="trip-layout">
        <div className="settings-surface profile-form">
          <h2>Trip brief</h2>
          <label>
            Destination
            <input className="input" value={trip.destination} onChange={(e) => setTrip({ ...trip, destination: e.target.value })} />
          </label>
          <div className="row">
            <label>
              Start
              <input className="input" type="date" value={trip.startDate} onChange={(e) => setTrip({ ...trip, startDate: e.target.value })} />
            </label>
            <label>
              Days
              <input className="input" type="number" min="1" max="14" value={trip.days} onChange={(e) => setTrip({ ...trip, days: e.target.value })} />
            </label>
          </div>
          <label>
            Weather
            <select className="select" value={trip.weather} onChange={(e) => setTrip({ ...trip, weather: e.target.value })}>
              <option value="spring">spring</option>
              <option value="summer">summer</option>
              <option value="fall">fall</option>
              <option value="winter">winter</option>
              <option value="hot">hot</option>
              <option value="cold">cold</option>
              <option value="rainy">rainy</option>
            </select>
          </label>
          <div>
            <span className="field-label">Activities</span>
            <div className="chip-row">
              {tripTemplates.map((activity) => (
                <button
                  className={`chip ${trip.activities.includes(activity) ? 'active' : ''}`}
                  type="button"
                  key={activity}
                  onClick={() => setTrip({
                    ...trip,
                    activities: trip.activities.includes(activity)
                      ? trip.activities.filter((item) => item !== activity)
                      : [...trip.activities, activity]
                  })}
                >
                  {activity}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="packing-list settings-surface">
          <h2>Packing list</h2>
          {packedItems.length === 0 && <p className="helper">Generate a trip to see the pieces to pack.</p>}
          {packedItems.map((item) => (
            <div className="packing-row" key={item.id}>
              <img src={item.imageUrl} alt={item.name} />
              <div>
                <strong>{item.name}</strong>
                <span>{item.category} · {item.color || 'color open'}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="trip-days">
        {plan.map((day) => (
          <article className="settings-surface trip-day" key={day.date}>
            <div>
              <span className="page-kicker">{day.occasion}</span>
              <h2>{new Date(day.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</h2>
            </div>
            <div className="planned-look">
              {day.result.outfit.map((item) => <img src={item.imageUrl} alt={item.name} key={item.id} />)}
            </div>
            <p>{day.result.explanation}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
