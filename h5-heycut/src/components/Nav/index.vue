<template>
  <div class="nav">
    <!-- 左边 -->
    <div class="nav-left">
      <img src="" alt="" />
      <span>SOOGIF</span>
    </div>
    <!-- 右边 -->
    <div class="nav-right" @click="handleShow">
      <img src="@/assets/img/icon-more/more.png" alt="" />
    </div>

    <van-popup
      v-model:show="popupFlag"
      position="top"
      :style="{ height: '100%' }"
    >
      <div class="del" @click="handleHide">
        <img src="@/assets/img/icon-more/del.png" alt="" />
      </div>

      <ul>
        <li @click="handleToggle('compress')">GIF压缩</li>
        <i></i>
        <li @click="handleToggle('convert')">GIF转换</li>
        <i></i>
        <li @click="handleToggle('record')">我的制作</li>
      </ul>
    </van-popup>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
// 弹出层flag
let popupFlag = ref(false);

// 点击右上角，弹出弹出层
const handleShow = () => {
  popupFlag.value = true;
};
// 点击弹出层右上角x，隐藏弹出框
const handleHide = () => {
  popupFlag.value = false;
};

// 点击li，跳转路由且关闭弹窗
const handleToggle = (params) => {
  // 跳转路由
  router.push(params);
  // 关闭弹出层
  popupFlag.value = false;
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

  // 遮罩层黑色去掉
  ::v-deep .van-overlay {
    background: none !important;
  }
  ::v-deep .van-popup {
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(10px);
    .del {
      position: absolute;
      width: 0.24rem;
      height: 0.24rem;
      top: 0.18rem;
      right: 0.15rem;
    }
    ul {
      width: 100%;
      margin-top: 0.5rem;
      li {
        text-align: center;
        width: 100%;
        height: 0.95rem;
        line-height: 0.95rem;
        font-size: 26px;
        font-family: AlimamaShuHeiTi;
        color: #121212;
        font-weight: 600;
      }
      i {
        display: block;
        width: 46px;
        height: 1px;
        border-top: 1px solid #979797;
        margin: auto;
      }
    }
  }
}
</style>
