<template>
  <!-- 压缩页面 -->
  <div class="compress">
    <!-- 版心 -->
    <div class="container">
      <!-- 顶部导航 -->
      <Nav></Nav>
      <!-- 标题 -->
      <Title>
        <template v-slot:title-p> GIF压缩 </template>
        <template v-slot:title-h1> 只需1步，10s压缩GIF到指定大小 </template>
      </Title>
      <!-- 闪烁动画 -->
      <FlickerAnimation></FlickerAnimation>
      <!-- 选择压缩大小 -->
      <div class="compress-size">
        <h2>选择需要压缩的大小</h2>
        <ul>
          <li @click="handleComress(1)" :class="{ liStyle: current === 1 }">
            表情包&lt;1M
          </li>
          <li @click="handleComress(2)" :class="{ liStyle: current === 2 }">
            表情包&lt;M
          </li>
          <li @click="handleComress(3)" :class="{ liStyle: current === 3 }">
            更多
          </li>
        </ul>
      </div>
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
import { ref } from "vue";
component: {
  Nav, Title, FlickerAnimation, ClickUpload, SlideModule, MoreTools;
}
let current = ref(1);
const handleComress = (num) => {
  current.value = num;
};
</script>

<style lang="less" scoped>
.compress {
  width: 100%;
  height: 10.01rem;
  background: linear-gradient(271deg, #e3e8f6, #e5f7f7);
  .container {
    margin: auto;
    width: 3.55rem;
    height: 100%;
    // 选择压缩大小
    .compress-size {
      padding: 0.18rem 0.14rem 0 0.19rem;
      width: 100%;
      height: 1.11rem;
      border: 0.03rem dashed rgba(5, 68, 255, 0.32);
      border-radius: 0.12rem 0.12rem 0 0;
      h2 {
        margin-bottom: 0.11rem;
        font-size: 0.12rem;
        font-family: HarmonyOS_Sans_SC;
        color: #121212;
      }
      ul {
        display: flex;
        justify-content: space-between;
        width: 100%;
        li {
          text-align: center;
          width: 1.02rem;
          height: 0.45rem;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 8px;
          border: 0.01rem solid #c8cddf;
          line-height: 0.45rem;
          font-size: 0.14rem;
          font-family: HarmonyOS_Sans_SC_Medium;
          color: #121212;
          font-weight: 600;
        }
        .liStyle {
          color: #fff;
          background: linear-gradient(90deg, #b77af6 0%, #5566ff 100%);
        }
      }
    }
    // 击上传虚线组件
    .click-upload {
      margin-top: 0.04rem;
      border-top: none;
      height: 1.43rem;
      border-radius: 0 0 0.12rem 0.12rem;
    }
  }
}
</style>
