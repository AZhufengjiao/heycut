import { requestWithoutToken } from "@/utils/request";

/** 自动注册登录
 */
export function voluntarilyLogin() {
  return requestWithoutToken("/wap/app-api/member/auth/auto", "post");
}

/** 微信登录
 * @returns
 */
export function WeChatLogin() {
  return requestWithoutToken("/wap/app-api/member/auth/wx", "post");
}

/** 判断用户是否登陆
 * @param {*} tenant-id     租户编号
 * @returns
 */
export function lookLoginInfo(Id) {
  let formData = new FormData();
  formData.append("tenant-id", Id);
  return requestWithoutToken(
    "/wap/app-api/member/auth/check",
    "post",
    formData
  );
}
