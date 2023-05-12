import { reactive, ref } from "vue";
export const room = ref("");
export const connected = ref(false);
export const opponentConnection = ref(false);
export const gameStarted = ref(false);
export const board = ref([]);
export const playerColor = ref("");
export const myTurn = ref(false);
export const piecesCaptured = ref([]);
export const enemyPiecesCaptured = ref([]);
export const gameOver = ref(undefined);
export const whiteTimer = ref(300);
export const blackTimer = ref(300);
export const roomNotValid = ref(false);
export const reconnectionTimer = ref(30);
export const rematch = reactive({ me: undefined, opponent: undefined });
export const coronation = reactive({
  x: undefined,
  y: undefined,
  move: undefined,
  cord: undefined,
});

export const resetReactives = () => {
  room.value = "";
  connected.value = false;
  gameStarted.value = false;
  playerColor.value = "";
  gameOver.value = undefined;
  rematchReset();
};
export const rematchReset = () => {
  board.value = [];
  myTurn.value = false;
  coronation.x = undefined;
  coronation.y = undefined;
  coronation.move = undefined;
  coronation.cord = undefined;
  piecesCaptured.value = [];
  enemyPiecesCaptured.value = [];
  whiteTimer.value = 300;
  blackTimer.value = 300;
  opponentConnection.value = true;
};
