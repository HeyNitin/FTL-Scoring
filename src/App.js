import { useState } from "react";
import "./styles.css";
import axios from "axios";

export default function App() {
  const [playerName, setPlayerName] = useState("");
  const [gameWeek, setGameWeek] = useState("");
  const [players, setPlayers] = useState({ response: [], notFound: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [exact, setExact] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await axios.get(
      `https://FTL-Scoring.heynitin.repl.co/${playerName}/${gameWeek}/${exact}`
    );
    setPlayers(res.data);
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
          placeholder="Enter player's Name"
        />
        <input
          type="checkbox"
          value={exact}
          onChange={() => setExact((prev) => !prev)}
          id="exact"
        />
        <label htmlFor="exact">Find Exact match</label>
        <button>Get Score</button>
      </form>
      <div className="result">
        {!isLoading && (
          <>
            {players.response.map((item, idx) => {
              return (
                <div key={idx}>
                  <div>
                    {item.player.first_name + " " + item.player.second_name}:{" "}
                    {item.points.total_points -
                      item.points.bonus -
                      (item.points.minutes >= 60
                        ? 2
                        : item.points.minutes >= 1
                        ? 1
                        : 0)}
                  </div>
                </div>
              );
            })}
            {players.notFound.map((item, idx) => (
              <div key={idx}>{item}: Not Found</div>
            ))}
          </>
        )}
        {!isLoading && (players.response.length || players.notFound.length) ? (
          <div>
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