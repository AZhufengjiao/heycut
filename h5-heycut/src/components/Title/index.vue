<template>
  <!-- 插槽title -->
  <div class="Title">
    <p>
      <slot name="title-p"></slot>
    </p>
    <h1>
      <slot name="title-h1"></slot>
    </h1>
  </div>
</template>

<script setup></script>

<style lang="less" scoped>
.Title {
  margin-bottom: 0.23rem;
  width: 100%;
  text-align: center;
  p {
    margin-top: 0.4rem;
    font-size: 0.26rem;
    font-family: AlimamaShuHeiTi;
    color: #121212;
    font-weight: bold;
  }
  h1 {
    margin-top: 0.1rem;
    font-size: 0.12rem;
    font-family: HarmonyOS_Sans_SC;
    color: #6d6f73;
  }
}
</style>
