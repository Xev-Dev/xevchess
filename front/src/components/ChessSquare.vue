<script setup>
import { computed } from "vue";
import { playerColor, myTurn } from "../reactives";

const props = defineProps({
  color: String,
  square: String,
  piece: String,
  pieceColor: String,
  state: String,
  cord: Object,
});

const emit = defineEmits(["action"]);

const squareColor = computed(() => {
  if (props.state === "selected") {
    return "selectedSquare square";
  } else if (props.state === "legalMove") {
    return "legalMoveSquare square";
  } else if (props.state === "enemyMove") {
    return "enemyMoveSquare square";
  } else {
    if (props.color === "light") {
      return "whiteSquare square";
    } else {
      return "blackSquare square";
    }
  }
});

function handleSquareAction() {
  if (
    props.state === "unselected" &&
    props.piece &&
    props.pieceColor === playerColor.value &&
    myTurn.value
  ) {
    emit("action", "select", props.cord, props.square);
  } else if (props.state === "selected") {
    emit("action", "unselect", props.cord);
  } else if (props.state === "legalMove") {
    emit("action", "movement", props.cord, props.square);
  }
}
</script>

<template>
  <div @click="handleSquareAction()" :class="squareColor">
    <img
      alt="Chess piece"
      v-if="piece"
      :src="`/SVG_PIECES/${piece}${pieceColor}.svg`"
      height="60"
    />
  </div>
</template>

<style>
.square {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.selectedSquare {
  background-color: rgb(38, 201, 65);
}
.legalMoveSquare {
  background-color: rgb(173, 193, 49);
}
.enemyMoveSquare {
  background-color: rgb(255, 0, 0);
}
.whiteSquare {
  background-color: rgb(255, 255, 255);
}
.blackSquare {
  background-color: rgb(16, 155, 219);
}
</style>
