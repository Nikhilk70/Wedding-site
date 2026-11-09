import { useEffect, useMemo, useRef, useState } from 'react';
import { getSite } from './lib/api.js';
import { firstName } from './lib/format.js';
import { useReveal } from './lib/useReveal.js';
import Envelope from './components/Envelope.jsx';
import Background from './components/Background.jsx';
import MusicToggle from './components/MusicToggle.jsx';
import Hero from './components/Hero.jsx';
import Invitation from './components/Invitation.jsx';
import Countdown from './components/Countdown.jsx';
import Events from './components/Events.jsx';
import SaveTheDate from './components/SaveTheDate.jsx';
import Schedule from './components/Schedule.jsx';
import Gallery from './components/Gallery.jsx';
import Rsvp from './components/Rsvp.jsx';
import Wishes from './components/Wishes.jsx';
import Gift from './components/Gift.jsx';
import Footer from './components/Footer.jsx';
import Reel from './components/Reel.jsx';
import BottomNav from './components/BottomNav.jsx';
import { Divider, TapSparkles, useParallax } from './components/Effects.jsx';

const guestFromUrl = () => {
  try { return new URLSearchParams(window.location.search).get('to')?.trim().slice(0, 80) || ''; }
  catch { return ''; }
};

export default function App() {
  const [site, setSite] = useState(null);
  const [error, setError] = useState('');
  // ?open=1 skips the envelope (handy for previews); music then starts from the button.
  const [opened, setOpened] = useState(() => new URLSearchParams(window.location.search).get('open') === '1');
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);
  const guest = useMemo(guestFromUrl, []);

  useEffect(() => {
    getSite().then(setSite).catch((e) => setError(e.message));
  }, []);

  useReveal(opened, [site]);
  useParallax([opened, site]);

  // Lock scrolling behind the envelope.
  useEffect(() => {
    document.body.style.overflow = opened ? '' : 'hidden';
  }, [opened]);

  const names = site ? { groom: firstName(site.groom), bride: firstName(site.bride) } : null;

  const startMusic = () => {
    const audio = audioRef.current;
    if (!audio || !site?.music?.file) return;
    const startAt = Number(site.music.startAt) || 0;
    const play = () => audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    if (audio.readyState >= 1) {
      if (audio.currentTime < startAt) audio.currentTime = startAt;
      play();
    } else {
      audio.addEventListener('loadedmetadata', () => { audio.currentTime = startAt; }, { once: true });
      play();
    }
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) startMusic();
    else { audio.pause(); setPlaying(false); }
  };

  if (error) return <div className="loading"><p>{error}</p></div>;
  if (!site) return <div className="loading"><div className="loader" aria-label="Loading" /></div>;

  return (
    <>
      <Background photos={site.photos?.background || []} />

      {site.music?.file && (
        <audio
          ref={audioRef}
          src={site.music.file}
          preload="auto"
          loop
          onLoadedMetadata={(e) => { e.currentTarget.currentTime = Number(site.music.startAt) || 0; }}
          onEnded={(e) => { e.currentTarget.currentTime = Number(site.music.startAt) || 0; }}
        />
      )}

      {!opened && (
        <Envelope
          names={names}
          guest={guest}
          date={site.wedding?.date}
          background={site.photos?.saveTheDate}
          onOpen={() => { startMusic(); setOpened(true); }}
        />
      )}

      <main className={`page ${opened ? 'is-open' : ''}`} aria-hidden={!opened}>
        <Hero site={site} names={names} />
        <Invitation site={site} guest={guest} />
        <Divider />
        <Countdown site={site} />
        <Events site={site} names={names} />
        <Divider />
        <Reel site={site} names={names} />
        <SaveTheDate site={site} names={names} />
        <Schedule site={site} />
        <Divider />
        <Gallery photos={site.photos?.gallery || []} />
        <Gift gift={site.gift} />
        <Rsvp />
        <Wishes />
        <Footer site={site} names={names} />
      </main>

      {opened && <BottomNav />}
      {opened && <TapSparkles />}
      {opened && site.music?.file && <MusicToggle playing={playing} onToggle={toggleMusic} />}
    </>
  );
}
