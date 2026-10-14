import "./footer.css";

function Footer() {
  return (
    <footer className="footer">
      <span>
        © 2026 <a href="https://github.com/FrankoM85">Frank</a>
      </span>
      <span className="footer__attribution">
        Data provided by{" "}
        <a href="https://rickandmortyapi.com/">Rick and Morty API</a>
      </span>
    </footer>
  );
}

export default Footer;
