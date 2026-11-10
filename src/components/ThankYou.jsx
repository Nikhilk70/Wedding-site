import { useEffect, useRef, useState } from 'react';

const parentName = (p) => (p?.name ? `${p.late ? 'Late ' : ''}${p.name}` : '');

/**
 * Animated thank-you card: it unfolds when scrolled into view, then the family names appear
 * one by one while hearts float up. Data: site.thanks + parents from bride/groom.
 */
export default function ThankYou({ site, names }) {
  const t = site.thanks;
  const ref = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) { setOpen(true); return undefined; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setOpen(true); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!t) return null;

  const sides = [
    {
      key: 'bride',
      label: t.bride?.label || "Bride's Family",
      parents: [parentName(site.bride?.father), parentName(site.bride?.mother)].filter(Boolean),
      members: t.bride?.members || []
    },
    {
      key: 'groom',
      label: t.groom?.label || "Groom's Family",
      parents: [parentName(site.groom?.father), parentName(site.groom?.mother)].filter(Boolean),
      members: t.groom?.members || []
    }
  ];

  // running index so names across both columns appear in sequence
  let n = 0;
  const delay = () => ({ '--i': n++ });

  return (
    <section className="section thanks" id="thanks">
      <div className="container narrow">
        <div ref={ref} className={`thanks__card ${open ? 'is-open' : ''}`}>
          <div className="thanks__hearts" aria-hidden="true">
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i} style={{ '--x': `${(i * 37) % 100}%`, '--s': `${0.7 + ((i * 13) % 7) / 10}`, '--t': `${5 + (i % 5)}s`, '--dl': `${(i * 0.6) % 5}s` }}>♥</span>
            ))}
          </div>

          <div className="thanks__inner">
            <p className="thanks__om" aria-hidden="true">❀</p>
            <p className="eyebrow">Thank you</p>
            <h2 className="script thanks__title">{t.title || 'With Love & Gratitude'}</h2>
            <p className="thanks__ml" lang="ml">ഹൃദയം നിറഞ്ഞ നന്ദി</p>
            {t.message && <p className="thanks__msg">{t.message}</p>}

            <div className="thanks__families">
              {sides.map((s) => (
                <div className="thanks__side" key={s.key}>
                  <h3 className="thanks__label">{s.label}</h3>
                  {s.parents.length > 0 && (
                    <p className="thanks__parents thanks__name" style={delay()}>{s.parents.join(' & ')}</p>
                  )}
                  <ul className="thanks__members">
                    {s.members.map((m) => (
                      <li key={m} className="thanks__name" style={delay()}>{m}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <p className="script thanks__sign" style={{ '--i': n + 1 }}>
              {names.groom} &amp; {names.bride}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
