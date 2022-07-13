import { ChessMatch, ChessMove } from "./chessEngine/ChessTypes";
import { UserProfile } from "./UserProfile";

export interface ServerToClientEvents {
	login_response: (userProfile:UserProfile)=>void;
	register_response: (userProfile:UserProfile)=>void;
	current_room_info: (room: string) => void;
	match_update: (match: ChessMatch)=> void;
	chatbox_update: (user:string, message: string)=>void;
	draw_requested: (drawRequested: boolean) =>void;
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
	add_friend: (userProfile: UserProfile, friendToAdd: string)=> void;
	resign:(room: string, userProfile: UserProfile)=>void;
	request_draw:(room: string, userProfile: UserProfile)=>void;
    
}

export interface InterServerEvents {
	login: UserProfile;
}

export interface SocketData {
	
}
