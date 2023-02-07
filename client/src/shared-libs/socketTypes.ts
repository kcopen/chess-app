import { ChessMatch, ChessMove } from "./chessEngine/ChessTypes";
import { UserProfile } from "./UserProfile";

export interface ServerToClientEvents {
	login_response: (userProfile:UserProfile)=>void;
	register_response: (userProfile:UserProfile)=>void;

	current_room_info: (room: string) => void;
	match_update: (match: ChessMatch)=> void;
	draw_requested: (drawRequested: boolean) =>void;

	chatbox_update: (user:string, message: string)=>void;
}

export interface ClientToServerEvents {
	login: (userProfile:UserProfile)=> void;
//matchmaking	
	quick_match:(user: UserProfile)=>void;
	rated_match:(user:UserProfile)=>void;
	host_private_match:(user:UserProfile, room: string) =>void;
	join_private_match:(user:UserProfile, room: string) =>void;
	ai_match:(user:UserProfile)=>void;

	attempt_move: (userProfile: UserProfile, room: string, move: ChessMove) => void;
	get_current_game_info: (userProfile:UserProfile)=>void;
	
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
