import "./App.css";
import { ChessBoard } from "./components/ChessBoard/ChessBoard";
import { ChessColor } from "./constants/ChessTypes";

function App() {
	return (
		<div className="App">
			<ChessBoard
				player={{ userName: "player", color: ChessColor.White }}
				opponent={{ userName: "computer", color: ChessColor.Black, isComputer: true }}
			/>
		</div>
	);
}

export default App;
