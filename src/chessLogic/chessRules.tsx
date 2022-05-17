import { JsxTagNamePropertyAccess } from "typescript";
import { ChessMove, PieceType, Square, Chessboard, Piece, Coords, ChessColor } from "../constants/ChessTypes";
import { GRID_SIZE } from "../constants/config";

//todo make sure king isnt in check before returning
export const isValidMove = (move: ChessMove, validateCheck: boolean = true): boolean => {
	if (!inGridBounds(move.targetCoords)) return false;
	if (isSameCoords(move.pieceToMove.coords, move.targetCoords)) return false;
	let isValid = false;
	switch (move.pieceToMove.pieceType) {
		case PieceType.Pawn:
			isValid = isValidPawnMove(move);
			break;
		case PieceType.Rook:
			isValid = isValidRookMove(move);
			break;
		case PieceType.Knight:
			isValid = isValidKnightMove(move);
			break;
		case PieceType.Bishop:
			isValid = isValidBishopMove(move);
			break;
		case PieceType.King:
			isValid = isValidKingMove(move);
			break;
		case PieceType.Queen:
			isValid = isValidQueenMove(move);
			break;
		default:
			isValid = false;
	}
	if (isValid && validateCheck) {
		isValid = !inCheck(move.pieceToMove.pieceColor, boardAfterMove(move));
	}

	return isValid;
};

function inCheck(color: ChessColor, board: Chessboard): boolean {
	const friendlyKing = board.pieces.find((p) => {
		return p.pieceType === PieceType.King && p.pieceColor === color;
	});
	if (!friendlyKing) return false;

	const enemyPieces = board.pieces.filter((p) => p.pieceColor !== color);
	for (let enemyPiece of enemyPieces) {
		const attackKing = {
			boardData: board,
			pieceToMove: enemyPiece,
			targetCoords: friendlyKing.coords,
		};
		if (isValidMove(attackKing, false)) return true;
	}
	return false;
}

export const boardAfterMove = (move: ChessMove): Chessboard => {
	const { boardData, pieceToMove, targetCoords } = move;
	const updatedBoard: Chessboard = JSON.parse(JSON.stringify(boardData)); //create a deep copy of the board

	//remove the piece to be captured if there is one
	updatedBoard.pieces = updatedBoard.pieces.filter((p) => {
		if (isEmpessant(move)) {
			return !isSameCoords({ x: targetCoords.x, y: pieceToMove.coords.y }, p.coords);
		} else {
			return !isSameCoords(targetCoords, p.coords);
		}
	});

	//move the piece being moved tot the target coords
	const pieceBeingMoved = pieceAt(pieceToMove.coords, updatedBoard);
	if (pieceBeingMoved) {
		pieceBeingMoved.coords.x = targetCoords.x;
		pieceBeingMoved.coords.y = targetCoords.y;
		pieceBeingMoved.moveCount = pieceBeingMoved.moveCount + 1;
	}

	//update the squares on the board
	updatedBoard.squares.forEach((s) => {
		s.piece = pieceAt(s.coords, updatedBoard);
	});

	return updatedBoard;
};
//empessant not done need to make sure the pawn beside moved last turn
function isEmpessant({ boardData, pieceToMove, targetCoords }: ChessMove): boolean {
	if (pieceToMove.pieceType !== PieceType.Pawn) return false;
	if (pieceToMove.pieceColor === ChessColor.White && pieceToMove.coords.y === 5) {
		if (isSameCoords({ x: pieceToMove.coords.x + 1, y: 6 }, targetCoords)) {
			const pieceBeside = pieceAt({ x: pieceToMove.coords.x + 1, y: 5 }, boardData);
			const pieceDiagonal = pieceAt({ x: pieceToMove.coords.x + 1, y: 6 }, boardData);
			if (
				!pieceDiagonal &&
				pieceBeside &&
				pieceBeside.pieceType === PieceType.Pawn &&
				pieceBeside.pieceColor !== pieceToMove.pieceColor &&
				pieceBeside.moveCount === 1
			)
				return true;
			else return false;
		} else if (isSameCoords({ x: pieceToMove.coords.x - 1, y: 6 }, targetCoords)) {
			const pieceBeside = pieceAt({ x: pieceToMove.coords.x - 1, y: 5 }, boardData);
			const pieceDiagonal = pieceAt({ x: pieceToMove.coords.x - 1, y: 6 }, boardData);
			if (
				!pieceDiagonal &&
				pieceBeside &&
				pieceBeside.pieceType === PieceType.Pawn &&
				pieceBeside.pieceColor !== pieceToMove.pieceColor &&
				pieceBeside.moveCount === 1
			)
				return true;
			else return false;
		}
	} else if (pieceToMove.pieceColor === ChessColor.Black && pieceToMove.coords.y === 4) {
		if (isSameCoords({ x: pieceToMove.coords.x + 1, y: 3 }, targetCoords)) {
			const pieceBeside = pieceAt({ x: pieceToMove.coords.x + 1, y: 4 }, boardData);
			const pieceDiagonal = pieceAt({ x: pieceToMove.coords.x + 1, y: 3 }, boardData);
			if (
				!pieceDiagonal &&
				pieceBeside &&
				pieceBeside.pieceType === PieceType.Pawn &&
				pieceBeside.pieceColor !== pieceToMove.pieceColor &&
				pieceBeside.moveCount === 1
			)
				return true;
			else return false;
		} else if (isSameCoords({ x: pieceToMove.coords.x - 1, y: 6 }, targetCoords)) {
			const pieceBeside = pieceAt({ x: pieceToMove.coords.x - 1, y: 4 }, boardData);
			const pieceDiagonal = pieceAt({ x: pieceToMove.coords.x - 1, y: 3 }, boardData);
			if (
				!pieceDiagonal &&
				pieceBeside &&
				pieceBeside.pieceType === PieceType.Pawn &&
				pieceBeside.pieceColor !== pieceToMove.pieceColor &&
				pieceBeside.moveCount === 1
			)
				return true;
			else return false;
		}
	}
	return false;
}

function isValidPawnMove({ boardData, pieceToMove, targetCoords }: ChessMove): boolean {
	if (pieceToMove.pieceType !== PieceType.Pawn) return false;
	if (isEmpessant({ boardData, pieceToMove, targetCoords })) return true;
	let direction = 1; //1 for white -1 for black
	if (pieceToMove.pieceColor === ChessColor.Black) direction = -1;
	//capture
	if (isSameCoords({ x: pieceToMove.coords.x + 1, y: pieceToMove.coords.y + 1 * direction }, targetCoords)) {
		const otherPiece = pieceAt({ x: pieceToMove.coords.x + 1, y: pieceToMove.coords.y + 1 * direction }, boardData);
		if (!otherPiece) return false;
		else if (otherPiece.pieceColor !== pieceToMove.pieceColor) return true;
		else return false;
	} else if (isSameCoords({ x: pieceToMove.coords.x - 1, y: pieceToMove.coords.y + 1 * direction }, targetCoords)) {
		const otherPiece = pieceAt({ x: pieceToMove.coords.x - 1, y: pieceToMove.coords.y + 1 * direction }, boardData);
		if (!otherPiece) return false;
		else if (otherPiece.pieceColor !== pieceToMove.pieceColor) return true;
		else return false;
	}
	//normal move
	let otherPiece = pieceAt({ x: pieceToMove.coords.x, y: pieceToMove.coords.y + 1 * direction }, boardData);
	if (otherPiece) return false; // if there is a piece 1 square in front return false
	if (isSameCoords({ x: pieceToMove.coords.x, y: pieceToMove.coords.y + 1 * direction }, targetCoords)) return true;
	else if (
		isSameCoords({ x: pieceToMove.coords.x, y: pieceToMove.coords.y + 2 * direction }, targetCoords) &&
		pieceToMove.moveCount === 0
	) {
		otherPiece = pieceAt({ x: pieceToMove.coords.x, y: pieceToMove.coords.y + 2 * direction }, boardData);
		return otherPiece ? false : true;
	}

	return false;
}

function isValidRookMove({ boardData, pieceToMove, targetCoords }: ChessMove): boolean {
	if (!(pieceToMove.pieceType === PieceType.Rook || pieceToMove.pieceType === PieceType.Queen)) return false;
	if (pieceToMove.coords.x === targetCoords.x) {
		//target square is in the same column
		if (pieceToMove.coords.y < targetCoords.y) {
			//check each square for pieces between the pieceToMove and the targetCoords
			//if there is another piece return false unless there are no pieces between
			//and the piece is at the target coords and is the enemy piece
			for (let y = pieceToMove.coords.y + 1; y <= targetCoords.y; y++) {
				const otherPiece = pieceAt({ x: pieceToMove.coords.x, y: y }, boardData);
				if (otherPiece) {
					if (otherPiece.pieceColor !== pieceToMove.pieceColor) {
						if (isSameCoords(otherPiece.coords, targetCoords)) return true;
						else return false;
					}
					return false;
				}
			}
			return true;
		} else if (pieceToMove.coords.y > targetCoords.y) {
			for (let y = pieceToMove.coords.y - 1; y >= targetCoords.y; y--) {
				const otherPiece = pieceAt({ x: pieceToMove.coords.x, y: y }, boardData);
				if (otherPiece) {
					if (otherPiece.pieceColor !== pieceToMove.pieceColor) {
						if (isSameCoords(otherPiece.coords, targetCoords)) return true;
						else return false;
					}
					return false;
				}
			}
			return true;
		}
	} else if (pieceToMove.coords.y === targetCoords.y) {
		if (pieceToMove.coords.x < targetCoords.x) {
			for (let x = pieceToMove.coords.x + 1; x <= targetCoords.x; x++) {
				const otherPiece = pieceAt({ x: x, y: pieceToMove.coords.y }, boardData);
				if (otherPiece) {
					if (otherPiece.pieceColor !== pieceToMove.pieceColor) {
						if (isSameCoords(otherPiece.coords, targetCoords)) return true;
						else return false;
					}
					return false;
				}
			}
			return true;
		} else if (pieceToMove.coords.x > targetCoords.x) {
			for (let x = pieceToMove.coords.x - 1; x >= targetCoords.x; x--) {
				const otherPiece = pieceAt({ x: x, y: pieceToMove.coords.y }, boardData);
				if (otherPiece) {
					if (otherPiece.pieceColor !== pieceToMove.pieceColor) {
						if (isSameCoords(otherPiece.coords, targetCoords)) return true;
						else return false;
					}
					return false;
				}
			}
			return true;
		}
	}
	return false;
}

function isValidKnightMove({ boardData, pieceToMove, targetCoords }: ChessMove): boolean {
	if (pieceToMove.pieceType !== PieceType.Knight) return false;
	//possible valid coords of knight moves
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
	const testCoord: Coords | undefined = testCoords.find((c) => {
		return isSameCoords(targetCoords, c);
	});
	if (!testCoord) return false; //target is not a possible knight move
	const testPiece = pieceAt(testCoord, boardData); //find the piece at the target square
	if (!testPiece) return true; //target square empty
	else if (testPiece.pieceColor !== pieceToMove.pieceColor) return true; //capture piece at target square
	else return false; //square held by friendly piece
}

function isValidBishopMove({ boardData, pieceToMove, targetCoords }: ChessMove): boolean {
	if (!(pieceToMove.pieceType === PieceType.Bishop || pieceToMove.pieceType === PieceType.Queen)) return false;
	if (targetCoords.x > pieceToMove.coords.x && targetCoords.y > pieceToMove.coords.y) {
		for (let x = pieceToMove.coords.x + 1, y = pieceToMove.coords.y + 1; x <= targetCoords.x, y <= targetCoords.y; x++, y++) {
			const otherPiece = pieceAt({ x, y }, boardData);
			if (otherPiece) {
				if (otherPiece.pieceColor !== pieceToMove.pieceColor && isSameCoords({ x, y }, targetCoords)) return true;
				else return false;
			} else if (isSameCoords({ x, y }, targetCoords)) return true;
		}
	} else if (targetCoords.x < pieceToMove.coords.x && targetCoords.y > pieceToMove.coords.y) {
		for (let x = pieceToMove.coords.x - 1, y = pieceToMove.coords.y + 1; x >= targetCoords.x, y <= targetCoords.y; x--, y++) {
			const otherPiece = pieceAt({ x, y }, boardData);
			if (otherPiece) {
				if (otherPiece.pieceColor !== pieceToMove.pieceColor && isSameCoords({ x, y }, targetCoords)) return true;
				else return false;
			} else if (isSameCoords({ x, y }, targetCoords)) return true;
		}
	} else if (targetCoords.x > pieceToMove.coords.x && targetCoords.y < pieceToMove.coords.y) {
		for (let x = pieceToMove.coords.x + 1, y = pieceToMove.coords.y - 1; x <= targetCoords.x, y >= targetCoords.y; x++, y--) {
			const otherPiece = pieceAt({ x, y }, boardData);
			if (otherPiece) {
				if (otherPiece.pieceColor !== pieceToMove.pieceColor && isSameCoords({ x, y }, targetCoords)) return true;
				else return false;
			} else if (isSameCoords({ x, y }, targetCoords)) return true;
		}
	} else if (targetCoords.x < pieceToMove.coords.x && targetCoords.y < pieceToMove.coords.y) {
		for (let x = pieceToMove.coords.x - 1, y = pieceToMove.coords.y - 1; x >= targetCoords.x, y >= targetCoords.y; x--, y--) {
			const otherPiece = pieceAt({ x, y }, boardData);
			if (otherPiece) {
				if (otherPiece.pieceColor !== pieceToMove.pieceColor && isSameCoords({ x, y }, targetCoords)) return true;
				else return false;
			} else if (isSameCoords({ x, y }, targetCoords)) return true;
		}
	}
	return false;
}

function isValidQueenMove(move: ChessMove): boolean {
	if (move.pieceToMove.pieceType !== PieceType.Queen) return false;
	return isValidBishopMove(move) || isValidRookMove(move);
}

function isValidKingMove({ boardData, pieceToMove, targetCoords }: ChessMove): boolean {
	if (pieceToMove.pieceType !== PieceType.King) return false;
	const testCoords: Coords[] = [
		{ x: pieceToMove.coords.x + 1, y: pieceToMove.coords.y - 1 },
		{ x: pieceToMove.coords.x + 1, y: pieceToMove.coords.y },
		{ x: pieceToMove.coords.x + 1, y: pieceToMove.coords.y + 1 },
		{ x: pieceToMove.coords.x, y: pieceToMove.coords.y - 1 },
		{ x: pieceToMove.coords.x, y: pieceToMove.coords.y + 1 },
		{ x: pieceToMove.coords.x - 1, y: pieceToMove.coords.y - 1 },
		{ x: pieceToMove.coords.x - 1, y: pieceToMove.coords.y },
		{ x: pieceToMove.coords.x - 1, y: pieceToMove.coords.y + 1 },
	];
	const testCoord: Coords | undefined = testCoords.find((c) => {
		return isSameCoords(targetCoords, c);
	});

	if (!testCoord) return false; //target is not a possible knight move
	const testPiece = pieceAt(testCoord, boardData); //find the piece at the target square
	if (!testPiece) return true; //target square empty
	else if (testPiece.pieceColor !== pieceToMove.pieceColor) return true; //capture piece at target square
	else return false; //square held by friendly piece
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
