import { ChessStats } from "./ChessStats";

export interface UserProfile {
	firstname: string;
	lastname: string;
	username: string;
	friends?: string[]; 
	chessStats?: ChessStats;
}