import { NavLink } from "react-router-dom";
import { useAppContext } from "../../context/AuthContext";

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

        <ul className="navbar-nav">
          {!ctx.isLoggedIn ? (
            <>
              <li className="nav-item">
                <NavLink className="nav-link login-btn" to="/app/login">
                  Login
                </NavLink>{" "}
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/app/register">
                  Register
                </NavLink>{" "}
              </li>
            </>
          ) : (
            <li className="nav-item">
              <button className="nav-link logout-btn" onClick={ctx.logout}>
                Logout
              </button>{" "}
            </li>
          )}
        </ul>
      </nav>
    </nav>
  );
}
