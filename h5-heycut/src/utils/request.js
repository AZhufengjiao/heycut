import axios from "axios";

// 2.创建 baseURL 变量用于存储基准的请求地址
import baseUrl from "./config";
// const baseUrl = "http(s)://up.qiniup.com";

//1.创建一个新的axios 实例对象 专门用来配置相关的请求、
const instanceWithoutToken = axios.create({
  baseUrl,
});

//不携带token响应拦截
// instanceWithoutToken.interceptors.response.use((response) => {
//   return response.data;
// });

// 用于生成请求配置的函数
function generateRequestConfig(url, method, data) {
  return {
    url,
    method,
    [method === "get" ? "params" : "data"]: data,
  };
}

//用于发送普通请求 不带token
export function requestWithoutToken(url, method, data) {
  return instanceWithoutToken(generateRequestConfig(url, method, data));
}
