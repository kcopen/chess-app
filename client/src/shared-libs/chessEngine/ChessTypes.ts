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
	name: string;
	pieceType: PieceType;
	pieceColor: ChessColor;
	coords: Coords;
	moveCount: number;
}

export interface Square {
	name: string;
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
	isComputer: boolean;
}

export enum ChessMatchResult {
	Unfinished = "unfinished",
	Draw = "draw",
	WhiteWins = "white_wins",
	BlackWins = "black_wins",
	Stalemate = "stalemate"
}

export interface ChessMatch {
	whitePlayer: ChessPlayer;
	blackPlayer: ChessPlayer;
	board: Chessboard;
	result: ChessMatchResult;
}


