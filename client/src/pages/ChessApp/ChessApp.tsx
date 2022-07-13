import "./ChessApp.css";
import { ChessBoard } from "../../components/ChessBoard/ChessBoard";
import { ChessColor, ChessMatch, ChessMatchResult, Piece } from "../../shared-libs/chessEngine/ChessTypes";
import { Socket } from "socket.io-client";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { ClientToServerEvents, ServerToClientEvents } from "../../shared-libs/socketTypes";
import { useAuth } from "../../context/AuthProvider";
import { Navigate } from "react-router-dom";
import Chatbox from "../../components/Chatbox/Chatbox";
import Navbar from "../../components/Navbar/Navbar";
import { SocketContext } from "../../App";
import { forEachChild } from "typescript";
import { stringify } from "querystring";

function ChessApp() {
	const { userProfile } = useAuth();
	const socket = useContext(SocketContext) as Socket<ServerToClientEvents, ClientToServerEvents>;
	const [room, setRoom] = useState<string>("");
	const [currentChessMatch, setCurrentChessMatch] = useState<ChessMatch | null>(null);
	const [removedPieces, setRemovedPieces] = useState<Piece[]>([]);
	const [opponentDraw, setOpponentDraw] = useState<boolean>(false);
	const [gameState, setGameState] = useState({
		gameOver: false,
		message: "",
	});

	const playerColor = (): ChessColor | undefined => {
		if (currentChessMatch === null) return undefined;
		if (userProfile.username === currentChessMatch.whitePlayer.username) {
			return ChessColor.White;
		} else if (userProfile.username === currentChessMatch.blackPlayer.username) {
			return ChessColor.Black;
		}
	};

	useLayoutEffect(() => {
		if (userProfile.username && userProfile.password) {
			socket.emit("login_request", { username: userProfile.username, password: userProfile.password });
		}
	}, []);

	useEffect(() => {
		socket.on("current_room_info", (room) => {
			setRoom(room);
		});
		socket.on("match_update", (match) => {
			const prevPieces = currentChessMatch?.board.pieces;
			const nextPieces = match.board.pieces;
			if (prevPieces && nextPieces.length < prevPieces.length) {
				prevPieces.forEach((piece) => {});
			}
			setCurrentChessMatch(match);
			switch (match.result) {
				case ChessMatchResult.Draw:
					setGameState({
						gameOver: true,
						message: "The game was a draw.",
					});
					break;
				case ChessMatchResult.BlackWins:
					setGameState({
						gameOver: true,
						message: "Black won.",
					});
					break;
				case ChessMatchResult.WhiteWins:
					setGameState({
						gameOver: true,
						message: "White won.",
					});
					break;
				case ChessMatchResult.Stalemate:
					setGameState({
						gameOver: true,
						message: "The game ended in a stalemate. It was a draw.",
					});
					break;
			}
		});
		socket.on("draw_requested", (drawRequested) => setOpponentDraw(drawRequested));
	}, [socket]);

	function resign() {
		if (currentChessMatch?.result === ChessMatchResult.Unfinished) {
			socket.emit("resign", room, userProfile);
		}
	}

	function requestDraw() {
		if (currentChessMatch?.result === ChessMatchResult.Unfinished) {
			socket.emit("request_draw", room, userProfile);
		}
	}

	function joinRandomGame() {
		if (userProfile.username) {
			socket.emit("join_queue", userProfile);
		}
	}

	return (
		<>
			{userProfile.username ? (
				room !== "" && currentChessMatch !== null ? (
					gameState.gameOver === false ? (
						<div className="chess-app">
							<ChessBoard userProfile={userProfile} room={room} playerColor={playerColor()} board={currentChessMatch.board} />
							<div className="side-container">
								<div className="missing-piece-container"></div>
								<button onClick={() => resign()}>Resign</button>
								<button className={`draw-button${opponentDraw ? "-highlighted" : ""}`} onClick={() => requestDraw()}>
									Request Draw
								</button>
								<Chatbox room={room} />
							</div>
						</div>
					) : (
						<div className="chess-app-game-over">
							<h1>{gameState.message}</h1>
						</div>
					)
				) : (
					<button onClick={() => joinRandomGame()}>Join Room</button>
				)
			) : (
				<Navigate to="/login" />
			)}
		</>
	);
}

export default ChessApp;
