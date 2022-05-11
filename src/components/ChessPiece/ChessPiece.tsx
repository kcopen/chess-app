import React from "react";
import { PieceType } from "../../constants/ChessTypes";
import "./ChessPiece.css";

interface Props {
	pieceType: PieceType;
	pieceColor: string;
}

export const ChessPiece: React.FC<Props> = ({ pieceType, pieceColor }: Props) => {
	const styles: React.CSSProperties = {
		backgroundImage: `url(/images/chessPieces/${pieceColor}_${pieceType}.png)`,
	};

	return <div className="chess-piece" style={styles}></div>;
};
