const star = {
  // 使用具有命名空间的vuex模块
  namespaced: true,
  // 返回该模式下存储的应用状态
  state() {
    return {
      imgOne: true,
      imgTwo: true,
      imgThree: true,
    };
  },
  mutations: {
    // 修改第一个img路径
    setImgOne(state, payload) {
      state.imgOne = payload;
    },
    // 修改第2个img路径
    setImgTwo(state, payload) {
      state.imgTwo = payload;
    },
    // 修改第3个img路径
    setImgThree(state, payload) {
      state.imgThree = payload;
    },
  },
};
export default star;
