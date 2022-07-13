import { useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "../../shared-libs/socketTypes";
import { useAuth } from "../../context/AuthProvider";
import "./Chatbox.css";
import { SocketContext } from "../../App";

interface ChatMessage {
	username: string;
	message: string;
	time?: Date;
}

interface Props {
	room: string;
}

const Chatbox: React.FC<Props> = ({ room }: Props) => {
	const socket = useContext(SocketContext) as Socket<ServerToClientEvents, ClientToServerEvents>;
	const { userProfile } = useAuth();
	const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
	const [messageToSend, setMessageToSend] = useState<string>("");

	useEffect(() => {
		socket.on("chatbox_update", (user, message) => {
			setChatHistory((prevChatHistory) => [{ username: user, message, time: new Date() }, ...prevChatHistory]);
		});
	}, [socket]);

	const sendMessage = () => {
		if (messageToSend) {
			socket.emit("send_chat_message", userProfile, room, messageToSend);
			setMessageToSend("");
		}
	};
	return (
		<div className="chatbox">
			<div className="chatbox_header">
				{chatHistory.map((chatMessage: ChatMessage, index: number) => {
					return (
						<p key={index} className={chatMessage.username === userProfile.username ? "you" : "other"}>
							<span className="chatbox_username">{chatMessage.username}: </span>
							<span className="chatbox_message">{chatMessage.message}</span>
						</p>
					);
				})}
			</div>
			<div className="chatbox_footer">
				<input
					type="text"
					placeholder="Send a message..."
					onChange={(e) => setMessageToSend(e.target.value)}
					onKeyPress={(e) => {
						e.key === "Enter" && sendMessage();
					}}
					value={messageToSend}
				/>
				<button onClick={sendMessage}>Send</button>
			</div>
		</div>
	);
};

export default Chatbox;
