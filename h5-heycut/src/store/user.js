const user = {
  // 使用具有命名空间的vuex模块
  namespaced: true,
  // 返回该模式下存储的应用状态
  state() {
    return {
      userObj: {},
    };
  },
  mutations: {
    // 修改第一个img路径
    setUserObj(state, payload) {
      state.userObj = payload;
    },
  },
};
export default user;
