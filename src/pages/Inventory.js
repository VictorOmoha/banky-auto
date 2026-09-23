import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Icon from '../components/Icon';
import VehicleCard from '../components/VehicleCard';
import { vehicles, matchesQuery } from '../data/vehicles';
import './Inventory.css';

const unique = (key) => [...new Set(vehicles.map((v) => v[key]))].sort();
const makes = unique('make');
const bodies = unique('body');
const years = unique('year').reverse();

const sorters = {
  featured: (a, b) => Number(b.featured) - Number(a.featured),
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  'miles-asc': (a, b) => a.mileage - b.mileage,
  'year-desc': (a, b) => b.year - a.year,
};

const FILTER_KEYS = ['q', 'make', 'body', 'year', 'min', 'max'];

function Inventory() {
  const [params, setParams] = useSearchParams();
  const [layout, setLayout] = useState('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const get = (k) => params.get(k) || '';
  const sort = get('sort') || 'featured';

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const clearAll = () => {
    const next = new URLSearchParams();
    if (params.get('sort')) next.set('sort', params.get('sort'));
    setParams(next, { replace: true });
  };

  const results = useMemo(() => {
    const q = params.get('q') || '';
    const make = params.get('make');
    const body = params.get('body');
    const year = Number(params.get('year')) || null;
    const min = Number(params.get('min')) || 0;
    const max = Number(params.get('max')) || Infinity;
    const sortKey = params.get('sort') || 'featured';
    return vehicles
      .filter(
        (v) =>
          matchesQuery(v, q) &&
          (!make || v.make === make) &&
          (!body || v.body === body) &&
          (!year || v.year === year) &&
          v.price >= min &&
          v.price <= max
      )
      .sort(sorters[sortKey] || sorters.featured);
  }, [params]);

  const active = FILTER_KEYS.filter((k) => params.get(k));
  const chipLabel = (k) => {
    const v = params.get(k);
    if (k === 'q') return `“${v}”`;
    if (k === 'min') return `From $${Number(v).toLocaleString()}`;
    if (k === 'max') return `Up to $${Number(v).toLocaleString()}`;
    return v;
  };

  return (
    <div className="inventory">
      <section className="inventory__head">
        <div className="container">
          <span className="eyebrow">Inventory</span>
          <div className="inventory__title">
            <h1 className="h2">Find your next car</h1>
            <form className="inventory__search" role="search" onSubmit={(e) => e.preventDefault()}>
              <Icon name="search" size={18} />
              <label htmlFor="inv-search" className="sr-only">
                Search inventory
              </label>
              <input
                id="inv-search"
                type="search"
                placeholder="Search make, model, year, color…"
                value={get('q')}
                onChange={(e) => update('q', e.target.value)}
              />
            </form>
          </div>
        </div>
      </section>

      <div className="container inventory__layout">
        <aside className={`filters ${filtersOpen ? 'filters--open' : ''}`} aria-label="Filters">
          <div className="filters__head">
            <h2>Filters</h2>
            {active.length > 0 && (
              <button type="button" className="filters__clear" onClick={clearAll}>
                Clear all
              </button>
            )}
          </div>

          <fieldset className="filters__group">
            <legend className="field-label">Body style</legend>
            <div className="segmented">
              <button type="button" aria-pressed={!get('body')} onClick={() => update('body', '')}>
                All
              </button>
              {bodies.map((b) => (
                <button key={b} type="button" aria-pressed={get('body') === b} onClick={() => update('body', b)}>
                  {b}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="field filters__group">
            <label htmlFor="f-make">Make</label>
            <select id="f-make" className="select" value={get('make')} onChange={(e) => update('make', e.target.value)}>
              <option value="">All makes</option>
              {makes.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="field filters__group">
            <label htmlFor="f-year">Year</label>
            <select id="f-year" className="select" value={get('year')} onChange={(e) => update('year', e.target.value)}>
              <option value="">All years</option>
              {years.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </div>

          <fieldset className="filters__group">
            <legend className="field-label">Price</legend>
            <div className="filters__price">
              <label className="sr-only" htmlFor="f-min">
                Minimum price
              </label>
              <input
                id="f-min"
                className="input"
                type="number"
                inputMode="numeric"
                min="0"
                step="500"
                placeholder="Min $"
                value={get('min')}
                onChange={(e) => update('min', e.target.value)}
              />
              <span aria-hidden="true">–</span>
              <label className="sr-only" htmlFor="f-max">
                Maximum price
              </label>
              <input
                id="f-max"
                className="input"
                type="number"
                inputMode="numeric"
                min="0"
                step="500"
                placeholder="Max $"
                value={get('max')}
                onChange={(e) => update('max', e.target.value)}
              />
            </div>
          </fieldset>

          <button type="button" className="btn btn--accent btn--block filters__done" onClick={() => setFiltersOpen(false)}>
            Show {results.length} {results.length === 1 ? 'car' : 'cars'}
          </button>
        </aside>

        <div className="inventory__main">
          <div className="toolbar">
            <p className="toolbar__count" aria-live="polite">
              <strong>{results.length}</strong> {results.length === 1 ? 'vehicle' : 'vehicles'}
            </p>
            <div className="toolbar__controls">
              <button
                type="button"
                className="btn btn--ghost toolbar__filters-btn"
                aria-expanded={filtersOpen}
                onClick={() => setFiltersOpen((o) => !o)}
              >
                <Icon name="sliders" size={16} /> Filters{active.length > 0 && ` (${active.length})`}
              </button>
              <label htmlFor="sort" className="sr-only">
                Sort by
              </label>
              <select id="sort" className="select toolbar__sort" value={sort} onChange={(e) => update('sort', e.target.value === 'featured' ? '' : e.target.value)}>
                <option value="featured">Featured</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="miles-asc">Mileage: lowest</option>
                <option value="year-desc">Year: newest</option>
              </select>
              <div className="segmented toolbar__layout" role="group" aria-label="Layout">
                <button type="button" aria-pressed={layout === 'grid'} onClick={() => setLayout('grid')}>
                  Grid
                </button>
                <button type="button" aria-pressed={layout === 'list'} onClick={() => setLayout('list')}>
                  List
                </button>
              </div>
            </div>
          </div>

          {active.length > 0 && (
            <div className="active-filters">
              {active.map((k) => (
                <button key={k} type="button" className="chip active-filters__chip" onClick={() => update(k, '')}>
                  {chipLabel(k)}
                  <Icon name="close" size={14} />
                  <span className="sr-only">Remove filter</span>
                </button>
              ))}
            </div>
          )}

          {results.length > 0 ? (
            <div className={layout === 'grid' ? 'vgrid vgrid--inventory' : 'vlist'}>
              {results.map((v) => (
                <VehicleCard key={v.id} vehicle={v} layout={layout} />
              ))}
            </div>
          ) : (
            <div className="empty card">
              <span className="icon-tile">
                <Icon name="search" size={22} />
              </span>
              <h3>No cars match those filters</h3>
              <p className="muted">Try widening your search, or tell us what you’re after and we’ll keep an eye out.</p>
              <button type="button" className="btn btn--ghost" onClick={clearAll}>
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Inventory;
