import React, { useEffect, useRef, useState } from "react";
import { ChessSquare, SquareData } from "../ChessSquare/ChessSquare";
import "./ChessBoard.css";
import { ChessPieceData, PieceType, ChessPiece } from "../ChessPiece/ChessPiece";
import { ChessLocation } from "../../constants/chessBoardLogic";
import { BOARD_SIZE, PIECE_SIZE } from "../../constants/config";

interface ChessBoardData {
	squares: SquareData[];
	pieces: ChessPieceData[];
}

interface ChessBoardProps {}

export const ChessBoard: React.FC<ChessBoardProps> = ({}: ChessBoardProps) => {
	const [gridX, setGridX] = useState(0);
	const [gridY, setGridY] = useState(0);
	const [boardData, setBoardData] = useState<ChessBoardData>({
		squares: [],
		pieces: [],
	});
	useEffect(() => {
		//initialize pieces
		const pieces: ChessPieceData[] = [];

		pieces.push({
			location: { x: 1, y: 1 },
			pieceType: PieceType.Rook,
			pieceColor: "white",
		});
		pieces.push({
			location: { x: 2, y: 1 },
			pieceType: PieceType.Knight,
			pieceColor: "white",
		});
		pieces.push({
			location: { x: 3, y: 1 },
			pieceType: PieceType.Bishop,
			pieceColor: "white",
		});
		pieces.push({
			location: { x: 4, y: 1 },
			pieceType: PieceType.King,
			pieceColor: "white",
		});
		pieces.push({
			location: { x: 5, y: 1 },
			pieceType: PieceType.Queen,
			pieceColor: "white",
		});
		pieces.push({
			location: { x: 6, y: 1 },
			pieceType: PieceType.Bishop,
			pieceColor: "white",
		});
		pieces.push({
			location: { x: 7, y: 1 },
			pieceType: PieceType.Knight,
			pieceColor: "white",
		});
		pieces.push({
			location: { x: 8, y: 1 },
			pieceType: PieceType.Rook,
			pieceColor: "white",
		});

		for (let i = 1; i <= 8; i++) {
			pieces.push({
				location: { x: i, y: 2 },
				pieceType: PieceType.Pawn,
				pieceColor: "white",
			});
		}

		const black_pieces: ChessPieceData[] = [];

		pieces.push({
			location: { x: 1, y: 8 },
			pieceType: PieceType.Rook,
			pieceColor: "black",
		});
		pieces.push({
			location: { x: 2, y: 8 },
			pieceType: PieceType.Knight,
			pieceColor: "black",
		});
		pieces.push({
			location: { x: 3, y: 8 },
			pieceType: PieceType.Bishop,
			pieceColor: "black",
		});
		pieces.push({
			location: { x: 4, y: 8 },
			pieceType: PieceType.King,
			pieceColor: "black",
		});
		pieces.push({
			location: { x: 5, y: 8 },
			pieceType: PieceType.Queen,
			pieceColor: "black",
		});
		pieces.push({
			location: { x: 6, y: 8 },
			pieceType: PieceType.Bishop,
			pieceColor: "black",
		});
		pieces.push({
			location: { x: 7, y: 8 },
			pieceType: PieceType.Knight,
			pieceColor: "black",
		});
		pieces.push({
			location: { x: 8, y: 8 },
			pieceType: PieceType.Rook,
			pieceColor: "black",
		});

		for (let i = 1; i <= 8; i++) {
			pieces.push({
				location: { x: i, y: 7 },
				pieceType: PieceType.Pawn,
				pieceColor: "black",
			});
		}

		//initialize squares
		const squares: SquareData[] = [];
		//order the squares from bottom left to top right
		for (let y = 8; y >= 1; y--) {
			for (let x = 1; x <= 8; x++) {
				const squareData: SquareData = {
					location: { x: x, y: y },
					color: (x + y) % 2 === 0 ? "white" : "black",
				};
				for (let piece of pieces) {
					if (squareData.location.x === piece.location.x && squareData.location.y === piece.location.y) {
						squareData.piece = piece;
						break;
					}
				}

				squares.push(squareData);
			}
		}

		setBoardData((prevData) => {
			return {
				...prevData,
				squares: squares,
				pieces: pieces,
			};
		});
	}, []);

	const chessBoardRef = useRef<HTMLDivElement>(null);

	let selectedPiece: HTMLElement | null = null;

	function grabPiece(e: React.MouseEvent) {
		const chessBoard = chessBoardRef.current;
		const element = e.target as HTMLElement;
		if (element.classList.contains("chess-piece") && chessBoard) {
			const gridX = Math.ceil((e.clientX - chessBoard.offsetLeft) / 100);
			const gridY = Math.abs(Math.floor((e.clientY - chessBoard.offsetTop - BOARD_SIZE) / 100));
			setGridX(gridX);
			setGridY(gridY);
			console.log(`ongrab gridx: ${gridX} gridY: ${gridY}`);
			const x = e.clientX - PIECE_SIZE / 2;
			const y = e.clientY - PIECE_SIZE / 2;
			const style = element.style;

			style.position = "absolute";
			style.left = `${x}px`;
			style.top = `${y}px`;

			selectedPiece = element;
		}
	}

	function movePiece(e: React.MouseEvent) {
		const chessBoard = chessBoardRef.current;
		if (selectedPiece && chessBoard) {
			const minX = chessBoard.offsetLeft - PIECE_SIZE / 2;
			const minY = chessBoard.offsetTop - PIECE_SIZE / 2;
			const maxX = minX + BOARD_SIZE;
			const maxY = minY + BOARD_SIZE;
			const x = e.clientX - PIECE_SIZE / 2;
			const y = e.clientY - PIECE_SIZE / 2;
			const style = selectedPiece.style;

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
		if (selectedPiece && chessBoard) {
			const gridX = Math.ceil((e.clientX - chessBoard.offsetLeft) / 100);
			const gridY = Math.abs(Math.floor((e.clientY - chessBoard.offsetTop - BOARD_SIZE) / 100));
			setGridX(gridX);
			setGridY(gridY);
			console.log(`on drop gridx: ${gridX} gridY: ${gridY}`);
			setBoardData((prevData) => {
				let currentPiece: ChessPieceData;
				const pieces = prevData.pieces.map((p) => {
					if (p.location.x === gridX && p.location.y === gridY) {
						p.location.x = gridX;
						p.location.y = gridY;
						currentPiece = p;
					}
					return p;
				});

				const squares: SquareData[] = prevData.squares.map((s: SquareData) => {
					if (s.location.x === gridX && s.location.y === gridY) {
						s.piece = currentPiece;
						console.log(s);
					}
					return s;
				});
				return { squares: squares, pieces: pieces };
			});
		}
	}

	const squareElements = boardData.squares.map((square: SquareData) => {
		return (
			<ChessSquare
				key={square.location.x + square.location.y * 8}
				location={{
					x: square.location.x,
					y: square.location.y,
				}}
				color={square.color}
				piece={square.piece}
			/>
		);
	});

	return (
		<div
			className="chessboard"
			onMouseMove={(e) => movePiece(e)}
			onMouseDown={(e) => grabPiece(e)}
			onMouseUp={(e) => dropPiece(e)}
			ref={chessBoardRef}
		>
			{[...squareElements]}
		</div>
	);
};
