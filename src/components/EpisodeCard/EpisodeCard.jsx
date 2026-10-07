import "./EpisodeCard.css";

function EpisodeIcon({ kind, className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {kind === "episode" ? (
        <>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M7 3v18M17 3v18M3 8h4M3 16h4M17 8h4M17 16h4M7 12h10" />
        </>
      ) : kind === "calendar" ? (
        <>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M7 3v4M17 3v4M3 11h18M7 15h2M15 15h2M7 18h2" />
        </>
      ) : kind === "characters" ? (
        <>
          <circle cx="9" cy="8" r="3" />
          <path d="M3 21v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6M21 21v-2a6 6 0 0 0-4-5.66" />
        </>
      ) : (
        <>
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="m8 2 4 5 4-5M17 7v14M20 11h.01M20 15h.01" />
        </>
      )}
    </svg>
  );
}

function EpisodeCard({ episode }) {
  const characterCount = episode.characters.length;

  return (
    <article className="episode-card" tabIndex={0}>
      <div className="episode-card__header">
        <EpisodeIcon kind="tv" className="episode-card__emblem" />
        <h2 className="episode-card__name">{episode.name}</h2>
      </div>
      <dl className="episode-card__facts">
        <div className="episode-card__fact">
          <dt><EpisodeIcon kind="episode" className="episode-card__icon" /><span>Episode</span></dt>
          <dd className="episode-card__code">{episode.episode}</dd>
        </div>
        <div className="episode-card__fact">
          <dt><EpisodeIcon kind="calendar" className="episode-card__icon" /><span>Air date</span></dt>
          <dd>{episode.air_date}</dd>
        </div>
        <div className="episode-card__fact">
          <dt><EpisodeIcon kind="characters" className="episode-card__icon" /><span>Characters</span></dt>
          <dd>{characterCount} {characterCount === 1 ? "character" : "characters"}</dd>
        </div>
      </dl>
    </article>
  );
}

export default EpisodeCard;
