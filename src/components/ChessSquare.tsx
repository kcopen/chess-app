import React, { useState } from "react";
import { ChessPiece, ChessPieceData } from "./ChessPiece";
import {
	BLACK_SQUARE_COLOR,
	square_color,
	WHITE_SQUARE_COLOR,
} from "../constants/squareLogic";
import { ChessLocation } from "../constants/chessBoardLogic";

export interface SquareData {
	location: ChessLocation;
	color: string;
	piece: ChessPieceData | null;
}

export const ChessSquare: React.FC<SquareData> = ({
	location,
	color,
	piece,
}: SquareData) => {
	const [squareData, setSquareData] = useState({
		location: {
			x: location.x,
			y: location.y,
		},
		color: color,
		piece: piece,
	});
	const styles = {
		backgroundColor: square_color(squareData.color),
	};

	return (
		<div className="chess-square" style={styles}>
			{squareData.piece !== null ? (
				<ChessPiece
					location={squareData.piece.location}
					pieceType={squareData.piece.pieceType}
					pieceColor={squareData.piece.pieceColor}
				/>
			) : (
				""
			)}
		</div>
	);
};
