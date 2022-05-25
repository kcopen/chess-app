import { Chessboard, ChessColor, ChessMove, Piece, PieceType } from "../constants/ChessTypes";
import { getValidTeamMoves, boardAfterMove, inCheck, pieceAt, inCheckMate, isPieceUnderAttack } from "./chessRules";

export const getBestMove = (team: ChessColor, board: Chessboard): ChessMove | undefined => {
	//score each move possible move
	const possibleMoves: ChessMove[] = scoreMoves(getValidTeamMoves(team, board), 1);

	//get the top move
	const topMove = topMoves(1, possibleMoves)[0];
	//return the move with the highest score

	return topMove;
};

function topMoves(ammount: number, moves: ChessMove[]): ChessMove[] {
	moves.sort((m1, m2) => {
		return m1.score && m2.score ? m2.score - m1.score : 0;
	});
	return moves.slice(ammount);
}

function scoreMoves(moves: ChessMove[], searchDepth: number = 0) {
	moves.forEach((m) => {
		m.score = scoreMove(m, 0, searchDepth);
	});
	return moves;
}

//scores how viable the move is
function scoreMove(move: ChessMove, depth: number = 0, searchDepth: number = 1): number {
	if (depth >= searchDepth) return 0;
	const { board, pieceToMove, targetCoords } = move;
	const newBoard = boardAfterMove(move);
	const pieceAfterMove = pieceAt(targetCoords, newBoard);
	const teamColor = pieceToMove.pieceColor;
	const enemyColor = teamColor === ChessColor.White ? ChessColor.Black : ChessColor.White;
	const pieceToCapture = pieceAt(targetCoords, board);
	const teamPieceValueDiff = teamPieceValue(teamColor, newBoard) - teamPieceValue(teamColor, board);

	const pieceValueModifier = 4;

	let score = 0;
	//add +1 to score for every square controlled
	score += getValidTeamMoves(teamColor, newBoard).length; //todo fix because it counts them multiple times

	if (inCheckMate(enemyColor, newBoard)) {
		score += 1000;
	}

	if (inCheck(enemyColor, newBoard)) {
		score += 10;
	}
	//if there is a piece to capture
	if (pieceToCapture) {
		score += pieceValue(pieceToCapture) * pieceValueModifier;
	}
	//if moving to the square would put the piece under attack reduce its score
	if (pieceAfterMove && isPieceUnderAttack(pieceAfterMove, newBoard)) {
		score -= pieceValueModifier * pieceValue(pieceToMove);
	}

	//if move loses a team piece decrease its score otherwise increase its score
	score += (teamPieceValueDiff < 0 ? Math.floor(teamPieceValueDiff * -2) : teamPieceValueDiff) * pieceValueModifier;

	const enemyResponseMoves = topMoves(15, scoreMoves(getValidTeamMoves(enemyColor, newBoard)));
	enemyResponseMoves.forEach((em) => {
		const nextBoard = boardAfterMove(em);
		const nextPossibleMoves = topMoves(15, scoreMoves(getValidTeamMoves(teamColor, nextBoard))); //top 5 moves
		nextPossibleMoves.forEach((pm) => {
			score += scoreMove(pm, depth + 1);
		});
	});

	return score;
}

function teamPieceValue(color: ChessColor, board: Chessboard) {
	const teamPieces = board.pieces.filter((p) => p.pieceColor === color);
	let totalPieceValue = 0;
	teamPieces.forEach((p) => (totalPieceValue += pieceValue(p)));
	return totalPieceValue;
}

function pieceValue(piece: Piece): number {
	switch (piece.pieceType) {
		case PieceType.Pawn:
			return 1;
		case PieceType.Rook:
			return 5;
		case PieceType.Knight:
			return 3;
		case PieceType.Bishop:
			return 3;
		case PieceType.King:
			return 1000000;
		case PieceType.Queen:
			return 9;
		default:
			return 0;
	}
}
