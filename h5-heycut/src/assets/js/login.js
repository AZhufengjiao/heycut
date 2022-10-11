import store from "store/index.js";
import { lookLoginInfo, voluntarilyLogin } from "@/api/index.js";

// 1.判断是否登陆
export const lookLogin = async () => {
  let memberId = store.state.user.userObj.id;
  return await lookLoginInfo(memberId).then((res) => {
    // console.log(Object.keys(store.state.user.userObj).length);
    if (
      res.data.code == 200 &&
      Object.keys(store.state.user.userObj).length !== 0
    ) {
      console.log("已登陆");
    } else {
      res.data.code = 201;
    }
    if (res.data.code == 201) {
      console.log("未登陆");
      // console.log( 222,  Object.keys(store.state.user.userObj).length )
      //是否是微信浏览器
      if (/(micromessenger)/i.test(navigator.userAgent)) {
        //是否电脑微信或者微信开发者工具
        if (
          /(WindowsWechat)/i.test(navigator.userAgent) ||
          /(wechatdevtools)/i.test(navigator.userAgent)
        ) {
          console.log("电脑微信或者微信开发者工具");
          WeChatLoginHandle();
          // 存储用户登录方式
          store.commit("user/setLoginState", "wechat-tool");
        } else {
          //手机微信打开的浏览器
          console.log("手机微信");
          WeChatLoginHandle();
          // 存储用户登录方式
          store.commit("user/setLoginState", "wechat");
        }
      } else {
        console.log("其他浏览器");
        voluntarilyLoginHandle();
        // 存储用户登录方式
        store.commit("user/setLoginState", "other");
      }
    }
  });
};
// // 2.1 自动登录
export const voluntarilyLoginHandle = async () => {
  return await voluntarilyLogin().then((res) => {
    console.log("登陆成功");
    if (res.data.code == 200) {
      store.commit("user/setUserObj", res.data.data);
    }
  });
};
// // 2.2 微信登录
export const WeChatLoginHandle = async () => {
  return await WeChatLogin().then((res) => {
    if (res.data.code == 200) {
      store.commit("user/setUserObj", res.data.data);
    }
  });
};

// // 自动登录
// const voluntarilyLoginHandle = async () => {
//   return await voluntarilyLogin().then((res) => {
//     if (res.data.code == 200) {
//       store.commit("user/setUserObj", res.data.data);
//     }
//   });
// };
// // 微信登录
// const WeChatLoginHandle = async () => {
//   return await WeChatLogin().then((res) => {
//     if (res.data.code == 200) {
//       store.commit("user/setUserObj", res.data.data);
//     }
//   });
// };

// // 判断是否登陆
// const lookLogin = async () => {
//   console.log(111);
//   let Id = store.state.user.userObj.id;
//   console.log(Id);
//   return await lookLoginInfo(Id).then((res) => {
//     if (
//       res.data.code == 200 &&
//       Object.keys(store.state.user.userObj).length !== 0
//     ) {
//       console.log("已登陆");
//     } else {
//       res.data.code = 201;
//     }
//     if (res.data.code == 201) {
//       // console.log( 222,  Object.keys(store.state.user.userObj).length )
//       //是否是微信浏览器
//       if (/(micromessenger)/i.test(navigator.userAgent)) {
//         //是否电脑微信或者微信开发者工具
//         if (
//           /(WindowsWechat)/i.test(navigator.userAgent) ||
//           /(wechatdevtools)/i.test(navigator.userAgent)
//         ) {
//           console.log("电脑微信或者微信开发者工具");
//           // 存储用户登录方式
//           store.commit("user/setLoginState", "wechat-tool");
//         } else {
//           //手机微信打开的浏览器
//           console.log("手机微信");
//           WeChatLoginHandle();
//           // 存储用户登录方式
//           store.commit("user/setLoginState", "wechat");
//         }
//       } else {
//         console.log("其他浏览器");
//         voluntarilyLoginHandle();
//         // 存储用户登录方式
//         store.commit("user/setLoginState", "other");
//       }
//     }
//   });
// };
