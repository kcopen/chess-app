import { Chessboard, ChessColor, ChessMove, PieceType } from "../constants/ChessTypes";
import { getValidTeamMoves, boardAfterMove, inCheck, pieceAt, inCheckMate } from "./chessRules";

export const getEngineMove = (team: ChessColor, board: Chessboard): ChessMove | undefined => {
	const possibleMoves: ChessMove[] = getValidTeamMoves(team, board);
	//score each move
	possibleMoves.forEach((m) => {
		m.score = scoreMove(m);
	});
	//sort the moves by score
	possibleMoves.sort((m1, m2) => {
		return m1.score && m2.score ? m2.score - m1.score : 0;
	});
	//return the move with the highest score
	return possibleMoves[0];
};

//scores how viable the move is
function scoreMove(move: ChessMove): number {
	const { board, pieceToMove, targetCoords } = move;
	const newBoard = boardAfterMove(move);
	const teamColor = pieceToMove.pieceColor;
	const enemyColor = teamColor === ChessColor.White ? ChessColor.Black : ChessColor.White;
	const pieceToCapture = pieceAt(targetCoords, board);

	let score = 0;
	//add +1 to score for every square controlled
	score += getValidTeamMoves(teamColor, newBoard).length;
	//if the enemy is put in check
	if (inCheck(enemyColor, newBoard)) {
		score += 10;
	}
	//if there is a piece to capture
	if (pieceToCapture) {
		score += getPieceValue(pieceToCapture.pieceType);
	}

	if (inCheckMate(enemyColor, newBoard)) {
		score += 1000;
	}
	return score;
}

function getPieceValue(pieceType: PieceType): number {
	switch (pieceType) {
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
