export enum PieceType {
	King = "king",
	Queen = "queen",
	Bishop = "bishop",
	Knight = "knight",
	Rook = "rook",
	Pawn = "pawn",
}

export enum ChessColor {
	White = "white",
	Black = "black",
}

export interface Coords {
	x: number;
	y: number;
}

export interface Piece {
	pieceType: PieceType;
	pieceColor: ChessColor;
	coords: Coords;
	moveCount: number;
}

export interface Square {
	color: ChessColor;
	coords: Coords;
	piece: Piece | undefined;
}

export interface Chessboard {
	squares: Square[];
	pieces: Piece[];
}

export interface ChessMove {
	board: Chessboard;
	pieceToMove: Piece;
	targetCoords: Coords;
	score?: number;
}

export interface ChessPlayer {
	userName: string;
	color: ChessColor;
	isComputer?: true;
}
