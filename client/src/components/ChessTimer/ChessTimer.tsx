import { useEffect, useState } from "react";

interface Props {
	time: number; //time limit in seconds
	isPaused: boolean;
}

export const ChessTimer: React.FC<Props> = ({ time, isPaused }: Props) => {
	const [currentTime, setCurrentTime] = useState<number>(Math.floor(time / 1000)); //time in seconds
	useEffect(() => {
		setTimeout(async () => {
			if (!isPaused) {
				setCurrentTime(currentTime - 1);
			}
		}, 1000);
	}, [currentTime]);

	function timerString() {
		const displaySeconds = currentTime % 60;
		const displayMinutes = Math.floor(currentTime / 60) % 60;
		const displayHours = Math.floor(currentTime / 3600);
		return `${displayHours > 0 ? `${displayHours}:` : ""}
				${displayHours > 0 && displayMinutes < 10 ? `0${displayMinutes}` : displayMinutes}:
				${displaySeconds < 10 ? `0${displaySeconds}` : displaySeconds}`;
	}

	return <div className="chess-timer">{timerString()}</div>;
};
