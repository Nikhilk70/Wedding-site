import { useEffect, useRef, useState } from 'react';
import { dotDate, longDate } from '../lib/format.js';
import { JasmineStrings, KasavuBand, Thoranam } from './Decor.jsx';

/** Muted, looping, inline background video that keeps playing on phones. */
export function LoopVideo({ media, className = '', ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return undefined;
    const tryPlay = () => v.play().catch(() => {});
    tryPlay();
    // iOS low-power mode / data saver may block autoplay; retry on first touch
    window.addEventListener('pointerdown', tryPlay, { once: true });
    return () => window.removeEventListener('pointerdown', tryPlay);
  }, []);
  if (!media?.src) return null;
  return (
    <video
      ref={ref}
      className={className}
      src={media.src}
      poster={media.poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      disablePictureInPicture
      {...rest}
    />
  );
}

/**
 * The slow-motion couple video fills the screen. The opening card sits over this same video,
 * so tapping "open" feels like the invitation lifting away rather than a page change.
 * Desktop: the video also appears inside a temple-arch frame beside the names.
 */
export default function Hero({ site, names }) {
  const media = site.media?.main;
  const [wide, setWide] = useState(() => window.matchMedia?.('(min-width: 860px)').matches);
  useEffect(() => {
    const mq = window.matchMedia?.('(min-width: 860px)');
    if (!mq) return undefined;
    const on = (e) => setWide(e.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  return (
    <section className="hero" id="home">
      <div className="hero__media" aria-hidden="true">
        {media ? <LoopVideo media={media} className="hero__video" /> : <div className="hero__video" style={{ backgroundImage: `url(${site.photos?.hero})` }} />}
        <div className="hero__sepia" />
        <div className="hero__grain" />
      </div>

      <Thoranam className="hero__thoranam" />
      <JasmineStrings />

      <div className="hero__content">
        {wide && media && (
          <div className="arch reveal zoom">
            <LoopVideo media={media} className="arch__video" />
            <span className="arch__shine" aria-hidden="true" />
          </div>
        )}
        <div className="hero__text">
          <p className="hero__shubha reveal" lang="ml" style={{ '--d': '.1s' }}>ശുഭ വിവാഹം</p>
          <p className="eyebrow reveal" style={{ '--d': '.2s' }}>We're getting married</p>
          <h1 className="script hero__names">
            <span className="write" style={{ '--d': '.3s' }}>{names.groom}</span>
            <span className="amp pop" style={{ '--d': '1.1s' }}>&amp;</span>
            <span className="write" style={{ '--d': '1.3s' }}>{names.bride}</span>
          </h1>
          <div className="ornament reveal" style={{ '--d': '1.8s' }} aria-hidden="true"><span>❖</span></div>
          <p className="hero__date reveal" style={{ '--d': '1.9s' }}>{dotDate(site.wedding?.date)}</p>
          <p className="hero__sub reveal" style={{ '--d': '2s' }}>{longDate(site.wedding?.date)}</p>
        </div>
      </div>

      <KasavuBand className="hero__band" />
      <a href="#invitation" className="scroll-cue" aria-label="Scroll down"><span /></a>
    </section>
  );
}
