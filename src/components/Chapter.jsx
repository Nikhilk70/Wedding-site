import { LoopVideo } from './Hero.jsx';

/**
 * Full-width "chapter" interlude between sections: one slow-motion clip with a single line of
 * text over it (and an optional button). Phones: full-bleed. Desktop: the clip sits in a tall
 * centred frame over a blurred still of itself.
 */
export default function Chapter({ media, title, ml, cta, id }) {
  if (!media?.src) return null;
  return (
    <section className="chapter" id={id}>
      <div className="chapter__bg" style={{ backgroundImage: `url(${media.poster})` }} aria-hidden="true" />
      <div className="chapter__frame reveal zoom">
        <LoopVideo media={media} className="chapter__video" />
        <div className="chapter__shade" aria-hidden="true" />
        <div className="chapter__text">
          <p className="script chapter__title">{title}</p>
          {ml && <p className="chapter__ml" lang="ml">{ml}</p>}
          {cta && <a className="btn btn--lg chapter__cta" href={cta.href}>{cta.label}</a>}
        </div>
      </div>
    </section>
  );
}
