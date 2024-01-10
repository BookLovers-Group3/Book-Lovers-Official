import { Link } from "react-router-dom";
import Auth from "../../utils/auth";
import "./Nav.scss";
import NavDropdown from "react-bootstrap/NavDropdown";

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
          <div className="title-container">
            <Link
              style={{ textDecoration: "none" }}
              className="custom-title"
              to="/">
              <h1 className="logo-text">Book L&#9825;vers</h1>
            </Link>
          </div>

          <div className="login-signup-container">
            {Auth.loggedIn() ? (
              <>
                <NavDropdown
                  className="nav-menu"
                  title="Menu"
                  id="collapsible-nav-dropdown">
                  <span className="dropdown-container">
                    <NavDropdown.Item href="/me">
                      View My Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/build-book-list">
                      Search Books
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/book-lending-list">
                      Borrow Books
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                  </span>
                </NavDropdown>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
              </>
            )}
          </div>
        </div>
        {/* <p className="tagline">Share your books and social.</p> */}
      </div>
    </nav>
  );
};

export default Header;
