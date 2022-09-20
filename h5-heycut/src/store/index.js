import { createStore } from "vuex";
import compress from "@/store/compress";
// 持久化数据 vuex-persistedstate 插件
import createPersistedState from "vuex-persistedstate";

export default createStore({
  plugins: [
    createPersistedState({
      // 数据存储在 localStorage 时的 key
      key: "soogif",
      // 指定将哪些模块中的数据同步到本地
      paths: ["compress"],
    }),
  ],
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: { compress },
});
