import { createStore } from "vuex";
import compress from "@/store/compress";
import star from "@/store/star"; // 动画 ：上传 拼接 下载
// 持久化数据 vuex-persistedstate 插件
import createPersistedState from "vuex-persistedstate";

export default createStore({
  plugins: [
    createPersistedState({
      // 数据存储在 localStorage 时的 key
      key: "soogif",
      // 指定将哪些模块中的数据同步到本地
      paths: ["compress", "star"],
    }),
  ],
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: { compress, star },
});
