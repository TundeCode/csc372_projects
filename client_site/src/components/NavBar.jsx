import { useState } from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "HOME", end: true },
  { to: "/shop", label: "SHOP" },
  { to: "/faqs", label: "FAQS" },
  { to: "/hotline", label: "HOTLINE" },
  { to: "/cart", label: "CART" },
];

export default function NavBar({ cartCount }) {
  const [menuOpen, setMenuOpen] = useState(false);

  function handleToggleMenu() {
    setMenuOpen((currentValue) => !currentValue);
  }

  function handleCloseMenu() {
    setMenuOpen(false);
  }

  return (
    <header>
      <nav className="nav">
        <NavLink className="logo" onClick={handleCloseMenu} to="/">
          AURUM
        </NavLink>

        <button
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
          className="menu-toggle"
          onClick={handleToggleMenu}
          type="button"
        >
          MENU
        </button>

        <ul className={`nav-links${menuOpen ? " nav-links-open" : ""}`}>
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                className={({ isActive }) => (isActive ? "active" : "")}
                end={link.end}
                onClick={handleCloseMenu}
                to={link.to}
              >
                {link.label}
                {link.to === "/cart" ? <span className="cart-count">{cartCount}</span> : null}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
