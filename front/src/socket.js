import { io } from "socket.io-client";
import {
  blackTimer,
  connected,
  gameOver,
  gameStarted,
  myTurn,
  playerColor,
  rematch,
  room,
  roomNotValid,
  whiteTimer,
} from "./reactives";
const serverURL = parseInt(import.meta.env.VITE_PROD)
  ? undefined
  : "http://localhost:3000";

export const socket = io(serverURL);

socket.on("connected", () => {
  connected.value = true;
});

socket.on("joined", () => {
  let randomVal = Math.round(Math.random());
  playerColor.value = randomVal === 1 ? "w" : "b";
  gameStarted.value = true;
  room.value = `room-${socket.id}`;
  if (playerColor.value === "w") {
    myTurn.value = true;
    socket.emit("allPlayersReady", room.value, "b");
  } else {
    socket.emit("allPlayersReady", room.value, "w");
  }
});

socket.on("gameIsReady", (gameRoom, color) => {
  room.value = gameRoom;
  playerColor.value = color;
  gameStarted.value = true;
  gameOver.value = undefined;
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

socket.on("disconnected", () => {
  connected.value = false;
  console.log("disconnected");
});
