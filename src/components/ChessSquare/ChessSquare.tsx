import React, { useState } from "react";
import { ChessPiece, ChessPieceData } from "../ChessPiece/ChessPiece";
import { square_color } from "../../constants/squareLogic";
import { ChessLocation } from "../../constants/chessBoardLogic";
import "./ChessSquare.css";

export interface SquareData {
	location: ChessLocation;
	color: string;
	piece?: ChessPieceData;
}

export const ChessSquare: React.FC<SquareData> = ({ location, color, piece }: SquareData) => {
	const [squareData, setSquareData] = useState({
		location: {
			x: location.x,
			y: location.y,
		},
		color: color,
		piece: piece,
	});
	const styles = {
		backgroundColor: square_color(color),
	};

	return (
		<div className="chess-square" style={styles}>
			{piece && <ChessPiece location={piece.location} pieceType={piece.pieceType} pieceColor={piece.pieceColor} />}
		</div>
	);
};
