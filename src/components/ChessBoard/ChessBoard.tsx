import React, { useRef, useState } from "react";
import { ChessSquare } from "../ChessSquare/ChessSquare";
import { BOARD_SIZE, GRID_SIZE, PIECE_SIZE } from "../../constants/config";
import { Chessboard, ChessColor, ChessMove, Piece, Square } from "../../constants/ChessTypes";
import "./ChessBoard.css";
import { initPieces, initSquares } from "../../chessLogic/boardInit";
import { isValidMove } from "../../chessLogic/chessRules";

interface Props {
	playerColor: ChessColor;
}

export const ChessBoard: React.FC<Props> = ({ playerColor }: Props) => {
	const chessBoardRef = useRef<HTMLDivElement>(null);

	const [boardData, setBoardData] = useState<Chessboard>(() => {
		const pieces = initPieces();
		const squares = initSquares(pieces, playerColor);
		return { squares: squares, pieces: pieces };
	});
	const [turn, setTurn] = useState<ChessColor>(ChessColor.White);

	const [activePiece, setActivePiece] = useState<{
		piece: Piece;
		element: HTMLElement;
		grabCoords: { gridX: number; gridY: number };
	} | null>(null);

	//attempt to take turn
	function attemptTurn(suggestedMove: ChessMove) {
		if (turn === playerColor && isValidMove(suggestedMove)) {
			//move is valid so update the board
			setBoardData((prev) => {
				//update the pieces
				const pieces = prev.pieces.map((p) => {
					//if p is the activePiece then update its coords
					if (p.coords.x === activePiece?.grabCoords.gridX && p.coords.y === activePiece?.grabCoords.gridY) {
						p.coords.x = suggestedMove.targetSquare.coords.x;
						p.coords.y = suggestedMove.targetSquare.coords.y;
					}
					return p;
				});
				//update the squares
				const squares = prev.squares.map((s) => {
					//find the piece that is on s
					const piece = pieces.find((p) => {
						return p.coords.x === s.coords.x && p.coords.y === s.coords.y;
					});

					if (piece?.coords.x === activePiece?.piece.coords.x && piece?.coords.y === activePiece?.piece.coords.y) {
						//if the piece is the active piece update s's piece to be the activepiece
						return {
							color: s.color,
							coords: s.coords,
							piece: activePiece?.piece,
						};
					} else {
						//otherwise leave the piece that is on s alone
						return {
							color: s.color,
							coords: s.coords,
							piece: piece ? piece : null,
						};
					}
				});
				return { ...prev, squares: squares, pieces: pieces } as Chessboard;
			});
			//successful move, update whose turn it is
			setTurn((prevTurn) => (prevTurn === ChessColor.White ? ChessColor.Black : ChessColor.White));
		}
	}

	function grabPiece(e: React.MouseEvent) {
		const chessBoard = chessBoardRef.current;
		const element = e.target as HTMLElement;
		if (element.classList.contains("chess-piece") && chessBoard) {
			//mouse position in grid units
			const gridX = Math.ceil((e.clientX - chessBoard.offsetLeft) / 100);
			const gridY = Math.abs(Math.floor((e.clientY - chessBoard.offsetTop - BOARD_SIZE) / 100)); //might be GRID_SIZE

			//position of element to render (mouse location in pixels)
			const x = e.clientX - PIECE_SIZE / 2;
			const y = e.clientY - PIECE_SIZE / 2;

			//render the element at the mouse cursor
			element.style.position = "absolute";
			element.style.left = `${x}px`;
			element.style.top = `${y}px`;

			//get the current piece being held and update activePiece state to it
			const currentPiece = boardData.pieces.find((p) => {
				return p.coords.x === gridX && p.coords.y === gridY;
			});
			currentPiece && setActivePiece({ piece: currentPiece, element: element, grabCoords: { gridX: gridX, gridY: gridY } });
		}
	}

	function movePiece(e: React.MouseEvent) {
		const chessBoard = chessBoardRef.current;
		if (activePiece && chessBoard) {
			//boundaries of the chessboard in pixels
			const minX = chessBoard.offsetLeft - PIECE_SIZE / 2;
			const minY = chessBoard.offsetTop - PIECE_SIZE / 2;
			const maxX = minX + BOARD_SIZE;
			const maxY = minY + BOARD_SIZE;

			//position of element to render (mouse location in pixels)
			const x = e.clientX - PIECE_SIZE / 2;
			const y = e.clientY - PIECE_SIZE / 2;

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
			const gridX = Math.ceil((e.clientX - chessBoard.offsetLeft) / PIECE_SIZE);
			const gridY = Math.abs(Math.floor((e.clientY - chessBoard.offsetTop - BOARD_SIZE) / PIECE_SIZE));
			console.log(`dropX:${gridX} dropY:${gridY}`);
			//square being moused over
			const targetSquare: Square | undefined = boardData.squares.find((s) => s.coords.x === gridX && s.coords.y === gridY);

			if (targetSquare) {
				//move being attempted by player
				const moveAttempt: ChessMove = {
					boardData: boardData,
					pieceToMove: activePiece.piece,
					targetSquare: targetSquare,
				};
				attemptTurn(moveAttempt);
			}
			//reset the styles and set active piece to null aka "drop" the element
			activePiece.element.style.position = "relative";
			activePiece.element.style.removeProperty("left");
			activePiece.element.style.removeProperty("top");
			setActivePiece(null);
		}
	}

	//squares to render to the screen
	const squareElements = boardData.squares.map((square: Square) => {
		const keyId = square.coords.x + square.coords.y * GRID_SIZE;
		if (square.piece) {
			return <ChessSquare key={keyId} squareColor={square.color} piece={square.piece} />;
		} else {
			return <ChessSquare key={keyId} squareColor={square.color} />;
		}
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
