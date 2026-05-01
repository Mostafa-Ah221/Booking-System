import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Calendar, ArrowRight } from 'lucide-react';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];
const DAYS_SHORT = ['Su','Mo','Tu','We','Th','Fr','Sa'];

const toDateObj = (str) => {
  if (!str) return null;
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const toISO = (date) => {
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const sameDay = (a, b) =>
  a && b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth()    === b.getMonth()    &&
  a.getDate()     === b.getDate();

const isBetween = (date, start, end) => {
  if (!date || !start || !end) return false;
  return date > start && date < end;
};

const getDaysInMonth   = (y, m) => new Date(y, m + 1, 0).getDate();
const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

const fmt = (str) => {
  if (!str) return null;
  const d = toDateObj(str);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};
const fmtShort = (str) => {
  if (!str) return null;
  const d = toDateObj(str);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

// ─────────────────────────────────────────────
// Main DateRangePicker
// ─────────────────────────────────────────────
const DateRangePicker = ({
  mode = 'range',
  value,
  onChange,
  onClear,
  placeholder = 'Select date',
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [open, setOpen]         = useState(false);
  const [year,  setYear]        = useState(today.getFullYear());
  const [month, setMonth]       = useState(today.getMonth());
  const [hoverDate, setHoverDate] = useState(null);
  // range step: 'start' | 'end'
  const [step, setStep]         = useState('start');
  const wrapRef = useRef(null);

  const startDate = mode === 'single' ? toDateObj(value?.date) : toDateObj(value?.from);
  const endDate   = mode === 'range'  ? toDateObj(value?.to)   : null;

  // Reset step when opening
  const handleOpen = () => {
    if (mode === 'range') {
      // If no selection yet → start from beginning
      if (!value?.from) setStep('start');
      else if (!value?.to) setStep('end');
      else setStep('start'); // re-pick
    }
    setOpen(o => !o);
  };

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  };

  const handleDayClick = (date) => {
    if (mode === 'single') {
      onChange({ date: toISO(date) });
      setOpen(false);
      return;
    }
    if (step === 'start') {
      onChange({ from: toISO(date), to: '' });
      setStep('end');
    } else {
      if (date < startDate) {
        onChange({ from: toISO(date), to: toISO(startDate) });
      } else {
        onChange({ from: toISO(startDate), to: toISO(date) });
      }
      setHoverDate(null);
      setOpen(false);
      setStep('start');
    }
  };

  const formatDisplay = () => {
    if (mode === 'single') {
      return value?.date ? fmt(value.date) : placeholder;
    }
    if (!value?.from && !value?.to) return placeholder;
    if (value?.from && value?.to)
      return `${fmtShort(value.from)}  →  ${fmtShort(value.to)}`;
    if (value?.from) return `From ${fmtShort(value.from)}`;
    if (value?.to)   return `Until ${fmtShort(value.to)}`;
    return placeholder;
  };

  const hasValue = mode === 'single' ? !!value?.date : (!!value?.from || !!value?.to);

  // Build calendar cells
  const daysInMonth   = getDaysInMonth(year, month);
  const firstDay      = getFirstDayOfMonth(year, month);
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const rangeEnd = endDate || (mode === 'range' && step === 'end' && hoverDate);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        .dpk-wrap { position: relative; font-family: 'DM Sans', sans-serif; }

        /* ── Trigger ── */
        .dpk-trigger {
          display: flex; align-items: center; gap: 8px;
          padding: 9px 12px; border-radius: 10px; cursor: pointer;
          border: 1.5px solid #e2e8f0; background: #fafafa;
          transition: border-color .18s, box-shadow .18s, background .18s;
          user-select: none;
        }
        .dpk-trigger:hover { border-color: #a5b4fc; background: #fff; }
        .dpk-trigger.dpk-active {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,.12);
          background: #fff;
        }
        .dpk-trigger-text {
          flex: 1; font-size: 13px; color: #1e293b; font-weight: 500; letter-spacing: -.1px;
        }
        .dpk-trigger-text.placeholder { color: #94a3b8; font-weight: 400; }
        .dpk-icon-left { color: #6366f1; flex-shrink: 0; }
        .dpk-clear {
          display: flex; align-items: center; justify-content: center;
          width: 18px; height: 18px; border-radius: 50%; background: #e2e8f0;
          border: none; cursor: pointer; color: #64748b; flex-shrink: 0;
          transition: background .15s, color .15s;
        }
        .dpk-clear:hover { background: #cbd5e1; color: #1e293b; }

        /* ── Dropdown ── */
        .dpk-dropdown {
          position: absolute; top: calc(100% + 8px); left: 0; right: 0; z-index: 9999;
          background: #fff; border-radius: 16px;
          box-shadow: 0 24px 56px -8px rgba(15,23,42,.18), 0 0 0 1px rgba(15,23,42,.06);
          padding: 18px 18px 14px;
          animation: dpk-in .16s cubic-bezier(.22,.68,0,1.2);
          overflow: hidden;
        }
        @keyframes dpk-in {
          from { opacity:0; transform: translateY(8px) scale(.98); }
          to   { opacity:1; transform: translateY(0) scale(1); }
        }

        /* ── Step pills (range only) ── */
        .dpk-steps {
          display: flex; align-items: center; gap: 6px;
          margin-bottom: 14px; padding: 4px; background: #f8fafc;
          border-radius: 10px; border: 1px solid #f1f5f9;
        }
        .dpk-step {
          flex: 1; display: flex; flex-direction: column; align-items: center;
          padding: 7px 8px; border-radius: 8px; transition: all .15s; cursor: pointer;
          border: 1.5px solid transparent;
        }
        .dpk-step--active {
          background: #fff; border-color: #6366f1;
          box-shadow: 0 2px 8px rgba(99,102,241,.15);
        }
        .dpk-step--done {
          background: #f0fdf4; border-color: #86efac;
        }
        .dpk-step-label {
          font-size: 9px; font-weight: 700; text-transform: uppercase;
          letter-spacing: .6px; color: #94a3b8; margin-bottom: 2px;
        }
        .dpk-step--active .dpk-step-label { color: #6366f1; }
        .dpk-step--done .dpk-step-label   { color: #22c55e; }
        .dpk-step-value {
          font-size: 12px; font-weight: 600; color: #334155;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;
        }
        .dpk-step-value--empty { color: #cbd5e1; font-weight: 400; font-style: italic; }
        .dpk-step-arrow { color: #cbd5e1; flex-shrink: 0; }

        /* ── Calendar header ── */
        .dpk-cal-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 12px;
        }
        .dpk-cal-title {
          font-size: 13.5px; font-weight: 700; color: #0f172a; letter-spacing: -.3px;
        }
        .dpk-nav {
          display: flex; align-items: center; justify-content: center;
          width: 28px; height: 28px; border-radius: 7px;
          border: 1.5px solid #e2e8f0; background: #fff;
          cursor: pointer; color: #475569; transition: all .15s;
        }
        .dpk-nav:hover { background: #f1f5f9; border-color: #c7d2fe; color: #4f46e5; }

        /* ── Grid ── */
        .dpk-grid {
          display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px;
        }
        .dpk-day-name {
          text-align: center; font-size: 10px; font-weight: 700;
          color: #94a3b8; padding: 3px 0 7px; letter-spacing: .4px;
        }

        /* ── Day cell ── */
        .dpk-day {
          position: relative; display: flex; align-items: center; justify-content: center;
          height: 34px; border-radius: 8px; font-size: 12.5px; font-weight: 500;
          color: #334155; border: none; background: transparent; cursor: pointer;
          transition: background .1s, color .1s; outline: none;
        }
        .dpk-day:hover:not(.dpk-day--past):not(.dpk-day--start):not(.dpk-day--end) {
          background: #eef2ff; color: #4338ca;
        }
        .dpk-day--today  { font-weight: 800; color: #6366f1; }
        .dpk-day--today::after {
          content: ''; position: absolute; bottom: 4px; left: 50%;
          transform: translateX(-50%); width: 3px; height: 3px;
          border-radius: 50%; background: currentColor;
        }
        .dpk-day--start, .dpk-day--end {
          background: #6366f1 !important; color: #fff !important;
          font-weight: 700; border-radius: 8px !important; z-index: 2;
        }
        .dpk-day--start::after, .dpk-day--end::after { display: none; }
        .dpk-day--in-range {
          background: #eef2ff !important; color: #4338ca; border-radius: 0 !important;
        }
        .dpk-day--cap-left  { border-radius: 8px 0 0 8px !important; }
        .dpk-day--cap-right { border-radius: 0 8px 8px 0 !important; }

        /* ── Footer ── */
        .dpk-footer {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 14px; padding-top: 12px; border-top: 1px solid #f1f5f9;
        }
        .dpk-hint { font-size: 11px; color: #94a3b8; font-weight: 500; }
        .dpk-hint strong { color: #6366f1; }
        .dpk-btns { display: flex; gap: 6px; }
        .dpk-btn {
          padding: 6px 14px; border-radius: 7px; font-size: 12px; font-weight: 600;
          cursor: pointer; border: none; transition: all .15s; letter-spacing: .1px;
          font-family: inherit;
        }
        .dpk-btn--ghost { background: transparent; color: #64748b; }
        .dpk-btn--ghost:hover { background: #f1f5f9; color: #334155; }
        .dpk-btn--primary { background: #6366f1; color: #fff; }
        .dpk-btn--primary:hover { background: #4f46e5; }
      `}</style>

      <div className="dpk-wrap" ref={wrapRef}>

        {/* ── Trigger ── */}
        <div
          className={`dpk-trigger ${open ? 'dpk-active' : ''}`}
          onClick={handleOpen}
        >
          <Calendar size={15} className="dpk-icon-left" />
          <span className={`dpk-trigger-text ${!hasValue ? 'placeholder' : ''}`}>
            {formatDisplay()}
          </span>
          {hasValue && (
            <button
              className="dpk-clear"
              onClick={(e) => { e.stopPropagation(); onClear?.(); setOpen(false); setStep('start'); }}
            >
              <X size={10} />
            </button>
          )}
        </div>

        {/* ── Dropdown ── */}
        {open && (
          <div className="dpk-dropdown">

            {/* Step pills — range only */}
            {mode === 'range' && (
              <div className="dpk-steps">
                <div
                  className={`dpk-step ${step === 'start' ? 'dpk-step--active' : value?.from ? 'dpk-step--done' : ''}`}
                  onClick={() => setStep('start')}
                >
                  <span className="dpk-step-label">Start</span>
                  <span className={`dpk-step-value ${!value?.from ? 'dpk-step-value--empty' : ''}`}>
                    {value?.from ? fmtShort(value.from) : 'Pick date'}
                  </span>
                </div>

                <ArrowRight size={13} className="dpk-step-arrow" />

                <div
                  className={`dpk-step ${step === 'end' ? 'dpk-step--active' : value?.to ? 'dpk-step--done' : ''}`}
                  onClick={() => { if (value?.from) setStep('end'); }}
                >
                  <span className="dpk-step-label">End</span>
                  <span className={`dpk-step-value ${!value?.to ? 'dpk-step-value--empty' : ''}`}>
                    {value?.to ? fmtShort(value.to) : 'Pick date'}
                  </span>
                </div>
              </div>
            )}

            {/* Calendar header */}
            <div className="dpk-cal-header">
              <button className="dpk-nav" onClick={prevMonth}><ChevronLeft size={14} /></button>
              <span className="dpk-cal-title">{MONTHS[month]} {year}</span>
              <button className="dpk-nav" onClick={nextMonth}><ChevronRight size={14} /></button>
            </div>

            {/* Day labels */}
            <div className="dpk-grid" style={{ marginBottom: 2 }}>
              {DAYS_SHORT.map(d => <div key={d} className="dpk-day-name">{d}</div>)}
            </div>

            {/* Day cells */}
            <div className="dpk-grid">
              {cells.map((date, idx) => {
                if (!date) return <div key={`e-${idx}`} />;

                const isStart  = sameDay(date, startDate);
                const isEnd    = sameDay(date, endDate);
                const inRange  = mode === 'range' && isBetween(date, startDate, rangeEnd);
                const isPast   = date < today;
                const isTodayD = sameDay(date, today);

                let cls = 'dpk-day';
                if (isTodayD && !isStart && !isEnd) cls += ' dpk-day--today';
                if (isStart) cls += ' dpk-day--start';
                if (isEnd)   cls += ' dpk-day--end';
                if (inRange) cls += ' dpk-day--in-range';
                if (isStart && (endDate || (step === 'end' && hoverDate))) cls += ' dpk-day--cap-left';
                if (isEnd   && startDate) cls += ' dpk-day--cap-right';

                return (
                  <button
                    key={idx}
                    className={cls}
                    onClick={() => handleDayClick(date)}
                     onMouseEnter={() => mode === 'range' && step === 'end' && setHoverDate(date)}
                    onMouseLeave={() => setHoverDate(null)}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="dpk-footer">
              <span className="dpk-hint">
                {mode === 'range'
                  ? step === 'start'
                    ? 'Pick a <strong>start</strong> date'
                    : startDate && endDate
                    ? `${Math.round((endDate - startDate) / 86400000) + 1} days`
                    : 'Now pick an <strong>end</strong> date'
                  : 'Click a day to select'
                }
              </span>
              <div className="dpk-btns">
                {hasValue && (
                  <button
                    className="dpk-btn dpk-btn--ghost"
                    onClick={() => { onClear?.(); setStep('start'); setOpen(false); }}
                  >
                    Clear
                  </button>
                )}
                <button className="dpk-btn dpk-btn--primary" onClick={() => setOpen(false)}>
                  Done
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </>
  );
};

export default DateRangePicker;