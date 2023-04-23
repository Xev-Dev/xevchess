<script setup>
import { useRouter } from "vue-router";
import { socket } from "../socket";
const router = useRouter();
function goToWaitRoom() {
  socket.emit("createRoom", `room-${socket.id}`);
  router.push("/");
}
</script>
<template>
  <div class="notValidWrapper">
    <h1 class="titleNotValid">Im sorry, this link is not available anymore.</h1>
    <button @click="goToWaitRoom()">Get a link</button>
  </div>
</template>
<style>
.notValidWrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  flex-direction: column;
  gap: 20px;
}
</style>
