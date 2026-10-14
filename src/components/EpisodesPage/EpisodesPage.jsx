import { useEffect, useRef, useState } from "react";
import { useEpisodes } from "../../api/useEpisodes";
import EpisodeCard from "../EpisodeCard/EpisodeCard";
import ResultsState from "../ResultsState/ResultsState";
import { endpoints } from "../../api/endpoints";
import "./episodesPage.css";

function EpisodesPage({ mainRef }) {
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

  const { data, loading, error, retry } = useEpisodes(page, debouncedSearch);

  const episodes = data?.results ?? [];
  const requestParams = new URLSearchParams({ page: String(page) });
  if (debouncedSearch.trim()) requestParams.set("name", debouncedSearch.trim());
  const currentRequestUrl = endpoints.episodes + "?" + requestParams.toString();
  const noSearchResults =
    error?.status === 404 &&
    page === 1 &&
    Boolean(debouncedSearch.trim()) &&
    error.requestUrl === currentRequestUrl;
  const empty =
    !loading && (noSearchResults || (!error && episodes.length === 0));
  const showGrid = episodes.length > 0 && (loading || (!error && !empty));
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
    setPage((current) =>
      Math.min(totalPages, Math.max(1, current + direction)),
    );
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
    <main
      className="episodes-page"
      ref={mainRef}
      tabIndex={-1}
      aria-label="Episodes"
    >
      <header className="episodes-header">
        <div className="episodes-heading">
          <h1 className="episodes-title">Episodes</h1>
          <p className="episodes-subtitle">
            Explore episodes from across the Rick and Morty series.
          </p>
        </div>

        <div className="episodes-search">
          <label htmlFor="episode-search">Search episodes</label>
          <input
            id="episode-search"
            type="search"
            placeholder="Search by episode name..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </header>

      <div className="episodes-results" ref={resultsRef}>
        <div className="episodes-results-toolbar">
          <nav
            className="episodes-pagination episodes-pagination--compact"
            style={
              !showGrid || !validPagination
                ? { visibility: "hidden" }
                : undefined
            }
            inert={!showGrid || !validPagination}
            aria-hidden={!showGrid || !validPagination}
            aria-label="Top episode pagination"
          >
            <button
              className="episodes-pagination__button"
              type="button"
              disabled={!canPaginate || page <= 1}
              onClick={() => handlePageChange(-1, { scrollToResults: false })}
            >
              <span aria-hidden="true">‹ </span>PREVIOUS
            </button>
            <span
              className="episodes-pagination__status"
              aria-label={
                loading
                  ? `Loading page ${page}`
                  : `Page ${page} of ${totalPages}`
              }
            >
              {loading ? "Loading..." : `${page} / ${totalPages}`}
            </span>
            <button
              className="episodes-pagination__button"
              type="button"
              disabled={!canPaginate || page >= totalPages}
              onClick={() => handlePageChange(1, { scrollToResults: false })}
            >
              NEXT<span aria-hidden="true"> ›</span>
            </button>
          </nav>
        </div>
        {loading && (
          <ResultsState
            variant="loading"
            resource="episodes"
            compact={showGrid}
            page={page}
          />
        )}
        {empty && (
          <ResultsState
            variant="empty"
            resource="episodes"
            filtered={Boolean(debouncedSearch.trim())}
          />
        )}
        {!loading && error && !noSearchResults && (
          <ResultsState variant="error" resource="episodes" onRetry={retry} />
        )}
        {showGrid && (
          <div className="episodes-grid">
            {episodes.map((episode) => (
              <EpisodeCard key={episode.id} episode={episode} />
            ))}
          </div>
        )}
        {showGrid && validPagination && (
          <nav className="episodes-pagination" aria-label="Episode pagination">
            <button
              className="episodes-pagination__button"
              type="button"
              disabled={!canPaginate || page <= 1}
              onClick={() => handlePageChange(-1)}
            >
              <span aria-hidden="true">‹ </span>PREVIOUS
            </button>
            <span
              className="episodes-pagination__status"
              aria-label={
                loading
                  ? `Loading page ${page}`
                  : `Page ${page} of ${totalPages}`
              }
            >
              {loading ? "Loading..." : `${page} / ${totalPages}`}
            </span>
            <button
              className="episodes-pagination__button"
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

export default EpisodesPage;
