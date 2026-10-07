import { useState } from "react";
import LandingPage from "./components/LandingPage/LandingPage";
import CharactersPage from "./components/CharactersPage/CharactersPage";
import LocationsPage from "./components/LocationsPage/LocationsPage";
import EpisodesPage from "./components/EpisodesPage/EpisodesPage";
import Navbar from "./components/Navbar/Navbar";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("landing");

  if (currentPage === "landing") {
    return (
      <LandingPage
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
        {currentPage === "characters" && <CharactersPage />}
        {currentPage === "locations" && <LocationsPage />}
        {currentPage === "episodes" && <EpisodesPage />}
      </div>
    </div>
  );
}

export default App;
