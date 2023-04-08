<script setup>
import {
  updateBoard,
  getSquareColor,
  selectPiece,
  unselectPiece,
  handleMove,
} from "../modules/game";
import { playerColor, board } from "../reactives";
import ChessSquare from "./ChessSquare.vue";
function handleAction(action, cord, square) {
  switch (action) {
    case "select":
      selectPiece(cord, square);
      break;
    case "unselect":
      unselectPiece(cord);
      break;
    case "movement":
      handleMove(cord, square);
      break;
    default:
      break;
  }
}
updateBoard();
</script>

<template>
  <div :class="playerColor === 'w' ? 'board' : 'boardReverse'">
    <div class="row" v-for="(row, rowIndex) in board" :key="rowIndex">
      <ChessSquare
        v-for="(position, columnIndex) in row"
        :key="columnIndex"
        :square="position.square"
        :color="getSquareColor(position.square)"
        :piece="position.type ? position.type : null"
        :pieceColor="position.color ? position.color : null"
        :state="position.state"
        :cord="{ x: rowIndex, y: columnIndex }"
        @action="handleAction"
      ></ChessSquare>
    </div>
  </div>
</template>

<style>
.row {
  display: flex;
}
.board {
  width: 640px;
  height: 640px;
}
.boardReverse {
  width: 640px;
  height: 640px;
  display: flex;
  flex-direction: column-reverse;
}
</style>
