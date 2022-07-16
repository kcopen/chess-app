import { useContext, useState } from "react";
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

	function joinRandomMatch() {
		if (userProfile.username) {
			socket.emit("join_queue", userProfile);
			setInMatch(true);
		}
	}

	return (
		<div className="home">
			{!userProfile.username ? (
				<Navigate to="/login" />
			) : (
				<>
					<Navbar />
					<button onClick={() => joinRandomMatch()}>Join random match.</button>
					{inMatch && <Navigate to="/chess" />}
				</>
			)}
		</div>
	);
};

export default Home;
