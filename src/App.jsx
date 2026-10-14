import { useLayoutEffect, useRef, useState } from "react";
import LandingPage from "./components/LandingPage/LandingPage";
import CharactersPage from "./components/CharactersPage/CharactersPage";
import LocationsPage from "./components/LocationsPage/LocationsPage";
import EpisodesPage from "./components/EpisodesPage/EpisodesPage";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import "./app.css";

function App() {
  const [currentPage, setCurrentPage] = useState("landing");
  const previousPageRef = useRef(currentPage);
  const mainRef = useRef(null);

  useLayoutEffect(() => {
    if (previousPageRef.current === currentPage) return;
    previousPageRef.current = currentPage;
    mainRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [currentPage]);

  if (currentPage === "landing") {
    return (
      <LandingPage
        mainRef={mainRef}
        onCharactersClick={() => setCurrentPage("characters")}
        onLocationsClick={() => setCurrentPage("locations")}
        onEpisodesClick={() => setCurrentPage("episodes")}
      />
    );
  }

  return (
    <div className="app-shell">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="app-shell__content">
        {currentPage === "characters" && <CharactersPage mainRef={mainRef} />}
        {currentPage === "locations" && <LocationsPage mainRef={mainRef} />}
        {currentPage === "episodes" && <EpisodesPage mainRef={mainRef} />}
      </div>
      <Footer />
    </div>
  );
}

export default App;
