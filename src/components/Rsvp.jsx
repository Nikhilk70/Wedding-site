import { useEffect, useRef, useState } from 'react';
import { sendRsvp } from '../lib/api.js';

const EMPTY = { name: '', attending: '', guests: 1, phone: '', message: '' };

export default function Rsvp() {
  const dialog = useRef(null);
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState('idle'); // idle | sending | done
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    const d = dialog.current;
    const onClose = () => { if (status === 'done') { setForm(EMPTY); setStatus('idle'); } };
    d?.addEventListener('close', onClose);
    return () => d?.removeEventListener('close', onClose);
  }, [status]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) return setError('Please enter your name.');
    if (!form.attending) return setError('Please let us know if you can come.');
    setStatus('sending');
    try { await sendRsvp(form); setStatus('done'); }
    catch (err) { setError(err.message); setStatus('idle'); }
  };

  return (
    <section className="section rsvp" id="rsvp">
      <div className="container narrow">
        <p className="eyebrow reveal">Will you join us?</p>
        <h2 className="section__title script reveal">Confirm Attendance</h2>
        <p className="lead reveal">Kindly let us know if you'll be able to celebrate with us.</p>
        <button className="btn btn--lg reveal" onClick={() => dialog.current?.showModal()}>RSVP</button>
      </div>

      <dialog ref={dialog} className="modal" onClick={(e) => { if (e.target === dialog.current) dialog.current.close(); }}>
        <div className="modal__body">
          <button className="modal__close" onClick={() => dialog.current.close()} aria-label="Close">×</button>
          {status === 'done' ? (
            <div className="modal__done">
              <p className="script modal__title">Thank you!</p>
              <p>{form.attending === 'yes' ? "We can't wait to celebrate with you." : 'We will miss you. Thank you for your blessings.'}</p>
              <button className="btn" onClick={() => dialog.current.close()}>Close</button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <p className="script modal__title">RSVP</p>
              <label className="field">
                <span>Your name</span>
                <input value={form.name} onChange={set('name')} autoComplete="name" maxLength={100} required />
              </label>
              <fieldset className="field">
                <legend>Will you attend?</legend>
                <div className="choice">
                  <label className={form.attending === 'yes' ? 'is-on' : ''}>
                    <input type="radio" name="attending" value="yes" checked={form.attending === 'yes'} onChange={set('attending')} /> Joyfully accept
                  </label>
                  <label className={form.attending === 'no' ? 'is-on' : ''}>
                    <input type="radio" name="attending" value="no" checked={form.attending === 'no'} onChange={set('attending')} /> Regretfully decline
                  </label>
                </div>
              </fieldset>
              {form.attending === 'yes' && (
                <label className="field">
                  <span>Number of guests</span>
                  <input type="number" min="1" max="20" value={form.guests} onChange={set('guests')} />
                </label>
              )}
              <label className="field">
                <span>Phone (optional)</span>
                <input type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" maxLength={20} />
              </label>
              <label className="field">
                <span>Message (optional)</span>
                <textarea rows="3" value={form.message} onChange={set('message')} maxLength={500} />
              </label>
              {error && <p className="form-error" role="alert">{error}</p>}
              <button className="btn btn--lg" type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send RSVP'}
              </button>
            </form>
          )}
        </div>
      </dialog>
    </section>
  );
}
