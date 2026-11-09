import { useEffect, useRef, useState } from 'react';

const ICONS = {
  home: 'M12 3 3 10v11h6v-6h6v6h6V10z',
  events: 'M7 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7Zm-2 8h14v10H5V10Zm2 2v3h3v-3H7Z',
  reel: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm6 4v8l6-4-6-4Z',
  gallery: 'M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z',
  rsvp: 'M12 21s-7.5-4.6-9.6-9.1C.9 8.6 3 5 6.6 5c2 0 3.5 1.1 4.4 2.5C11.9 6.1 13.4 5 15.4 5 19 5 21.1 8.6 19.6 11.9 17.5 16.4 12 21 12 21Z'
};
const ITEMS = [
  ['home', 'Home'], ['events', 'Events'], ['reel', 'Reel'], ['gallery', 'Photos'], ['rsvp', 'RSVP']
];

/** Mobile-only app-style navigation. Hides while scrolling down, returns when scrolling up. */
export default function BottomNav() {
  const [active, setActive] = useState('home');
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const sections = ITEMS.map(([id]) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((s) => io.observe(s));

    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > lastY.current + 4 && y > 300);
      if (y < lastY.current - 4) setHidden(false);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll); };
  }, []);

  return (
    <nav className={`bottomnav ${hidden ? 'is-hidden' : ''}`} aria-label="Sections">
      {ITEMS.map(([id, label]) => (
        <a key={id} href={`#${id}`} className={active === id ? 'is-active' : ''} aria-current={active === id ? 'true' : undefined}>
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d={ICONS[id]} /></svg>
          <span>{label}</span>
        </a>
      ))}
    </nav>
  );
}
