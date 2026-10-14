import "./landingPage.css";
import logo from "../../assets/logo.png";
import topScene from "../../assets/landing-scene-top.jpg";
import bottomScene from "../../assets/landing-scene-bottom.jpg";
import Footer from "../Footer/Footer";

function LandingPage({
  mainRef,
  onCharactersClick,
  onLocationsClick,
  onEpisodesClick,
}) {
  return (
    <main
      className="landing-page"
      ref={mainRef}
      tabIndex={-1}
      aria-label="Rick and Morty Multiverse Explorer home"
    >
      <div className="landing-banner landing-banner--top" aria-hidden="true">
        <div
          className="landing-scene landing-scene--top"
          style={{ "--scene-image": `url(${topScene})` }}
        />
      </div>

      <div className="landing-content">
        <img className="landing-logo" src={logo} alt="Rick and Morty" />

        <div className="landing-actions">
          <button
            type="button"
            className="landing-button"
            onClick={onCharactersClick}
          >
            Characters
          </button>

          <button
            type="button"
            className="landing-button"
            onClick={onLocationsClick}
          >
            Locations
          </button>
          <button
            type="button"
            className="landing-button"
            onClick={onEpisodesClick}
          >
            Episodes
          </button>
        </div>

        <p className="landing-intro">
          If you want to know more about the characters of the amazing Rick and
          Morty series, don't hesitate to click the Characters button above. You
          can also find more info about the locations by clicking the Locations
          button.
        </p>
      </div>

      <Footer />

      <div className="landing-banner landing-banner--bottom" aria-hidden="true">
        <div
          className="landing-scene landing-scene--bottom"
          style={{ "--scene-image": `url(${bottomScene})` }}
        />
      </div>
    </main>
  );
}

export default LandingPage;
