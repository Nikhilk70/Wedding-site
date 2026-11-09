export default function MusicToggle({ playing, onToggle }) {
  return (
    <button
      className={`music ${playing ? 'is-playing' : ''}`}
      onClick={onToggle}
      aria-label={playing ? 'Pause music' : 'Play music'}
      title={playing ? 'Pause music' : 'Play music'}
    >
      <span className="music__disc" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20">
          {playing
            ? <path fill="currentColor" d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
            : <path fill="currentColor" d="M8 5v14l11-7z" />}
        </svg>
      </span>
      {playing && <span className="music__bars" aria-hidden="true"><i /><i /><i /></span>}
    </button>
  );
}
