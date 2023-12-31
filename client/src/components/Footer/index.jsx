import { useLocation, useNavigate } from "react-router-dom";
import "./Footer.scss"

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <footer className="custom-footer mt-auto text-dark p-4">
      <div className=" text-center">
        {location.pathname !== "/" && (
          <button className="btn btn-dark mb-3" onClick={() => navigate(-1)}>
            &larr; Go Back
          </button>
        )}
        <h4>&copy; {new Date().getFullYear()} - Book Lovers</h4>
      </div>
    </footer>
  );
};

export default Footer;
