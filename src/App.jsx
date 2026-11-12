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
import ThankYou from './components/ThankYou.jsx';
import Chapter from './components/Chapter.jsx';
import { Divider, TapSparkles, useParallax } from './components/Effects.jsx';
import { KasavuBand } from './components/Decor.jsx';

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

  const startAt = Number(site?.music?.startAt) || 0;

  /**
   * Keep playback at or after `startAt`. Phones (especially iPhone Safari) ignore a seek made
   * before the song has loaded, so this runs on every load/play/time event until it sticks,
   * and also handles looping back to `startAt` instead of 0:00.
   */
  const keepStart = (audio) => {
    if (!audio || !startAt) return;
    if (audio.currentTime < startAt - 0.5 && audio.readyState >= 1) {
      try { audio.currentTime = startAt; } catch { /* not seekable yet; next event retries */ }
    }
  };

  const startMusic = () => {
    const audio = audioRef.current;
    if (!audio || !site?.music?.file) return;
    keepStart(audio);
    audio.play()
      .then(() => { keepStart(audio); setPlaying(true); })
      .catch(() => setPlaying(false));
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
          // "#t=40" tells the browser itself to begin at 0:40 (media fragment)
          src={startAt ? `${site.music.file}#t=${startAt}` : site.music.file}
          preload="auto"
          onLoadedMetadata={(e) => keepStart(e.currentTarget)}
          onCanPlay={(e) => keepStart(e.currentTarget)}
          onPlaying={(e) => keepStart(e.currentTarget)}
          onTimeUpdate={(e) => keepStart(e.currentTarget)}
          onEnded={(e) => {
            // loop from startAt, not from the beginning
            const a = e.currentTarget;
            a.currentTime = startAt;
            a.play().catch(() => setPlaying(false));
          }}
        />
      )}

      {!opened && (
        <Envelope
          names={names}
          media={site.media?.opening}
          guest={guest}
          date={site.wedding?.date}
          onOpen={() => { startMusic(); setOpened(true); }}
        />
      )}

      <main className={`page ${opened ? 'is-open' : ''}`} aria-hidden={!opened}>
        <Hero site={site} names={names} />
        <Invitation site={site} guest={guest} />
        <KasavuBand />
        <Countdown site={site} />
        <Events site={site} names={names} />
        <Divider />
        <SaveTheDate site={site} names={names} />
        <Schedule site={site} />
        <KasavuBand />
        <Gallery photos={site.photos?.gallery || []} />
        <Gift gift={site.gift} />
        <Chapter id="chapter-2" media={site.media?.chapter2} title="Will you bless us with your presence?" ml="നിങ്ങളുടെ സാന്നിധ്യം ഞങ്ങളുടെ ഭാഗ്യം" cta={{ href: "#rsvp", label: "RSVP" }} />
        <Rsvp />
        <Wishes />
        <ThankYou site={site} names={names} />
        <Footer site={site} names={names} />
      </main>

      {opened && <TapSparkles />}
      {opened && site.music?.file && <MusicToggle playing={playing} onToggle={toggleMusic} />}
    </>
  );
}
