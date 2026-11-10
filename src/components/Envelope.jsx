import { useState } from 'react';
import { dotDate } from '../lib/format.js';
import { Burst } from './Effects.jsx';
import { Nilavilakku } from './Decor.jsx';

/**
 * Opening screen: a vintage kasavu-bordered invitation card floating over the hero's
 * slow-motion video (the video plays behind this see-through overlay).
 */
export default function Envelope({ names, guest, date, onOpen }) {
  const [opening, setOpening] = useState(false);

  const open = () => {
    if (opening) return;
    setOpening(true);
    try { navigator.vibrate?.(35); } catch { /* not supported */ }
    onOpen(); // start music inside the tap (browsers block autoplay otherwise)
  };

  return (
    <div className={`envelope ${opening ? 'is-opening' : ''}`} role="dialog" aria-label="Wedding invitation">
      <div className="envelope__card">
        <span className="envelope__corner envelope__corner--tl" aria-hidden="true" />
        <span className="envelope__corner envelope__corner--tr" aria-hidden="true" />
        <span className="envelope__corner envelope__corner--bl" aria-hidden="true" />
        <span className="envelope__corner envelope__corner--br" aria-hidden="true" />

        <div className="envelope__inner">
          <Nilavilakku size={34} className="envelope__lamp" />
          <p className="envelope__ml" lang="ml">ശുഭ വിവാഹം</p>
          <p className="eyebrow">Wedding Invitation</p>
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
