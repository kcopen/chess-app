import React from "react";
import { ChessPiece } from "../ChessPiece/ChessPiece";
import { ChessColor, PieceType, Square } from "../../shared-libs/chessEngine/ChessTypes";
import "./ChessSquare.css";
import { BLACK_SQUARE_COLOR, HIGHLIGHTED_BORDER_SIZE, WHITE_SQUARE_COLOR } from "../../config";

interface Props {
	isHighlighted: boolean;
	square: Square;
}

export const ChessSquare: React.FC<Props> = ({ isHighlighted, square }: Props) => {
	const squareStyles = {
		backgroundColor:
			square.color === ChessColor.White
				? isHighlighted
					? "#e4a19c"
					: WHITE_SQUARE_COLOR
				: isHighlighted
				? "#944936"
				: BLACK_SQUARE_COLOR,
	};

	const pieceElement = () => {
		if (square.piece) {
			return <ChessPiece pieceType={square.piece.pieceType} pieceColor={square.piece.pieceColor} />;
		}
	};
	return (
		<div className="chess-square" style={squareStyles}>
			{pieceElement()}
		</div>
	);
};
