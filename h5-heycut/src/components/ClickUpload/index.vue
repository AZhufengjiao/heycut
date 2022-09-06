<template>
  <!-- 点击上传虚线组件 -->
  <div class="click-upload">
    <button>+点击上传视频</button>
  </div>
</template>

<script setup></script>

<style lang="less" scoped>
.click-upload {
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 1.66rem;
  border-radius: 0.12rem;
  border: 0.03rem dashed rgba(5, 68, 255, 0.32);

  button {
    width: 1.85rem;
    height: 0.44rem;
    background: linear-gradient(90deg, #b77af6 0%, #5566ff 100%);
    border-radius: 0.12rem;
    border: none;

    font-size: 0.16rem;
    font-family: AlimamaShuHeiTi;
    color: #fff;
    line-height: 0.16rem;
  }
}
</style>
