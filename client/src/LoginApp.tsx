import { useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "./shared-libs/socketTypes";
import { UserProfile } from "./shared-libs/UserProfile";
import { LoginContext } from "./ChessApp";
import { SocketContext } from "./ChessApp";

interface Props {}

export const LoginApp: React.FC<Props> = ({}) => {
	const setUserProfile = useContext(LoginContext) as React.Dispatch<React.SetStateAction<UserProfile | undefined>>;
	const socket = useContext(SocketContext) as Socket<ServerToClientEvents, ClientToServerEvents>;
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [firstname, setFirstName] = useState<string>("");
	const [lastname, setLastName] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [isSigningUp, setIsSigningUp] = useState<Boolean>(false);

	useEffect(() => {
		socket.on("login_response", (loginResponse: UserProfile) => {
			setUserProfile(loginResponse);
		});
		socket.on("register_response", (registerResponse: UserProfile) => {
			setUserProfile(registerResponse);
			console.log("thank you for registering");
		});
	}, [socket]);

	function login(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		socket.emit("login_request", { username, password });
	}

	function register(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (password === confirmPassword) {
			socket.emit("register_request", { firstname, lastname, username, password });
		}
	}

	return !isSigningUp ? (
		<form className="login_form" onSubmit={(event) => login(event)}>
			<input
				type="text"
				placeholder="username..."
				onChange={(event) => {
					setUsername(event.target.value);
				}}
			/>
			<input
				type="password"
				placeholder="password..."
				onChange={(event) => {
					setPassword(event.target.value);
				}}
			/>
			<button type="submit">Login</button>
			<button
				type="button"
				onClick={(event) => {
					setIsSigningUp(true);
				}}
			>
				Sign up!
			</button>
		</form>
	) : (
		<form className="registration_form" onSubmit={(event) => register(event)}>
			<input
				id="firstname"
				type="text"
				placeholder="first name..."
				onChange={(event) => {
					setFirstName(event.target.value);
				}}
			/>
			<input
				id="lastname"
				type="text"
				placeholder="last name..."
				onChange={(event) => {
					setLastName(event.target.value);
				}}
			/>
			<input
				id="username"
				type="text"
				placeholder="username..."
				onChange={(event) => {
					setUsername(event.target.value);
				}}
			/>
			<input
				id="password"
				type="password"
				placeholder="password..."
				onChange={(event) => {
					setPassword(event.target.value);
				}}
			/>
			<input
				id="confirm_password"
				type="password"
				placeholder="confirm password..."
				onChange={(event) => {
					setConfirmPassword(event.target.value);
				}}
			/>
			<button type="submit">Register/Login</button>
		</form>
	);
};
