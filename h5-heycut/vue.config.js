const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  publicPath: "./",
  transpileDependencies: true,
  lintOnSave: false,
  configureWebpack: {
    devServer: {
      proxy: {
        "/wap": {
          target: "http://demo-mobile.soogif.com",
          changeOrigin: true,
        },
      },
      historyApiFallback: {
        index: "/index.html", //与output的publicPath
      },
    },
    resolve: {
      alias: {
        assets: "@/assets",
        api: "@/api",
        views: "@/views",
        components: "@/components",
      },
    },
  },
});
