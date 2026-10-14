import { useEffect, useId, useRef, useState } from "react";
import logo from "../../assets/logo.png";
import "./navbar.css";

const destinations = [
  { label: "HOME", value: "landing" },
  { label: "CHARACTERS", value: "characters" },
  { label: "LOCATIONS", value: "locations" },
  { label: "EPISODES", value: "episodes" },
];

function Navbar({ currentPage, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const menuTriggerRef = useRef(null);
  const menuRegionRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuTriggerRef.current?.focus();
      }
    }

    function handleOutsidePointerDown(event) {
      if (!menuRegionRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handleOutsidePointerDown, true);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener(
        "pointerdown",
        handleOutsidePointerDown,
        true,
      );
    };
  }, [menuOpen]);

  function handleNavigate(destination) {
    onNavigate(destination);
    setMenuOpen(false);
  }

  return (
    <nav className="navbar" aria-label="Primary navigation">
      <div className="navbar__inner">
        <button
          className="navbar__brand"
          type="button"
          aria-label="Back to home"
          onClick={() => handleNavigate("landing")}
        >
          <img className="navbar__logo" src={logo} alt="" />
        </button>

        <div
          ref={menuRegionRef}
          className={`navbar__menu-region${menuOpen ? " navbar__menu-region--open" : ""}`}
        >
          <div className="navbar__menu-header">
            <button
              ref={menuTriggerRef}
              className="navbar__menu-trigger"
              type="button"
              aria-label={
                menuOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={menuOpen}
              aria-controls={menuId}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="navbar__hamburger" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>

          <ul
            id={menuId}
            inert={!menuOpen}
            className={`navbar__links${menuOpen ? " navbar__links--open" : ""}`}
          >
            {destinations.map(({ label, value }) => (
              <li key={value}>
                {currentPage === value ? (
                  <span className="navbar__link" aria-current="page">
                    {label}
                  </span>
                ) : (
                  <button
                    className="navbar__link"
                    type="button"
                    onClick={() => handleNavigate(value)}
                  >
                    {label}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
