<script setup>
const props = defineProps({
  piecesCaptured: Array,
});
</script>

<template>
  <div class="piecesWrapper">
    <img
      v-for="(piece, index) in props.piecesCaptured"
      :key="index"
      :src="`/SVG_PIECES/${piece.type}${piece.color}.svg`"
      width="20"
      height="20"
    />
  </div>
</template>

<style>
.piecesWrapper {
  display: flex;
  height: 100%;
  align-items: center;
}
</style>
