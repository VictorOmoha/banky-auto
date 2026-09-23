import React, { useState } from 'react';
import Icon from '../../components/Icon';
import { useAdmin } from '../AdminContext';

const TAGS = ['Punctuality', 'Communication', 'Pricing', 'Item description'];
const today = () => new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

function ReviewForm({ initial, onCancel, onSubmit, busy }) {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState('');
  const toggle = (tag) =>
    setForm((f) => ({ ...f, tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag] }));

  return (
    <form
      className="admin-review-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.content.trim()) {
          setError('Add the customer’s name and what they said.');
          return;
        }
        onSubmit({ ...form, name: form.name.trim(), content: form.content.trim(), date: form.date.trim() || today() });
      }}
      noValidate
    >
      <div className="admin-form-grid">
        <div className="field">
          <label htmlFor="rv-name">Customer name</label>
          <input id="rv-name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="rv-date">Date</label>
          <input id="rv-date" className="input" placeholder={today()} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </div>
        <div className="field admin-span-2">
          <label htmlFor="rv-content">Review</label>
          <textarea id="rv-content" className="textarea" rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
        </div>
        <fieldset className="admin-span-2 admin-tags">
          <legend className="field-label">Notable for</legend>
          {TAGS.map((t) => (
            <label key={t} className="admin-check">
              <input type="checkbox" checked={form.tags.includes(t)} onChange={() => toggle(t)} /> {t}
            </label>
          ))}
        </fieldset>
      </div>
      {error && <p className="field-error">{error}</p>}
      <div className="admin-review-form__actions">
        <button type="submit" className="btn btn--accent" disabled={busy}>
          {busy ? 'Saving…' : 'Save review'}
        </button>
        <button type="button" className="btn btn--ghost" onClick={onCancel} disabled={busy}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function Reviews() {
  const { content, save } = useAdmin();
  const [editing, setEditing] = useState(null); // review id, 'new' or null
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [confirmId, setConfirmId] = useState(null);

  const run = async (message, mutate) => {
    setBusy(true);
    setError('');
    try {
      await save({ key: 'reviews', message, mutate });
      setEditing(null);
      setConfirmId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const upsert = (review) =>
    run(`${review.id ? 'Update' : 'Add'} review from ${review.name}`, (list) => {
      if (review.id) return list.map((r) => (r.id === review.id ? review : r));
      const id = `r${Date.now().toString(36)}`;
      return [{ ...review, id }, ...list];
    });

  const move = (index, delta) =>
    run('Reorder reviews', (list) => {
      const next = [...list];
      const i = next.findIndex((r) => r.id === content.reviews[index].id);
      const j = i + delta;
      if (i < 0 || j < 0 || j >= next.length) return list;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div>
          <h1 className="admin-title">Reviews</h1>
          <p className="muted">Shown on the home page in this order.</p>
        </div>
        {editing !== 'new' && (
          <button type="button" className="btn btn--accent" onClick={() => setEditing('new')}>
            <Icon name="star" size={18} /> Add a review
          </button>
        )}
      </div>

      {error && <div className="admin-alert">{error}</div>}

      {editing === 'new' && (
        <div className="card admin-panel">
          <h2>New review</h2>
          <ReviewForm initial={{ name: '', date: '', content: '', tags: [] }} onCancel={() => setEditing(null)} onSubmit={upsert} busy={busy} />
        </div>
      )}

      <ul className="admin-reviews">
        {content.reviews.map((r, i) => (
          <li key={r.id} className="card admin-review">
            {editing === r.id ? (
              <ReviewForm initial={{ ...r, tags: r.tags || [] }} onCancel={() => setEditing(null)} onSubmit={upsert} busy={busy} />
            ) : (
              <>
                <div className="admin-review__body">
                  <div className="admin-review__who">
                    <strong>{r.name}</strong> <span className="muted">· {r.date}</span>
                  </div>
                  <p>“{r.content}”</p>
                  {r.tags?.length > 0 && (
                    <div className="admin-review__tags">
                      {r.tags.map((t) => (
                        <span key={t} className="chip">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="admin-review__actions">
                  <button type="button" className="admin-icon-btn" onClick={() => move(i, -1)} disabled={busy || i === 0} aria-label="Move up">
                    <Icon name="chevronLeft" size={16} className="admin-rot90" />
                  </button>
                  <button
                    type="button"
                    className="admin-icon-btn"
                    onClick={() => move(i, 1)}
                    disabled={busy || i === content.reviews.length - 1}
                    aria-label="Move down"
                  >
                    <Icon name="chevronRight" size={16} className="admin-rot90" />
                  </button>
                  <button type="button" className="btn btn--soft" onClick={() => setEditing(r.id)} disabled={busy}>
                    Edit
                  </button>
                  {confirmId === r.id ? (
                    <>
                      <button
                        type="button"
                        className="btn btn--danger"
                        disabled={busy}
                        onClick={() => run(`Remove review from ${r.name}`, (list) => list.filter((x) => x.id !== r.id))}
                      >
                        Delete
                      </button>
                      <button type="button" className="btn btn--ghost" onClick={() => setConfirmId(null)}>
                        Keep
                      </button>
                    </>
                  ) : (
                    <button type="button" className="btn btn--ghost" onClick={() => setConfirmId(r.id)} disabled={busy}>
                      Remove
                    </button>
                  )}
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Reviews;
