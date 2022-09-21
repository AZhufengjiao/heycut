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
