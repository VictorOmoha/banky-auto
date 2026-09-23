import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Icon from '../../components/Icon';
import AdminPhoto from '../AdminPhoto';
import { useAdmin } from '../AdminContext';
import { paths } from '../config';
import { money, prepareImage, slugify, uniqueId } from '../utils';

const BODY_STYLES = ['Sedan', 'SUV', 'Truck', 'Coupe', 'Hatchback', 'Minivan', 'Wagon', 'Convertible'];
const TRANSMISSIONS = ['Automatic', 'Manual', 'CVT'];
const DRIVETRAINS = ['', 'FWD', 'RWD', 'AWD', '4WD'];
const FUELS = ['Gasoline', 'Hybrid', 'Electric', 'Diesel'];
const TITLES = ['', 'Clean', 'Rebuilt', 'Salvage'];

const blank = {
  year: '',
  make: '',
  model: '',
  trim: '',
  body: 'Sedan',
  price: '',
  mileage: '',
  exteriorColor: '',
  interiorColor: '',
  transmission: 'Automatic',
  drivetrain: '',
  fuelType: 'Gasoline',
  titleStatus: '',
  damageHistory: '',
  vin: '',
  safetyRating: '',
  description: '',
  highlights: '',
  featured: false,
  status: 'available',
};

const toForm = (v) => ({
  ...blank,
  ...Object.fromEntries(Object.entries(v).map(([k, val]) => [k, val ?? ''])),
  highlights: (v.highlights || []).join('\n'),
  featured: !!v.featured,
  status: v.status === 'sold' ? 'sold' : 'available',
});

// Drops empty optional fields so the saved JSON stays tidy.
const fromForm = (form) => {
  const out = {
    year: Number(form.year),
    make: form.make.trim(),
    model: form.model.trim(),
    trim: form.trim.trim(),
    body: form.body,
    price: Number(form.price),
    mileage: Number(form.mileage),
    exteriorColor: form.exteriorColor.trim(),
    interiorColor: form.interiorColor.trim(),
    transmission: form.transmission,
    drivetrain: form.drivetrain,
    fuelType: form.fuelType,
    titleStatus: form.titleStatus,
    damageHistory: form.damageHistory.trim(),
    vin: form.vin.trim().toUpperCase(),
    safetyRating: form.safetyRating.trim(),
    description: form.description.trim(),
    highlights: form.highlights
      .split('\n')
      .map((h) => h.trim())
      .filter(Boolean),
    featured: !!form.featured,
    status: form.status,
  };
  Object.keys(out).forEach((k) => {
    if (out[k] === '' || (Array.isArray(out[k]) && !out[k].length && k !== 'highlights')) delete out[k];
  });
  return out;
};

const validate = (form) => {
  const errors = {};
  const year = Number(form.year);
  const thisYear = new Date().getFullYear();
  if (!form.year || !Number.isInteger(year) || year < 1950 || year > thisYear + 1) errors.year = `Enter a year between 1950 and ${thisYear + 1}`;
  if (!form.make.trim()) errors.make = 'Required';
  if (!form.model.trim()) errors.model = 'Required';
  if (form.price === '' || Number(form.price) <= 0) errors.price = 'Enter the price in dollars';
  if (form.mileage === '' || Number(form.mileage) < 0) errors.mileage = 'Enter the mileage';
  if (form.vin && !/^[A-HJ-NPR-Z0-9]{17}$/i.test(form.vin.trim())) errors.vin = 'A VIN is 17 letters and numbers (no I, O or Q)';
  return errors;
};

const referenced = (list) => new Set(list.flatMap((v) => v.photos || []));

// Photo files that were used before but no longer are, so the repo stays clean.
const orphanedPhotos = (next, fresh) => {
  const keep = referenced(next);
  return [...referenced(fresh)].filter((f) => !keep.has(f)).map((f) => ({ path: `${paths.photos}/${f}`, remove: true }));
};

function Field({ id, label, error, hint, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label} {hint && <span className="hint">{hint}</span>}
      </label>
      {children}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

function CarEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { content, save } = useAdmin();
  const existing = useMemo(() => content.vehicles.find((v) => v.id === id), [content.vehicles, id]);
  const isNew = !id;

  const [form, setForm] = useState(() => (existing ? toForm(existing) : blank));
  const [photos, setPhotos] = useState(() => (existing?.photos || []).map((file) => ({ file })));
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ busy: false, error: '', note: '' });
  const [dirty, setDirty] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInput = useRef(null);

  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  if (!isNew && !existing) {
    return (
      <div className="admin-page">
        <div className="admin-alert">
          That car doesn’t exist (it may have been deleted). <Link to="/admin/cars">Back to cars</Link>
        </div>
      </div>
    );
  }

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    setDirty(true);
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const addFiles = async (fileList) => {
    const files = [...fileList];
    if (!files.length) return;
    setStatus((s) => ({ ...s, error: '', note: `Preparing ${files.length} photo${files.length > 1 ? 's' : ''}…` }));
    const base = slugify(`${form.model || 'car'}${form.year || ''}`) || 'car';
    const added = [];
    const problems = [];
    for (let i = 0; i < files.length; i += 1) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const { dataUrl, base64 } = await prepareImage(files[i]);
        added.push({ file: `${base}-${Date.now().toString(36)}${i}.jpg`, src: dataUrl, base64 });
      } catch (err) {
        problems.push(err.message);
      }
    }
    setPhotos((p) => [...p, ...added]);
    if (added.length) setDirty(true);
    setStatus((s) => ({ ...s, note: '', error: problems.join(' ') }));
  };

  const movePhoto = (index, delta) => {
    setPhotos((p) => {
      const next = [...p];
      const target = index + delta;
      if (target < 0 || target >= next.length) return p;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setDirty(true);
  };

  const makeCover = (index) => {
    setPhotos((p) => [p[index], ...p.filter((_, i) => i !== index)]);
    setDirty(true);
  };

  const removePhoto = (index) => {
    setPhotos((p) => p.filter((_, i) => i !== index));
    setDirty(true);
  };

  const label = `${form.year} ${form.make} ${form.model}`.trim();

  const onSave = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) {
      setStatus({ busy: false, error: 'Please fix the highlighted fields.', note: '' });
      document.getElementById(`car-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    setStatus({ busy: true, error: '', note: '' });
    const data = { ...fromForm(form), photos: photos.map((p) => p.file), updatedAt: new Date().toISOString() };
    let savedId = id;
    try {
      await save({
        key: 'vehicles',
        message: `${isNew ? 'Add' : 'Update'} car: ${label}`,
        mutate: (list) => {
          if (isNew) {
            savedId = uniqueId(`${data.model}${data.year}`, list.map((v) => v.id));
            return [{ id: savedId, ...data }, ...list];
          }
          if (!list.some((v) => v.id === id)) throw new Error('This car was deleted by someone else. Reload to see the latest list.');
          return list.map((v) => (v.id === id ? { id, ...data } : v));
        },
        extraFiles: (next, fresh) => [
          ...photos.filter((p) => p.base64).map((p) => ({ path: `${paths.photos}/${p.file}`, base64: p.base64 })),
          ...orphanedPhotos(next, fresh),
        ],
      });
      setDirty(false);
      setPhotos((p) => p.map(({ file, src }) => ({ file, src })));
      setStatus({ busy: false, error: '', note: 'Saved.' });
      if (isNew) navigate(`/admin/cars/${savedId}`, { replace: true });
    } catch (err) {
      setStatus({ busy: false, error: err.message, note: '' });
    }
  };

  const onDelete = async () => {
    setStatus({ busy: true, error: '', note: '' });
    try {
      await save({
        key: 'vehicles',
        message: `Delete car: ${label}`,
        mutate: (list) => list.filter((v) => v.id !== id),
        extraFiles: orphanedPhotos,
      });
      setDirty(false);
      navigate('/admin/cars', { replace: true });
    } catch (err) {
      setStatus({ busy: false, error: err.message, note: '' });
      setConfirmDelete(false);
    }
  };

  return (
    <form className="admin-page admin-editor" onSubmit={onSave} noValidate>
      <Link to="/admin/cars" className="admin-back">
        <Icon name="arrowLeft" size={16} /> All cars
      </Link>
      <div className="admin-head">
        <div>
          <h1 className="admin-title">{isNew ? 'Add a car' : label}</h1>
          <p className="muted">
            {isNew
              ? 'Fill in the details and add photos. It goes live once you save.'
              : `${money(form.price)} · ${form.status === 'sold' ? 'Sold (hidden from the website)' : 'For sale'}`}
          </p>
        </div>
        {!isNew && existing?.photos?.length > 0 && form.status !== 'sold' && (
          <a
            href={`${process.env.PUBLIC_URL}/vehicles/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--ghost"
          >
            <Icon name="external" size={16} /> View on site
          </a>
        )}
      </div>

      <div className="admin-editor__grid">
        <div className="admin-editor__main">
          <section className="card admin-panel">
            <h2>Photos</h2>
            <p className="muted admin-panel__lead">The first photo is the cover shown in listings. Photos are resized automatically.</p>
            <div
              className={`admin-drop ${dragOver ? 'is-over' : ''}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                addFiles(e.dataTransfer.files);
              }}
            >
              <Icon name="camera" size={28} />
              <span>
                <strong>Drag photos here</strong> or{' '}
                <button type="button" className="admin-linkbtn" onClick={() => fileInput.current?.click()}>
                  choose files
                </button>
              </span>
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => {
                  addFiles(e.target.files);
                  e.target.value = '';
                }}
              />
            </div>
            {photos.length > 0 ? (
              <ul className="admin-photos">
                {photos.map((p, i) => (
                  <li key={p.file} className="admin-photos__item">
                    <AdminPhoto file={p.src ? null : p.file} src={p.src} alt={`Photo ${i + 1}`} />
                    {i === 0 && <span className="chip chip--glass admin-photos__cover">Cover</span>}
                    {p.base64 && <span className="chip chip--blue admin-photos__new">New</span>}
                    <div className="admin-photos__bar">
                      <button type="button" onClick={() => movePhoto(i, -1)} disabled={i === 0} aria-label={`Move photo ${i + 1} left`}>
                        <Icon name="chevronLeft" size={16} />
                      </button>
                      {i !== 0 && (
                        <button type="button" onClick={() => makeCover(i)} aria-label={`Make photo ${i + 1} the cover`}>
                          Cover
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => movePhoto(i, 1)}
                        disabled={i === photos.length - 1}
                        aria-label={`Move photo ${i + 1} right`}
                      >
                        <Icon name="chevronRight" size={16} />
                      </button>
                      <button type="button" onClick={() => removePhoto(i)} aria-label={`Remove photo ${i + 1}`} className="is-danger">
                        <Icon name="close" size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="admin-hint-warn">Add at least one photo, or the car won’t appear on the website.</p>
            )}
          </section>

          <section className="card admin-panel">
            <h2>Vehicle details</h2>
            <div className="admin-form-grid">
              <Field id="car-year" label="Year" error={errors.year}>
                <input id="car-year" className="input" inputMode="numeric" value={form.year} onChange={set('year')} aria-invalid={!!errors.year} />
              </Field>
              <Field id="car-make" label="Make" error={errors.make}>
                <input id="car-make" className="input" placeholder="Honda" value={form.make} onChange={set('make')} aria-invalid={!!errors.make} />
              </Field>
              <Field id="car-model" label="Model" error={errors.model}>
                <input id="car-model" className="input" placeholder="Accord" value={form.model} onChange={set('model')} aria-invalid={!!errors.model} />
              </Field>
              <Field id="car-trim" label="Trim" hint="(optional)">
                <input id="car-trim" className="input" placeholder="EX-L" value={form.trim} onChange={set('trim')} />
              </Field>
              <Field id="car-price" label="Price ($)" error={errors.price}>
                <input id="car-price" className="input" inputMode="numeric" value={form.price} onChange={set('price')} aria-invalid={!!errors.price} />
              </Field>
              <Field id="car-mileage" label="Mileage" error={errors.mileage}>
                <input id="car-mileage" className="input" inputMode="numeric" value={form.mileage} onChange={set('mileage')} aria-invalid={!!errors.mileage} />
              </Field>
              <Field id="car-body" label="Body style">
                <select id="car-body" className="select" value={form.body} onChange={set('body')}>
                  {BODY_STYLES.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </Field>
              <Field id="car-transmission" label="Transmission">
                <select id="car-transmission" className="select" value={form.transmission} onChange={set('transmission')}>
                  {TRANSMISSIONS.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <Field id="car-drivetrain" label="Drivetrain">
                <select id="car-drivetrain" className="select" value={form.drivetrain} onChange={set('drivetrain')}>
                  {DRIVETRAINS.map((d) => (
                    <option key={d} value={d}>
                      {d || 'Not specified'}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="car-fuel" label="Fuel">
                <select id="car-fuel" className="select" value={form.fuelType} onChange={set('fuelType')}>
                  {FUELS.map((f) => (
                    <option key={f}>{f}</option>
                  ))}
                </select>
              </Field>
              <Field id="car-ext" label="Exterior color">
                <input id="car-ext" className="input" value={form.exteriorColor} onChange={set('exteriorColor')} />
              </Field>
              <Field id="car-int" label="Interior color">
                <input id="car-int" className="input" value={form.interiorColor} onChange={set('interiorColor')} />
              </Field>
              <Field id="car-vin" label="VIN" hint="(optional)" error={errors.vin}>
                <input id="car-vin" className="input admin-mono" maxLength={17} value={form.vin} onChange={set('vin')} aria-invalid={!!errors.vin} />
              </Field>
              <Field id="car-safety" label="Safety rating" hint="(optional)">
                <input id="car-safety" className="input" placeholder="5-star overall NHTSA rating" value={form.safetyRating} onChange={set('safetyRating')} />
              </Field>
            </div>
          </section>

          <section className="card admin-panel">
            <h2>Description</h2>
            <div className="admin-form-stack">
              <Field id="car-description" label="Overview">
                <textarea id="car-description" className="textarea" rows={4} value={form.description} onChange={set('description')} />
              </Field>
              <Field id="car-highlights" label="Highlights" hint="(one per line)">
                <textarea
                  id="car-highlights"
                  className="textarea"
                  rows={4}
                  placeholder={'Backup camera\nApple CarPlay\nPaid off'}
                  value={form.highlights}
                  onChange={set('highlights')}
                />
              </Field>
            </div>
          </section>

          <section className="card admin-panel">
            <h2>Title &amp; history</h2>
            <div className="admin-form-grid">
              <Field id="car-title" label="Title status">
                <select id="car-title" className="select" value={form.titleStatus} onChange={set('titleStatus')}>
                  {TITLES.map((t) => (
                    <option key={t} value={t}>
                      {t || 'Not specified'}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="car-damage" label="Damage history" hint="(shown as a disclosure)">
                <input
                  id="car-damage"
                  className="input"
                  placeholder="Repaired side impact damage"
                  value={form.damageHistory}
                  onChange={set('damageHistory')}
                />
              </Field>
            </div>
          </section>
        </div>

        <aside className="admin-editor__side">
          <section className="card admin-panel admin-sticky">
            <h2>Status</h2>
            <div className="segmented admin-status-toggle" role="group" aria-label="Status">
              <button
                type="button"
                aria-pressed={form.status === 'available'}
                onClick={() => {
                  setForm((f) => ({ ...f, status: 'available' }));
                  setDirty(true);
                }}
              >
                For sale
              </button>
              <button
                type="button"
                aria-pressed={form.status === 'sold'}
                onClick={() => {
                  setForm((f) => ({ ...f, status: 'sold' }));
                  setDirty(true);
                }}
              >
                Sold
              </button>
            </div>
            <label className="admin-check">
              <input type="checkbox" checked={form.featured} onChange={set('featured')} />
              Feature on the home page
            </label>

            <button type="submit" className="btn btn--accent btn--lg btn--block" disabled={status.busy}>
              {status.busy ? 'Saving…' : isNew ? 'Save & publish' : 'Save changes'}
            </button>
            {dirty && !status.busy && <p className="admin-unsaved">You have unsaved changes.</p>}
            {status.note && <p className="admin-note">{status.note}</p>}
            {status.error && (
              <p className="field-error" role="alert">
                {status.error}
              </p>
            )}

            {!isNew && (
              <div className="admin-danger">
                {confirmDelete ? (
                  <>
                    <p>Delete this car and its photos for good?</p>
                    <div className="admin-danger__row">
                      <button type="button" className="btn btn--danger" onClick={onDelete} disabled={status.busy}>
                        Yes, delete
                      </button>
                      <button type="button" className="btn btn--ghost" onClick={() => setConfirmDelete(false)}>
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <button type="button" className="admin-linkbtn admin-linkbtn--danger" onClick={() => setConfirmDelete(true)}>
                    Delete this car
                  </button>
                )}
                <p className="muted admin-danger__tip">Sold it? Use “Sold” instead to keep its history.</p>
              </div>
            )}
          </section>
        </aside>
      </div>
    </form>
  );
}

export default CarEditor;
