import "./ChessApp.css";
import { ChessBoard } from "./components/ChessBoard/ChessBoard";
import { ChessTimer } from "./components/ChessTimer/ChessTimer";
import { Chessboard, ChessColor } from "./shared-libs/chessEngine/ChessTypes";
import { io, Socket } from "socket.io-client";
import { createContext, useEffect, useState } from "react";
import { LoginApp } from "./LoginApp";
import { ClientToServerEvents, ServerToClientEvents } from "./shared-libs/socketTypes";
import { UserProfile } from "./shared-libs/UserProfile";

export const LoginContext = createContext<React.Dispatch<React.SetStateAction<UserProfile | undefined>> | null>(null);
export const SocketContext = createContext<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);

function ChessApp() {
	const [userProfile, setUserProfile] = useState<UserProfile | undefined>();
	const [room, setRoom] = useState<string>("");
	const [playerColor, setPlayerColor] = useState<ChessColor | undefined>();
	const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents>>(io("http://localhost:30690").connect());

	useEffect(() => {
		socket.on("disconnect", (reason) => {
			console.log("disconnection");
			if (reason === "io client disconnect" || reason === "io server disconnect") {
				//manual disconnection
			} else {
				//unwanted disconnection
				if (userProfile) {
					socket.emit("login_request", userProfile);
					socket.emit("get_current_game_info", userProfile);
				}
			}
		});
		socket.on("current_game_info", (room, playerColor) => {
			setRoom(room);
			setPlayerColor(playerColor);
		});
	}, [socket]);

	function joinRandomGame() {
		if (userProfile) {
			socket.emit("join_queue", userProfile);
		}
	}

	return (
		<SocketContext.Provider value={socket}>
			{userProfile ? (
				room !== "" ? (
					<div className="chess-app">
						<span>Team:{playerColor}</span>
						<span>Room:{room}</span>
						<ChessBoard userProfile={userProfile} room={room} playerColor={playerColor} />
					</div>
				) : (
					<button onClick={() => joinRandomGame()}>Join Room</button>
				)
			) : (
				<LoginContext.Provider value={setUserProfile}>
					<LoginApp />
				</LoginContext.Provider>
			)}
		</SocketContext.Provider>
	);
}

export default ChessApp;
