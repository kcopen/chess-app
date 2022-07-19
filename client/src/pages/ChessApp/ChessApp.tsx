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

	return (
		<>
			{userProfile.username ? (
				room !== "" && currentChessMatch !== null ? (
					gameState.gameOver === false ? (
						<div className="chess-app basic-page">
							<div>
								<h3 className="opponent-name">{currentChessMatch.blackPlayer.username}</h3>
								<h3 className="opponent-name">{currentChessMatch.whitePlayer.username}</h3>
							</div>
							<ChessBoard userProfile={userProfile} room={room} playerColor={playerColor()} board={currentChessMatch.board} />

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
							<Link to="/">Return to home page</Link>
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
