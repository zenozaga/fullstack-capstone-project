import { useMemo } from "react";

import "./UserNavbar.css";
import { Link } from "react-router-dom";

export default function UserNavbar(props = {}) {
  const { firstLetter, lastLetter, name } = useMemo(() => {
    const name = props.name || "";
    const firstLetter = name ? name.charAt(0).toUpperCase() : "";
    const lastLetter = name ? name.charAt(name.length - 1).toUpperCase() : "";

    return { firstLetter, lastLetter, name };
  }, [props]);

  return (
    <ul className="navbar-nav d-flex flex-row align-items-center">
      <li className="nav-item mr-2">
        <button className="nav-link logout-btn auth-btn" onClick={props.onLogout}>
          Logout
        </button>{" "}
      </li>
      <li className="nav-item">
        <Link to="/app/profile" className="col d-flex align-items-center user-badge">
          <div className="avatar me-2">
            {firstLetter}
            {lastLetter}
          </div>
          <div className="d-flex flex-column">
            <span className="avatar-name">{name}</span>
            <span className="avatar-email d-block">{props.email}</span>
          </div>
        </Link>
      </li>
    </ul>
  );
}
