import React from "react";
import { ChessPiece } from "../ChessPiece/ChessPiece";
import { ChessColor, PieceType } from "../../shared-libs/chessEngine/ChessTypes";
import "./ChessSquare.css";
import { BLACK_SQUARE_COLOR, HIGHLIGHTED_BORDER_SIZE, WHITE_SQUARE_COLOR } from "../../shared-libs/config";

interface Props {
	squareColor: string;
	piece?: {
		pieceType: PieceType;
		pieceColor: string;
	};
	isHighlighted: boolean;
}

export const ChessSquare: React.FC<Props> = ({ squareColor, piece, isHighlighted }: Props) => {
	const squareStyles = {
		backgroundColor: squareColor === ChessColor.White ? WHITE_SQUARE_COLOR : BLACK_SQUARE_COLOR,
		border: isHighlighted ? `${HIGHLIGHTED_BORDER_SIZE}px solid red` : `none`,
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
