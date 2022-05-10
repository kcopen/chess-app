import React, { HTMLAttributes, MouseEventHandler, useState } from "react";
import { ChessLocation } from "../../constants/chessBoardLogic";
import "./ChessPiece.css";

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

export const ChessPiece: React.FC<ChessPieceData> = ({ location, pieceType, pieceColor }: ChessPieceData) => {
	const [pieceData, setPieceData] = useState<ChessPieceData>({
		location: location,
		pieceType: pieceType,
		pieceColor: pieceColor,
	});

	const styles: React.CSSProperties = {
		backgroundImage: `url(/images/chessPieces/${pieceColor}_${pieceType}.png)`,
	};

	return <div className="chess-piece" style={styles}></div>;
};
