import { Link } from "react-router-dom";

import Auth from "../../utils/auth";
import "./header.scss";

const Header = () => {
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };
  console.log("logged in?", Auth.loggedIn());
  return (
    <header className="bg-info text-dark display-flex align-center">
      <div className="flex-column justify-space-between-lg justify-center align-center text-center">
        <img className="logo-image" src="../images/Logo-2.png" alt="Logo" />
        <Link style={{ textDecoration: "none" }} className="text-dark" to="/">
          <h1 style={{ fontSize: "3rem" }}>Book 💌 Lovers</h1>
        </Link>
        <p className="m-0" style={{ fontSize: "1.75rem", fontWeight: "700" }}>
          Share your books and social.
        </p>
        <div>
          {Auth.loggedIn() ? (
            <>
              <Link className="btn btn-lg btn-primary m-2" to="/me">
                View My Profile
              </Link>
              <Link
                className="btn btn-lg btn-primary m-2"
                to="/build-book-list">
                Add to Lending Library
              </Link>
              <button className="btn btn-lg btn-light m-2" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-lg btn-primary m-2" to="/login">
                Login
              </Link>
              <Link className="btn btn-lg btn-light m-2" to="/signup">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
