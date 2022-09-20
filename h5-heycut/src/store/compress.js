const compress = {
  // 使用具有命名空间的vuex模块
  namespaced: true,
  // 返回该模式下存储的应用状态
  state() {
    return {
      token: "",
      // 压缩大小
      size: "1M",
    };
  },
  mutations: {
    setToken(state, payload) {
      state.token = payload;
    },
    // 修改压缩大小
    setSize(state, payload) {
      state.size = payload;
    },
  },
};
export default compress;
