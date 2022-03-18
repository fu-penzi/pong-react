export default function GameControl(props) {
  return (
    <div className="gameControl">
      <button onClick={props.toggleStart}>
        {props.isGameRunning ? "Pause" : "Start"}
      </button>
      <h2 className="Score">{props.score}</h2>
      <button onClick={props.restartGame}>Restart</button>
    </div>
  );
}
