<template>
  <!-- 2022.9.6 创建项目 -->
  <!-- <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav> -->
  <router-view />
</template>

<style lang="less" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
// loading图标
.van-loading,
.van-loading__spinner,
.van-loading__spinner--spinner {
  width: 0.4rem !important;
  height: 0.4rem !important;
}
</style>
