// Formatting helpers. All wedding times are Kerala local time (IST, UTC+05:30).

const HONORIFICS = /^(dr|mr|mrs|ms|miss|adv|er|prof|sri|smt)\.?$/i;
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** "Dr. Varaha M" -> "Varaha" (uses shortName when the client gave one). */
export function firstName(person = {}) {
  if (person.shortName) return person.shortName.trim();
  const words = String(person.name || '').trim().split(/\s+/).filter((w) => !HONORIFICS.test(w));
  return words[0] || '';
}

/** "2027-01-24" -> parts, without timezone drift. */
export function dateParts(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  const weekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return { y, m, d, month: MONTHS[m - 1], weekday: DAYS[weekday] };
}

export function longDate(iso) {
  const p = dateParts(iso);
  return p ? `${p.weekday}, ${p.d} ${p.month} ${p.y}` : '';
}

export function dotDate(iso) {
  const p = dateParts(iso);
  return p ? `${String(p.d).padStart(2, '0')} · ${String(p.m).padStart(2, '0')} · ${p.y}` : '';
}

/** "17:30" -> "5:30 PM" */
export function time12(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
}

/** Absolute instant for a Kerala date + time. */
export function istInstant(date, time = '00:00') {
  return new Date(`${date}T${time}:00+05:30`);
}

const pad = (n) => String(n).padStart(2, '0');
function calStamp(date, time, addMinutes = 0) {
  const d = new Date(istInstant(date, time).getTime() + addMinutes * 60000 + 5.5 * 3600000);
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00`;
}

export function googleCalendarUrl({ title, date, time, minutes = 120, location, details }) {
  const q = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${calStamp(date, time)}/${calStamp(date, time, minutes)}`,
    ctz: 'Asia/Kolkata',
    location: location || '',
    details: details || ''
  });
  return `https://calendar.google.com/calendar/render?${q}`;
}

export function icsDataUrl({ title, date, time, minutes = 120, location, details }) {
  const esc = (s) => String(s || '').replace(/[,;\\]/g, (c) => '\\' + c).replace(/\n/g, '\\n');
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wedding//Invite//EN', 'BEGIN:VEVENT',
    `UID:${date}-${time}-${Math.random().toString(36).slice(2)}@wedding`,
    `DTSTART;TZID=Asia/Kolkata:${calStamp(date, time)}`,
    `DTEND;TZID=Asia/Kolkata:${calStamp(date, time, minutes)}`,
    `SUMMARY:${esc(title)}`, `LOCATION:${esc(location)}`, `DESCRIPTION:${esc(details)}`,
    'END:VEVENT', 'END:VCALENDAR'
  ].join('\r\n');
  return 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics);
}
