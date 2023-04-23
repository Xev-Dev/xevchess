<script setup>
import { connected, gameStarted } from "../reactives";
import { socket } from "../socket";
import { watch } from "vue";
import CustomLoading from "../components/common/CustomLoading.vue";
import { useRouter } from "vue-router";
const router = useRouter();
const environment = import.meta.env.VITE_ENV;
const url =
  environment === "dev"
    ? "http://localhost:5173/"
    : "https://xevchess.duckdns.org/";
watch(connected, (newValue) => {
  if (newValue) {
    socket.emit("createRoom", `room-${socket.id}`);
  }
});
watch(gameStarted, (newValue) => {
  if (newValue) {
    router.push(`room-${socket.id}`);
  }
});
function copyUrl() {
  navigator.clipboard.writeText(`${url}room-${socket.id}`);
}
</script>

<template>
  <div class="waitRoomWrapper">
    <CustomLoading v-if="!connected" />
    <div class="urlWrapper" v-else>
      <h1 class="titleUrl">Send this link to a friend to play a chess game</h1>
      <div class="urlContainer">{{ `${url}room-${socket.id}` }}</div>
      <button @click="copyUrl()" class="copyButton">
        <v-icon name="co-copy"></v-icon>
      </button>
    </div>
  </div>
</template>

<style>
.urlWrapper,
.waitRoomWrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}
.urlWrapper {
  width: 100%;
  flex-direction: column;
  gap: 20px;
}
.waitRoomWrapper {
  height: 100%;
}
.urlContainer {
  width: 50%;
  border: 1px solid gray;
  border-radius: 5px;
  text-align: center;
  padding: 5px 0;
}
.copyButton {
  padding: 10px;
}
</style>
