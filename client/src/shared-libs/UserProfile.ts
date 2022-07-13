import { ChessStats } from "./ChessStats";

export interface UserProfile {
	firstname: string;
	lastname: string;
	username: string;
	password: string;
	friends?: string[]; 
	chessStats?: ChessStats;
}