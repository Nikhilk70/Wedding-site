import { useEffect, useRef, useState } from 'react';
import { dotDate, longDate } from '../lib/format.js';
import { JasmineStrings, KasavuBand } from './Decor.jsx';

/* Guests on data-saver or with "reduce motion" get the still poster instead of video. */
const posterOnly = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || navigator.connection?.saveData === true;

/**
 * Muted, looping, inline video tuned for phones (see docs on mobile video limits):
 *  - eager (hero only): loads and plays immediately
 *  - otherwise: no download until ~300px from the viewport; plays only while ≥50% visible;
 *    pauses when it leaves; releases the decoder when far away; pauses when the tab is hidden
 *  - autoplay blocked (iOS Low Power Mode)? the poster stays and the first tap retries
 */
export function LoopVideo({ media, className = '', eager = false, ...rest }) {
  const ref = useRef(null);
  const [still] = useState(posterOnly);

  useEffect(() => {
    const v = ref.current;
    if (!v || still || !media?.src) return undefined;
    let visible = false;
    const attach = () => { if (!v.getAttribute('src')) { v.src = media.src; v.load(); } };
    const detach = () => { if (!eager && v.getAttribute('src')) { v.pause(); v.removeAttribute('src'); v.load(); } };
    const play = () => { if (visible && !document.hidden) v.play().catch(() => {}); };

    if (eager) { attach(); visible = true; play(); }

    // load ahead of time when it is getting close
    const near = new IntersectionObserver(([e]) => (e.isIntersecting ? attach() : detach()), { rootMargin: '1200px 0px' });
    const soon = new IntersectionObserver(([e]) => { if (e.isIntersecting) attach(); }, { rootMargin: '300px 0px' });
    // play only while at least half of it is on screen
    const seen = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) { attach(); play(); } else v.pause();
    }, { threshold: 0.5 });
    near.observe(v); soon.observe(v); seen.observe(v);

    const onVis = () => (document.hidden ? v.pause() : play());
    const onTap = () => play();
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('pointerdown', onTap, { passive: true });
    return () => {
      near.disconnect(); soon.disconnect(); seen.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pointerdown', onTap);
    };
  }, [media?.src, eager, still]);

  if (!media?.src) return null;
  if (still) return <img className={className} src={media.poster} alt="" {...rest} />;
  return (
    <video
      ref={ref}
      className={className}
      poster={media.poster}
      muted
      loop
      playsInline
      preload={eager ? 'auto' : 'none'}
      disablePictureInPicture
      {...rest}
    />
  );
}

/**
 * The slow-motion hero video. The opening card sits over this same video, so tapping "open"
 * feels like the invitation lifting away. Phones: full-screen. Desktop: the video sits in a
 * temple-arch frame over a blurred still of itself (only one video decoding either way).
 */
export default function Hero({ site, names }) {
  const media = site.media?.hero;
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
        {wide
          ? <div className="hero__video" style={{ backgroundImage: `url(${media?.poster})` }} />
          : <LoopVideo media={media} eager className="hero__video" />}
        <div className="hero__sepia" />
        <div className="hero__grain" />
      </div>

      <JasmineStrings />

      <div className="hero__content">
        {wide && media && (
          <div className="arch reveal zoom">
            <LoopVideo media={media} eager className="arch__video" />
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
