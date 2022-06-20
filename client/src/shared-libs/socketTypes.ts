import { Chessboard, ChessColor, ChessMove } from "./chessEngine/ChessTypes";
import { UserProfile } from "./UserProfile";

export interface ServerToClientEvents {
	login_response: (userProfile:UserProfile)=>void;
	register_response: (userProfile:UserProfile)=>void;
	current_game_info: (room: string, playerColor: ChessColor | undefined) => void;
	board_update: (board: Chessboard)=> void;
	chatbox_update: (user:string, message: string)=>void;
}

export interface ClientToServerEvents {
	login_request: (userProfile: { username: string, password: string })=> void;
	register_request: (userProfile: UserProfile)=> void;
	join_chess_room_request: (userProfile: UserProfile, room: string) => void;
	attempt_move: (userProfile: UserProfile, room: string, move: ChessMove) => void;
	join_queue:(userProfile: UserProfile)=>void;
	get_current_game_info: (userProfile:UserProfile)=>void;
	reconnect: (userProfile: UserProfile)=>void;
	send_chat_message: (userProfile: UserProfile, room:string, message:string)=>void;
    
}

export interface InterServerEvents {
	login: UserProfile;
}

export interface SocketData {
	
}
