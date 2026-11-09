import { useEffect, useState } from 'react';
import { getWishes, sendWish } from '../lib/api.js';

const when = (iso) => {
  try { return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
  catch { return ''; }
};

export default function Wishes() {
  const [wishes, setWishes] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { getWishes().then(setWishes).catch(() => {}); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !message.trim()) return setError('Please add your name and a message.');
    setSending(true);
    try {
      const saved = await sendWish({ name, message });
      setWishes((w) => [saved, ...w]);
      setMessage('');
    } catch (err) { setError(err.message); }
    finally { setSending(false); }
  };

  return (
    <section className="section wishes" id="wishes">
      <div className="container narrow">
        <p className="eyebrow reveal">Guestbook</p>
        <h2 className="section__title script reveal">Send Your Wishes</h2>

        <form className="wishes__form reveal" onSubmit={submit} noValidate>
          <input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} aria-label="Your name" />
          <textarea placeholder="Write your blessings for the couple…" rows="3" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={500} aria-label="Your message" />
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="btn" type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send wishes'}</button>
        </form>

        <ul className="wishes__list">
          {wishes.length === 0 && <li className="wish wish--empty">Be the first to send your blessings ✨</li>}
          {wishes.map((w) => (
            <li className="wish" key={w.id}>
              <p className="wish__msg">“{w.message}”</p>
              <p className="wish__meta">— {w.name} <span>{when(w.createdAt)}</span></p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
