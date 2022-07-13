import { squareName } from "./chessRules";
import { Chessboard, ChessColor, Piece, PieceType, Square } from "./ChessTypes";

export const initPieces = (): Piece[] => {
	const pieces: Piece[] = [];
	pieces.push({
		name:"wr1",
		pieceType: PieceType.Rook,
		pieceColor: ChessColor.White,
		coords: {
			x: 1,
			y: 1,
		},
		moveCount: 0,
	});
	pieces.push({
		name:"wn1",
		pieceType: PieceType.Knight,
		pieceColor: ChessColor.White,
		coords: {
			x: 2,
			y: 1,
		},
		moveCount: 0,
	});
	pieces.push({
		name:"wb1",
		pieceType: PieceType.Bishop,
		pieceColor: ChessColor.White,
		coords: {
			x: 3,
			y: 1,
		},
		moveCount: 0,
	});
	pieces.push({
		name:"wk",
		pieceType: PieceType.King,
		pieceColor: ChessColor.White,
		coords: {
			x: 4,
			y: 1,
		},
		moveCount: 0,
	});
	pieces.push({
		name:"wq",
		pieceType: PieceType.Queen,
		pieceColor: ChessColor.White,
		coords: {
			x: 5,
			y: 1,
		},
		moveCount: 0,
	});
	pieces.push({
		name:"wb2",
		pieceType: PieceType.Bishop,
		pieceColor: ChessColor.White,
		coords: {
			x: 6,
			y: 1,
		},
		moveCount: 0,
	});
	pieces.push({
		name:"wn2",
		pieceType: PieceType.Knight,
		pieceColor: ChessColor.White,
		coords: {
			x: 7,
			y: 1,
		},
		moveCount: 0,
	});
	pieces.push({
		name:"wr2",
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
			name:`wp${i}`,
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
		name:"br1",
		pieceType: PieceType.Rook,
		pieceColor: ChessColor.Black,
		coords: {
			x: 1,
			y: 8,
		},
		moveCount: 0,
	});
	pieces.push({
		name:"bn1",
		pieceType: PieceType.Knight,
		pieceColor: ChessColor.Black,
		coords: {
			x: 2,
			y: 8,
		},
		moveCount: 0,
	});
	pieces.push({
		name:"bb1",
		pieceType: PieceType.Bishop,
		pieceColor: ChessColor.Black,
		coords: {
			x: 3,
			y: 8,
		},
		moveCount: 0,
	});
	pieces.push({
		name:"bk",
		pieceType: PieceType.King,
		pieceColor: ChessColor.Black,
		coords: {
			x: 4,
			y: 8,
		},
		moveCount: 0,
	});
	pieces.push({
		name:"bq",
		pieceType: PieceType.Queen,
		pieceColor: ChessColor.Black,
		coords: {
			x: 5,
			y: 8,
		},
		moveCount: 0,
	});
	pieces.push({
		name:"bb2",
		pieceType: PieceType.Bishop,
		pieceColor: ChessColor.Black,
		coords: {
			x: 6,
			y: 8,
		},
		moveCount: 0,
	});
	pieces.push({
		name:"bn2",
		pieceType: PieceType.Knight,
		pieceColor: ChessColor.Black,
		coords: {
			x: 7,
			y: 8,
		},
		moveCount: 0,
	});
	pieces.push({
		name:"br2",
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
			name:`bp${i}`,
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
				name: squareName({
					x: file,
					y: rank,
				}),
				color: (file + rank) % 2 === 0 ? ChessColor.White : ChessColor.Black,
				coords: {
					x: file,
					y: rank,
				},
				piece: piece,
			});
		} else {
			squares.push({
				name: squareName({
					x: file,
					y: rank,
				}),
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
	return {squares, pieces, turn: ChessColor.White, prevMove: undefined};
}
