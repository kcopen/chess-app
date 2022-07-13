import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useAuth } from "../../context/AuthProvider";

interface Props {}

const Profile: React.FC<Props> = (props: Props) => {
	const { userProfile } = useAuth();

	return (
		<>
			<Navbar />
			<main>
				<h1>{userProfile.username}</h1>
				<h2>{userProfile.firstname}</h2>
				<h2>{userProfile.lastname}</h2>
				<section>
					<p>wins:{userProfile.chessStats?.wins}</p>
					<p>losses:{userProfile.chessStats?.losses}</p>
					<p>draws:{userProfile.chessStats?.draws}</p>
				</section>
			</main>
		</>
	);
};

export default Profile;
