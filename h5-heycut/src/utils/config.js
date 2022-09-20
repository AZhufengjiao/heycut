//  配置开发环境/生产环境
const env = process.env.NODE_ENV;
const config = {
  // 本地（开发环境）
  development: {
    baseURL: "http://localhost:8080",
  },
  // 线上 （生产环境）
  production: {
    baseURL: "http://demo-mobile.soogif.com",
  },
};

export default {
  baseURL: config[env].baseURL,
};
