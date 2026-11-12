import { dotDate } from '../lib/format.js';
import { LoopVideo } from './Hero.jsx';

/** Save-the-date: the slow-motion "story" video in a vintage gilded frame. */
export default function SaveTheDate({ site, names }) {
  const media = site.media?.save;
  const photo = site.photos?.saveTheDate;
  if (!media && !photo) return null;
  return (
    <section className="section save" id="save-the-date">
      <div className="container save__grid">
        <figure className="save__frame reveal from-left">
          {media
            ? <LoopVideo media={media} className="save__video" aria-label={`${names.groom} and ${names.bride}`} />
            : <img src={photo} alt={`Save the date — ${names.groom} and ${names.bride}`} loading="lazy" />}
        </figure>
        <div className="save__text">
          <p className="eyebrow reveal">Two hearts · One journey · Forever</p>
          <h2 className="script save__title reveal" style={{ '--d': '.1s' }}>Save the Date</h2>
          <p className="save__date reveal" style={{ '--d': '.2s' }}>{dotDate(site.wedding?.date)}</p>
          <p className="lead reveal" style={{ '--d': '.3s' }}>
            Our families and we would be delighted to have you with us as we begin this beautiful journey together.
          </p>
          <p className="save__ml reveal" lang="ml" style={{ '--d': '.4s' }}>നിങ്ങളുടെ അനുഗ്രഹം ഞങ്ങൾക്കൊപ്പം ഉണ്ടാകണം</p>
        </div>
      </div>
    </section>
  );
}
