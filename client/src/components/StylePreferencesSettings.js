import { useState } from 'react';

const styleOptions = ['minimal', 'streetwear', 'vintage', 'classic', 'romantic', 'denim'];
const goalOptions = ['look taller', 'casual', 'formal', 'party-ready', 'polished'];

function toggleValue(values, value) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export default function StylePreferencesSettings({ preferences, context, onPreferencesChange, onContextChange }) {
  const [dislikedColor, setDislikedColor] = useState('');

  return (
    <aside className="stylist-panel">
      <div className="panel-heading">
        <p>AI stylist brief</p>
        <span>Personalization</span>
      </div>

      <label>
        Occasion
        <select className="select" value={context.occasion} onChange={(e) => onContextChange({ ...context, occasion: e.target.value })}>
          <option value="casual">casual</option>
          <option value="work">work</option>
          <option value="formal">formal</option>
          <option value="party">party</option>
          <option value="date">date</option>
          <option value="travel">travel</option>
        </select>
      </label>

      <label>
        Weather or season
        <select className="select" value={context.weather} onChange={(e) => onContextChange({ ...context, weather: e.target.value })}>
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
        Time of day
        <select className="select" value={context.timeOfDay} onChange={(e) => onContextChange({ ...context, timeOfDay: e.target.value })}>
          <option value="day">day</option>
          <option value="evening">evening</option>
          <option value="night">night</option>
        </select>
      </label>

      <label>
        Body type
        <input className="input" value={preferences.bodyType} placeholder="optional" onChange={(e) => onPreferencesChange({ ...preferences, bodyType: e.target.value })} />
      </label>

      <div>
        <span className="field-label">Preferred styles</span>
        <div className="chip-row">
          {styleOptions.map((style) => (
            <button
              type="button"
              key={style}
              className={`chip ${preferences.preferredStyles.includes(style) ? 'active' : ''}`}
              onClick={() => onPreferencesChange({ ...preferences, preferredStyles: toggleValue(preferences.preferredStyles, style) })}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="field-label">Fashion goals</span>
        <div className="chip-row">
          {goalOptions.map((goal) => (
            <button
              type="button"
              key={goal}
              className={`chip ${preferences.fashionGoals.includes(goal) ? 'active' : ''}`}
              onClick={() => onPreferencesChange({ ...preferences, fashionGoals: toggleValue(preferences.fashionGoals, goal) })}
            >
              {goal}
            </button>
          ))}
        </div>
      </div>

      <label>
        Disliked colors
        <div className="inline-field">
          <input className="input" value={dislikedColor} placeholder="e.g. orange" onChange={(e) => setDislikedColor(e.target.value)} />
          <button
            type="button"
            className="btn"
            onClick={() => {
              const value = dislikedColor.trim().toLowerCase();
              if (!value) return;
              onPreferencesChange({ ...preferences, dislikedColors: [...new Set([...preferences.dislikedColors, value])] });
              setDislikedColor('');
            }}
          >
            Add
          </button>
        </div>
      </label>
      <div className="chip-row">
        {preferences.dislikedColors.map((color) => (
          <button
            type="button"
            className="chip active"
            key={color}
            onClick={() => onPreferencesChange({ ...preferences, dislikedColors: preferences.dislikedColors.filter((item) => item !== color) })}
          >
            {color}
          </button>
        ))}
      </div>
    </aside>
  );
}
