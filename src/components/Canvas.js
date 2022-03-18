import React from "react";
import GameConfig from "../GameConfig";
export default class Canvas extends React.Component {
  componentDidMount() {
    document.addEventListener("keydown", this.props.handleKeyDown);
    document.addEventListener("keyup", this.props.handleKeyDown);
    this.setupBoard();
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.props.handleKeyDown);
    document.removeEventListener("keyup", this.props.handleKeyDown);
  }
  render() {
    return (
      <div className="Canvas">
        <canvas
          id="canvas"
          width={GameConfig.board.width}
          height={GameConfig.board.height}
        ></canvas>
      </div>
    );
  }
  setupBoard() {
    const { board, player } = GameConfig;
    const physics = {
      playerLy: player.startY,
      playerRy: player.startY,
      ballY: board.height / 2,
      ballX: board.width / 2
    };
    updateBoard(physics);
  }
}

function updateBoard(physics) {
  const { board } = GameConfig;
  var c = document.getElementById("canvas");
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, board.width, board.height);
  drawBoard(ctx);
  drawPlayers(ctx, physics);
  drawBall(ctx, physics);
}
function drawBoard(ctx) {
  const { board, goal } = GameConfig;
  ctx.beginPath();
  ctx.moveTo(0, goal.upperPoleY);
  ctx.lineTo(0, 0);
  ctx.lineTo(board.width, 0);
  ctx.lineTo(board.width, goal.upperPoleY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, goal.bottomPoleY);
  ctx.lineTo(0, board.height);
  ctx.lineTo(board.width, board.height);
  ctx.lineTo(board.width, goal.bottomPoleY);
  ctx.stroke();

  ctx.beginPath();
  ctx.setLineDash([2, 4]);
  ctx.moveTo(board.width / 2, 0);
  ctx.lineTo(board.width / 2, board.height);
  ctx.stroke();
  ctx.setLineDash([]);
}
function drawBall(ctx, physics) {
  const { ballX, ballY } = physics;
  const { ball } = GameConfig;
  ctx.beginPath();
  ctx.arc(ballX, ballY, ball.radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}
function drawPlayers(ctx, physics) {
  const { playerLy, playerRy } = physics;
  const { board, player } = GameConfig;
  ctx.fillRect(player.distFromGoal, playerLy, player.width, player.height);
  ctx.fillRect(
    board.width - player.distFromGoal,
    playerRy,
    player.width,
    player.height
  );
}
export { Canvas, updateBoard };
