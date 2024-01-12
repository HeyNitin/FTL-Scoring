import { useRef, useState } from "react";
import "./styles.css";
import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_URL;

export default function App() {
	const [players, setPlayers] = useState({ response: [], notFound: [] });
	const [isLoading, setIsLoading] = useState(false);
	const gameWeekRef = useRef();
	const playerRef = useRef();
	const exact = useRef();

	const submitHandler = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const res = await axios.get(
				`${baseURL}/${playerRef.current.value}/${gameWeekRef.current.value}/${exact.current.checked}`
			);
			if (res.data.status === 200) {
				console.log(res.data);
				setPlayers(res.data);
			} else {
				alert(res.data.reason);
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
					ref={gameWeekRef}
					placeholder="Enter Game Week"
					required
					autoFocus
				/>
				<input
					className="textfield"
					ref={playerRef}
					placeholder="Enter players"
					required
				/>
				<input type="checkbox" ref={exact} id="exact" />
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
										{item.points.reduce((res, points) => {
											return (
												res +
												points.total_points -
												points.bonus -
												(points.minutes >= 60 ? 2 : points.minutes >= 1 ? 1 : 0)
											);
										}, 0)}
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
								item.points.reduce((res, points) => {
									return (
										res +
										points.total_points -
										points.bonus -
										(points.minutes >= 60 ? 2 : points.minutes >= 1 ? 1 : 0)
									);
								}, 0),
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
