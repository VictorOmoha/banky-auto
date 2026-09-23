import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon';
import { vehicles, vehicleName, formatPrice, formatMiles, matchesQuery } from '../data/vehicles';
import './SearchSuggest.css';

const MAX_CARS = 5;
const MAX_TERMS = 4;

// Searchable shortcuts built from inventory: makes, make + model, body styles.
const terms = (() => {
  const list = [];
  const seen = new Set();
  const add = (label, to, kind, test) => {
    if (seen.has(label)) return;
    seen.add(label);
    list.push({ label, to, kind, count: vehicles.filter(test).length });
  };
  vehicles.forEach((v) => {
    add(v.make, `/vehicles?make=${encodeURIComponent(v.make)}`, 'Make', (x) => x.make === v.make);
    add(
      `${v.make} ${v.model}`,
      `/vehicles?q=${encodeURIComponent(`${v.make} ${v.model}`)}`,
      'Model',
      (x) => x.make === v.make && x.model === v.model
    );
    add(`${v.body}s`, `/vehicles?body=${encodeURIComponent(v.body)}`, 'Body style', (x) => x.body === v.body);
  });
  return list;
})();

const popular = ['Honda', 'Toyota Camry', 'SUVs', 'Honda Accord'];

// Every query word must start a word in the term ("acc" → "Honda Accord").
const termMatches = (label, query) => {
  const words = label.toLowerCase().split(/\s+/);
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((q) => words.some((w) => w.startsWith(q) || (q.length > 2 && w.startsWith(q.replace(/s$/, '')))));
};

function Highlight({ text, query }) {
  const words = query.trim().split(/\s+/).filter(Boolean).map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (!words.length) return text;
  const parts = text.split(new RegExp(`(${words.join('|')})`, 'gi'));
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="suggest__mark">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function SearchSuggest({ placeholder = 'Search by make, model or year', buttonLabel = 'Search cars', className = '' }) {
  const navigate = useNavigate();
  const id = useId();
  const listId = `${id}-list`;
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const q = query.trim();

  const { termItems, carItems } = useMemo(() => {
    if (!q) {
      return {
        termItems: popular.map((label) => terms.find((t) => t.label === label)).filter(Boolean),
        carItems: [],
      };
    }
    return {
      termItems: terms.filter((t) => termMatches(t.label, q)).slice(0, MAX_TERMS),
      carItems: vehicles.filter((v) => matchesQuery(v, q)).slice(0, MAX_CARS),
    };
  }, [q]);

  // One flat list drives keyboard navigation across both groups.
  const options = useMemo(() => {
    const opts = [
      ...termItems.map((t) => ({ key: `t-${t.label}`, to: t.to })),
      ...carItems.map((v) => ({ key: `v-${v.id}`, to: `/vehicles/${v.id}` })),
    ];
    if (q) opts.push({ key: 'all', to: `/vehicles?q=${encodeURIComponent(q)}` });
    return opts;
  }, [termItems, carItems, q]);

  useEffect(() => setActive(-1), [q]);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('touchstart', onPointer);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('touchstart', onPointer);
    };
  }, [open]);

  const go = (to) => {
    setOpen(false);
    inputRef.current?.blur();
    navigate(to);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (open && active >= 0 && options[active]) return go(options[active].to);
    return go(q ? `/vehicles?q=${encodeURIComponent(q)}` : '/vehicles');
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (i + 1) % options.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (i <= 0 ? options.length - 1 : i - 1));
    } else if (e.key === 'Escape') {
      if (open) {
        e.preventDefault();
        setOpen(false);
        setActive(-1);
      } else {
        setQuery('');
      }
    }
  };

  const optionId = (i) => `${id}-opt-${i}`;
  const showPanel = open && options.length > 0;
  const noMatches = open && q && !termItems.length && !carItems.length;
  let index = -1;

  const optionProps = (to) => {
    index += 1;
    const i = index;
    return {
      id: optionId(i),
      role: 'option',
      'aria-selected': active === i,
      className: `suggest__option ${active === i ? 'is-active' : ''}`,
      onMouseEnter: () => setActive(i),
      onMouseDown: (e) => e.preventDefault(),
      onClick: () => go(to),
    };
  };

  return (
    <div className={`suggest ${showPanel ? 'suggest--open' : ''} ${className}`} ref={rootRef}>
      <form className="suggest__bar" onSubmit={onSubmit} role="search">
        <Icon name="search" size={22} className="suggest__icon" />
        <label htmlFor={`${id}-input`} className="sr-only">
          Search inventory
        </label>
        <input
          ref={inputRef}
          id={`${id}-input`}
          type="text"
          inputMode="search"
          autoComplete="off"
          spellCheck="false"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showPanel && active >= 0 ? optionId(active) : undefined}
        />
        {query && (
          <button
            type="button"
            className="suggest__clear"
            aria-label="Clear search"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
          >
            <Icon name="close" size={16} />
          </button>
        )}
        <button type="submit" className="btn btn--accent btn--lg suggest__submit">
          {buttonLabel}
        </button>
      </form>

      {showPanel && (
        <div className="suggest__panel">
          <ul id={listId} role="listbox" aria-label="Search suggestions" className="suggest__list">
            {termItems.length > 0 && (
              <li role="presentation" className="suggest__group">
                {q ? 'Suggestions' : 'Popular searches'}
              </li>
            )}
            {termItems.map((t) => (
              <li key={t.label} {...optionProps(t.to)}>
                <span className="suggest__term-icon">
                  <Icon name="search" size={16} />
                </span>
                <span className="suggest__term">
                  <Highlight text={t.label} query={q} />
                </span>
                <span className="suggest__meta">
                  {t.kind} · {t.count} {t.count === 1 ? 'car' : 'cars'}
                </span>
              </li>
            ))}

            {carItems.length > 0 && (
              <li role="presentation" className="suggest__group">
                Cars
              </li>
            )}
            {carItems.map((v) => (
              <li key={v.id} {...optionProps(`/vehicles/${v.id}`)}>
                <img src={v.photos[0]} alt="" className="suggest__thumb" />
                <span className="suggest__car">
                  <strong>
                    <Highlight text={`${vehicleName(v)} ${v.trim}`} query={q} />
                  </strong>
                  <span>
                    {formatMiles(v.mileage)} · {v.exteriorColor} · {v.body}
                  </span>
                </span>
                <span className="suggest__price">{formatPrice(v.price)}</span>
              </li>
            ))}

            {q && (
              <li {...optionProps(`/vehicles?q=${encodeURIComponent(q)}`)} className={`suggest__option suggest__all ${active === index ? 'is-active' : ''}`}>
                <span>
                  {noMatches ? 'No exact matches. Search all cars for' : 'See all results for'} <strong>“{q}”</strong>
                </span>
                <Icon name="arrowRight" size={18} />
              </li>
            )}
          </ul>
        </div>
      )}
      <p className="sr-only" aria-live="polite">
        {open && q ? `${carItems.length} cars and ${termItems.length} suggestions available` : ''}
      </p>
    </div>
  );
}

export default SearchSuggest;
