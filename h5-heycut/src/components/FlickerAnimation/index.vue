<template>
  <!-- 闪烁动画 -->
  <div class="flicker-animation">
    <ul>
      <li>
        <div><img src="" alt="" /></div>

        <h1>1.上传</h1>
      </li>
      <li><i></i><i></i><i></i></li>
      <li>
        <div><img src="" alt="" /></div>

        <h1>1.上传</h1>
      </li>
      <li><i></i><i></i><i></i></li>
      <li>
        <div><img src="" alt="" /></div>

        <h1>1.上传</h1>
      </li>
    </ul>
  </div>
</template>

<script setup></script>

<style lang="less" scoped>
.flicker-animation {
  margin-bottom: 0.2rem;
  padding: 0.15rem 0.3rem;
  width: 3.55rem;
  height: 1.18rem;
  background: #ffffff;
  border-radius: 0.12rem;
  border: 0.01rem solid rgba(255, 238, 221, 0.34);
  backdrop-filter: blur(0.1rem);
  ul {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    li {
      text-align: center;
      div {
        margin-bottom: 0.07rem;
        width: 0.64rem;
        height: 0.64rem;
        background: linear-gradient(
          180deg,
          rgba(255, 255, 255, 0.4) 0%,
          rgba(235, 239, 252, 0.4) 100%
        );
        border-radius: 0.32rem;
        border: 0.01rem solid #ebeffc;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      h1 {
        font-size: 0.12rem;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #121212;
      }
      i {
        margin: 0.29rem 0.02rem 0;
        width: 0.06rem;
        height: 0.06rem;
        display: inline-flex;
        background: #e8eefa;
        border-radius: 50%;
      }
    }
  }
}
</style>
