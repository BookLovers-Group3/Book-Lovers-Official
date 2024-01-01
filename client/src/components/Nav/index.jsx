import { Link } from "react-router-dom";
import Auth from "../../utils/auth";
import "./nav.scss";

const Header = () => {
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };

  return (
    <nav>
      <div className="custom-header">
        <div className="top-row">
          <img className="logo-image" src="../images/Logo-2.png" alt="Logo" />
          <Link
            style={{ textDecoration: "none" }}
            className="custom-title"
            to="/">
            <h1 className="logo-text">Book L&#9825;vers</h1>
          </Link>

          <div className="login-signup-container">
            {Auth.loggedIn() ? (
              <>
                <Link className="btn btn-lg btn-primary" to="/me">
                  View My Profile
                </Link>
                <Link className="btn btn-lg btn-primary" to="/build-book-list">
                  Search Books
                </Link>
                <Link
                  className="btn btn-lg btn-primary"
                  to="/book-lending-list">
                  Borrow Books
                </Link>
                <button className="btn btn-lg btn-light" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn-lg btn-primary" to="/login">
                  Login
                </Link>
                <Link className="btn btn-lg btn-light" to="/signup">
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
        <p className="tagline">Share your books and social.</p>
      </div>
    </nav>
  );
};

export default Header;
