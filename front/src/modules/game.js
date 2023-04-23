import { Chess } from "chess.js";
import {
  board,
  coronation,
  enemyPiecesCaptured,
  gameOver,
  myTurn,
  piecesCaptured,
  playerColor,
  room,
} from "../reactives";
import { socket } from "../socket";

const chess = new Chess();
const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];

let selectedPiece = { x: null, y: null };
let legalMovesHistory = [];
let enemyMoves = [];

export function updateBoard() {
  board.value = [];
  board.value = [...chess.board()];
  for (let i = 0; i < board.value.length; i++) {
    for (let j = 0; j < board.value.length; j++) {
      if (board.value[i][j] === null) {
        board.value[i][j] = {
          square: `${letters[j]}${board.value.length - i}`,
        };
      }
      board.value[i][j].state = "unselected";
    }
  }
}

export function updateGameStatus(fen) {
  chess.load(fen);
  updateBoard();
}

export function getSquareColor(square) {
  return chess.squareColor(square);
}

export function getFen() {
  return chess.fen();
}

export function selectPiece(cord, square) {
  if (selectedPiece.x !== null) {
    unselectPiece(selectedPiece);
  }
  board.value[cord.x][cord.y].state = "selected";
  selectedPiece = { ...cord };
  let legalMoves = [...chess.moves({ square: square })];
  legalMoves.forEach((move) => {
    if (move === "O-O") {
      let square = undefined;
      let row = undefined;
      if (playerColor.value === "w") {
        board.value[7][7].state = "legalMove";
        square = board.value[7][7].square;
        row = 7;
      } else {
        board.value[0][7].state = "legalMove";
        square = board.value[0][7].square;
        row = 0;
      }
      legalMovesHistory.push({
        move: move,
        square: square,
        row: row,
      });
    } else if (move === "O-O-O") {
      let square = undefined;
      let row = undefined;
      if (playerColor.value === "w") {
        board.value[7][0].state = "legalMove";
        square = board.value[7][0].square;
        row = 7;
      } else {
        board.value[0][0].state = "legalMove";
        square = board.value[0][0].square;
        row = 0;
      }
      legalMovesHistory.push({
        move: move,
        square: square,
        row: row,
      });
    } else {
      let letterArray = move.match(/[a-h]/g);
      let letter = letterArray[letterArray.length - 1];
      let row = parseInt(move.match(/[1-8]/g)[0]);
      let square = board.value[8 - row].find(
        (element) => element.square === letter + row
      );
      if (square) {
        square.state = "legalMove";
        legalMovesHistory.push({
          row: 8 - row,
          letter: letter,
          square: letter + row,
          move: move,
        });
      }
    }
  });
}

export function unselectPiece(cord) {
  board.value[cord.x][cord.y].state = "unselected";
  unsetLegalMoves();
}

export function handleMove(cord, square) {
  let legalMove = legalMovesHistory.find(
    (element) => element.square === square
  );
  let position = board.value[cord.x][cord.y];
  if (position.type !== undefined && position.color !== playerColor.value) {
    piecesCaptured.value.push({ type: position.type, color: position.color });
  }
  let move = legalMove.move;
  if (move.includes("=")) {
    coronation.x = 8 - legalMove.row;
    coronation.y = letters.indexOf(legalMove.letter);
    coronation.move = move;
    coronation.cord = cord;
  } else {
    doMovement(move, cord);
  }
}

export function handleCoronation(letter) {
  if (coronation.move.includes("+")) {
    coronation.move = coronation.move.slice(0, -2);
  } else {
    coronation.move = coronation.move.slice(0, -1);
  }
  coronation.move += letter.toUpperCase();
  doMovement(coronation.move, { x: coronation.cord.x, y: coronation.cord.y });
  unsetCoronation();
}

function doMovement(move, cord) {
  chess.move(move);
  updateBoard();
  socket.emit("move", room.value, move, {
    init: selectedPiece,
    end: { x: cord.x, y: cord.y },
  });
  unsetLegalMoves();
  unsetEnemyMoves();
  unsetCoronation();
  myTurn.value = false;
}

export function resetGame() {
  chess.reset();
  enemyMoves = [];
  selectedPiece = { x: null, y: null };
  legalMovesHistory = [];
}

function unsetLegalMoves() {
  legalMovesHistory.forEach((move) => {
    let square = board.value[move.row].find(
      (element) => element.square === move.square
    );
    if (square) {
      square.state = "unselected";
    }
  });
  legalMovesHistory = [];
  setEnemyMoves();
}

function unsetEnemyMoves() {
  enemyMoves.forEach((move) => {
    board.value[move.x][move.y].state = "unselected";
  });
  enemyMoves = [];
}

function setEnemyMoves() {
  enemyMoves.forEach((move) => {
    board.value[move.x][move.y].state = "enemyMove";
  });
}

function unsetCoronation() {
  coronation.x = undefined;
  coronation.y = undefined;
  coronation.move = undefined;
  coronation.cord = undefined;
}

socket.on("enemyMove", (move, position) => {
  let square = board.value[position.end.x][position.end.y];
  if (square.color === playerColor.value) {
    enemyPiecesCaptured.value.push({
      type: square.type,
      color: square.color,
    });
  }
  chess.move(move);
  enemyMoves.push(position.init);
  enemyMoves.push(position.end);
  updateBoard();
  setEnemyMoves();
  if (chess.isGameOver()) {
    socket.emit("stopTimers", room.value);
    if (chess.isDraw()) {
      gameOver.value = "Draw by insufficient material or repetition";
      socket.emit(
        "gameOver",
        room.value,
        "Draw by insufficient material or repetition"
      );
    }
    if (chess.isStalemate()) {
      gameOver.value = "Draw by stalemate";
      socket.emit("gameOver", room.value, "Stalemate!");
    }
    if (chess.isCheckmate()) {
      gameOver.value = "You've been checkmated";
      socket.emit("gameOver", room.value, "Checkmate!");
    }
  } else {
    socket.emit("toggleTimer", room.value, playerColor.value);
    myTurn.value = true;
  }
});
