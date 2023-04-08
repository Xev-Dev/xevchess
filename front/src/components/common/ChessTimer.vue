<script setup>
import { computed } from "vue";
const props = defineProps({
  time: Number,
});
const timeFormated = computed(() => {
  const minutes = Math.floor(props.time / 60);
  const seconds = props.time - minutes * 60;
  let result = `${minutes}:${seconds}`;
  if (result.length < 4) {
    return `${minutes}:0${seconds}`;
  } else {
    return result;
  }
});
</script>

<template>
  <div class="time">{{ timeFormated }}</div>
</template>

<style>
.time {
  font-size: x-large;
  color: black;
  padding: 0 5px;
}
</style>
