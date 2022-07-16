import { useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "../../API/axios";
import { UserProfile } from "../../shared-libs/UserProfile";
import "./Register.css";

const REGISTER_URL = "/register";

interface Props {}

const Register: React.FC<Props> = () => {
	const firstNameRef = useRef<HTMLInputElement>(null);
	const errRef = useRef<HTMLParagraphElement>(null);

	const [firstName, setFirstName] = useState<string>("");
	const [lastName, setLastName] = useState<string>("");
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
	const [errMsg, setErrMsg] = useState<string>("");
	const [successfulRegistration, setSuccessfulRegistration] = useState<boolean>(false);

	useEffect(() => {
		firstNameRef.current?.focus();
	}, []);

	useEffect(() => {
		setErrMsg("");
	}, [firstName, lastName, username, password, passwordConfirmation]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (password !== passwordConfirmation) {
			setErrMsg("Password confirmation must match");
			return;
		}
		try {
			const response = await axios.post(
				REGISTER_URL,
				JSON.stringify({ firstname: firstName, lastname: lastName, username, password }),
				{
					headers: { "Content-Type": "application/json" },
				}
			);
			const userProfile: UserProfile = response?.data;
			if (userProfile) {
				setFirstName("");
				setLastName("");
				setUsername("");
				setPassword("");
				setPasswordConfirmation("");
				setSuccessfulRegistration(true);
			}
		} catch (err: any) {
			if (!err?.response) {
				setErrMsg("No server response.");
			} else if (err.response?.status === 400) {
				setErrMsg("User already exists.");
			} else {
				setErrMsg("Registration failed.");
			}
			errRef.current?.focus();
		}
	};

	return !successfulRegistration ? (
		<div className="basic-page">
			<main className="basic-container">
				<p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
					{errMsg}
				</p>
				<h1 className="basic-title">Register</h1>
				<form className="basic-form" onSubmit={handleSubmit}>
					<label htmlFor="first_name">First Name:</label>
					<input
						type="text"
						id="first_name"
						ref={firstNameRef}
						autoComplete="off"
						onChange={(e) => setFirstName(e.target.value)}
						value={firstName}
						required
					/>

					<label htmlFor="last_name">Last Name:</label>
					<input
						type="text"
						id="last_name"
						autoComplete="off"
						onChange={(e) => setLastName(e.target.value)}
						value={lastName}
						required
					/>

					<label htmlFor="username">Username:</label>
					<input
						type="text"
						id="username"
						autoComplete="off"
						onChange={(e) => setUsername(e.target.value)}
						value={username}
						required
					/>

					<label htmlFor="password">Password:</label>
					<input type="password" id="password" onChange={(e) => setPassword(e.target.value)} value={password} required />

					<label htmlFor="password_confirmation">Confirm Password:</label>
					<input
						type="password"
						id="password_confirmation"
						onChange={(e) => setPasswordConfirmation(e.target.value)}
						value={passwordConfirmation}
						required
					/>
					<button>Sign Up</button>
				</form>
				<p>
					Already have an account? <br />
					<span className="line">
						<Link to="/login">Log In</Link>
					</span>
				</p>
			</main>
		</div>
	) : (
		<Navigate to="/login" />
	);
};

export default Register;
