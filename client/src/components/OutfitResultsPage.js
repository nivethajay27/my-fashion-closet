import TryOnPreview from './TryOnPreview';

export default function OutfitResultsPage({ result, lockedIds, onToggleLock, onSwap, onRegenerate, onSave }) {
  if (!result?.outfit?.length) {
    return (
      <section className="results-empty">
        <p>Add enough wardrobe pieces to generate a styled outfit.</p>
      </section>
    );
  }

  const breakdown = result.scoreBreakdown || {};

  return (
    <section className="outfit-results">
      <div className="results-header">
        <div>
          <p className="eyebrow">Generated look</p>
          <h2>{result.rating}/100 outfit rating</h2>
        </div>
        <div className="builder-controls">
          <button className="btn" type="button" onClick={onRegenerate}>Regenerate</button>
          <button className="btn btn-primary" type="button" onClick={onSave}>Save outfit</button>
        </div>
      </div>

      <div className="results-layout">
        <TryOnPreview outfit={result.outfit} lockedIds={lockedIds} onToggleLock={onToggleLock} onSwap={onSwap} />
        <aside className="score-panel">
          <div className="why-tooltip" title={result.explanation}>
            Why this outfit?
          </div>
          <p className="explanation">{result.explanation}</p>
          {Object.entries(breakdown).map(([label, value]) => (
            <div className="score-row" key={label}>
              <span>{label.replace(/([A-Z])/g, ' $1')}</span>
              <strong>{value}</strong>
              <div className="score-track"><span style={{ width: `${value}%` }} /></div>
            </div>
          ))}
          <div className="selected-list">
            {result.outfit.map((item) => (
              <div className="selected-item" key={item.id}>
                <img src={item.imageUrl} alt={item.name} />
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.category} · {item.color || 'color open'}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
