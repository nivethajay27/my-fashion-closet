import { useEffect, useState } from 'react';
import { defaultStyleProfile, loadStyleProfile, saveStyleProfile } from '../styleProfile';

const goalOptions = [
  'plan my outfits better',
  'look professional at work',
  'expand my wardrobe',
  'evolve my style',
  'wear my clothes more',
  'pack smarter for trips'
];

const styleOptions = ['minimal', 'streetwear', 'vintage', 'classic', 'romantic', 'denim', 'polished', 'soft glam'];
const lifestyleOptions = ['casual days', 'office', 'date nights', 'travel', 'events', 'errands', 'school'];

function toggle(values, value) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export default function StyleGoalsPage() {
  const [profile, setProfile] = useState(defaultStyleProfile);
  const [saved, setSaved] = useState(false);
  const [color, setColor] = useState('');

  useEffect(() => {
    setProfile(loadStyleProfile());
  }, []);

  const update = (patch) => {
    setSaved(false);
    setProfile((current) => ({ ...current, ...patch }));
  };

  const save = () => {
    saveStyleProfile(profile);
    setSaved(true);
  };

  return (
    <div className="container goals-page">
      <div className="page-kicker">Style onboarding</div>
      <section className="goals-hero">
        <div>
          <h1 className="section-title">Tell your stylist what confidence looks like.</h1>
          <p className="lede">These preferences shape daily outfits, dressing-room recommendations, and saved-look planning.</p>
        </div>
        <button className="btn btn-primary" onClick={save}>Save style profile</button>
      </section>

      {saved && <div className="notice success">Style profile saved. Your recommendations will use this from now on.</div>}

      <div className="goals-grid">
        <section className="settings-surface">
          <h2>Style goals</h2>
          <div className="chip-row">
            {goalOptions.map((goal) => (
              <button
                className={`chip ${profile.fashionGoals.includes(goal) ? 'active' : ''}`}
                key={goal}
                type="button"
                onClick={() => update({ fashionGoals: toggle(profile.fashionGoals, goal) })}
              >
                {goal}
              </button>
            ))}
          </div>
        </section>

        <section className="settings-surface">
          <h2>Style language</h2>
          <div className="chip-row">
            {styleOptions.map((style) => (
              <button
                className={`chip ${profile.preferredStyles.includes(style) ? 'active' : ''}`}
                key={style}
                type="button"
                onClick={() => update({ preferredStyles: toggle(profile.preferredStyles, style) })}
              >
                {style}
              </button>
            ))}
          </div>
        </section>

        <section className="settings-surface">
          <h2>Lifestyle</h2>
          <div className="chip-row">
            {lifestyleOptions.map((item) => (
              <button
                className={`chip ${profile.lifestyle.includes(item) ? 'active' : ''}`}
                key={item}
                type="button"
                onClick={() => update({ lifestyle: toggle(profile.lifestyle, item) })}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <section className="settings-surface profile-form">
          <h2>Details</h2>
          <label>
            Dress code
            <input className="input" value={profile.dressCode} onChange={(e) => update({ dressCode: e.target.value })} />
          </label>
          <label>
            Body type
            <input className="input" value={profile.bodyType} placeholder="optional" onChange={(e) => update({ bodyType: e.target.value })} />
          </label>
          <label>
            Location / climate
            <input className="input" value={profile.location} placeholder="e.g. Los Angeles" onChange={(e) => update({ location: e.target.value })} />
          </label>
          <label>
            Disliked colors
            <div className="inline-field">
              <input className="input" value={color} placeholder="e.g. orange" onChange={(e) => setColor(e.target.value)} />
              <button
                className="btn"
                type="button"
                onClick={() => {
                  const value = color.trim().toLowerCase();
                  if (!value) return;
                  update({ dislikedColors: [...new Set([...profile.dislikedColors, value])] });
                  setColor('');
                }}
              >
                Add
              </button>
            </div>
          </label>
          <div className="chip-row">
            {profile.dislikedColors.map((item) => (
              <button className="chip active" key={item} type="button" onClick={() => update({ dislikedColors: profile.dislikedColors.filter((colorName) => colorName !== item) })}>
                {item}
              </button>
            ))}
          </div>
          <label>
            Confidence notes
            <textarea className="input textarea" value={profile.confidenceNotes} placeholder="What makes an outfit feel right?" onChange={(e) => update({ confidenceNotes: e.target.value })} />
          </label>
        </section>
      </div>
    </div>
  );
}
