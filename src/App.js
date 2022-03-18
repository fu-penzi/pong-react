import React from "react";
import { Canvas, updateBoard } from "./components/Canvas";
import GameControl from "./components/GameControl";
import GameConfig from "./GameConfig";
import "./styles.css";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerLy: GameConfig.player.startY,
      playerRy: GameConfig.player.startY,
      ballY: GameConfig.board.height / 2,
      ballX: GameConfig.board.width / 2,
      ballVelX: GameConfig.ball.startSpeed,
      ballVelY: GameConfig.ball.startSpeed,
      leftArrowPressed: false,
      rightArrowPressed: false,
      aPressed: false,
      dPressed: false,
      isGameRunning: false,
      time: 0,
      leftScore: 0,
      rightScore: 0
    };
  }
  handleKeyDown = (e) => {
    if (e.type === "keydown" || e.type === "keyup") {
      const isPressed = e.type === "keydown" ? true : false;
      switch (e.key) {
        case "ArrowLeft":
          this.setState({
            leftArrowPressed: isPressed
          });
          break;
        case "ArrowRight":
          this.setState({
            rightArrowPressed: isPressed
          });
          break;
        case "a":
          this.setState({
            aPressed: isPressed
          });
          break;
        case "d":
          this.setState({
            dPressed: isPressed
          });
          break;
        default:
          break;
      }
    }
  };
  drawCanvas = () => {
    this.movePlayers();
    this.setState((prevState) => ({
      ballX: prevState.ballX + prevState.ballVelX,
      ballY: prevState.ballY + prevState.ballVelY
    }));
    this.goalCheck();
    this.collisionCheck();
    updateBoard({
      ...this.state
    });
  };
  collisionCheck() {
    const { ballY, ballX } = this.state;
    const { ball } = GameConfig;
    if (this.playerCollisionCheck()) {
      this.setState((prevState) => ({
        ballVelX: -prevState.ballVelX * ball.speedUpRatio,
        ballVelY: -prevState.ballVelY * ball.speedUpRatio
      }));
    } else if (ballY >= GameConfig.board.height || ballY <= 0) {
      this.setState((prevState) => ({
        ballVelY: -prevState.ballVelY
      }));
    }
    if (ballX >= GameConfig.board.width || ballX <= 0) {
      this.setState((prevState) => ({
        ballVelX: -prevState.ballVelX
      }));
    }
  }
  playerCollisionCheck() {
    const { ballY, ballX, playerLy, playerRy } = this.state;
    const { board, player } = GameConfig;
    var playerX =
      ballX < board.width / 2
        ? player.distFromGoal
        : board.width - player.distFromGoal;
    var playerY = ballX < board.width / 2 ? playerLy : playerRy;
    return (
      ballX <= playerX + player.width &&
      ballY <= playerY + player.height &&
      ballX >= playerX &&
      ballY >= playerY
    );
  }
  movePlayers() {
    const { player, board } = GameConfig;
    if (this.state.leftArrowPressed && this.state.playerLy >= 0) {
      this.setState((prevState) => ({
        playerLy: prevState.playerLy - player.speed
      }));
    }
    if (
      this.state.rightArrowPressed &&
      this.state.playerLy + player.height <= board.height
    ) {
      this.setState((prevState) => ({
        playerLy: prevState.playerLy + player.speed
      }));
    }
    if (this.state.dPressed && this.state.playerRy >= 0) {
      this.setState((prevState) => ({
        playerRy: prevState.playerRy - player.speed
      }));
    }
    if (
      this.state.aPressed &&
      this.state.playerRy + player.height <= board.height
    ) {
      this.setState((prevState) => ({
        playerRy: prevState.playerRy + player.speed
      }));
    }
  }
  goalCheck() {
    const { ballY, ballX } = this.state;
    const { goal, board } = GameConfig;
    const side = ballX < board.width / 2 ? "rightScore" : "leftScore";
    if (ballX <= 0 || ballX >= board.width) {
      if (ballY < goal.bottomPoleY && ballY > goal.upperPoleY) {
        this.setState((prevState) => ({
          [side]: prevState[side] + 1,
          ...this.getDefaultBoardState()
        }));
      }
    }
  }
  getDefaultBoardState() {
    return {
      playerLy: GameConfig.player.startY,
      playerRy: GameConfig.player.startY,
      ballY: GameConfig.board.height / 2,
      ballX: GameConfig.board.width / 2,
      ballVelX: GameConfig.ball.startSpeed,
      ballVelY: GameConfig.ball.startSpeed
    };
  }
  handleRestartGame = () => {
    this.setState(
      {
        ...this.getDefaultBoardState(),
        time: 0,
        isGameRunning: false,
        leftScore: 0,
        rightScore: 0
      },
      () => {
        updateBoard({
          ...this.state
        });
        clearInterval(this.boardTimerID);
        clearInterval(this.clockTimerID);
      }
    );
  };
  handleStart = () => {
    if (this.state.isGameRunning) {
      clearInterval(this.boardTimerID);
      clearInterval(this.clockTimerID);
    } else {
      this.boardTimerID = setInterval(this.drawCanvas, 1000 / 60);
      this.clockTimerID = setInterval(() => {
        this.setState((prevState) => ({
          time: prevState.time + 1
        }));
      }, 1000);
    }
    this.setState((prevState) => ({
      isGameRunning: !prevState.isGameRunning
    }));
  };
  render() {
    return (
      <div className="App">
        <div className="Timer">
          {this.state.time > 59 ? Math.floor(this.state.time / 60) + " m" : ""}{" "}
          {this.state.time % 60} s
        </div>
        <Canvas handleKeyDown={this.handleKeyDown} />
        <GameControl
          isGameRunning={this.state.isGameRunning}
          score={this.state.leftScore + " : " + this.state.rightScore}
          restartGame={this.handleRestartGame}
          toggleStart={this.handleStart}
        />
        <div className="Controls" hidden={this.state.isGameRunning}>
          <p>
            <b>Controls:</b>
          </p>
          <ul>
            <li>Left player: Left arrow, Right arrow</li>
            <li>Right plalyer: A,D</li>
          </ul>
        </div>
      </div>
    );
  }
}
