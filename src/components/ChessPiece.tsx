import React, { MouseEventHandler, useState } from "react";
import { ChessLocation } from "../constants/chessBoardLogic";

export enum PieceType {
	King = "king",
	Queen = "queen",
	Bishop = "bishop",
	Knight = "knight",
	Rook = "rook",
	Pawn = "pawn",
}

export interface ChessPieceData {
	location: ChessLocation;
	pieceType: PieceType;
	pieceColor: string;
}

export const ChessPiece: React.FC<ChessPieceData> = ({
	location,
	pieceType,
	pieceColor,
}: ChessPieceData) => {
	const [pieceData, setPieceData] = useState<ChessPieceData>({
		location: location,
		pieceType: pieceType,
		pieceColor: pieceColor,
	});

	return (
		<img
			className="chess-piece"
			src={`/images/chessPieces/${pieceColor}_${pieceType}.png`}
			alt={`${pieceColor}_${pieceType}`}
		/>
	);
};
