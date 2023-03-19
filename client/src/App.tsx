import { createContext, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import RequireAuth from "./App/RequireAuth";
import { AuthProvider } from "./context/AuthProvider";
import ChessApp from "./pages/ChessApp/ChessApp";
import Home from "./pages/Home";
import Login from "./pages/Login/Login";
import Profile from "./pages/Profile/Profile";
import Register from "./pages/Register/Register";
import { ServerToClientEvents, ClientToServerEvents } from "./shared-libs/socketTypes";

export const SocketContext = createContext<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
const App: React.FC = () => {
	const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents>>(io("http://localhost:3500"));
	return (
		<AuthProvider>
			<Routes>
				<Route path="/register" element={<Register />} />
			</Routes>

			<SocketContext.Provider value={socket}>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route element={<RequireAuth />}>
						<Route path="/chess" element={<ChessApp />} />
						<Route path="/" element={<Home />} />
						<Route path="/profile" element={<Profile />} />
					</Route>
				</Routes>
			</SocketContext.Provider>
		</AuthProvider>
	);
};

export default App;
