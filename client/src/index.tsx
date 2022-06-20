import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import ChessApp from "./pages/ChessApp/ChessApp";
import { AuthProvider } from "./context/AuthProvider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
	<AuthProvider>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/chess" element={<ChessApp />} />
			</Routes>
		</BrowserRouter>
	</AuthProvider>
);
