import { useCallback, useEffect, useRef, useState } from 'react';

export default function Gallery({ photos }) {
  const [open, setOpen] = useState(-1);
  const touchX = useRef(null);

  const close = useCallback(() => setOpen(-1), []);
  const step = useCallback((dir) => setOpen((i) => (i + dir + photos.length) % photos.length), [photos.length]);

  useEffect(() => {
    if (open < 0) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open, close, step]);

  if (!photos.length) return null;

  return (
    <section className="section gallery" id="gallery">
      <div className="container">
        <p className="eyebrow reveal">Moments</p>
        <h2 className="section__title script reveal">Our Gallery</h2>
        <p className="gallery__swipe" aria-hidden="true">Swipe <span>→</span></p>
        <div className="gallery__grid">
          {photos.map((src, i) => (
            <button
              key={src}
              className={`gallery__item reveal zoom g${i % 6}`}
              style={{ '--d': `${(i % 3) * 0.1}s` }}
              onClick={() => setOpen(i)}
              aria-label={`Open photo ${i + 1}`}
            >
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      </div>

      {open >= 0 && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${open + 1} of ${photos.length}`}
          onClick={close}
          onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touchX.current == null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          <img key={open} src={photos[open]} alt="" onClick={(e) => e.stopPropagation()} />
          <button className="lightbox__btn lightbox__close" onClick={close} aria-label="Close">×</button>
          <button className="lightbox__btn lightbox__prev" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous">‹</button>
          <button className="lightbox__btn lightbox__next" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next">›</button>
          <p className="lightbox__count">{open + 1} / {photos.length}</p>
        </div>
      )}
    </section>
  );
}
