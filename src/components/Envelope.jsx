import { useState } from 'react';
import { dotDate } from '../lib/format.js';
import { Burst } from './Effects.jsx';

export default function Envelope({ names, guest, date, background, onOpen }) {
  const [opening, setOpening] = useState(false);

  const open = () => {
    if (opening) return;
    setOpening(true);
    try { navigator.vibrate?.(35); } catch { /* not supported */ }
    onOpen(); // start music inside the tap (browsers block autoplay otherwise)
  };

  return (
    <div
      className={`envelope ${opening ? 'is-opening' : ''}`}
      role="dialog"
      aria-label="Wedding invitation"
      style={background ? { '--envelope-bg': `url(${background})` } : undefined}
    >
      <div className="envelope__card">
        <div className="envelope__flap" aria-hidden="true" />
        <div className="envelope__inner">
          <p className="eyebrow">Wedding Invitation</p>
          <p className="envelope__ml" lang="ml">വിവാഹ ക്ഷണം</p>
          <h1 className="script envelope__names">
            {names.groom} <span className="amp">&amp;</span> {names.bride}
          </h1>
          <p className="envelope__date">{dotDate(date)}</p>

          <div className="envelope__guest">
            <span>Dear</span>
            <strong>{guest || 'Family & Friends'}</strong>
          </div>

          <button className="seal" onClick={open} aria-label="Open the invitation">
            <span className="seal__initials">{names.groom[0]}<i>&amp;</i>{names.bride[0]}</span>
          </button>
          <p className="envelope__hint">Tap the seal to open</p>
        </div>
      </div>
      {opening && <Burst />}
    </div>
  );
}
