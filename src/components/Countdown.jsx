import { useEffect, useState } from 'react';
import { dateParts, istInstant } from '../lib/format.js';
import MotionFrame from './MotionFrame.jsx';

function diff(target) {
  const ms = Math.max(0, target - Date.now());
  return {
    done: ms === 0,
    days: Math.floor(ms / 86400000),
    hours: Math.floor(ms / 3600000) % 24,
    minutes: Math.floor(ms / 60000) % 60,
    seconds: Math.floor(ms / 1000) % 60
  };
}

function MonthCalendar({ iso }) {
  const p = dateParts(iso);
  if (!p) return null;
  const first = new Date(Date.UTC(p.y, p.m - 1, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(p.y, p.m, 0)).getUTCDate();
  const cells = [...Array(first).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div className="calendar reveal zoom">
      <p className="calendar__title">{p.month} {p.y}</p>
      <div className="calendar__grid">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={i} className="calendar__dow">{d}</span>)}
        {cells.map((d, i) => (
          <span key={i} className={d === p.d ? 'calendar__day is-wedding' : 'calendar__day'}>
            {d === p.d ? <><b>{d}</b><svg viewBox="0 0 32 29" aria-hidden="true"><path d="M16 28 3.2 15.6A8 8 0 0 1 16 5.6a8 8 0 0 1 12.8 10Z" /></svg></> : d}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Countdown({ site }) {
  const target = istInstant(site.wedding?.date, site.wedding?.time || '00:00').getTime();
  const [left, setLeft] = useState(() => diff(target));

  useEffect(() => {
    const id = setInterval(() => setLeft(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const units = [['Days', left.days], ['Hours', left.hours], ['Minutes', left.minutes], ['Seconds', left.seconds]];

  return (
    <section className="section countdown" id="countdown">
      <div className="container split">
        <MotionFrame src={site.frames?.countdown} motion="left" tilt={-2} focus="60% 40%" />
        <div className="split__body">
        <p className="eyebrow reveal">Counting down to forever</p>
        <h2 className="section__title script reveal">The Big Day</h2>
        {left.done ? (
          <p className="lead reveal">Today we begin our forever. Thank you for celebrating with us!</p>
        ) : (
          <div className="countdown__units">
            {units.map(([label, value], i) => (
              <div className="countdown__unit reveal" style={{ '--d': `${i * 0.1}s` }} key={label}>
                <span className="countdown__num" key={value}>{String(value).padStart(2, '0')}</span>
                <span className="countdown__label">{label}</span>
              </div>
            ))}
          </div>
        )}
        <MonthCalendar iso={site.wedding?.date} />
        </div>
      </div>
    </section>
  );
}
