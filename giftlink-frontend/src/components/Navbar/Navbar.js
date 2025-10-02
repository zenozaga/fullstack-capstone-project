import { NavLink } from "react-router-dom";
import { useAppContext } from "../../context/AuthContext";
import UserNavbar from "./UserNavbar";

export default function Navbar() {
  const ctx = useAppContext();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-lg-4">
      <a className="navbar-brand" href="/">
        GiftLink
      </a>
      <nav
        className="collapse navbar-collapse justify-content-between"
        id="navbarNav"
      >
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" href="/home.html">
              Home
            </a>{" "}
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/app" end>
              Gifts
            </NavLink>{" "}
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/app/search">
              Search
            </NavLink>{" "}
          </li>
        </ul>

        {!ctx.isLoggedIn && (
          <ul className="navbar-nav d-flex flex-row gap-3">
            <li className="nav-item">
              <NavLink className="nav-link login-btn auth-btn" to="/app/login">
                Login
              </NavLink>{" "}
            </li>
            <li className="nav-item">
              <NavLink className="nav-link auth-btn" to="/app/register">
                Register
              </NavLink>{" "}
            </li>
          </ul>
        )}

        {ctx.isLoggedIn && (
          <UserNavbar
            name={ctx.state.name}
            email={ctx.state.email}
            onLogout={ctx.logout}
          />
        )}
      </nav>
    </nav>
  );
}
