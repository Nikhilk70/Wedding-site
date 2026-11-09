import { time12 } from '../lib/format.js';

/** Uses the client's schedule; if they left it empty, builds one from the event times. */
function buildSchedule(site) {
  if (site.schedule?.length) return site.schedule.filter((s) => s.time || s.title);
  const { wedding = {}, reception = {} } = site;
  const items = [];
  if (wedding.time) {
    items.push({ time: wedding.time, title: 'Muhurtham', note: wedding.venue?.name, ml: 'താലികെട്ട്' });
    items.push({ time: '', title: 'Sadhya', note: 'Traditional Kerala feast, following the Muhurtham', ml: 'സദ്യ' });
  }
  if (reception.enabled) {
    if (reception.welcomeTime) items.push({ time: reception.welcomeTime, title: 'Guests welcome', note: reception.venue?.name, ml: 'സ്വാഗതം' });
    if (reception.time) items.push({ time: reception.time, title: 'Reception', note: reception.venue?.name, ml: 'സ്വീകരണം' });
  }
  return items;
}

export default function Schedule({ site }) {
  const items = buildSchedule(site);
  if (!items.length) return null;
  return (
    <section className="section schedule" id="schedule">
      <div className="container narrow">
        <p className="eyebrow reveal">The wedding day</p>
        <h2 className="section__title script reveal">Schedule</h2>
        <ol className="timeline reveal">
          {items.map((it, i) => (
            <li className={`timeline__item reveal ${i % 2 ? 'from-right' : 'from-left'}`} key={i} style={{ '--d': `${i * 0.08}s` }}>
              <span className="timeline__dot" aria-hidden="true" />
              <time className="timeline__time">{time12(it.time) || 'After'}</time>
              <div className="timeline__body">
                <h3>{it.title} {it.ml && <span lang="ml">· {it.ml}</span>}</h3>
                {it.note && <p>{it.note}</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
