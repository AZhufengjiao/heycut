const user = {
  // 使用具有命名空间的vuex模块
  namespaced: true,
  // 返回该模式下存储的应用状态
  state() {
    return {
      // 用户登录获取的数据
      userObj: {},
      // 登录状态  ，就是用什么登录方式  other:其他浏览器   wechat：微信登录   wechat-tool：微信开发者工具
      loginState: "",
    };
  },
  mutations: {
    // 修改第一个img路径
    setUserObj(state, payload) {
      state.userObj = payload;
    },
    // 修改登录状态
    setLoginState(state, payload) {
      state.loginState = payload;
      console.log(payload);
    },
  },
};
export default user;
