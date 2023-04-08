import { createRouter, createWebHistory } from "vue-router";
import GameRoom from "./views/GameRoom.vue";
import RoomNotValid from "./views/RoomNotValid.vue";
import WaitRoom from "./views/WaitRoom.vue";
const routes = [
  { path: "/", component: WaitRoom },
  { path: "/:roomId", component: GameRoom },
  { path: "/room_not_valid", component: RoomNotValid },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
