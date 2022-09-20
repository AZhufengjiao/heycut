const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    proxy: {
      "/wap": {
        target: "http://demo-mobile.soogif.com",
        changeOrigin: true,
      },
    },
  },
});
