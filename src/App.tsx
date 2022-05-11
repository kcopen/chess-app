import "./App.css";
import { ChessBoard } from "./components/ChessBoard/ChessBoard";
import { ChessColor } from "./constants/ChessTypes";

function App() {
	return (
		<div className="App">
			<ChessBoard playerColor={ChessColor.White} />
		</div>
	);
}

export default App;
