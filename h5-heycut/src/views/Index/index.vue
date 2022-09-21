<template>
  <!-- 视频转化 -->
  <div class="conversion">
    <!-- 版心 -->
    <div class="container">
      <!-- 顶部导航 -->
      <Nav></Nav>
      <!-- 标题 -->
      <Title>
        <template v-slot:title-p> 视频转化GIF动图 </template>
        <template v-slot:title-h1> 只需三步，1分钟将视频转为GIF </template>
      </Title>
      <!-- 闪烁动画 -->
      <FlickerAnimation></FlickerAnimation>
      <!-- 点击上传虚线组件 -->
      <ClickUpload></ClickUpload>
      <!-- 滑动画面 -->
      <SlideModule></SlideModule>
      <!-- 更多工具 -->
      <MoreTools></MoreTools>
    </div>
  </div>
</template>

<script setup>
import Nav from "@/components/Nav/index.vue"; // 顶部导航组件
import Title from "@/components/Title/index.vue"; // 标题组件
import FlickerAnimation from "@/components/FlickerAnimation/index.vue"; // 闪烁动画组件
import ClickUpload from "@/components/ClickUpload/index.vue"; // 击上传虚线组件
import SlideModule from "@/components/SlideModule/index.vue"; // 滑动画面
import MoreTools from "@/components/MoreTools/index.vue"; // 更多工具
// 接口
import { voluntarilyLogin, WeChatLogin } from "@/api/login.js";
import { onMounted, ref } from "vue";
component: {
  Nav, Title, FlickerAnimation, ClickUpload, SlideModule, MoreTools;
}

onMounted(() => {
  //是否是微信浏览器
  if (/(micromessenger)/i.test(navigator.userAgent)) {
    //是否电脑微信或者微信开发者工具
    if (
      /(WindowsWechat)/i.test(navigator.userAgent) ||
      /(wechatdevtools)/i.test(navigator.userAgent)
    ) {
      alert("电脑微信或者微信开发者工具");
    } else {
      //手机微信打开的浏览器
      console.log("手机微信");
      WeChatLoginHandle();
    }
  } else {
    console.log("其他浏览器");
    voluntarilyLoginHandle();
  }
});

// 自动登录
const voluntarilyLoginHandle = async () => {
  return await voluntarilyLogin().then((res) => {
    if (res.data.code == 200) {
      console.log(res.data.data);
    }
  });
};
// 微信登录
const WeChatLoginHandle = async () => {
  return await WeChatLogin().then((res) => {
    if (res.data.code == 200) {
      console.log(res.data.data);
    }
  });
};
</script>

<style lang="less" scoped>
// @import url("@/assets/css/Index/index-375px.less");
.conversion {
  width: 100%;
  padding-bottom: 0.56rem;
  // height: 8.97rem;
  background: linear-gradient(271deg, #e3e8f6, #e5f7f7);
  background-image: url("@/assets/img/bj/background.png");
  background-attachment: fixed;
  background-size: cover;
  // 版心
  .container {
    margin: auto;
    width: 3.55rem;
  }
}
</style>
