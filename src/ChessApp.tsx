import "./ChessApp.css";
import { ChessBoard } from "./components/ChessBoard/ChessBoard";
import { ChessColor } from "./constants/ChessTypes";

function ChessApp() {
	return (
		<div className="chess-app">
			<ChessBoard
				player={{ userName: "player", color: ChessColor.White }}
				opponent={{ userName: "computer", color: ChessColor.Black, isComputer: true }}
			/>
		</div>
	);
}

export default ChessApp;
