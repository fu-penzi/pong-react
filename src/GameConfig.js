const GameConfig = {
  board: {
    width: 550,
    height: 300
  },
  player: {
    width: 10,
    height: 100,
    distFromGoal: 20,
    startY: 100,
    speed: 5
  },
  ball: {
    radius: 10,
    startSpeed: 4,
    speedUpRatio: 1.1
  },
  goal: {
    upperPoleY: 30,
    bottomPoleY: 270
  }
};
export default GameConfig;
