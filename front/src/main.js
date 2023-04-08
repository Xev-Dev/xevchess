import { addIcons, OhVueIcon } from "oh-vue-icons";
import { CoCopy } from "oh-vue-icons/icons";
import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import "./style.css";
addIcons(CoCopy);
createApp(App).use(router).component("v-icon", OhVueIcon).mount("#app");
