import "./ChessApp.css";
import { ChessBoard } from "../../components/ChessBoard/ChessBoard";
import { ChessColor, ChessMatch, ChessMatchResult, Piece } from "../../shared-libs/chessEngine/ChessTypes";
import { Socket } from "socket.io-client";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { ClientToServerEvents, ServerToClientEvents } from "../../shared-libs/socketTypes";
import { useAuth } from "../../context/AuthProvider";
import { Link, Navigate } from "react-router-dom";
import Chatbox from "../../components/Chatbox/Chatbox";
import { SocketContext } from "../../App";
import { initPieces } from "../../shared-libs/chessEngine/boardInit";
import { ChessPiece } from "../../components/ChessPiece/ChessPiece";
import { pieceTypeByLetter } from "../../shared-libs/chessEngine/chessRules";
import { ChessTimer } from "../../components/ChessTimer/ChessTimer";
import { match } from "assert";

function ChessApp() {
	const { userProfile } = useAuth();
	const socket = useContext(SocketContext) as Socket<ServerToClientEvents, ClientToServerEvents>;
	const [room, setRoom] = useState<string>("");
	const [currentChessMatch, setCurrentChessMatch] = useState<ChessMatch | null>(null);
	const [opponentDraw, setOpponentDraw] = useState<boolean>(false);
	const [gameState, setGameState] = useState({
		gameOver: false,
		message: "",
	});

	const [timeSinceLastUpdate, setTimeSinceLastUpdate] = useState(0); // in miliseconds
	useEffect(() => {
		const interval = setInterval(() => setTimeSinceLastUpdate(timeSinceLastUpdate + 1000), 1000);
		return () => clearInterval(interval);
	}, [timeSinceLastUpdate]);

	const playerColor = (): ChessColor | undefined => {
		if (currentChessMatch === null) return undefined;
		if (userProfile.username === currentChessMatch.whitePlayer.username) {
			return ChessColor.White;
		} else if (userProfile.username === currentChessMatch.blackPlayer.username) {
			return ChessColor.Black;
		}
	};

	const missingPieces = (): JSX.Element[] => {
		const startingPieceNames = [
			"wr1",
			"wn1",
			"wb1",
			"wk",
			"wq",
			"wb2",
			"wn2",
			"wr2",
			"wp1",
			"wp2",
			"wp3",
			"wp4",
			"wp5",
			"wp6",
			"wp7",
			"wp8",
			"br1",
			"bn1",
			"bb1",
			"bk",
			"bq",
			"bb2",
			"bn2",
			"br2",
			"bp1",
			"bp2",
			"bp3",
			"bp4",
			"bp5",
			"bp6",
			"bp7",
			"bp8",
		];
		let missingPieces: string[] = [];
		startingPieceNames.forEach((sp) => {
			if (!currentChessMatch?.board.pieces.find((p) => p.name === sp)) {
				missingPieces.push(sp);
			}
		});
		const piecelist = missingPieces.map((p) => {
			return (
				<ChessPiece key={p} pieceType={pieceTypeByLetter(p[1])} pieceColor={p[0] === "w" ? ChessColor.White : ChessColor.Black} />
			);
		});
		return piecelist;
	};

	useLayoutEffect(() => {
		if (userProfile.username) {
			socket.emit("get_current_game_info", userProfile);
		}
	}, []);

	useEffect(() => {
		socket.on("current_room_info", (room) => {
			setRoom(room);
		});
		socket.on("match_update", (match) => {
			setTimeSinceLastUpdate(0);
			setCurrentChessMatch(match);
			switch (match.result) {
				case ChessMatchResult.Unfinished:
					setGameState({
						gameOver: false,
						message: "",
					});
					break;
				case ChessMatchResult.Draw:
					setGameState({
						gameOver: true,
						message: "The game was a draw.",
					});
					break;
				case ChessMatchResult.BlackWins:
					setGameState({
						gameOver: true,
						message: playerColor() === ChessColor.Black ? "Black (you) won! Good job." : "Black (opponent) won, you lost.",
					});
					break;
				case ChessMatchResult.WhiteWins:
					setGameState({
						gameOver: true,
						message: playerColor() === ChessColor.White ? "White (you) won! Good job." : "White (opponent) won, you lost.",
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

	function timerString(time: number) {
		const timeInSeconds = Math.floor(time / 1000);
		const displaySeconds = timeInSeconds % 60;
		const displayMinutes = Math.floor(timeInSeconds / 60) % 60;
		const displayHours = Math.floor(timeInSeconds / 3600);
		return `${displayHours > 0 ? `${displayHours}:` : ""}
				${displayHours > 0 && displayMinutes < 10 ? `0${displayMinutes}` : displayMinutes}:
				${displaySeconds < 10 ? `0${displaySeconds}` : displaySeconds}`;
	}

	return (
		<>
			{userProfile.username ? (
				room !== "" && currentChessMatch !== null ? (
					gameState.gameOver === false ? (
						<div className="chess-app basic-page">
							<div className="column-container">
								<div className={"timecard"}>
									<h3>
										{playerColor() === ChessColor.White
											? currentChessMatch.blackPlayer.username
											: currentChessMatch.whitePlayer.username}
									</h3>
									{playerColor() === ChessColor.White
										? timerString(
												currentChessMatch.board.turn === ChessColor.Black
													? currentChessMatch.timer.black - timeSinceLastUpdate
													: currentChessMatch.timer.black
										  )
										: timerString(
												currentChessMatch.board.turn === ChessColor.White
													? currentChessMatch.timer.white - timeSinceLastUpdate
													: currentChessMatch.timer.white
										  )}
								</div>

								<ChessBoard
									userProfile={userProfile}
									room={room}
									playerColor={playerColor()}
									board={currentChessMatch.board}
								/>
								<div className="column-container">
									<div className={"timecard"}>
										<h3>
											{playerColor() === ChessColor.Black
												? currentChessMatch.blackPlayer.username
												: currentChessMatch.whitePlayer.username}
										</h3>
										{playerColor() === ChessColor.Black
											? timerString(
													currentChessMatch.board.turn === ChessColor.Black
														? currentChessMatch.timer.black - timeSinceLastUpdate
														: currentChessMatch.timer.black
											  )
											: timerString(
													currentChessMatch.board.turn === ChessColor.White
														? currentChessMatch.timer.white - timeSinceLastUpdate
														: currentChessMatch.timer.white
											  )}
									</div>
								</div>
							</div>
							<div className="side-container">
								<div className="missing-piece-container">{[...missingPieces()]}</div>
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
							<Link
								to="/"
								onClick={() => {
									socket.emit("leave_room", room);
								}}
							>
								Return to home page
							</Link>
						</div>
					)
				) : (
					<></>
				)
			) : (
				<Navigate to="/login" />
			)}
		</>
	);
}

export default ChessApp;
