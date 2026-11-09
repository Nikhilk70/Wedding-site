import { useCallback, useEffect, useRef, useState } from 'react';
import { dotDate, longDate, time12 } from '../lib/format.js';

const SLIDE_SECONDS = 5;

async function shareVideo(src, title) {
  try {
    if (navigator.canShare) {
      const blob = await (await fetch(src)).blob();
      const file = new File([blob], src.split('/').pop(), { type: 'video/mp4' });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title });
        return;
      }
    }
  } catch (e) {
    if (e?.name === 'AbortError') return; // user closed the share sheet
  }
  const a = document.createElement('a');
  a.href = src;
  a.download = src.split('/').pop();
  a.click();
}

/** Instagram-story style reel: Ken Burns photos, captions, tap to skip, hold to pause. */
export default function Reel({ site, names }) {
  const photos = site.photos?.reel || [];
  const slides = [...photos, { card: true }];
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const [inView, setInView] = useState(false);
  const [full, setFull] = useState(false);
  const box = useRef(null);
  const holdTimer = useRef(null);
  const wasHold = useRef(false);

  const paused = held || !inView;
  const go = useCallback((dir) => setIndex((i) => (i + dir + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    const el = box.current;
    if (!el || !('IntersectionObserver' in window)) { setInView(true); return undefined; }
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.45 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!full) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setFull(false); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [full]);

  if (!photos.length) return null;

  const down = () => {
    wasHold.current = false;
    holdTimer.current = setTimeout(() => { wasHold.current = true; setHeld(true); }, 220);
  };
  const up = (e) => {
    clearTimeout(holdTimer.current);
    setHeld(false);
    if (wasHold.current) return;
    const rect = box.current.getBoundingClientRect();
    go(e.clientX - rect.left < rect.width / 3 ? -1 : 1);
  };

  const { wedding = {}, reception = {} } = site;

  return (
    <section className="section reel" id="reel">
      <div className="container">
        <p className="eyebrow reveal">Our story in motion</p>
        <h2 className="section__title script reveal">The Reel</h2>

        <div className="reveal zoom">
        <div
          ref={box}
          className={`reel__player ${full ? 'is-full' : ''} ${paused ? 'is-paused' : ''}`}
          onPointerDown={down}
          onPointerUp={up}
          onPointerLeave={() => { clearTimeout(holdTimer.current); setHeld(false); }}
          onContextMenu={(e) => e.preventDefault()}
          role="region"
          aria-label="Photo reel. Tap the right side for next, left side for previous, hold to pause."
        >
          <div className="reel__bars" aria-hidden="true">
            {slides.map((_, i) => (
              <span key={i} className="reel__bar">
                <i
                  key={i === index ? `a${index}` : i}
                  className={i < index ? 'done' : i === index ? 'active' : ''}
                  style={{ animationDuration: `${SLIDE_SECONDS}s` }}
                  onAnimationEnd={i === index ? () => go(1) : undefined}
                />
              </span>
            ))}
          </div>

          {slides.map((s, i) => (
            s.card ? (
              <div key="card" className={`reel__slide reel__card ${i === index ? 'is-active' : ''}`}>
                <p className="eyebrow">We're getting married</p>
                <p className="script reel__card-names">{names.groom}<span>&amp;</span>{names.bride}</p>
                <p className="reel__card-date">{longDate(wedding.date)}</p>
                <p className="reel__card-line"><b>Muhurtham · {time12(wedding.time)}</b>{wedding.venue?.name}</p>
                {reception.enabled && <p className="reel__card-line"><b>Reception · {time12(reception.time)}</b>{reception.venue?.name}</p>}
              </div>
            ) : (
              <div key={s.src} className={`reel__slide ${i === index ? 'is-active' : ''} ${i === index - 1 || (index === 0 && i === slides.length - 1) ? 'was-active' : ''}`}>
                <img
                  src={s.src}
                  alt=""
                  draggable="false"
                  className={`kb kb--${s.motion || 'in'}`}
                  style={{ objectPosition: s.focus || '50% 40%' }}
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
                {i === 0 ? (
                  <div className="reel__caption reel__caption--hero">
                    <p className="script">{names.groom} &amp; {names.bride}</p>
                    <span>{dotDate(wedding.date)}</span>
                  </div>
                ) : s.caption && (
                  <div className="reel__caption"><p>{s.caption}</p></div>
                )}
              </div>
            )
          ))}

          <div className="reel__shade" aria-hidden="true" />
          {held && <div className="reel__pause" aria-hidden="true">❚❚</div>}
          <button
            className="reel__full"
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            onClick={() => setFull((f) => !f)}
            aria-label={full ? 'Exit full screen' : 'Full screen'}
          >
            {full ? '×' : '⤢'}
          </button>
        </div>
        </div>

        {site.videos?.length > 0 && (
          <div className="reel__downloads reveal">
            <p className="reel__hint">Share our invitation video on WhatsApp</p>
            <div className="event__actions">
              {site.videos.map((v) => (
                <button key={v.src} className="btn" onClick={() => shareVideo(v.src, `${names.groom} & ${names.bride}`)}>
                  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M18 16a3 3 0 0 0-2.4 1.2l-6.7-3.4a3 3 0 0 0 0-1.6l6.7-3.4A3 3 0 1 0 15 7l-6.7 3.4a3 3 0 1 0 0 3.2L15 17a3 3 0 1 0 3-1Z" /></svg>
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
