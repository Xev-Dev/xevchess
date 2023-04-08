<script setup>
import { resetGame, updateBoard } from "../modules/game";
import {
  rematchReset,
  resetReactives,
  room,
  rematch,
  myTurn,
} from "../reactives";
import { socket } from "../socket";
import { useRouter } from "vue-router";
import { watch } from "vue";
import { playerColor } from "../reactives";
import { gameOver } from "../reactives";
const router = useRouter();
defineProps({
  status: String,
});
function handleReset() {
  resetReactives();
  resetGame();
  socket.disconnect();
  socket.connect();
  router.push("/");
}
function handleRematch() {
  socket.emit("rematch", room.value);
  rematch.me = true;
}
watch(rematch, (newValue) => {
  console.log("im here");
  if (newValue.me && newValue.opponent) {
    rematchReset();
    resetGame();
    if (playerColor.value === "w") {
      let randomVal = Math.round(Math.random());
      playerColor.value = randomVal === 1 ? "w" : "b";
      if (playerColor.value === "w") {
        myTurn.value = true;
        socket.emit("allPlayersReady", room.value, "b");
      } else {
        socket.emit("allPlayersReady", room.value, "w");
      }
    }
    gameOver.value = undefined;
    updateBoard();
  }
});
</script>

<template>
  <div class="modalWrapper">
    <div class="modal">
      <h1 class="modalTitle">{{ status }}</h1>
      <div class="buttonWrapper">
        <button @click="handleRematch">Rematch</button>
        <button @click="handleReset">Get a new link</button>
      </div>
    </div>
  </div>
</template>

<style>
.modalWrapper {
  opacity: 0.8;
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 640px;
  height: 640px;
  margin-top: 30px;
}

.modal {
  background-color: white;
  width: 50%;
  height: 30%;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  border-radius: 3px;
}

.modalTitle {
  color: black;
  text-align: center;
}
.buttonWrapper {
  display: flex;
  justify-content: space-around;
  padding: 5px;
}

.buttonWrapper button {
  background-color: black;
  width: 100px;
  height: 30px;
  border: none;
  border-radius: 3px;
}
</style>
