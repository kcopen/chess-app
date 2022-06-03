import { Chessboard, ChessColor, Piece, PieceType, Square } from "./ChessTypes";

export const initPieces = (): Piece[] => {
	const pieces: Piece[] = [];
	pieces.push({
		pieceType: PieceType.Rook,
		pieceColor: ChessColor.White,
		coords: {
			x: 1,
			y: 1,
		},
		moveCount: 0,
	});
	pieces.push({
		pieceType: PieceType.Knight,
		pieceColor: ChessColor.White,
		coords: {
			x: 2,
			y: 1,
		},
		moveCount: 0,
	});
	pieces.push({
		pieceType: PieceType.Bishop,
		pieceColor: ChessColor.White,
		coords: {
			x: 3,
			y: 1,
		},
		moveCount: 0,
	});
	pieces.push({
		pieceType: PieceType.King,
		pieceColor: ChessColor.White,
		coords: {
			x: 4,
			y: 1,
		},
		moveCount: 0,
	});
	pieces.push({
		pieceType: PieceType.Queen,
		pieceColor: ChessColor.White,
		coords: {
			x: 5,
			y: 1,
		},
		moveCount: 0,
	});
	pieces.push({
		pieceType: PieceType.Bishop,
		pieceColor: ChessColor.White,
		coords: {
			x: 6,
			y: 1,
		},
		moveCount: 0,
	});
	pieces.push({
		pieceType: PieceType.Knight,
		pieceColor: ChessColor.White,
		coords: {
			x: 7,
			y: 1,
		},
		moveCount: 0,
	});
	pieces.push({
		pieceType: PieceType.Rook,
		pieceColor: ChessColor.White,
		coords: {
			x: 8,
			y: 1,
		},
		moveCount: 0,
	});
	for (let i = 1; i <= 8; i++) {
		pieces.push({
			pieceType: PieceType.Pawn,
			pieceColor: ChessColor.White,
			coords: {
				x: i,
				y: 2,
			},
			moveCount: 0,
		});
	}

	pieces.push({
		pieceType: PieceType.Rook,
		pieceColor: ChessColor.Black,
		coords: {
			x: 1,
			y: 8,
		},
		moveCount: 0,
	});
	pieces.push({
		pieceType: PieceType.Knight,
		pieceColor: ChessColor.Black,
		coords: {
			x: 2,
			y: 8,
		},
		moveCount: 0,
	});
	pieces.push({
		pieceType: PieceType.Bishop,
		pieceColor: ChessColor.Black,
		coords: {
			x: 3,
			y: 8,
		},
		moveCount: 0,
	});
	pieces.push({
		pieceType: PieceType.King,
		pieceColor: ChessColor.Black,
		coords: {
			x: 4,
			y: 8,
		},
		moveCount: 0,
	});
	pieces.push({
		pieceType: PieceType.Queen,
		pieceColor: ChessColor.Black,
		coords: {
			x: 5,
			y: 8,
		},
		moveCount: 0,
	});
	pieces.push({
		pieceType: PieceType.Bishop,
		pieceColor: ChessColor.Black,
		coords: {
			x: 6,
			y: 8,
		},
		moveCount: 0,
	});
	pieces.push({
		pieceType: PieceType.Knight,
		pieceColor: ChessColor.Black,
		coords: {
			x: 7,
			y: 8,
		},
		moveCount: 0,
	});
	pieces.push({
		pieceType: PieceType.Rook,
		pieceColor: ChessColor.Black,
		coords: {
			x: 8,
			y: 8,
		},
		moveCount: 0,
	});
	for (let i = 1; i <= 8; i++) {
		pieces.push({
			pieceType: PieceType.Pawn,
			pieceColor: ChessColor.Black,
			coords: {
				x: i,
				y: 7,
			},
			moveCount: 0,
		});
	}
	return pieces;
};

export const initSquares = (pieces: Piece[]): Square[] => {
	const squares: Square[] = [];
	function addSquare(rank: number, file: number) {
		const piece: Piece | undefined = pieces.find((piece) => piece.coords.x === file && piece.coords.y === rank);
		if (piece) {
			squares.push({
				color: (file + rank) % 2 === 0 ? ChessColor.White : ChessColor.Black,
				coords: {
					x: file,
					y: rank,
				},
				piece: piece,
			});
		} else {
			squares.push({
				color: (file + rank) % 2 === 0 ? ChessColor.White : ChessColor.Black,
				coords: {
					x: file,
					y: rank,
				},
				piece: undefined,
			});
		}
	}

	for (let rank = 8; rank >= 1; rank--) {
		for (let file = 1; file <= 8; file++) {
			addSquare(rank, file);
		}
	}

	return squares;
};

export const initBoard = (): Chessboard =>{
	const pieces = initPieces();
	const squares = initSquares(pieces);
	return {squares, pieces, turn: ChessColor.White};
}
