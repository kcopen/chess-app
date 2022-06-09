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

export interface ChessMove {
	board: Chessboard;
	pieceToMove: Piece;
	targetCoords: Coords;
	score?: number;
}

export interface Chessboard {
	squares: Square[];
	pieces: Piece[];
	turn: ChessColor;
	prevMove: ChessMove | undefined;
}



export interface ChessPlayer {
	username: string;
	color: ChessColor;
	isComputer?: true;
}
