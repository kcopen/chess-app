import React from "react";
import { ChessPiece } from "../ChessPiece/ChessPiece";
import { ChessColor, PieceType } from "../../shared-libs/chessEngine/ChessTypes";
import "./ChessSquare.css";
import { BLACK_SQUARE_COLOR, WHITE_SQUARE_COLOR } from "../../shared-libs/config";

interface Props {
	squareColor: string;
	piece?: {
		pieceType: PieceType;
		pieceColor: string;
	};
}

export const ChessSquare: React.FC<Props> = ({ squareColor, piece }: Props) => {
	const square_color = (color: string) => {
		if (color === "white") return WHITE_SQUARE_COLOR;
		if (color === "black") return BLACK_SQUARE_COLOR;
	};

	const squareStyles = {
		backgroundColor: squareColor === ChessColor.White ? WHITE_SQUARE_COLOR : BLACK_SQUARE_COLOR,
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
