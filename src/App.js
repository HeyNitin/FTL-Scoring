import { useState } from "react";
import "./styles.css";
import axios from "axios";
import { config } from "./config";

export default function App() {
	const [playerName, setPlayerName] = useState("");
	const [gameWeek, setGameWeek] = useState("");
	const [exact, setExact] = useState(true);
	const [players, setPlayers] = useState({ response: [], notFound: [] });
	const [isLoading, setIsLoading] = useState(false);

	const submitHandler = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const res = await axios.get(
				`${config.serverURL()}/${playerName}/${gameWeek}/${exact}`
			);
			if(res.data.status === 200){
				setPlayers(res.data);
			}else{
				alert(res.data.reason)
			}
		} catch (e) {
			alert("Something went wrong!");
			console.log(e);
		}
		setIsLoading(false);
	};

	return (
		<div className="App">
			<form onSubmit={(e) => submitHandler(e)}>
				<input
					className="textfield"
					value={gameWeek}
					onChange={(e) => setGameWeek(e.target.value)}
					placeholder="Enter Game Week"
				/>
				<input
					className="textfield"
					value={playerName}
					onChange={(e) => setPlayerName(e.target.value)}
					placeholder="Enter players"
				/>
				<input
					type="checkbox"
					checked={exact}
					onChange={() => setExact((prev) => !prev)}
					id="exact"
				/>
				<label htmlFor="exact">Find Exact match</label>
				<button>Get Score</button>
			</form>
			<div className="result">
				{!isLoading && (
					<>
						{players.response.length ? (
							<div className="bold">Found: {players.response.length}</div>
						) : (
							<></>
						)}
						<ul>
							{players.response.map((item, idx) => {
								return (
									<li key={idx + 1}>
										{idx + 1}:{" "}
										{item.player.first_name + " " + item.player.second_name}:{" "}
										{item.points.total_points -
											item.points.bonus -
											(item.points.minutes >= 60
												? 2
												: item.points.minutes >= 1
												? 1
												: 0)}
									</li>
								);
							})}
						</ul>
						{players.notFound.length ? (
							<div className="bold">Not Found</div>
						) : (
							<></>
						)}
						{players.notFound.map((item, idx) => (
							<div key={idx}>{item}: Not Found</div>
						))}
					</>
				)}
				{!isLoading && (players.response.length || players.notFound.length) ? (
					<div className="bold">
						Total:{" "}
						{players.response.reduce(
							(total, item) =>
								total +
								item.points.total_points -
								item.points.bonus -
								(item.points.minutes >= 60
									? 2
									: item.points.minutes >= 1
									? 1
									: 0),
							0
						)}
					</div>
				) : (
					<></>
				)}
				{isLoading && <div>Loading...</div>}
			</div>
		</div>
	);
}
