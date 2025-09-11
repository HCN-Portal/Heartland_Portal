import { useEffect, useMemo, useRef, useState } from "react";
import './SkillsMultiSelect.css'

export default function SkillsMultiSelect({
  options = [],
  value = [],
  onChange,
  placeholder = "Search skills…",
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? options.filter((o) => o.toLowerCase().includes(s)) : options;
  }, [q, options]);

  const toggle = (opt) => {
    if (value.includes(opt)) onChange(value.filter((v) => v !== opt));
    else onChange([...value, opt]);
  };

  return (
    <div className="ms-wrap" ref={ref}>
      <div
        className={`ms-input ${open ? "ms-open" : ""}`}
        onClick={() => setOpen(true)}
      >
        <div className="ms-tags">
          {value.length === 0 && (
            <span className="ms-placeholder">Select skills…</span>
          )}
          {value.map((v) => (
            <span key={v} className="ms-tag">
              {v}
              <button
                type="button"
                className="ms-x"
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(v);
                }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <span className="ms-caret">▾</span>
      </div>

      {open && (
        <div className="ms-popover">
          <div className="ms-search">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={placeholder}
              autoFocus
            />
          </div>
          <div className="ms-list">
            {filtered.length === 0 && <div className="ms-empty">No matches</div>}
            {filtered.map((opt) => (
              <label key={opt} className="ms-item">
                <input
                  type="checkbox"
                  checked={value.includes(opt)}
                  onChange={() => toggle(opt)}
                />
                <span>{opt}</span>
              </label>


            ))}
          </div>
        </div>
      )}
    </div>
  );
}
