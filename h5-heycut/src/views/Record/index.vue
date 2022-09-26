<template>
  <!-- 制作历史记录 -->
  <div class="record">
    <!-- 版心 -->
    <div class="container">
      <!-- 顶部导航 -->
      <Nav></Nav>
      <!-- 标题 -->
      <Title>
        <template v-slot:title-p> 视频转化GIF动图 </template>
      </Title>

      <!-- 记录 -->
      <ul>
        <li>
          <div class="video-img"><img src="" alt="" /></div>
          <div class="download-btn">
            <div><button>下载GIF</button></div>
            <div class="div-style">&yen;1.00去水印</div>
          </div>
        </li>
        <li>
          <div class="video-img"><img src="" alt="" /></div>
          <div class="download-btn">
            <div><button>下载GIF</button></div>
            <div class="div-style">&yen;1.00去水印</div>
          </div>
        </li>
        <li>
          <div class="video-img"><img src="" alt="" /></div>
          <div class="download-btn">
            <div><button>下载GIF</button></div>
            <div class="div-style">&yen;1.00去水印</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import Nav from "@/components/Nav/index.vue"; // 顶部导航组件
import Title from "@/components/Title/index.vue"; // 标题组件
// 接口
import { voluntarilyLogin, WeChatLogin } from "@/api/login.js";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
component: {
  Nav, Title;
}
const store = useStore();

onMounted(() => {
  //是否是微信浏览器
  if (/(micromessenger)/i.test(navigator.userAgent)) {
    //是否电脑微信或者微信开发者工具
    if (
      /(WindowsWechat)/i.test(navigator.userAgent) ||
      /(wechatdevtools)/i.test(navigator.userAgent)
    ) {
      console.log("电脑微信或者微信开发者工具");
    } else {
      //手机微信打开的浏览器
      console.log("手机微信");
      WeChatLoginHandle();
    }
  } else {
    console.log("其他浏览器");
    voluntarilyLoginHandle();
  }
});

// 自动登录
const voluntarilyLoginHandle = async () => {
  return await voluntarilyLogin().then((res) => {
    if (res.data.code == 200) {
      store.commit("user/setUserObj", res.data.data);
    }
  });
};
// 微信登录
const WeChatLoginHandle = async () => {
  return await WeChatLogin().then((res) => {
    if (res.data.code == 200) {
      store.commit("user/setUserObj", res.data.data);
    }
  });
};
</script>
<style lang="less" scoped>
.record {
  width: 100%;
  height: 8.97rem;
  background: linear-gradient(271deg, #e3e8f6, #e5f7f7);
  background-image: url("@/assets/img/bj/background.png");
  background-attachment: fixed;
  background-size: cover;
  overflow: hidden;
  .container {
    margin: auto;
    width: 3.55rem;
    // 标题修改样式
    .Title {
      margin-bottom: 0.36rem;
    }
    // 记录
    ul {
      width: 100%;
      li {
        margin-bottom: 0.15rem;
        width: 100%;
        height: 2.4rem;
        border-radius: 0.12rem;
        .video-img {
          width: 100%;
          height: 1.66rem;
          border-radius: 0.12rem 0.12rem 0 0;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .download-btn {
          display: flex;
          justify-content: space-between;
          padding: 0.15rem 0.24rem;
          height: 0.74rem;
          background: #ffffff;
          border-radius: 0 0 0.12rem 0.12rem;
          div {
            position: relative;
            text-align: center;
            line-height: 0.44rem;
            width: 1.49rem;
            height: 0.44rem;
            background: linear-gradient(
              90deg,
              rgba(183, 122, 246) 0%,
              rgba(85, 102, 255) 100%
            );
            border-radius: 0.12rem;
            border-image: linear-gradient(
                90deg,
                rgba(172, 120, 247, 1),
                rgba(17, 78, 232, 1)
              )
              2 2;
            font-size: 0.16rem;
            font-family: AlimamaShuHeiTi;
            color: #6068fd;
            font-weight: 600;
            button {
              width: 97%;
              height: 92%;
              position: absolute;
              border: none;
              background: #fff;
              top: 0.02rem;
              left: 0.02rem;
              border-radius: 0.12rem;
              font-size: 0.16rem;
              font-family: AlimamaShuHeiTi;
              color: #6068fd;
              font-weight: 600;
            }
          }
          .div-style {
            color: #fff;
            border: none;
          }
        }
      }
    }
  }
}
</style>
