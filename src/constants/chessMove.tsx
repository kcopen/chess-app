import { PieceType } from "../components/ChessPiece/ChessPiece";
import { ChessLocation } from "./chessBoardLogic";

export default interface ChessMove {
	piece: PieceType;
	currentLocation: ChessLocation;
	destinationLocation: ChessLocation;
	isValid: boolean;
}
