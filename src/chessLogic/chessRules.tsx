import { ChessMove, PieceType, Square, Chessboard, Piece, Coords } from "../constants/ChessTypes";
import { GRID_SIZE } from "../constants/config";

export const isValidMove = (move: ChessMove): boolean => {
	if (!inGridBounds(move.targetCoords)) return false;
	if (isSameCoords(move.pieceToMove.coords, move.targetCoords)) return false;
	switch (move.pieceToMove.pieceType) {
		case PieceType.Pawn:
			return isValidPawnMove(move);
		case PieceType.Rook:
			return isValidRookMove(move);
		case PieceType.Knight:
			return isValidKnightMove(move);
		case PieceType.Bishop:
			return isValidBishopMove(move);
		case PieceType.King:
			return isValidKingMove(move);
		case PieceType.Queen:
			return isValidQueenMove(move);
		default:
			return false;
	}
};

function isValidPawnMove({ boardData, pieceToMove, targetCoords }: ChessMove): boolean {
	throw new Error("Function not implemented.");
}

function isValidRookMove({ boardData, pieceToMove, targetCoords }: ChessMove): boolean {
	if (pieceToMove.coords.x === targetCoords.x) {
		//check for pieces between the piece and its target square
		if (pieceToMove.coords.y < targetCoords.y) {
			for (let y = pieceToMove.coords.y + 1; y < targetCoords.y; y++) {
				if (pieceAt({ x: pieceToMove.coords.x, y: y }, boardData)?.pieceColor === pieceToMove.pieceColor) return false;
			}
		} else if (pieceToMove.coords.y > targetCoords.y) {
			for (let y = targetCoords.y; y < pieceToMove.coords.y; y++) {
				if (pieceAt({ x: pieceToMove.coords.x, y: y }, boardData)?.pieceColor === pieceToMove.pieceColor) return false;
			}
		}
		return true;
	} else if (pieceToMove.coords.y === targetCoords.y) {
		//check for pieces between the piece and its target square
		if (pieceToMove.coords.x < targetCoords.x) {
			for (let x = targetCoords.x; x > pieceToMove.coords.x; x--) {
				if (pieceAt({ x: x, y: pieceToMove.coords.y }, boardData)?.pieceColor === pieceToMove.pieceColor) return false;
			}
		} else if (pieceToMove.coords.x > targetCoords.x) {
			for (let x = targetCoords.x; x < pieceToMove.coords.x; x++) {
				if (pieceAt({ x: x, y: pieceToMove.coords.y }, boardData)?.pieceColor === pieceToMove.pieceColor) return false;
			}
		}
		return true;
	} else return false;
}

function isValidKnightMove({ boardData, pieceToMove, targetCoords }: ChessMove): boolean {
	const testCoords: Coords[] = [
		{ x: pieceToMove.coords.x + 1, y: pieceToMove.coords.y + 2 },
		{ x: pieceToMove.coords.x + 1, y: pieceToMove.coords.y - 2 },
		{ x: pieceToMove.coords.x - 1, y: pieceToMove.coords.y + 2 },
		{ x: pieceToMove.coords.x - 1, y: pieceToMove.coords.y - 2 },
		{ x: pieceToMove.coords.x + 2, y: pieceToMove.coords.y + 1 },
		{ x: pieceToMove.coords.x + 2, y: pieceToMove.coords.y - 1 },
		{ x: pieceToMove.coords.x - 2, y: pieceToMove.coords.y + 1 },
		{ x: pieceToMove.coords.x - 2, y: pieceToMove.coords.y - 1 },
	];
	for (const coord of testCoords) {
		if (!isSameCoords(targetCoords, coord)) continue;
		const testPiece = pieceAt(coord, boardData);
		if (!testPiece) return true;
		else if (testPiece.pieceColor !== pieceToMove.pieceColor) return true;
	}
	return false;
}

function isValidBishopMove({ boardData, pieceToMove, targetCoords }: ChessMove): boolean {
	return true;
}

function isValidQueenMove({ boardData, pieceToMove, targetCoords }: ChessMove): boolean {
	return true;
}

function isValidKingMove({ boardData, pieceToMove, targetCoords }: ChessMove): boolean {
	return true;
}

//---------------coord functions---------------------------------------------------------

export const isSameCoords = (a: { x: number; y: number }, b: { x: number; y: number }) => {
	if (a.x === b.x && a.y === b.y) return true;
	else return false;
};

export const squareAt = (coords: { x: number; y: number }, boardData: Chessboard): Square | undefined => {
	if (!inGridBounds(coords)) return undefined;
	return boardData.squares.find((s) => isSameCoords(s.coords, coords));
};

export const pieceAt = (coords: { x: number; y: number }, boardData: Chessboard): Piece | undefined => {
	if (!inGridBounds(coords)) return undefined;
	return boardData.pieces.find((p) => isSameCoords(p.coords, coords));
};

export const inGridBounds = (coords: Coords): boolean => {
	if (coords.x >= 1 && coords.x <= GRID_SIZE && coords.y >= 1 && coords.y <= GRID_SIZE) return true;
	return false;
};
