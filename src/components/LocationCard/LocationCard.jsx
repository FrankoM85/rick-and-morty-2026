import "./locationCard.css";

function LocationIcon({ kind, className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {kind === "dimension" ? (
        <>
          <circle cx="12" cy="12" r="1" />
          <ellipse
            cx="12"
            cy="12"
            rx="10"
            ry="4"
            transform="rotate(45 12 12)"
          />
          <ellipse
            cx="12"
            cy="12"
            rx="10"
            ry="4"
            transform="rotate(-45 12 12)"
          />
        </>
      ) : kind === "type" ? (
        <>
          <path d="M3 3h7l11 11-7 7L3 10V3Z" />
          <circle cx="7" cy="7" r="1" />
        </>
      ) : kind === "residents" ? (
        <>
          <circle cx="9" cy="8" r="3" />
          <path d="M3 21v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6M21 21v-2a6 6 0 0 0-4-5.66" />
        </>
      ) : (
        <g strokeWidth="1">
          <circle cx="12" cy="12" r="10" />
          <ellipse cx="12" cy="12" rx="4" ry="10" />
          <ellipse cx="12" cy="12" rx="7" ry="10" />
          <ellipse cx="12" cy="7" rx="8.66" ry="2" />
          <ellipse cx="12" cy="17" rx="8.66" ry="2" />
          <path d="M12 2v20M2 12h20" />
        </g>
      )}
    </svg>
  );
}

function LocationCard({ location }) {
  const residentCount = location.residents.length;

  return (
    <article className="location-card" tabIndex={0}>
      <div className="location-card__title">
        <LocationIcon kind="globe" className="location-card__emblem" />
        <h2 className="location-card__name">{location.name}</h2>
      </div>
      <dl className="location-card__facts">
        <div className="location-card__fact">
          <dt>
            <LocationIcon kind="type" className="location-card__icon" />
            <span>Type</span>
          </dt>
          <dd>{location.type || "Unknown"}</dd>
        </div>
        <div className="location-card__fact">
          <dt>
            <LocationIcon kind="dimension" className="location-card__icon" />
            <span>Dimension</span>
          </dt>
          <dd>{location.dimension || "Unknown"}</dd>
        </div>
        <div className="location-card__fact">
          <dt>
            <LocationIcon kind="residents" className="location-card__icon" />
            <span>Residents</span>
          </dt>
          <dd>
            {residentCount} {residentCount === 1 ? "resident" : "residents"}
          </dd>
        </div>
      </dl>
    </article>
  );
}

export default LocationCard;
