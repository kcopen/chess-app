import React, { useEffect, useId, useState } from "react";
import { ChessSquare, SquareData } from "./ChessSquare";
import "./ChessBoard.css";
import { ChessPieceData, PieceType, ChessPiece } from "./ChessPiece";
import { ChessLocation } from "../constants/chessBoardLogic";

interface ChessBoardData {
	squares: SquareData[];
	pieces: ChessPieceData[];
}

interface ChessBoardProps {}

export const ChessBoard: React.FC<ChessBoardProps> = ({}: ChessBoardProps) => {
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
					piece: null,
				};
				for (let piece of pieces) {
					if (
						squareData.location.x === piece.location.x &&
						squareData.location.y === piece.location.y
					) {
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

	const [selectedPiece, setSelectedPiece] = useState<ChessPieceData | null>(
		null
	);

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

	return <div className="chessboard">{[...squareElements]}</div>;
};
