<script setup>
import { notifySound } from "../modules/game";
import { reconnectionTimer } from "../reactives";
notifySound();
</script>
<template>
  <p class="reconnectionMessage">
    Opponent's disconnected! Waiting reconnection: {{ reconnectionTimer }}
  </p>
</template>
<style>
.reconnectionMessage {
  font-size: 15px;
  position: absolute;
  top: 0.5rem;
  left: 1rem;
}
</style>
