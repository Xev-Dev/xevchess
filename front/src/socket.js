import { io } from "socket.io-client";
import {
  blackTimer,
  connected,
  gameOver,
  gameStarted,
  myTurn,
  opponentConnection,
  playerColor,
  reconnectionTimer,
  rematch,
  room,
  roomNotValid,
  whiteTimer,
} from "./reactives";

const environment = import.meta.env.VITE_ENV;
const url =
  environment === "dev"
    ? "http://localhost:3000/"
    : "https://xevchess.duckdns.org/";

export const socket = io(url);
let fenFunction;
let updateFunction;

socket.on("connected", () => {
  connected.value = true;
  import("./modules/game").then((obj) => {
    fenFunction = obj.getFen;
    updateFunction = obj.updateGameStatus;
  });
});

socket.on("joined", () => {
  if (gameStarted.value) {
    socket.emit("stopReconnectionTimer", room.value);
    opponentConnection.value = true;
    let reconnectionItem = {
      fen: fenFunction(),
      room: room.value,
      turn: !myTurn.value,
      color: playerColor.value,
    };
    socket.emit("reconnectOpponent", reconnectionItem);
  } else {
    let randomVal = Math.round(Math.random());
    playerColor.value = randomVal === 1 ? "w" : "b";
    gameStarted.value = true;
    room.value = `room-${socket.id}`;
    opponentConnection.value = true;
    if (playerColor.value === "w") {
      myTurn.value = true;
      socket.emit("allPlayersReady", room.value, "b");
    } else {
      socket.emit("allPlayersReady", room.value, "w");
    }
  }
});

socket.on("reconnectionInfo", (item) => {
  room.value = item.room;
  item.color === "w" ? (playerColor.value = "b") : (playerColor.value = "w");
  myTurn.value = item.turn;
  gameStarted.value = true;
  opponentConnection.value = true;
  updateFunction(item.fen);
});

socket.on("gameIsReady", (gameRoom, color) => {
  room.value = gameRoom;
  playerColor.value = color;
  gameStarted.value = true;
  gameOver.value = undefined;
  opponentConnection.value = true;
  if (playerColor.value === "w") {
    myTurn.value = true;
  }
});

socket.on("gameOver", (status) => {
  gameOver.value = status;
});

socket.on("updateWhiteTimer", (time) => {
  whiteTimer.value = time;
});

socket.on("updateBlackTimer", (time) => {
  blackTimer.value = time;
});

socket.on("timeout", (color) => {
  socket.emit("stopTimers", room.value);
  if (color === playerColor.value) {
    gameOver.value = "You timed out";
  } else {
    gameOver.value = "Win by timeout";
  }
});

socket.on("roomNotValid", () => {
  roomNotValid.value = true;
});

socket.on("rematch", () => {
  rematch.opponent = true;
});

socket.on("updateReconnectionTimer", (timer) => {
  reconnectionTimer.value = timer;
});

socket.on("winByDisconnection", () => {
  socket.emit("stopTimers", room.value);
  gameOver.value = "Win by disconnect";
});

socket.on("disconnected", () => {
  opponentConnection.value = false;
  socket.emit("startReconnectionTimer", room.value);
});
