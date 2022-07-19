import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const RequireAuth = () => {
	const { userProfile } = useAuth();
	const location = useLocation();
	return userProfile.username ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};

export default RequireAuth;
