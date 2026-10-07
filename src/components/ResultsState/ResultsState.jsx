import "./ResultsState.css";

function ResultsState({ variant, resource, compact = false, filtered = false, page, onRetry }) {
  const title = variant === "loading"
    ? compact && page > 1 ? `Loading page ${page}...` : `Loading ${resource}...`
    : variant === "empty"
      ? `No ${resource} ${filtered ? "found" : "available"}`
      : "Something went wrong";

  return (
    <>
      <div className={`results-state${compact ? " results-state--compact" : ""}`}>
        <div className={`results-state__message${variant === "error" ? " results-state__message--error" : ""}`}>
          {variant === "error" && (
            <svg className="results-state__icon" viewBox="0 0 60 60" aria-hidden="true" focusable="false">
              <path d="M25.7 8.5a5 5 0 0 1 8.6 0l22 38A5 5 0 0 1 52 54H8a5 5 0 0 1-4.3-7.5Z" fill="#e05252" />
              <path d="m24 28 12 12m0-12L24 40" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
            </svg>
          )}
          {variant === "empty" && (
            <svg className="results-state__icon" viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true" focusable="false">
              <circle cx="25" cy="25" r="17" />
              <path d="m38 38 14 14" />
            </svg>
          )}
          <div className="results-state__text">
            <div role={variant === "error" ? "alert" : "status"}>
              {variant === "loading" && <span className="results-state__indicator" aria-hidden="true" />}
              <p className="results-state__title">{title}</p>
              {variant === "empty" && filtered && <p className="results-state__description">Try a different search term.</p>}
              {variant === "error" && <p className="results-state__description">We couldn't load the {resource}.</p>}
            </div>
          </div>
          {variant === "error" && <button className="results-state__retry" type="button" onClick={onRetry}>TRY AGAIN</button>}
        </div>
      </div>
    </>
  );
}

export default ResultsState;
