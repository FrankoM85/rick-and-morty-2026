import { useEffect, useRef, useState } from "react";
import { useCharacters } from "../../api/useCharacters";
import CharacterCard from "../CharacterCard/CharacterCard";
import ResultsState from "../ResultsState/ResultsState";
import { endpoints } from "../../api/endpoints";
import "./CharactersPage.css";

const filterGroups = [
  { key: "status", label: "Status", options: ["Alive", "Dead", "Unknown"] },
  { key: "species", label: "Species", options: ["Human", "Alien"] },
  { key: "gender", label: "Gender", options: ["Female", "Male", "Genderless", "Unknown"] },
];

function CharactersPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [filters, setFilters] = useState({ status: "", species: "", gender: "" });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filterRegionRef = useRef(null);
  const filterTriggerRef = useRef(null);
  const activeFilters = filterGroups.filter(({ key }) => filters[key]);
  const gridRef = useRef(null);
  const resultsRef = useRef(null);
  const paginationPendingRef = useRef(false);

  function handleFilterChange(key, value) {
    if (filters[key] === value) return;
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  }

  useEffect(() => {
    if (!filtersOpen) return;
    function handleOutsidePointer(event) {
      if (!filterRegionRef.current?.contains(event.target)) setFiltersOpen(false);
    }
    function handleEscape(event) {
      if (event.key === "Escape") {
        setFiltersOpen(false);
        filterTriggerRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", handleOutsidePointer, true);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointer, true);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [filtersOpen]);

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

  useEffect(() => {
    if (!selectedCharacter) return;

    const expandedCard = gridRef.current?.querySelector(
      ".character-card--expanded",
    );

    if (expandedCard && expandedCard.getBoundingClientRect().top < 0) {
      expandedCard.scrollIntoView({
        block: "start",
        inline: "nearest",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    }
  }, [selectedCharacter]);

  useEffect(() => {
    if (!selectedCharacter) return;

    function handleOutsidePointerDown(event) {
      const expandedCard = gridRef.current?.querySelector(
        ".character-card--expanded",
      );

      if (expandedCard && !expandedCard.contains(event.target)) {
        setSelectedCharacter(null);
      }
    }

    document.addEventListener("pointerdown", handleOutsidePointerDown, true);
    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointerDown, true);
    };
  }, [selectedCharacter]);

  const { data, loading, error, retry } = useCharacters(page, debouncedSearch, filters);

  const characters = data?.results ?? [];
  const requestParams = new URLSearchParams({ page: String(page) });
  if (debouncedSearch.trim()) requestParams.set("name", debouncedSearch.trim());
  for (const { key } of filterGroups) {
    if (filters[key]) requestParams.set(key, filters[key]);
  }
  const hasFilters = Boolean(debouncedSearch.trim()) || activeFilters.length > 0;
  const currentRequestUrl = endpoints.characters + "?" + requestParams.toString();
  const noSearchResults = error?.status === 404 && page === 1 &&
    hasFilters && error.requestUrl === currentRequestUrl;
  const empty = !loading && (noSearchResults || (!error && characters.length === 0));
  const showGrid = characters.length > 0 && (loading || (!error && !empty));
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
    setSelectedCharacter(null);
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
    <main className="characters-page">
      <header className="characters-header">
        <div className="characters-heading">
          <h1 className="characters-title">Characters</h1>
          <p className="characters-subtitle">
            Explore the Rick and Morty multiverse.
          </p>
        </div>

        <div className="characters-search">
          <label htmlFor="character-search">Search characters</label>
          <div className="characters-search-controls">
          <input
            id="character-search"
            type="search"
            placeholder="Search by character name..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <div className="characters-filters" ref={filterRegionRef} onBlur={(event) => {
            if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setFiltersOpen(false);
          }}>
            <button ref={filterTriggerRef} className="characters-filters__trigger" type="button"
              aria-expanded={filtersOpen} aria-controls="character-filters-panel"
              aria-label={activeFilters.length ? `${filtersOpen ? "Close" : "Open"} filters: ${activeFilters.map(({ key, label }) => label + ": " + filters[key]).join(", ")}` : `${filtersOpen ? "Close" : "Open"} filters: none active`}
              onClick={() => setFiltersOpen((open) => !open)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                {filtersOpen ? <path d="m6 6 12 12M18 6 6 18" /> : <>
                <path d="M3 6h3m4 0h11M3 12h11m4 0h3M3 18h5m4 0h9" />
                <circle cx="8" cy="6" r="2" />
                <circle cx="16" cy="12" r="2" />
                <circle cx="10" cy="18" r="2" />
                </>}
              </svg>
              {activeFilters.length > 0 && <span className="characters-filters__count" aria-hidden="true">{activeFilters.length}</span>}
            </button>
            <div className="characters-filters__chips">
              {activeFilters.map(({ key, label, options }) => (
                <button key={key} type="button" className="characters-filters__chip"
                  aria-label={`Clear ${label.toLowerCase()} filter: ${filters[key]}`}
                  onClick={() => { handleFilterChange(key, ""); filterTriggerRef.current?.focus(); }}>
                  {options.find((option) => option.toLowerCase() === filters[key])}<span aria-hidden="true"> ×</span>
                </button>
              ))}
            </div>
            <div id="character-filters-panel" className={`characters-filters__panel${filtersOpen ? " characters-filters__panel--open" : ""}`} role="region" aria-label="Character filters" inert={!filtersOpen}>
              {filterGroups.map(({ key, label, options }) => (
                <fieldset key={key}>
                  <legend>{label}</legend>
                  {["All", ...options].map((option) => {
                    const value = option === "All" ? "" : option.toLowerCase();
                    return <label key={option} className="characters-filters__option">
                      <input type="radio" name={`character-filter-${key}`} value={value}
                        checked={filters[key] === value} onChange={() => handleFilterChange(key, value)} />
                      <span>{option}</span>
                    </label>;
                  })}
                </fieldset>
              ))}
            </div>
          </div>
          </div>
        </div>

      </header>

      <div className="characters-results" ref={resultsRef}>
        <div className="characters-results-toolbar">
        <nav
          className="characters-pagination characters-pagination--compact"
          style={!showGrid || !validPagination ? { visibility: "hidden" } : undefined}
          inert={!showGrid || !validPagination}
          aria-hidden={!showGrid || !validPagination}
          aria-label="Top character pagination"
        >
          <button
            className="characters-pagination__button"
            type="button"
            disabled={!canPaginate || page <= 1}
            onClick={() => handlePageChange(-1, { scrollToResults: false })}
          >
            <span aria-hidden="true">‹ </span>PREVIOUS
          </button>
          <span className="characters-pagination__status" aria-label={loading ? `Loading page ${page}` : `Page ${page} of ${totalPages}`}>
            {loading ? "Loading..." : `${page} / ${totalPages}`}
          </span>
          <button
            className="characters-pagination__button"
            type="button"
            disabled={!canPaginate || page >= totalPages}
            onClick={() => handlePageChange(1, { scrollToResults: false })}
          >
            NEXT<span aria-hidden="true"> ›</span>
          </button>
        </nav>
        </div>
      {loading && <ResultsState variant="loading" resource="characters" compact={showGrid} page={page} />}
      {empty && (hasFilters ? (
        <div className="results-state">
          <div className="results-state__message">
            <svg className="results-state__icon" viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true" focusable="false">
              <circle cx="25" cy="25" r="17" /><path d="m38 38 14 14" />
            </svg>
            <div className="results-state__text" role="status">
              <p className="results-state__title">No characters found</p>
              <p className="results-state__description">Try adjusting your search or filters.</p>
            </div>
          </div>
        </div>
      ) : <ResultsState variant="empty" resource="characters" />)}
      {!loading && error && !noSearchResults && <ResultsState variant="error" resource="characters" onRetry={retry} />}
      {showGrid && (
        <div className="characters-grid" ref={gridRef}>
          {characters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              onSelect={(character) =>
                setSelectedCharacter(
                  (current) => current?.id === character.id ? null : character,
                )
              }
              isSelected={selectedCharacter?.id === character.id}
            />
          ))}
        </div>
      )}
      {showGrid && validPagination && (
        <nav className="characters-pagination" aria-label="Character pagination">
          <button
            className="characters-pagination__button"
            type="button"
            disabled={!canPaginate || page <= 1}
            onClick={() => handlePageChange(-1)}
          >
            <span aria-hidden="true">‹ </span>PREVIOUS
          </button>
          <span className="characters-pagination__status" aria-label={loading ? `Loading page ${page}` : `Page ${page} of ${totalPages}`}>
            {loading ? "Loading..." : `${page} / ${totalPages}`}
          </span>
          <button
            className="characters-pagination__button"
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

export default CharactersPage;
