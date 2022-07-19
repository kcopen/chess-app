import { useContext, useLayoutEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { SocketContext } from "../App";
import Navbar from "../components/Navbar/Navbar";
import { useAuth } from "../context/AuthProvider";
import { ServerToClientEvents, ClientToServerEvents } from "../shared-libs/socketTypes";

interface Props {}

const Home: React.FC<Props> = () => {
	const { userProfile } = useAuth();
	const socket = useContext(SocketContext) as Socket<ServerToClientEvents, ClientToServerEvents>;
	const [inMatch, setInMatch] = useState<boolean>(false);

	useLayoutEffect(() => {
		if (userProfile.username) {
			socket.emit("login", userProfile);
		}
	}, []);

	function quickMatch() {
		if (userProfile.username) {
			socket.emit("quick_match", userProfile);
			setInMatch(true);
		}
	}

	return (
		<>
			<Navbar />
			<div className="basic-page">
				<div className="basic-container">
					<button onClick={() => quickMatch()}>Quick Match</button>
					{inMatch && <Navigate to="/chess" />}
				</div>
			</div>
		</>
	);
};

export default Home;
