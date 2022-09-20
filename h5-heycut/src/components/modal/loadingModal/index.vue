<template>
  <div v-if="modalObj.flag" class="loadingmodal">
    <!-- 遮罩层 -->
    <div class="zzc"></div>
    <!-- 弹出框盒子部分 -->
    <div class="loadingmodal-box">
      <van-loading type="spinner"></van-loading>
      <p>压缩中</p>
      <h1>请不要操作页面</h1>
    </div>
  </div>
</template>

<script setup>
import { onUpdated, ref, toRefs, watch } from "vue";
import { Toast } from "vant";
components: {
}
// 父子通讯
const props = defineProps({ modalObj: Object });
const emit = defineEmits(["updateFlag"]);
let { modalObj } = toRefs(props);

// // 退出按钮
// const exitBtnHandle = () => {
//   emit("updateFlag", false);
// };
</script>

<style lang="less" scoped>
// @import url("@/assets/css/modal/download/loadingmodal/download1_1440px.less");
h1,
h2,
h3,
h4,
h5,
h6,
p,
ul {
  margin: 0;
}

.loadingmodal {
  z-index: 99;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  // 遮罩层
  .zzc {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(0px);
  }

  // 弹出框盒子部分
  .loadingmodal-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    position: relative;
    z-index: 10;
    width: 1.6rem;
    height: 1.53rem;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 12px;
    padding-top: 0.3rem;

    // loading图标
    .van-loading,
    .van-loading__spinner,
    .van-loading__spinner--spinner {
      color: #ffff;
      width: 40px !important;
      height: 40px !important;
      display: inline-block;
    }

    // 退出按钮
    .exitBtn {
      position: absolute;
      top: 0;
      right: 0;
      font-size: 14px;
    }
    p,
    h1 {
      text-align: center;
      width: 100%;
      height: 15px;
      color: #fff;
      margin: 0;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 7px;
    }
    h1 {
      margin-top: -15px;
    }
  }
}
</style>
