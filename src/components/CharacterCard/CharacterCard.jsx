import { useLayoutEffect, useRef } from "react";
import "./CharacterCard.css";

function CharacterCard({ character, onSelect, isSelected }) {
  const status = character.status?.toLowerCase();
  const statusClass = status === "alive" || status === "dead" ? status : "unknown";
  const detailsRef = useRef(null);
  const buttonRef = useRef(null);

  useLayoutEffect(() => {
    if (!isSelected && detailsRef.current?.contains(document.activeElement)) {
      buttonRef.current?.focus({ preventScroll: true });
    }
  }, [isSelected]);

  function handleCardClick(event) {
    const interactiveElement = event.target.closest(
      'button, a, input, select, textarea, summary, [contenteditable]:not([contenteditable="false"]), [role="button"], [role="link"], [role="checkbox"], [role="switch"], [role="slider"], [role="combobox"], [role="textbox"], [data-card-no-toggle]',
    );

    if (event.defaultPrevented || interactiveElement) return;
    onSelect(character);
  }

  function renderIdentity(expanded) {
    return (
      <div className="character-card__identity">
        <h2 className="character-card__name" title={character.name}>
          {character.name}
        </h2>
        <p className="character-card__metadata">
          <span className="character-card__status">
            <span
              className={`character-card__status-dot character-card__status-dot--${statusClass}`}
              aria-hidden="true"
            />
            {character.status || "unknown"}
          </span>
          {!expanded && <span aria-hidden="true">·</span>}
          <span title={character.species}>{character.species}</span>
        </p>
      </div>
    );
  }

  return (
    <article
      className={`character-card${isSelected ? " character-card--expanded" : ""}`}
      onClick={handleCardClick}
    >
      <div className="character-card__stage">
        <img
          className="character-card__image"
          src={character.image}
          alt={character.name}
        />
        <div
          className="character-card__closed"
          aria-hidden={isSelected}
          inert={isSelected}
        >
          <div className="character-card__image-space" aria-hidden="true" />
          {renderIdentity(false)}
        </div>
        <div
          className="character-card__expanded"
          aria-hidden={!isSelected}
          inert={!isSelected}
        >
          <div className="character-card__summary">
            <div className="character-card__image-space" aria-hidden="true" />
            {renderIdentity(true)}
          </div>
          <div className="character-card__details-clip">
            <div
              className="character-card__details-scroll"
              ref={detailsRef}
              tabIndex={isSelected ? 0 : -1}
              role="region"
              aria-label={`Details for ${character.name}`}
              id={`character-details-${character.id}`}
            >
              <dl className="character-card__details">
                <div><dt>Gender</dt><dd>{character.gender}</dd></div>
                <div><dt>Origin</dt><dd>{character.origin.name}</dd></div>
                <div><dt>Current location</dt><dd>{character.location.name}</dd></div>
                <div><dt>Episodes</dt><dd>{character.episode.length} appearances</dd></div>
              </dl>
            </div>
          </div>
        </div>
      </div>
      <button
        ref={buttonRef}
        className="character-card__button"
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onSelect(character);
        }}
        aria-expanded={isSelected}
        aria-controls={`character-details-${character.id}`}
        aria-label={`${isSelected ? "Close details for" : "View details for"} ${character.name}`}
      >
        {isSelected ? "CLOSE" : "VIEW DETAILS"}
      </button>
    </article>
  );
}

export default CharacterCard;
