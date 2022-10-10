import store from "store/index.js";
import axios from "axios";
// 12.1 未支付，选择支付方式
/**
 *
 * @param {*} uniqueId  每个订单的创建制作记录id
 */
export const onBridgeReady = (uniqueId) => {
  console.log(store.state.user.loginState);
  //   // 其他支付 pc端
  if (store.state.user.loginState === "other") {
    wechatNotH5Pay(uniqueId);
  } // 微信支付
  else if (
    store.state.user.loginState === "wechat" ||
    store.state.user.loginState === "wechat-tool"
  ) {
    // 获取需要的参数
    // getWeChatPayParams();
  }
};

// 12.1.1 获取微信支付需要的参数
const getWeChatPayParams = async () => {
  let obj = {
    mld: gifObj.value.uniqueId,
    openId: store.state.user.userObj.id,
  };
  console.log(obj);
  return await getJSAPIParams(obj).then((res) => {
    console.log(res);
  });
};

// 12.1.2 非微信支付
const wechatNotH5Pay = async (uniqueId) => {
  console.log(uniqueId);
  axios({
    method: "post",
    url: "http://demo-mobile.soogif.com/wap/app-api/pay/wx/createUnifiedOrderH5",
    params: {
      memberId: store.state.user.userObj.id,
      mId: uniqueId,
    },
  }).then((res) => {
    console.log(res);
    if (res.data.code == 200) {
      console.log(11111, uniqueId);

      // 获取数据，跳转支付页面
      let payRedirectUrl =
        res.data.data.mwebUrl +
        "&redirect_url=" +
        encodeURIComponent(
          window.location.origin +
            "/compress?uniqueId=" +
            uniqueId +
            "&out_trade_no=" +
            res.data.data.out_trade_no
        );

      //   window.location.href = payRedirectUrl;
      console.log(payRedirectUrl);
    }
  });

  // return await h5PlaceOrder(obj).then((res) => {
  // });
};
