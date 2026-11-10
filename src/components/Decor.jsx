/**
 * Vintage Kerala wedding decor pieces:
 *  - Nilavilakku: brass lamp with flickering flames (centre of every Kerala Hindu ceremony)
 *  - Thoranam: mango-leaf festoon with marigolds and swinging temple bells (hung over entrances)
 *  - JasmineStrings: strings of mulla poo hanging at the sides
 *  - KasavuBand: cream band with the gold kasavu stripes of the saree / mundu border
 */

export function Nilavilakku({ size = 64, className = '' }) {
  return (
    <svg className={`lamp ${className}`} viewBox="0 0 80 150" width={size} height={size * 1.875} aria-hidden="true">
      <defs>
        <linearGradient id="brass" x1="0" x2="1">
          <stop offset="0" stopColor="#7a5412" />
          <stop offset=".35" stopColor="#e9c46a" />
          <stop offset=".55" stopColor="#fff1c1" />
          <stop offset=".75" stopColor="#c8962e" />
          <stop offset="1" stopColor="#6e4a10" />
        </linearGradient>
        <radialGradient id="glow">
          <stop offset="0" stopColor="#ffe9a8" stopOpacity=".9" />
          <stop offset="1" stopColor="#ffb347" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="flame" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ff7a00" />
          <stop offset=".45" stopColor="#ffc93c" />
          <stop offset="1" stopColor="#fff6d5" />
        </linearGradient>
      </defs>
      {/* glow + flames (5 wicks; 3 visible from the front) */}
      <circle className="lamp__glow" cx="40" cy="22" r="30" fill="url(#glow)" />
      {[[22, 30, 0.85], [40, 22, 1], [58, 30, 0.85]].map(([x, y, s], i) => (
        <path
          key={i}
          className="lamp__flame"
          style={{ animationDelay: `${i * -0.37}s`, transformOrigin: `${x}px ${y + 12}px` }}
          d={`M${x} ${y - 14 * s} C ${x + 7 * s} ${y - 2 * s}, ${x + 6 * s} ${y + 10 * s}, ${x} ${y + 12 * s} C ${x - 6 * s} ${y + 10 * s}, ${x - 7 * s} ${y - 2 * s}, ${x} ${y - 14 * s} Z`}
          fill="url(#flame)"
        />
      ))}
      {/* wick dish with spouts */}
      <path d="M6 44 Q40 62 74 44 L70 40 Q40 52 10 40 Z" fill="url(#brass)" />
      <path d="M16 41 l-4 -5 h8 Z M64 41 l4 -5 h-8 Z M40 47 l-3 -6 h6 Z" fill="url(#brass)" />
      {/* finial + stem with knobs */}
      <rect x="37" y="56" width="6" height="66" rx="2" fill="url(#brass)" />
      <ellipse cx="40" cy="60" rx="10" ry="4" fill="url(#brass)" />
      <ellipse cx="40" cy="78" rx="8" ry="5" fill="url(#brass)" />
      <ellipse cx="40" cy="96" rx="11" ry="5" fill="url(#brass)" />
      <ellipse cx="40" cy="112" rx="7" ry="4" fill="url(#brass)" />
      {/* base */}
      <path d="M14 140 Q40 116 66 140 Z" fill="url(#brass)" />
      <ellipse cx="40" cy="141" rx="28" ry="5" fill="url(#brass)" />
    </svg>
  );
}

/** Mango-leaf thoranam: leaves sag along a curve, each sways on its own. */
export function Thoranam({ leaves = 15, bells = true, className = '' }) {
  const items = Array.from({ length: leaves }, (_, i) => {
    const x = i / (leaves - 1);
    return { left: `${x * 100}%`, sag: 4 * 18 * x * (1 - x), delay: `${(i % 5) * -0.4}s`, marigold: i % 2 === 1 };
  });
  return (
    <div className={`thoranam ${className}`} aria-hidden="true">
      <svg className="thoranam__rope" viewBox="0 0 100 20" preserveAspectRatio="none">
        <path d="M0 2 Q50 38 100 2" />
      </svg>
      {items.map((it, i) => (
        <span key={i} className="thoranam__item" style={{ left: it.left, top: `${it.sag}px`, animationDelay: it.delay }}>
          <i className="thoranam__leaf" />
          {it.marigold && <b className="thoranam__marigold" />}
        </span>
      ))}
      {bells && (
        <>
          <span className="bell bell--l"><i /></span>
          <span className="bell bell--r"><i /></span>
        </>
      )}
    </div>
  );
}

export function JasmineStrings() {
  return (
    <div className="jasmine" aria-hidden="true">
      {['l1', 'l2', 'r1', 'r2'].map((k) => <span key={k} className={`jasmine__str jasmine__str--${k}`}><b /></span>)}
    </div>
  );
}

export function KasavuBand({ className = '' }) {
  return <div className={`kasavu ${className}`} aria-hidden="true"><span /></div>;
}
