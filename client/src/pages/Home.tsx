import { useContext, useEffect, useLayoutEffect, useState } from "react";
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
	const [inQueue, setInQueue] = useState<boolean>(false);

	useEffect(() => {
		socket.on("current_room_info", (room) => {
			if (room === "") {
				setInMatch(false);
				setInQueue(false);
			} else if (room === "In Queue") {
				setInQueue(true);
				setInMatch(false);
			} else {
				setInQueue(false);
				setInMatch(true);
			}
		});
	}, [socket]);

	function quickMatch() {
		if (userProfile.username) {
			socket.emit("quick_match", userProfile);
		}
	}

	function AIMatch() {
		if (userProfile.username) {
			socket.emit("ai_match", userProfile);
		}
	}

	function HomeButtons() {
		return (
			<>
				<button onClick={() => quickMatch()}>Quick Match</button>
				<button onClick={() => AIMatch()}>Play Against AI</button>
			</>
		);
	}

	//TODO add leave queue button functionality
	function LeaveQueueButton() {
		return (
			<>
				<p>You are in queue!</p>
				<button onClick={() => {}}>Leave Queue</button>
			</>
		);
	}

	return (
		<>
			<Navbar />
			<div className="basic-page">
				<div className="basic-container">
					{!inQueue ? HomeButtons() : LeaveQueueButton()}

					{inMatch && <Navigate to="/chess" />}
				</div>
			</div>
		</>
	);
};

export default Home;
