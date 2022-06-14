import { useRef, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { UserProfile } from "../shared-libs/UserProfile";

import axios from "../API/axios";
const LOGIN_URL = "/auth";

const Login: React.FC = () => {
	const { userProfile, setUserProfile } = useAuth();
	const userRef = useRef<HTMLInputElement>(null);
	const errRef = useRef<HTMLParagraphElement>(null);

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errMsg, setErrMsg] = useState("");

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
			const userProfile: UserProfile = response?.data;
			if (userProfile) {
				setUserProfile(userProfile);
				setUsername("");
				setPassword("");
			}
		} catch (err: any) {
			if (!err?.response) {
				setErrMsg("No server response");
			} else if (err.response?.status === 400) {
				setErrMsg("Missing username or password.");
			} else if (err.response?.status === 401) {
				setErrMsg("Unauthorized");
			} else {
				setErrMsg("Login Failed");
			}
			errRef.current?.focus();
		}
	};

	return !userProfile.username ? (
		<section>
			<p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
				{errMsg}
			</p>
			<h1>Sign In</h1>
			<form onSubmit={handleSubmit}>
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
					<a href="">Sign Up</a>
				</span>
			</p>
		</section>
	) : (
		<Navigate to="/chess" />
	);
};

export default Login;
