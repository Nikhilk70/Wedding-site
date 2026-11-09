import { googleCalendarUrl, icsDataUrl, longDate, time12 } from '../lib/format.js';

const pin = (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
  </svg>
);
const cal = (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <path fill="currentColor" d="M7 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7Zm-2 8h14v10H5V10Z" />
  </svg>
);

function EventCard({ icon, title, ml, date, rows, venue, calendar, delay }) {
  const location = [venue?.name, venue?.address].filter(Boolean).join(', ');
  const mapUrl = venue?.mapUrl || (location && `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`);

  return (
    <article className="event reveal" style={{ '--d': delay }}>
      <div className={`event__icon ${icon === '🪔' ? 'flicker' : 'twinkle'}`} aria-hidden="true">{icon}</div>
      <h3 className="event__title">{title}</h3>
      <p className="event__ml" lang="ml">{ml}</p>
      <p className="event__date">{longDate(date)}</p>
      <dl className="event__times">
        {rows.filter((r) => r[1]).map(([label, value]) => (
          <div key={label}><dt>{label}</dt><dd>{time12(value)}</dd></div>
        ))}
      </dl>
      <p className="event__venue">{venue?.name}</p>
      {venue?.address && <p className="event__address">{venue.address}</p>}
      <div className="event__actions">
        {mapUrl && <a className="btn" href={mapUrl} target="_blank" rel="noopener noreferrer">{pin} Get directions</a>}
        <a className="btn btn--ghost" href={googleCalendarUrl(calendar)} target="_blank" rel="noopener noreferrer">{cal} Google Calendar</a>
        <a className="btn btn--ghost" href={icsDataUrl(calendar)} download={`${title.toLowerCase()}.ics`}>{cal} Apple / Outlook</a>
      </div>
    </article>
  );
}

export default function Events({ site, names }) {
  const { wedding = {}, reception = {} } = site;
  const couple = `${names.groom} & ${names.bride}`;
  const placeOf = (v) => [v?.name, v?.address].filter(Boolean).join(', ');

  return (
    <section className="section events" id="events">
      <div className="container">
        <p className="eyebrow reveal">Join us</p>
        <h2 className="section__title script reveal">Wedding Events</h2>
        <div className="events__grid">
          {wedding.date && (
            <EventCard
              icon="🪔"
              title="Muhurtham"
              ml="വിവാഹം · മുഹൂർത്തം"
              date={wedding.date}
              rows={[['Muhurtham', wedding.time]]}
              venue={wedding.venue}
              delay="0s"
              calendar={{
                title: `${couple}'s Wedding`,
                date: wedding.date, time: wedding.time || '10:00', minutes: 180,
                location: placeOf(wedding.venue),
                details: `Join us to celebrate the wedding of ${couple}.`
              }}
            />
          )}
          {reception.enabled && reception.date && (
            <EventCard
              icon="✨"
              title="Reception"
              ml="സ്വീകരണം"
              date={reception.date}
              rows={[['Guests welcome', reception.welcomeTime], ['Reception', reception.time]]}
              venue={reception.venue}
              delay=".15s"
              calendar={{
                title: `${couple}'s Wedding Reception`,
                date: reception.date, time: reception.welcomeTime || reception.time || '17:00', minutes: 240,
                location: placeOf(reception.venue),
                details: `Join us for the wedding reception of ${couple}.`
              }}
            />
          )}
        </div>
        {site.dressCode && (
          <p className="dress reveal"><span className="eyebrow">Dress code</span>{site.dressCode}</p>
        )}
      </div>
    </section>
  );
}
