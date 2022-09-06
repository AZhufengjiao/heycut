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
    </div>
  </div>
</template>

<script setup>
import Nav from "@/components/Nav/index.vue"; // 顶部导航组件
import Title from "@/components/Title/index.vue"; // 标题组件
import FlickerAnimation from "@/components/FlickerAnimation/index.vue"; // 闪烁动画组件
import ClickUpload from "@/components/ClickUpload/index.vue"; // 击上传虚线组件
import SlideModule from "@/components/SlideModule/index.vue"; // 滑动画面
</script>

<style lang="less" scoped>
// @import url("@/assets/css/Index/index-375px.less");
.conversion {
  width: 100%;
  height: 8.97rem;

  // 版心
  .container {
    margin: auto;
    width: 3.55rem;
  }
}
</style>
