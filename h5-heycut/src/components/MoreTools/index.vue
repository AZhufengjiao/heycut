<template>
  <!-- 更多工具 -->
  <div class="more-tools">
    <h1>更多工具</h1>
    <ul>
      <li @click="$router.push('/')">表情制作</li>
      <li @click="$router.push('/compress')">表情制作</li>
      <li @click="$router.push('/record')">表情制作</li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

</script>

<style lang="less" scoped>
.more-tools {
  width: 100%;
  h1 {
    margin-bottom: 0.2rem;
    text-align: center;
    font-size: 0.18rem;
    font-family: AlimamaShuHeiTi;
    color: #020202;
    font-weight: 600;
  }
  ul {
    display: flex;
    justify-content: space-between;
    li {
      width: 1.11rem;
      height: 0.47rem;
      border-radius: 0.06rem;
      text-align: center;
      font-size: 0.18rem;
      font-family: AlimamaShuHeiTi;
      color: #133f5f;
      line-height: 0.47rem;
      font-weight: 600;
      background: linear-gradient(
        135deg,
        rgba(0, 250, 254, 0.2) 0%,
        rgba(79, 172, 254, 0.2) 100%
      );
    }
    li:nth-child(2) {
      background: linear-gradient(
        135deg,
        rgba(56, 249, 215, 0.2) 0%,
        rgba(37, 237, 105, 0.2) 100%
      );
    }
    li:nth-child(3) {
      background: linear-gradient(
        135deg,
        rgba(249, 85, 25, 0.2) 0%,
        rgba(245, 119, 87, 0.2) 100%
      );
    }
  }
}
</style>
