import { dotDate, longDate } from '../lib/format.js';

/**
 * Mobile: full-screen photo with the names over it (story-like).
 * Desktop: palace-arch framed photo beside the names.
 */
export default function Hero({ site, names }) {
  const photo = site.photos?.hero;
  return (
    <section className="hero" id="home">
      <div className="hero__bg" style={{ backgroundImage: `url(${photo})` }} aria-hidden="true" />
      <div className="hero__full" aria-hidden="true">
        <div className="hero__full-img" data-parallax="0.25" style={{ backgroundImage: `url(${photo})` }} />
        <div className="hero__full-shade" />
      </div>

      <div className="hero__content">
        <div className="arch reveal zoom">
          <img src={photo} alt={`${names.groom} and ${names.bride}`} />
          <span className="arch__shine" aria-hidden="true" />
        </div>
        <div className="hero__text">
          <p className="eyebrow reveal" style={{ '--d': '.1s' }}>We're getting married</p>
          <h1 className="script hero__names">
            <span className="write" style={{ '--d': '.3s' }}>{names.groom}</span>
            <span className="amp pop" style={{ '--d': '1.1s' }}>&amp;</span>
            <span className="write" style={{ '--d': '1.3s' }}>{names.bride}</span>
          </h1>
          <div className="ornament reveal" style={{ '--d': '1.8s' }} aria-hidden="true"><span>❖</span></div>
          <p className="hero__date reveal" style={{ '--d': '1.9s' }}>{dotDate(site.wedding?.date)}</p>
          <p className="hero__sub reveal" style={{ '--d': '2s' }}>{longDate(site.wedding?.date)}</p>
          <p className="hero__ml reveal" lang="ml" style={{ '--d': '2.1s' }}>രണ്ടു ഹൃദയങ്ങൾ, ഒരു യാത്ര</p>
        </div>
      </div>
      <a href="#invitation" className="scroll-cue" aria-label="Scroll down"><span /></a>
    </section>
  );
}
