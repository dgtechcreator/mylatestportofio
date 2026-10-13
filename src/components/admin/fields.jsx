import { useId, useRef, useState } from 'react';
import { api } from '../../lib/api';
import { prepareImage } from '../../lib/image';
import { safeSrc } from '../../lib/safe';

export function Field({ label, hint, children }) {
  return (
    <div className="f">
      {label && <span className="fl">{label}</span>}
      {children}
      {hint && <small className="fh">{hint}</small>}
    </div>
  );
}

export function Text({ label, hint, value, onChange, multiline, rows = 3, ...rest }) {
  const id = useId();
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <div className="f">
      {label && (
        <label className="fl" htmlFor={id}>
          {label}
        </label>
      )}
      <Tag id={id} value={value ?? ''} onChange={(e) => onChange(e.target.value)} rows={multiline ? rows : undefined} {...rest} />
      {hint && <small className="fh">{hint}</small>}
    </div>
  );
}

export function Check({ label, value, onChange }) {
  return (
    <label className="fc">
      <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

const hex = (v) => (/^#[0-9a-f]{6}$/i.test(v || '') ? v : '#f4b400');

export function Color({ label, value, onChange }) {
  return (
    <div className="f">
      {label && <span className="fl">{label}</span>}
      <input type="color" value={hex(value)} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Mini({ onClick, label, children, danger, disabled }) {
  return (
    <button type="button" className={danger ? 'mini danger' : 'mini'} onClick={onClick} aria-label={label} title={label} disabled={disabled}>
      {children}
    </button>
  );
}

const move = (list, from, to) => {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

/** Editable list of plain strings: type, reorder, delete, add. */
export function Strings({ label, hint, value, onChange, placeholder, addLabel = 'Add' }) {
  return (
    <Field label={label} hint={hint}>
      <div className="sl">
        {value.map((text, i) => (
          <div className="sr" key={i}>
            <input value={text} placeholder={placeholder} onChange={(e) => onChange(value.map((t, j) => (j === i ? e.target.value : t)))} />
            <Mini label="Move up" disabled={i === 0} onClick={() => onChange(move(value, i, i - 1))}>
              ↑
            </Mini>
            <Mini label="Move down" disabled={i === value.length - 1} onClick={() => onChange(move(value, i, i + 1))}>
              ↓
            </Mini>
            <Mini label="Delete" danger onClick={() => onChange(value.filter((_, j) => j !== i))}>
              ✕
            </Mini>
          </div>
        ))}
        <button type="button" className="add" onClick={() => onChange([...value, ''])}>
          + {addLabel}
        </button>
      </div>
    </Field>
  );
}

/** List of objects as collapsible cards with reorder / delete / add. */
export function ItemList({ items, onChange, title, render, makeItem, addLabel = 'Add item', max }) {
  return (
    <div className="il">
      {items.map((item, i) => (
        <details className="ic" key={i}>
          <summary>
            <span className="it">{title(item, i) || `Item ${i + 1}`}</span>
            <span className="ia" onClick={(e) => e.preventDefault()}>
              <Mini label="Move up" disabled={i === 0} onClick={() => onChange(move(items, i, i - 1))}>
                ↑
              </Mini>
              <Mini label="Move down" disabled={i === items.length - 1} onClick={() => onChange(move(items, i, i + 1))}>
                ↓
              </Mini>
              <Mini label="Delete" danger onClick={() => confirm('Delete this item?') && onChange(items.filter((_, j) => j !== i))}>
                ✕
              </Mini>
            </span>
          </summary>
          <div className="ib">{render(item, (patch) => onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it))), i)}</div>
        </details>
      ))}
      {(!max || items.length < max) && (
        <button type="button" className="add" onClick={() => onChange([...items, makeItem()])}>
          + {addLabel}
        </button>
      )}
    </div>
  );
}

/** Picture picker: shrinks the file in the browser, uploads it, stores the returned URL. */
export function ImageInput({ label, hint, value, onChange, fallback, removeLabel = 'Remove' }) {
  const file = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const shown = safeSrc(value) || fallback;

  const pick = async (e) => {
    const chosen = e.target.files?.[0];
    e.target.value = '';
    if (!chosen) return;
    setBusy(true);
    setError('');
    try {
      const blob = await prepareImage(chosen);
      const { url } = await api.upload(blob);
      onChange(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Field label={label} hint={hint}>
      <div className="im">
        <div className="imp">{shown ? <img src={shown} alt="" /> : <span>No image</span>}</div>
        <div className="imb">
          <input ref={file} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={pick} />
          <button type="button" className="mini wide" disabled={busy} onClick={() => file.current.click()}>
            {busy ? 'Uploading…' : value ? 'Change image' : 'Upload image'}
          </button>
          {value && (
            <button type="button" className="mini wide danger" onClick={() => onChange('')}>
              {removeLabel}
            </button>
          )}
          {error && <small className="fe">{error}</small>}
        </div>
      </div>
    </Field>
  );
}
