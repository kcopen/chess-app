import { useEffect, useState } from "react";

interface Props {
	time: number; //time limit in seconds
	isPaused: boolean;
}

export const ChessTimer: React.FC<Props> = ({ time, isPaused }: Props) => {
	const [currentTime, setCurrentTime] = useState<number>(time);
	useEffect(() => {
		setTimeout(async () => {
			if (!isPaused) {
				setCurrentTime(currentTime - 1);
			}
		}, 1000);
	}, [currentTime]);

	function timerString() {
		const currentSeconds = currentTime % 60;
		const currentMinutes = Math.floor(currentTime / 60) % 60;
		const currentHours = Math.floor(currentTime / 3600);
		return `${currentHours > 0 ? `${currentHours}:` : ""}
				${currentHours > 0 && currentMinutes < 10 ? `0${currentMinutes}` : currentMinutes}:
				${currentSeconds < 10 ? `0${currentSeconds}` : currentSeconds}`;
	}

	return <div className="chess-timer">{timerString()}</div>;
};
