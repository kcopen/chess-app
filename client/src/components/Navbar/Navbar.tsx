import { useContext } from "react";
import { Link } from "react-router-dom";
import { Socket } from "socket.io-client";
import { SocketContext } from "../../App";
import { useAuth } from "../../context/AuthProvider";
import { ServerToClientEvents, ClientToServerEvents } from "../../shared-libs/socketTypes";
import { UserProfile } from "../../shared-libs/UserProfile";
import "./Navbar.css";

const Navbar: React.FC = () => {
	const { userProfile, setUserProfile } = useAuth();
	const socket = useContext(SocketContext) as Socket<ServerToClientEvents, ClientToServerEvents>;

	function logout() {
		socket.disconnect();
		setUserProfile({} as UserProfile);
	}

	return (
		<nav className="navbar">
			<Link className="navbar-item" to="/">
				Home
			</Link>
			<Link className="navbar-item" to="/Profile">
				Profile
			</Link>
			<button className="navbar-item" onClick={() => logout()}>
				Logout
			</button>
		</nav>
	);
};

export default Navbar;
