import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar: React.FC = () => {
	return (
		<ul>
			<li>
				<Link to="/Chess">Play</Link>
			</li>
			<li>
				<Link to="/Profile">Profile</Link>
			</li>
		</ul>
	);
};

export default Navbar;
