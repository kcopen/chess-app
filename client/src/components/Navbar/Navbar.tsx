import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar: React.FC = () => {
	return (
		<nav className="navbar">
			<Link className="navbar-item" to="/">
				Home
			</Link>
			<Link className="navbar-item" to="/Profile">
				Profile
			</Link>
			<button className="navbar-item">Logout</button>
		</nav>
	);
};

export default Navbar;
