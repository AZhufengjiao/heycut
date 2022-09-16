import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "@/assets/styles/common.less";
// 视频插件
import vue3videoPlay from "vue3-video-play"; // 引入组件
import "vue3-video-play/dist/style.css"; // 引入css
import Vant from "vant";
// 2. 引入组件样式
import "vant/lib/index.css";
import store from "./store";
import interact from "interactjs";

createApp(App)
  .use(interact)
  .use(vue3videoPlay)
  .use(store)
  .use(Vant)
  .use(router)
  .mount("#app");
