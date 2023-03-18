import { useRef, useState, useEffect, useContext } from "react";
import { SocketContext } from "./../../App";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { UserProfile } from "../../shared-libs/UserProfile";
import "./Login.css";

import axios from "../../API/axios";
import { ClientToServerEvents, ServerToClientEvents } from "../../shared-libs/socketTypes";
import { Socket } from "socket.io-client";
const LOGIN_URL = "/auth";

const Login: React.FC = () => {
	const { userProfile, setUserProfile } = useAuth();
	const socket = useContext(SocketContext) as Socket<ServerToClientEvents, ClientToServerEvents>;
	const userRef = useRef<HTMLInputElement>(null);
	const errRef = useRef<HTMLParagraphElement>(null);

	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [errMsg, setErrMsg] = useState<string>("");

	useEffect(() => {
		userRef.current?.focus();
	}, []);

	useEffect(() => {
		setErrMsg("");
	}, [username, password]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const response = await axios.post(LOGIN_URL, JSON.stringify({ username, password }), {
				headers: { "Content-Type": "application/json" },
			});
			const userProfileData: UserProfile = response?.data;
			if (userProfileData) {
				setUserProfile(userProfileData);
				socket.emit("login", userProfileData);
				setUsername("");
				setPassword("");
			}
		} catch (err: any) {
			if (!err?.response) {
				setErrMsg("No server response.");
			} else if (err.response?.status === 400) {
				setErrMsg("Missing username or password.");
			} else if (err.response?.status === 401) {
				setErrMsg("Unauthorized.");
			} else {
				setErrMsg("Login Failed.");
			}
			errRef.current?.focus();
		}
	};

	return !userProfile.username ? (
		<div className="basic-page">
			<main className="basic-container">
				<p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
					{errMsg}
				</p>
				<h1 className="basic-title">Log In</h1>
				<form className="basic-form" onSubmit={handleSubmit}>
					<label htmlFor="username">Username:</label>
					<input
						type="text"
						id="username"
						ref={userRef}
						autoComplete="off"
						onChange={(e) => setUsername(e.target.value)}
						value={username}
						required
					/>
					<label htmlFor="password">Password:</label>
					<input type="password" id="password" onChange={(e) => setPassword(e.target.value)} value={password} required />
					<button>Sign In</button>
				</form>
				<p>
					Need an Account? <br />
					<span className="line">
						<Link to="/register">Sign Up</Link>
					</span>
				</p>
			</main>
		</div>
	) : (
		<Navigate to="/" />
	);
};

export default Login;
