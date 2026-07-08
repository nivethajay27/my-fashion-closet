import { useState } from 'react';
import { addLocalWardrobeItem, inferMetadataFromUpload } from '../closetStorage';
import { CATEGORIES, OCCASIONS, SEASONS } from '../stylingEngine';

export default function UploadItemPage() {
  const [preview, setPreview] = useState('');
  const [form, setForm] = useState(inferMetadataFromUpload(''));
  const [saved, setSaved] = useState('');

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const updateList = (key, value) => update(key, value.split(',').map((item) => item.trim()).filter(Boolean));

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result;
      setPreview(imageUrl);
      setForm({ ...inferMetadataFromUpload(file.name), imageUrl });
      setSaved('');
    };
    reader.readAsDataURL(file);
  };

  const save = () => {
    if (!form.name || !form.imageUrl) return;
    addLocalWardrobeItem(form);
    setSaved(`${form.name} added to your closet.`);
  };

  return (
    <div className="container upload-page">
      <div className="page-kicker">Smart closet intake</div>
      <section className="builder-hero">
        <div>
          <h1 className="section-title">Upload a piece, confirm the details.</h1>
          <p className="lede">The app suggests metadata from the image filename, then lets you correct everything before it enters your closet.</p>
        </div>
      </section>

      <div className="upload-layout">
        <section className="upload-drop">
          <label>
            <span>Choose clothing image</span>
            <input type="file" accept="image/*" onChange={handleFile} />
          </label>
          {preview ? <img src={preview} alt="Uploaded clothing preview" /> : <div className="upload-placeholder">Preview</div>}
        </section>

        <section className="settings-surface profile-form">
          <h2>Confirm metadata</h2>
          <label>
            Name
            <input className="input" value={form.name} onChange={(e) => update('name', e.target.value)} />
          </label>
          <div className="row">
            <label>
              Category
              <select className="select" value={form.category} onChange={(e) => update('category', e.target.value)}>
                {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </label>
            <label>
              Color
              <input className="input" value={form.color} onChange={(e) => update('color', e.target.value)} />
            </label>
          </div>
          <label>
            Material
            <input className="input" value={form.material} placeholder="cotton, denim, silk..." onChange={(e) => update('material', e.target.value)} />
          </label>
          <div className="row">
            <label>
              Season
              <select className="select" value={form.season[0] || 'all'} onChange={(e) => update('season', [e.target.value])}>
                {SEASONS.map((season) => <option key={season} value={season}>{season}</option>)}
              </select>
            </label>
            <label>
              Occasion
              <select className="select" value={form.occasion[0] || 'casual'} onChange={(e) => update('occasion', [e.target.value])}>
                {OCCASIONS.map((occasion) => <option key={occasion} value={occasion}>{occasion}</option>)}
              </select>
            </label>
          </div>
          <label>
            Tags
            <input className="input" value={(form.tags || []).join(', ')} onChange={(e) => updateList('tags', e.target.value)} />
          </label>
          <button className="btn btn-primary" onClick={save} disabled={!form.imageUrl}>Add to closet</button>
          {saved && <div className="notice success">{saved}</div>}
        </section>
      </div>
    </div>
  );
}
