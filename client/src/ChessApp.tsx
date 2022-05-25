import "./ChessApp.css";
import { ChessBoard } from "./components/ChessBoard/ChessBoard";
import { ChessTimer } from "./components/ChessTimer/ChessTimer";
import { ChessColor } from "./constants/ChessTypes";
import { io, Socket } from "socket.io-client";
import "./socketTypes.tsx";
import { ServerToClientEvents, ClientToServerEvents } from "./socketTypes";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost:3001").connect();

function ChessApp() {
	return (
		<div className="chess-app">
			<ChessTimer timeLimit={5 * 60} />
			<ChessBoard
				player={{ userName: "player", color: ChessColor.White }}
				opponent={{ userName: "computer", color: ChessColor.Black, isComputer: true }}
			/>
		</div>
	);
}

export default ChessApp;
