import { useEffect, useMemo, useState } from 'react';

const PETALS = 18;

/** Fixed, slowly cross-fading photo backdrop with drifting petals and gold sparkles. */
export default function Background({ photos }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (photos.length < 2) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % photos.length), 7000);
    return () => clearInterval(id);
  }, [photos.length]);

  const petals = useMemo(
    () => Array.from({ length: PETALS }, (_, i) => ({
      left: `${(i * 97) % 100}%`,
      size: 8 + ((i * 7) % 10),
      duration: 14 + ((i * 5) % 12),
      delay: -((i * 3.1) % 20),
      sway: 30 + ((i * 11) % 50),
      kind: i % 3
    })),
    []
  );

  return (
    <div className="bg" aria-hidden="true">
      {photos.map((src, i) => (
        <div
          key={src}
          className={`bg__photo ${i === index ? 'is-active' : ''}`}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}
      <div className="bg__veil" />
      <div className="bg__petals">
        {petals.map((p, i) => (
          <span
            key={i}
            className={`petal petal--${p.kind}`}
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              animationDuration: `${p.duration}s, ${p.duration / 4}s`,
              animationDelay: `${p.delay}s, ${p.delay}s`,
              '--sway': `${p.sway}px`
            }}
          />
        ))}
      </div>
    </div>
  );
}
