<template>
  <!-- 提示文字弹出框 -->
  <div class="loadingmodal" v-if="modalObj.flag">
    <!-- 遮罩层 -->
    <div class="zzc"></div>

    <!-- 弹出框盒子部分 -->
    <div class="download1-box">
      <h1>{{ modalObj.title }}</h1>
      <p>{{ modalObj.content }}</p>

      <van-button type="primary" @click="exitBtnHandle">确定</van-button>
    </div>
  </div>
</template>

<script setup>
import { onUpdated, ref, toRefs, watch } from "vue";
components: {
}
// 父子通讯
const props = defineProps({ modalObj: Object });
const emit = defineEmits(["updateFlag"]);
let { modalObj } = toRefs(props);
// 退出按钮
const exitBtnHandle = () => {
  emit("updateFlag", false);
};

// 父组件代码// 遮罩层变量           ------------弹出框遮罩层
// <compressSize
//     :modalObj="modalObj"
//     @updateFlag="compressSizeFlag"
//   ></compressSize>
// // 遮罩层变量
// let modalObj = ref({
//   flag: false,
// });
// // 打开弹出框
// const handleBtn = () => {
//   modalObj.value.flag = true;
//   console.log(modalObj.value.flag);
// };
// // 让弹出框关闭
// const compressSizeFlag = (flag) => {
//   console.log(flag);
//   modalObj.value.flag = flag;
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
    background: rgba(244, 244, 244, 0.7);
    // background: #f4f4f4;
    backdrop-filter: blur(0);
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
    border-radius: 0.12rem;
    padding-top: 0.3rem;

    // loading图标
    .van-loading,
    .van-loading__spinner,
    .van-loading__spinner--spinner {
      color: #ffff;
      width: 0.4rem !important;
      height: 0.4rem !important;
      display: inline-block;
    }

    // 退出按钮
    .exitBtn {
      position: absolute;
      top: 0;
      right: 0;
      font-size: 0.14rem;
    }
    p,
    h1 {
      text-align: center;
      width: 100%;
      height: 0.15rem;
      color: #fff;
      margin: 0;
      font-size: 0.14rem;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 0.07rem;
    }
    h1 {
      margin-top: -0.15rem;
    }
  }

  // 弹出框盒子部分
  .download1-box {
    padding: 0.36rem 0.21rem 0;
    text-align: center;
    position: relative;
    z-index: 10;
    width: 3.21rem;
    height: 1.8rem;
    background: #fff;
    box-shadow: 0 0.01rem 0.05rem 0 rgba(0, 0, 0, 0.06);
    border-radius: 0.12rem;
    // 退出按钮
    .exitBtn {
      position: absolute;
      top: 0.1rem;
      right: 0.1rem;
      font-size: 0.14rem;
      img {
        display: inline-block;
        width: 0.12rem !important;
        height: 0.12rem !important;
      }
    }
    button {
      margin-top: 0.24rem;
      width: 1.14rem;
      height: 0.36rem;
      background: #0544ff;
      border-radius: 0.06rem;
    }
    h1 {
      margin-bottom: 0.12rem;
      font-size: 0.15rem;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #333333;
      line-height: 0.15rem;
    }

    ul {
      width: 100%;
      display: flex;
      justify-content: space-between;
      li {
        width: 0.86rem;
        height: 0.38rem;
        border-radius: 0.06rem;
        border: 0.01rem solid #bebdbd;
        line-height: 0.38rem;
        font-size: 0.14rem;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
      }
      .liStyle {
        border: 0.01rem solid #0544ff;
        color: #0544ff;
      }
    }
  }
}
</style>
