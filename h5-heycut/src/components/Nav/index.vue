<template>
  <div class="nav">
    <!-- 左边 -->
    <div class="nav-left">
      <img src="" alt="" />
      <span @click="handle">SOOGIF</span>
    </div>
    <!-- 右边 -->
    <div class="nav-right">
      <img src="@/assets/img/icon-more/more.png" alt="" />
    </div>
  </div>
</template>

<script setup>
const handle = () => {
  console.log(123);
};
</script>

<style lang="less" scoped>
// @import url("@/assets/css/nav/nav-375px.less");
.nav {
  width: 100%;
  height: 0.44rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // 左边
  .nav-left {
    display: flex;
    align-items: center;
    margin-left: 0.14rem;
    img {
      width: 0.24rem;
      height: 0.24rem;
      margin-right: 0.06rem;
    }
    span {
      font-size: 0.2rem;
      font-family: Futura-Bold, Futura;
      font-weight: bold;
      color: #121212;
    }
  }
  // 右边
  .nav-right {
    width: 0.2rem;
    height: 0.16rem;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
