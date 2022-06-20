import "./ChessApp.css";
import { ChessBoard } from "../../components/ChessBoard/ChessBoard";
import { ChessColor } from "../../shared-libs/chessEngine/ChessTypes";
import { io, Socket } from "socket.io-client";
import { createContext, useEffect, useLayoutEffect, useState } from "react";
import { ClientToServerEvents, ServerToClientEvents } from "../../shared-libs/socketTypes";
import { useAuth } from "../../context/AuthProvider";
import { Navigate } from "react-router-dom";
import Chatbox from "../../components/Chatbox/Chatbox";

export const SocketContext = createContext<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);

function ChessApp() {
	const { userProfile } = useAuth();
	const [room, setRoom] = useState<string>("");
	const [playerColor, setPlayerColor] = useState<ChessColor | undefined>();
	const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents>>(io("http://localhost:3500").connect());

	useLayoutEffect(() => {
		if (userProfile.username && userProfile.password) {
			socket.emit("login_request", { username: userProfile.username, password: userProfile.password });
		}
	}, []);

	useEffect(() => {
		socket.on("current_game_info", (room, playerColor) => {
			setRoom(room);
			setPlayerColor(playerColor);
		});
	}, [socket]);

	function joinRandomGame() {
		if (userProfile.username) {
			socket.emit("join_queue", userProfile);
		}
	}

	return (
		<>
			{userProfile.username ? (
				<SocketContext.Provider value={socket}>
					{room !== "" ? (
						<div className="chess-app">
							<span>Team:{playerColor}</span>
							<span>Room:{room}</span>
							<ChessBoard userProfile={userProfile} room={room} playerColor={playerColor} />
							<Chatbox room={room} />
						</div>
					) : (
						<button onClick={() => joinRandomGame()}>Join Room</button>
					)}
				</SocketContext.Provider>
			) : (
				<Navigate to="/login" />
			)}
		</>
	);
}

export default ChessApp;
