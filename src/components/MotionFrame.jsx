import { LoopVideo } from './Hero.jsx';

const isVideo = (src) => /\.(mp4|webm)$/i.test(src || '');

/**
 * The "save-the-date" look as a reusable piece: a tilted, gold-edged frame whose picture is
 * always moving — a slow-motion video, or for photos a cinematic slow zoom/pan — with petals
 * falling inside the frame and warm sunlight drifting across.
 *
 *   <MotionFrame src="/photos/7.jpeg" motion="left" tilt={2} />
 *   <MotionFrame src="/videos/clip-xyz.mp4" />          (poster = same name .jpg)
 */
export default function MotionFrame({ src, motion = 'in', tilt = -2, focus = '50% 35%', shape = 'card', ratio = '4 / 5', className = '' }) {
  if (!src) return null;
  return (
    <figure
      className={`mframe mframe--${shape} reveal ${tilt < 0 ? 'from-left' : 'from-right'} ${className}`}
      style={{ '--tilt': `${tilt}deg`, '--ratio': ratio }}
    >
      <div className="mframe__window">
        {isVideo(src)
          ? <LoopVideo media={{ src, poster: src.replace(/\.(mp4|webm)$/i, '.jpg') }} className="mframe__media" />
          : <img src={src} alt="" loading="lazy" className={`mframe__media mkb mkb--${motion}`} style={{ objectPosition: focus }} />}
        <span className="mframe__sun" aria-hidden="true" />
        <span className="mframe__petals" aria-hidden="true">
          {Array.from({ length: 9 }, (_, i) => (
            <i key={i} style={{ '--x': `${(i * 23 + 8) % 92}%`, '--d': `${(i * 1.7) % 9}s`, '--t': `${7 + (i % 4) * 1.5}s`, '--s': `${0.6 + (i % 3) * 0.25}` }} />
          ))}
        </span>
      </div>
    </figure>
  );
}
