<template>
  <!-- 闪烁动画 -->
  <div class="flicker-animation">
    <ul>
      <li>
        <div>
          <img class="imgOne" :src="imgOne" alt="" />
        </div>
        <h1>1.上传</h1>
      </li>
      <li>
        <i class="iStyle i"></i>
        <i class="i"></i>
        <i class="i"></i>
      </li>
      <li>
        <div><img :src="imgTwo" alt="" /></div>
        <h1>2.拼接</h1>
      </li>
      <li>
        <i class="i"></i>
        <i></i>
        <i></i>
      </li>
      <li>
        <div><img :src="imgThree" alt="" /></div>
        <h1>3.下载</h1>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
const store = useStore();

onMounted(() => {
  store.commit("star/setImgOne", true);
  store.commit("star/setImgTwo", true);
  store.commit("star/setImgThree", true);
});

const imgOne = computed(() =>
  store.state.star.imgOne
    ? require("@/assets/img/upload-img/upload-one.png")
    : require("@/assets/img/upload-img/wc-one.png")
);
const imgTwo = computed(() =>
  store.state.star.imgTwo
    ? require("@/assets/img/upload-img/upload-two.png")
    : require("@/assets/img/upload-img/wc-two.png")
);
const imgThree = computed(() =>
  store.state.star.imgThree
    ? require("@/assets/img/upload-img/upload-three.png")
    : require("@/assets/img/upload-img/wc-three.png")
);
</script>

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
      .iStyle {
        // color: #836ffa;
        // background: #836ffa;
      }
    }
  }
}
</style>
