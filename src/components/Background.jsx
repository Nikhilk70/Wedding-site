import { useEffect, useMemo, useState } from 'react';

/* Flower shapes used across the site (all small inline SVGs, transform-animated only). */
const SHAPES = {
  jasmine: (
    <svg viewBox="0 0 40 40">
      {[0, 72, 144, 216, 288].map((r) => (
        <ellipse key={r} cx="20" cy="10" rx="5.5" ry="10" fill="#fffdf4" stroke="#efe2c4" strokeWidth=".8" transform={`rotate(${r} 20 20)`} />
      ))}
      <circle cx="20" cy="20" r="3.2" fill="#f4d47c" />
    </svg>
  ),
  marigold: (
    <svg viewBox="0 0 40 40">
      {Array.from({ length: 12 }, (_, i) => (
        <ellipse key={i} cx="20" cy="9" rx="5" ry="9" fill={i % 2 ? '#f39c12' : '#f7b733'} transform={`rotate(${i * 30} 20 20)`} />
      ))}
      <circle cx="20" cy="20" r="7" fill="#e67e22" />
      <circle cx="20" cy="20" r="3.5" fill="#c0560e" />
    </svg>
  ),
  thechi: (
    <svg viewBox="0 0 40 40">
      {[0, 90, 180, 270].map((r) => (
        <ellipse key={r} cx="20" cy="11" rx="5" ry="9" fill="#c0392b" transform={`rotate(${r + 45} 20 20)`} />
      ))}
      <circle cx="20" cy="20" r="2.5" fill="#ffd27a" />
    </svg>
  ),
  konna: (
    <svg viewBox="0 0 40 40">
      {[0, 72, 144, 216, 288].map((r) => (
        <path key={r} d="M20 20 C14 12 15 3 20 2 C25 3 26 12 20 20Z" fill="#f6c90e" transform={`rotate(${r} 20 20)`} />
      ))}
      <circle cx="20" cy="20" r="2.6" fill="#b8860b" />
    </svg>
  ),
  petal: (
    <svg viewBox="0 0 40 40">
      <path d="M20 3 C34 10 34 30 20 37 C6 30 6 10 20 3Z" fill="#d9536f" opacity=".9" />
      <path d="M20 6 C28 14 28 26 20 33" stroke="#f3a3b4" strokeWidth="1.2" fill="none" />
    </svg>
  ),
  leaf: (
    <svg viewBox="0 0 40 40">
      <path d="M20 2 C31 12 31 28 20 38 C9 28 9 12 20 2Z" fill="#4f7d3a" />
      <path d="M20 4 V36" stroke="#a8c686" strokeWidth="1" />
    </svg>
  )
};
const KINDS = ['jasmine', 'marigold', 'jasmine', 'petal', 'konna', 'thechi', 'jasmine', 'leaf', 'petal', 'marigold'];

/**
 * Fixed backdrop for the whole site:
 *  - slowly cross-fading, blurred, sepia-toned couple photos
 *  - aged-paper tint + vignette
 *  - golden bokeh lights
 *  - jasmine, marigold, konna, thechi, rose petals and mango leaves drifting down
 */
export default function Background({ photos }) {
  const [index, setIndex] = useState(0);
  const small = typeof window !== 'undefined' && window.innerWidth < 600;

  useEffect(() => {
    if (photos.length < 2) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % photos.length), 8000);
    return () => clearInterval(id);
  }, [photos.length]);

  const flowers = useMemo(() => {
    const count = small ? 18 : 28;
    return Array.from({ length: count }, (_, i) => ({
      kind: KINDS[i % KINDS.length],
      left: `${(i * 61 + 7) % 100}%`,
      size: 14 + ((i * 7) % 16),
      duration: 16 + ((i * 7) % 14),
      delay: -((i * 2.7) % 26),
      sway: 25 + ((i * 13) % 55),
      spin: (i % 2 ? 1 : -1) * (180 + ((i * 47) % 360))
    }));
  }, [small]);

  const bokeh = useMemo(() => Array.from({ length: small ? 8 : 14 }, (_, i) => ({
    left: `${(i * 37 + 11) % 100}%`,
    top: `${(i * 53 + 5) % 100}%`,
    size: 30 + ((i * 17) % 70),
    duration: 9 + (i % 6) * 2,
    delay: -(i * 1.3)
  })), [small]);

  return (
    <div className="bg" aria-hidden="true">
      {photos.map((src, i) => (
        <div key={src} className={`bg__photo ${i === index ? 'is-active' : ''}`} style={{ backgroundImage: `url(${src})` }} />
      ))}
      <div className="bg__veil" />
      <div className="bg__bokeh">
        {bokeh.map((b, i) => (
          <span key={i} style={{ left: b.left, top: b.top, width: b.size, height: b.size, animationDuration: `${b.duration}s`, animationDelay: `${b.delay}s` }} />
        ))}
      </div>
      <div className="bg__petals">
        {flowers.map((f, i) => (
          <span
            key={i}
            className={`flower flower--${f.kind}`}
            style={{
              left: f.left,
              width: f.size,
              height: f.size,
              animationDuration: `${f.duration}s, ${f.duration / 3.5}s`,
              animationDelay: `${f.delay}s, ${f.delay}s`,
              '--sway': `${f.sway}px`,
              '--spin': `${f.spin}deg`
            }}
          >
            <i>{SHAPES[f.kind]}</i>
          </span>
        ))}
      </div>
    </div>
  );
}

export { SHAPES };
