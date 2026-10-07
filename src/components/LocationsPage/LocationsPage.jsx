import { useEffect, useRef, useState } from "react";
import { useLocations } from "../../api/useLocations";
import LocationCard from "../LocationCard/LocationCard";
import ResultsState from "../ResultsState/ResultsState";
import { endpoints } from "../../api/endpoints";
import "./LocationsPage.css";

function LocationsPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const resultsRef = useRef(null);
  const paginationPendingRef = useRef(false);

  function handleSearchChange(event) {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.trim().length < 2) {
      setDebouncedSearch("");
      setPage(1);
    }
  }

  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 2) return;

    const timer = setTimeout(() => {
      setDebouncedSearch(query);
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, loading, error, retry } = useLocations(page, debouncedSearch);

  const locations = data?.results ?? [];
  const requestParams = new URLSearchParams({ page: String(page) });
  if (debouncedSearch.trim()) requestParams.set("name", debouncedSearch.trim());
  const currentRequestUrl = endpoints.locations + "?" + requestParams.toString();
  const noSearchResults = error?.status === 404 && page === 1 &&
    Boolean(debouncedSearch.trim()) && error.requestUrl === currentRequestUrl;
  const empty = !loading && (noSearchResults || (!error && locations.length === 0));
  const showGrid = locations.length > 0 && (loading || (!error && !empty));
  const totalPages = data?.info?.pages;
  const validPagination = Number.isInteger(totalPages) && totalPages >= 1;
  const canPaginate = !loading && showGrid && validPagination;

  useEffect(() => {
    if (!loading) paginationPendingRef.current = false;
  }, [loading, data, error]);

  function handlePageChange(direction, { scrollToResults = true } = {}) {
    if (!canPaginate || paginationPendingRef.current) return;
    const nextPage = Math.min(totalPages, Math.max(1, page + direction));
    if (nextPage === page) return;

    // Block repeated input before the fetch effect updates loading.
    paginationPendingRef.current = true;
    setPage((current) => Math.min(totalPages, Math.max(1, current + direction)));
    if (scrollToResults) {
      resultsRef.current?.scrollIntoView({
      block: "start",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      });
    }
  }

  return (
    <main className="locations-page">
      <header className="locations-header">
        <div className="locations-heading">
          <h1 className="locations-title">Locations</h1>
          <p className="locations-subtitle">
            Explore locations across the Rick and Morty multiverse.
          </p>
        </div>

        <div className="locations-search">
          <label htmlFor="location-search">Search locations</label>
          <input
            id="location-search"
            type="search"
            placeholder="Search by location name..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

      </header>

      <div className="locations-results" ref={resultsRef}>
        <div className="locations-results-toolbar">
        <nav
          className="locations-pagination locations-pagination--compact"
          style={!showGrid || !validPagination ? { visibility: "hidden" } : undefined}
          inert={!showGrid || !validPagination}
          aria-hidden={!showGrid || !validPagination}
          aria-label="Top location pagination"
        >
          <button
            className="locations-pagination__button"
            type="button"
            disabled={!canPaginate || page <= 1}
            onClick={() => handlePageChange(-1, { scrollToResults: false })}
          >
            <span aria-hidden="true">‹ </span>PREVIOUS
          </button>
          <span className="locations-pagination__status" aria-label={loading ? `Loading page ${page}` : `Page ${page} of ${totalPages}`}>
            {loading ? "Loading..." : `${page} / ${totalPages}`}
          </span>
          <button
            className="locations-pagination__button"
            type="button"
            disabled={!canPaginate || page >= totalPages}
            onClick={() => handlePageChange(1, { scrollToResults: false })}
          >
            NEXT<span aria-hidden="true"> ›</span>
          </button>
        </nav>
        </div>
      {loading && <ResultsState variant="loading" resource="locations" compact={showGrid} page={page} />}
      {empty && <ResultsState variant="empty" resource="locations" filtered={Boolean(debouncedSearch.trim())} />}
      {!loading && error && !noSearchResults && <ResultsState variant="error" resource="locations" onRetry={retry} />}
      {showGrid && (
        <div className="locations-grid">
          {locations.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
            />
          ))}
        </div>
      )}
      {showGrid && validPagination && (
        <nav className="locations-pagination" aria-label="Location pagination">
          <button
            className="locations-pagination__button"
            type="button"
            disabled={!canPaginate || page <= 1}
            onClick={() => handlePageChange(-1)}
          >
            <span aria-hidden="true">‹ </span>PREVIOUS
          </button>
          <span className="locations-pagination__status" aria-label={loading ? `Loading page ${page}` : `Page ${page} of ${totalPages}`}>
            {loading ? "Loading..." : `${page} / ${totalPages}`}
          </span>
          <button
            className="locations-pagination__button"
            type="button"
            disabled={!canPaginate || page >= totalPages}
            onClick={() => handlePageChange(1)}
          >
            NEXT<span aria-hidden="true"> ›</span>
          </button>
        </nav>
      )}
      </div>
    </main>
  );
}

export default LocationsPage;


