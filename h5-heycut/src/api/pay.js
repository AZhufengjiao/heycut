import { requestWithoutToken } from "@/utils/request";

/** 查询图片支付状态
 */
export function inquireImgPayState(uniqueId) {
  console.log(uniqueId);
  return requestWithoutToken(
    "/wap/app-api/tools/tool-make-status/checkStatus",
    "get",
    { uniqueId }
  );
}

/** 查询已支付制作图片列表
 */
export function inquireImgHavePaidState(memberId,pageNo,pageSize) {
  return requestWithoutToken(
    "/wap/app-api/tools/tool-make-status/getList",
    "get",
    { memberId,pageNo,pageSize }
  );
}

/** 创建制作记录
 * @param {*} memberId  用户id
 * @param {*} toolType  工具类型
 * @param {*} url       用户制作图片url
 * @param {*} urlWm     用户制作图片带水印Url
 * @returns
 */
export function createRecord({ memberId, url, urlWm }) {
  return requestWithoutToken(
    "/wap/app-api/tools/tool-make-status/save",
    "post",
    { memberId, url, urlWm }
  );
}

/** JSAPI 统一下单 ,获取微信支付需要的参数
 *
 * @param {*} mld  用户id
 * @param {*} openId  登录返的参数
 * @param {*} param0
 * @returns
 */
export function getJSAPIParams({ mld, openId }) {
  let formData = new FormData();
  formData.append("mId", mld);
  formData.append("openId", openId);
  return requestWithoutToken(
    "/wap/app-api/pay/wx/createUnifiedOrder",
    "post",
    formData
  );
}

/** JSAPI 统一下单 ,获取非微信支付需要的参数
 * @param {*} mld  用户id
 * @param {*} memberId
 * @returns
 */
export function getNotJSAPIParams({ memberId, mId }) {
  let formData = new FormData();
  formData.append("memberId", memberId);
  formData.append("mId", mId);
  return requestWithoutToken(
    "/wap/app-api/pay/wx/createUnifiedOrderH5",
    "post",
    formData
  );
}

/** JSAPI 订单状态查询
 * @param {*} memberId  用户id
 * @param {*} out_trade_no  统一下单接口返回的out_trade_no
 * @param {*} param0
 * @returns
 */
export function OrderStatusQuery({ memberId, out_trade_no }) {
  return requestWithoutToken("/wap/app-api/pay/wx/payStatusJS", "post", {
    memberId,
    out_trade_no,
  });
}

/** h5统一下单
 * @param {*} memberId  用户id
 * @param {*} mId
 * @returns
 */
export function h5PlaceOrder({ memberId, mId }) {
  return requestWithoutToken(
    "/wap/app-api/pay/wx/createUnifiedOrderH5",
    "post",
    {
      memberId,
      mId,
    }
  );
}
