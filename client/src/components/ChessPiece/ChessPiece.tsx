import React from "react";
import { PieceType } from "../../shared-libs/chessEngine/ChessTypes";
import { PIECE_SIZE } from "../../config";
import "./ChessPiece.css";

interface Props {
	pieceType: PieceType;
	pieceColor: string;
}

export const ChessPiece: React.FC<Props> = ({ pieceType, pieceColor }: Props) => {
	return (
		<div
			className="chess-piece"
			style={{
				backgroundImage: `url(/images/chessPieces/${pieceColor}_${pieceType}.png)`,
			}}
		/>
	);
};
