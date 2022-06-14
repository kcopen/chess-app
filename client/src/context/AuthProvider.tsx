import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";
import { UserProfile } from "../shared-libs/UserProfile";

const AuthContext = createContext({
	userProfile: {} as UserProfile,
	setUserProfile: {} as Dispatch<SetStateAction<UserProfile>>,
});

const AuthProvider = ({ children, value = {} as UserProfile }: { children: React.ReactNode; value?: UserProfile }) => {
	const [auth, setAuth] = useState(value);

	return <AuthContext.Provider value={{ userProfile: auth, setUserProfile: setAuth }}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within AuthContext");
	}
	return context;
};

export { AuthProvider, useAuth };
