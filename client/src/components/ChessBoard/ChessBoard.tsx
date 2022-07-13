import React, { useContext, useEffect, useRef, useState } from "react";
import { ChessSquare } from "../ChessSquare/ChessSquare";
import { BOARD_SIZE, GRID_SIZE, PIECE_SIZE, SQUARE_SIZE } from "../../config";
import { Chessboard, ChessColor, ChessMove, Coords, Piece, Square } from "../../shared-libs/chessEngine/ChessTypes";
import "./ChessBoard.css";
import { ClientToServerEvents, ServerToClientEvents } from "../../shared-libs/socketTypes";
import { Socket } from "socket.io-client";
import { UserProfile } from "../../shared-libs/UserProfile";
import { getValidTeamMoves, inGridBounds, isSameCoords } from "../../shared-libs/chessEngine/chessRules";
import { initBoard } from "../../shared-libs/chessEngine/boardInit";
import { SocketContext } from "../../App";

interface Props {
	userProfile: UserProfile;
	room: string;
	playerColor: ChessColor | undefined;
	board: Chessboard;
}

export const ChessBoard: React.FC<Props> = ({ userProfile, room, playerColor, board }: Props) => {
	const socket = useContext(SocketContext) as Socket<ServerToClientEvents, ClientToServerEvents>;
	const chessBoardRef = useRef<HTMLDivElement>(null);

	const validMoves: ChessMove[] = playerColor ? getValidTeamMoves(playerColor, board) : [];

	const [activePiece, setActivePiece] = useState<{
		piece: Piece;
		element: HTMLElement;
		grabCoords: { gridX: number; gridY: number };
	} | null>(null);

	//attempt to take turn
	function attemptTurn(suggestedMove: ChessMove) {
		socket.emit("attempt_move", userProfile, room, suggestedMove);
	}

	function grabPiece(e: React.MouseEvent) {
		if (activePiece) return; //already holding piece
		const chessBoard = chessBoardRef.current;
		const element = e.target as HTMLElement;
		if (element.classList.contains("chess-piece") && chessBoard) {
			//mouse position in grid units
			const gridX = Math.ceil((e.clientX - chessBoard.offsetLeft) / SQUARE_SIZE);
			const gridY = Math.abs(Math.floor((e.clientY - chessBoard.offsetTop - BOARD_SIZE()) / SQUARE_SIZE));

			//position of element to render (mouse location in pixels)
			const x = e.clientX - PIECE_SIZE() / 2;
			const y = e.clientY - PIECE_SIZE() / 2;

			const currentPiece = board.pieces.find((p) => {
				return p.coords.x === gridX && p.coords.y === gridY && p.pieceColor === playerColor;
			});
			if (currentPiece) {
				//render the element at the mouse cursor
				element.style.position = "absolute";
				element.style.left = `${x}px`;
				element.style.top = `${y}px`;
				setActivePiece({ piece: currentPiece, element: element, grabCoords: { gridX: gridX, gridY: gridY } });
			}
		}
	}

	function movePiece(e: React.MouseEvent) {
		const chessBoard = chessBoardRef.current;
		if (activePiece && chessBoard) {
			//boundaries of the chessboard that the piece element can be within in pixels
			const minX = chessBoard.offsetLeft - PIECE_SIZE() / 2;
			const minY = chessBoard.offsetTop - PIECE_SIZE() / 2;
			const maxX = minX + BOARD_SIZE();
			const maxY = minY + BOARD_SIZE();

			const gridX = Math.ceil((e.clientX - chessBoard.offsetLeft) / PIECE_SIZE());
			const gridY = Math.abs(Math.floor((e.clientY - chessBoard.offsetTop - BOARD_SIZE()) / PIECE_SIZE()));
			const gridCoords: Coords = { x: gridX, y: gridY };
			if (!inGridBounds(gridCoords)) {
				activePiece.element.style.position = "relative";
				activePiece.element.style.removeProperty("left");
				activePiece.element.style.removeProperty("top");
				setActivePiece(null);
				return;
			}
			//position of element to render (mouse location in pixels)
			const x = e.clientX - PIECE_SIZE() / 2;
			const y = e.clientY - PIECE_SIZE() / 2;

			//render element at mouse location
			//if out of bounds render at edge of board
			const style = activePiece.element.style;
			style.position = "absolute";
			if (x < minX) style.left = `${minX}px`;
			else if (x > maxX) style.right = `${maxX}px`;
			else style.left = `${x}px`;

			if (y < minY) style.top = `${minY}px`;
			else if (y > maxY) style.top = `${maxY}px`;
			else style.top = `${y}px`;
		}
	}

	function dropPiece(e: React.MouseEvent) {
		const chessBoard = chessBoardRef.current;
		if (activePiece && chessBoard) {
			//current grid coordinates of mouse
			const gridX = Math.ceil((e.clientX - chessBoard.offsetLeft) / PIECE_SIZE());
			const gridY = Math.abs(Math.floor((e.clientY - chessBoard.offsetTop - BOARD_SIZE()) / PIECE_SIZE()));
			const gridCoords: Coords = { x: gridX, y: gridY };

			//reset the styles and set active piece to null aka "drop" the element
			activePiece.element.style.position = "relative";
			activePiece.element.style.removeProperty("left");
			activePiece.element.style.removeProperty("top");

			//move being attempted by player
			const moveAttempt: ChessMove = {
				board: board,
				pieceToMove: activePiece.piece,
				targetCoords: gridCoords,
			};

			setActivePiece(null);

			attemptTurn(moveAttempt);
		}
	}

	//squares to render to the screen
	const squares = board.squares; //playerColor === ChessColor.Black ? board.squares.reverse() : board.squares;
	const squareElements = squares.map((square: Square) => {
		let highlight = false;
		if (validMoves.find((m) => isSameCoords(m.targetCoords, square.coords))) {
			highlight = true;
		}
		return <ChessSquare key={square.name} square={square} isHighlighted={highlight} />;
	});

	return (
		<div
			className="chessboard"
			onMouseDown={(e) => grabPiece(e)}
			onMouseMove={(e) => movePiece(e)}
			onMouseUp={(e) => dropPiece(e)}
			ref={chessBoardRef}
		>
			{[...squareElements]}
		</div>
	);
};
