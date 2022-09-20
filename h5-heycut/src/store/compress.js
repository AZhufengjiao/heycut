const compress = {
  // 使用具有命名空间的vuex模块
  namespaced: true,
  // 返回该模式下存储的应用状态
  state() {
    return {
      token: "",
    };
  },
  mutations: {
    setToken(state, payload) {
      state.token = payload;
    },
  },
};
export default compress;
