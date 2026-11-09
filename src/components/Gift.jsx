import { useState } from 'react';

function UpiCard({ who, person }) {
  const [copied, setCopied] = useState(false);
  if (!person?.upi) return null;
  const copy = async () => {
    try { await navigator.clipboard.writeText(person.upi); setCopied(true); setTimeout(() => setCopied(false), 1800); }
    catch { /* clipboard blocked: the ID is visible to copy by hand */ }
  };
  const pay = `upi://pay?pa=${encodeURIComponent(person.upi)}&pn=${encodeURIComponent(person.name || who)}&cu=INR`;
  return (
    <div className="upi pop-in">
      <p className="eyebrow">{who}</p>
      {person.name && <p className="upi__name">{person.name}</p>}
      <p className="upi__id">{person.upi}</p>
      <div className="event__actions">
        <button className="btn btn--ghost" onClick={copy}>{copied ? 'Copied ✓' : 'Copy UPI ID'}</button>
        <a className="btn" href={pay}>Pay with UPI</a>
      </div>
    </div>
  );
}

export default function Gift({ gift }) {
  const [open, setOpen] = useState(false);
  if (!gift?.enabled || (!gift.bride?.upi && !gift.groom?.upi)) return null;
  return (
    <section className="section gift" id="gift">
      <div className="container narrow">
        <p className="eyebrow reveal">With love</p>
        <h2 className="section__title script reveal">Gift Box</h2>
        {!open ? (
          <button className="giftbox reveal zoom" onClick={() => setOpen(true)} aria-label="Open the gift box">
            <span className="giftbox__lid" /><span className="giftbox__body" />
            <span className="giftbox__hint">Tap to open</span>
          </button>
        ) : (
          <div className="upi__grid">
            <UpiCard who="Groom" person={gift.groom} />
            <UpiCard who="Bride" person={gift.bride} />
          </div>
        )}
        <p className="lead reveal">{gift.message || 'Your presence is the greatest gift we could receive!'}</p>
      </div>
    </section>
  );
}
