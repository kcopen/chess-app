import React from "react";
import { ChessPiece } from "../ChessPiece/ChessPiece";
import { square_color } from "../../chessLogic/squareLogic";
import { PieceType } from "../../constants/ChessTypes";
import "./ChessSquare.css";

interface Props {
	squareColor: string;
	piece?: {
		pieceType: PieceType;
		pieceColor: string;
	};
}

export const ChessSquare: React.FC<Props> = ({ squareColor, piece }: Props) => {
	const squareStyles = {
		backgroundColor: square_color(squareColor),
	};

	const pieceElement = () => {
		if (piece) {
			return <ChessPiece pieceType={piece.pieceType} pieceColor={piece.pieceColor} />;
		}
	};
	return (
		<div className="chess-square" style={squareStyles}>
			{pieceElement()}
		</div>
	);
};
