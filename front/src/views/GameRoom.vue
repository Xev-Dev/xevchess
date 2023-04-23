<script setup>
import {
  reconnectionTimer,
  opponentConnection,
  connected,
  roomNotValid,
  gameStarted,
  gameOver,
  coronation,
  playerColor,
  whiteTimer,
  blackTimer,
  piecesCaptured,
  enemyPiecesCaptured,
} from "../reactives";
import { socket } from "../socket";
import { useRoute, useRouter } from "vue-router";
import { watch } from "vue";
import CustomLoading from "../components/common/CustomLoading.vue";
import ChessBoard from "../components/ChessBoard.vue";
import GameOverModal from "../components/GameOverModal.vue";
import CoronationModal from "../components/CoronationModal.vue";
import ChessTimer from "../components/common/ChessTimer.vue";
import CaptureList from "../components/common/CaptureList.vue";
const route = useRoute();
const router = useRouter();
watch(connected, (newValue) => {
  if (newValue) {
    socket.emit("joinRoom", route.params.roomId);
  }
});
watch(roomNotValid, (newValue) => {
  if (newValue) {
    router.push("/room_not_valid");
  }
});
</script>

<template>
  <div class="gameRoomWrapper">
    <CustomLoading v-if="!gameStarted"></CustomLoading>
    <div v-else class="gameRoom">
      <GameOverModal
        v-if="gameOver !== undefined"
        :status="gameOver"
      ></GameOverModal>
      <CoronationModal v-if="coronation.x !== undefined"></CoronationModal>
      <p class="reconnectionMessage" v-if="!opponentConnection">
        Opponent's disconnected! Waiting reconnection: {{ reconnectionTimer }}
      </p>
      <div class="gameInfoWrapper topRadius reverse">
        <ChessTimer
          :time="playerColor === 'w' ? blackTimer : whiteTimer"
        ></ChessTimer>
        <CaptureList :piecesCaptured="enemyPiecesCaptured"></CaptureList>
      </div>
      <ChessBoard></ChessBoard>
      <div class="gameInfoWrapper bottomRadius">
        <ChessTimer
          :time="playerColor === 'w' ? whiteTimer : blackTimer"
        ></ChessTimer>
        <CaptureList :piecesCaptured="piecesCaptured"></CaptureList>
      </div>
    </div>
  </div>
</template>

<style>
.gameRoomWrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.gameInfoWrapper {
  display: flex;
  justify-content: space-between;
  height: 30px;
  align-items: center;
  background-color: rgb(174, 171, 171);
}
.topRadius {
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
}
.bottomRadius {
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
}
.reverse {
  flex-direction: row-reverse;
}
.reconnectionMessage {
  font-size: 15px;
  position: absolute;
  top: 0.5rem;
  left: 1rem;
}
</style>
