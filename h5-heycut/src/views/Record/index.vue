<template>
  <!-- 制作历史记录 -->
  <div class="record">
    <!-- 版心 -->
    <div class="container">
      <!-- 顶部导航 -->
      <Nav></Nav>
      <!-- 标题 -->
      <Title>
        <template v-slot:title-p> 我的制作GIF库</template>
      </Title>

      <!-- 记录 -->
      <ul>
        <lazy-component>
          <li v-for="item in gifList" :key="item.createAt" v-lazy="item.url">
            <template v-if="item.url">
              <div class="video-img">
                <img
                  :src="!item.payStatus === 0 ? item.url : item.urlWm"
                  alt=""
                />
              </div>
              <div class="download-btn">
                <div><button>下载GIF</button></div>
                <div
                  :style="{ width: item.payStatus !== 0 ? '100%' : '1.49rem' }"
                  class="div-style"
                  @click="handlePay(item)"
                >
                  {{
                    item.payStatus === 0
                      ? "¥1.00去水印"
                      : "立即下载无水印GIF（已支付）"
                  }}
                </div>
              </div>
            </template>
          </li>
        </lazy-component>
      </ul>
    </div>
  </div>
</template>

<script setup>
import Nav from "@/components/Nav/index.vue"; // 顶部导航组件
import Title from "@/components/Title/index.vue"; // 标题组件
// 接口
import { voluntarilyLogin, WeChatLogin, lookLoginInfo } from "@/api/login.js";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
// 支付接口
import { inquireImgHavePaidState } from "@/api/pay.js";

// 支付 js pay 逻辑代码
import { onBridgeReady } from "@/assets/js/pay.js";
// 下载图片 js 逻辑代码
import { downLoadimg } from "@/assets/js/downLoadImg.js";
component: {
  Nav, Title;
}
const store = useStore();

// 我的制作列表
let gifList = ref([]);
// 分页数据
let pagingObj = ref({
  pageNo: 1, // 当前显示多少页
  pageSize: 10, // 每页显示多少行
  total: 10, // 总数
});

onMounted(() => {
  // 查看是否登陆，没登陆就登陆
  lookLogin();

  if (store.state.user.userObj.id.length !== 0) {
    // 登录了就获取数据
    payTrue();
  }
});

// 1.判断是否登陆
const lookLogin = async () => {
  let memberId = store.state.user.userObj.id;
  let { pageNo, pageSize } = pagingObj.value;
  return await lookLoginInfo(memberId, pageNo, pageSize).then((res) => {
    if (
      res.data.code == 200 &&
      Object.keys(store.state.user.userObj).length !== 0
    ) {
      console.log("已登陆");
    } else {
      res.data.code = 201;
    }
    if (res.data.code == 201) {
      // console.log( 222,  Object.keys(store.state.user.userObj).length )
      //是否是微信浏览器
      if (/(micromessenger)/i.test(navigator.userAgent)) {
        //是否电脑微信或者微信开发者工具
        if (
          /(WindowsWechat)/i.test(navigator.userAgent) ||
          /(wechatdevtools)/i.test(navigator.userAgent)
        ) {
          console.log("电脑微信或者微信开发者工具");
          // 存储用户登录方式
          store.commit("user/setLoginState", "wechat-tool");
        } else {
          //手机微信打开的浏览器
          console.log("手机微信");
          WeChatLoginHandle();
          // 存储用户登录方式
          store.commit("user/setLoginState", "wechat");
        }
      } else {
        console.log("其他浏览器");
        voluntarilyLoginHandle();
        // 存储用户登录方式
        store.commit("user/setLoginState", "other");
      }
    }
  });
};
// 2.1 自动登录
const voluntarilyLoginHandle = async () => {
  return await voluntarilyLogin().then((res) => {
    if (res.data.code == 200) {
      store.commit("user/setUserObj", res.data.data);
    }
  });
};
// 2.2 微信登录
const WeChatLoginHandle = async () => {
  return await WeChatLogin().then((res) => {
    if (res.data.code == 200) {
      store.commit("user/setUserObj", res.data.data);
    }
  });
};

// 3 查询 我的制作GIF库列表
const payTrue = async () => {
  let memberId = store.state.user.userObj.id;
  return await inquireImgHavePaidState(memberId).then((res) => {
    console.log(res);
    if (res.data.code == 200) {
      // 存储数组
      gifList.value = res.data.data.list;
      // 存储总数
      pagingObj.value.total = res.data.data.total;

      if (gifList.value.length > 0) {
        document.querySelector(".record").style.height = "100%";
      }
      console.log(res.data.data);
    }
  });
};

// 4.点击支付
const handlePay = (item) => {
  console.log(item);
  console.log(item.payStatus);
  // 未支付
  if (item.payStatus == 0) {
    onBridgeReady(item.uniqueId);
  } else if (item.payStatus == 1) {
    // 已支付  下载图片
    downLoadimg(item.urlWm);
  }
};
</script>
<style lang="less" scoped>
.record {
  width: 100%;
  height: 8.97rem;
  // height: 100%;
  background: linear-gradient(271deg, #e3e8f6, #e5f7f7);
  background-image: url("@/assets/img/bj/background.png");
  background-attachment: fixed;
  background-size: cover;
  overflow: hidden;
  .container {
    margin: auto;
    width: 3.55rem;
    // height: 8.97rem;
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
        // height: 2.4rem;
        border-radius: 0.12rem;
        .video-img {
          width: 100%;
          height: 1.66rem;
          border-radius: 0.12rem 0.12rem 0 0;
          // overflow: hidden;
          background: #fff;
          img {
            float: left;
            width: 100%;
            // height: 100% !important;
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
              height: 91%;
              line-height: 91%;
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
