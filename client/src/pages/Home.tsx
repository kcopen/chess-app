import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

interface Props {}

const Home: React.FC<Props> = () => {
	const { userProfile } = useAuth();

	return <div className="home">{!userProfile.username ? <Navigate to="/login" /> : <Navigate to="/chess" />}</div>;
};

export default Home;
