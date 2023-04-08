<script setup>
import { playerColor } from "../reactives";
import { handleCoronation } from "../modules/game";
let coronationArray = ["n", "b", "r", "q"];
</script>

<template>
  <div class="coronationWrapper">
    <div class="bubbleWrapper">
      <button
        v-for="(letter, index) in coronationArray"
        :key="index"
        @click="handleCoronation(letter)"
      >
        <img
          alt="Chess piece"
          :src="`/SVG_PIECES/${letter}${playerColor}.svg`"
          width="27"
        />
      </button>
    </div>
  </div>
</template>

<style>
.bubbleWrapper {
  display: flex;
  justify-content: space-around;
  gap: 10px;
}
.bubbleWrapper button {
  background-color: gold;
  width: 70px;
  height: 70px;
  border: none;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.coronationWrapper {
  opacity: 0.7;
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 640px;
  height: 640px;
  margin-top: 30px;
}
</style>
