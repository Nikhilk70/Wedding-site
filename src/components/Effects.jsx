import { useEffect, useState } from 'react';

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Little hearts/sparkles where the guest taps. */
export function TapSparkles() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    if (reducedMotion()) return undefined;
    let n = 0;
    const onDown = (e) => {
      if (e.target.closest('input, textarea, dialog, .reel__player, .lightbox')) return;
      const id = n++;
      const glyph = ['♥', '✦', '❀'][id % 3];
      setItems((list) => [...list.slice(-10), { id, x: e.clientX, y: e.clientY, glyph }]);
      setTimeout(() => setItems((list) => list.filter((i) => i.id !== id)), 1000);
    };
    window.addEventListener('pointerdown', onDown, { passive: true });
    return () => window.removeEventListener('pointerdown', onDown);
  }, []);
  return (
    <div className="taps" aria-hidden="true">
      {items.map((i) => (
        <span key={i.id} style={{ left: i.x, top: i.y }}>
          {[0, 1, 2].map((k) => <b key={k} style={{ '--a': `${-60 + k * 60}deg` }}>{i.glyph}</b>)}
        </span>
      ))}
    </div>
  );
}

/** Burst of petals + gold confetti when the envelope opens. */
export function Burst() {
  const pieces = Array.from({ length: 40 }, (_, i) => {
    const angle = (i / 40) * Math.PI * 2;
    const dist = 140 + (i * 37) % 180;
    return {
      tx: `${Math.cos(angle) * dist}px`,
      ty: `${Math.sin(angle) * dist - 80}px`,
      r: `${(i * 47) % 360}deg`,
      kind: i % 4,
      delay: `${(i % 5) * 0.03}s`
    };
  });
  return (
    <div className="burst" aria-hidden="true">
      {pieces.map((p, i) => (
        <i key={i} className={`burst__p burst__p--${p.kind}`} style={{ '--tx': p.tx, '--ty': p.ty, '--r': p.r, animationDelay: p.delay }} />
      ))}
    </div>
  );
}

/** Gold line ornament that draws itself when scrolled into view. */
export function Divider() {
  return (
    <div className="divider reveal" aria-hidden="true">
      <svg viewBox="0 0 240 40" width="240" height="40">
        <path d="M4 20H92" />
        <path d="M148 20h88" />
        <path d="M120 6c6 6 6 22 0 28-6-6-6-22 0-28Z" />
        <path d="M120 20c8-8 20-8 26 0-6 8-18 8-26 0Z" />
        <path d="M120 20c-8-8-20-8-26 0 6 8 18 8 26 0Z" />
        <circle cx="120" cy="20" r="2.5" />
      </svg>
    </div>
  );
}

/** Moves [data-parallax] elements gently while scrolling. */
export function useParallax(deps = []) {
  useEffect(() => {
    if (reducedMotion()) return undefined;
    const els = [...document.querySelectorAll('[data-parallax]')];
    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const k = parseFloat(el.dataset.parallax) || 0.1;
        const offset = (r.top + r.height / 2 - vh / 2) * -k;
        el.style.setProperty('--py', `${offset.toFixed(1)}px`);
      });
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(frame); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Native share sheet for the invitation link (falls back to WhatsApp). */
export function ShareButton({ names, className = 'btn' }) {
  const share = async () => {
    const url = window.location.origin + window.location.pathname;
    const text = `You're invited to the wedding of ${names.groom} & ${names.bride} 💛`;
    if (navigator.share) {
      try { await navigator.share({ title: `${names.groom} & ${names.bride}`, text, url }); } catch { /* closed */ }
      return;
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`, '_blank', 'noopener');
  };
  return (
    <button className={className} onClick={share}>
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M18 16a3 3 0 0 0-2.4 1.2l-6.7-3.4a3 3 0 0 0 0-1.6l6.7-3.4A3 3 0 1 0 15 7l-6.7 3.4a3 3 0 1 0 0 3.2L15 17a3 3 0 1 0 3-1Z" /></svg>
      Share invitation
    </button>
  );
}
