<template>
  <div v-if="gifObj == null">
    <!-- 选择压缩大小 -->
    <div class="compress-size">
      <h2>选择需要压缩的大小</h2>
      <ul>
        <li @click="handleComress('1M')" :class="{ liStyle: current === '1M' }">
          1M-表情包
        </li>
        <!--  表情包&lt;1M -->
        <li @click="handleComress('5M')" :class="{ liStyle: current === '5M' }">
          5M-公众号
        </li>
        <li
          @click="handleComress(moreNum, 3)"
          :class="{ liStyle: current === moreNum && moreNum != null }"
        >
          {{ moreNum !== null ? moreNum : "更多" }}
        </li>
      </ul>
    </div>
    <!-- 点击上传虚线组件 -->
    <div class="click-upload">
      <button @click="handleUplaod">
        <span> + 点击上传视频 </span>
      </button>

      <input
        ref="fileDom"
        type="file"
        style="display: none"
        name="upload"
        accept="image/gif"
        @change="FileChange"
      />
      <loadingModal :modalObj="modalObj"></loadingModal>
    </div>
  </div>
  <!-- 压缩完成 -->
  <div class="compress-succeed" v-else>
    <div class="video-box">
      <img
        :src="!buttonState.flag ? gifObj.newWmFileName : gifObj.newFileName"
        alt=""
      />
    </div>
    <div class="button-box">
      <div class="download-btn">
        <div v-if="!buttonState.flag">
          <button @click="downloadImg" >
            下载GIF
          </button>
        </div>
        <div
          :style="{ width: buttonState.flag ? '100%' : '1.49rem' }"
          class="div-style"
          @click="handlePay"
        >
          {{
            !buttonState.flag
              ? buttonState.title
              : "立即下载无水印GIF（已支付）"
          }}
        </div>
      </div>
      <div class="new-make"><button @click="anewMake">重新制作</button></div>
    </div>
  </div>

  <!-- 滑动画面 -->
  <SlideModule v-if="gifObj == null"></SlideModule>

  <!-- 选择压缩大小弹出框 -->
  <compressSizeModal
    :modalObj="CompressModalObj"
    @updateFlag="compressSizeFlag"
    @moreNum="handleMoreNum"
  ></compressSizeModal>

  <!-- 提示文字弹出框 -->
  <promptModal
    :modalObj="Titlemodal"
    @updateFlag="compressTitleFlag"
  ></promptModal>
</template>

<script setup>
import { ref, reactive, watch, onUnmounted, computed, onMounted } from "vue";
import loadingModal from "@/components/modal/loadingModal"; // 上传 upload弹出框
import compressSizeModal from "@/components/modal/compressSize/index.vue"; // 选择压缩大小弹出框
import promptModal from "@/components/modal/promptModal/index.vue"; // 提示文字弹出框
import SlideModule from "@/components/SlideModule/index.vue"; // 滑动画面
// 视频插件
import { videoPlay } from "vue3-video-play";
// 压缩接口
import {
  getUploadProof,
  componentVideo,
  getCompressSchedule,
  getWatermarkSchedule,
  dataRecord,
} from "@/api/compress.js";
// 支付接口
import {
  createRecord,
  inquireImgPayState,
  getJSAPIParams,
  h5PlaceOrder,
  OrderStatusQuery,
} from "@/api/pay.js";
import { useStore } from "vuex";
import axios from "axios";
// components: {
//   loadingModal, videoPlay, compressSizeModal, SlideModule, promptModal;
// }
const store = useStore();
// file Dom            ---------file数据
let fileDom = ref(null);
// file 文件数据
let files = ref(null);

// 样式跳转
let current = ref("1M");
// 更多 的数据
let moreNum = ref(null);

// 视频url             ------------gif数据
let gifUrl = ref(null);
// 支付 button 状态
let buttonState = ref({
  flag: false, // 支付状态
  title: `¥1.00去水印`,
});
// 请求参数 token key
let requestObj = ref(null);
// 压缩轮训定时器
let compressTimer = ref(null);
// 压缩大小
let compressSize = computed(() => store.state.compress.size);
// gif 图片  无码和有码
let gifObj = ref(null);
// gifObj.value.payState               支付状态参数变量
// gifObj.value.newWmFileName          拼接有水印url
// gifObj.value.newFileName            拼接没有水印url
// gifObj.value.mId                    创建制作记录返回的参数
// gifObj.value.h5PayObj               非微信请求跳转支付链接 准备拼接 参数

// 遮罩层变量           ------------upload弹出框遮罩层
let modalObj = ref({
  flag: false,
});
// 遮罩层变量           ------------选择压缩大小弹出框遮罩层
let CompressModalObj = ref({
  flag: false,
});
//                      ------------提示文字弹出框遮罩层
let Titlemodal = ref({
  flag: false,
  title: "提示",
  content: "图片格式错误，请上传gif图片",
});
// 让弹出框关闭         ------------  提示文字关闭弹出框遮罩层
const compressTitleFlag = (flag) => {
  Titlemodal.value.flag = flag;
  // 清空input缓存
  fileDom.value.value = null;
};

// 0
onMounted(() => {
  current.value = "1M";
  store.commit("compress/setSize", "1M");

  let str2 =
    "http://demo-mobile.soogif.com/compress?uniqueId=undefined&out_trade_no=34ec717acad9488f9f0d4edf67d3a4cd";

  // 查看用户是否打开微信支付
  // 打开
  // if (str2.indexOf("uniqueId") > -1) {
  if (window.location.href.indexOf("uniqueId") > -1) {
    // 先获取需要的参数
    let uniqueId = decodeURIComponent(
      window.location.search.substring(1).split("&")[0].split("=")[1]
    );
    let out_trade_no = decodeURIComponent(
      window.location.search.substring(1).split("&")[1].split("=")[1]
    );
    // let uniqueId = str2.split("?")[1].split("&")[0].split("=")[1];

    // let out_trade_no = str2.split("?")[1].split("&")[1].split("=")[1];
    // 已支付
    // 图片支付状态
    buttonState.value.flag = true;

    // 查询图片支付状态
    inquireImgPayStateFn(uniqueId);
    // 订单状态查询
    orderState(out_trade_no);
  } else {
    // 未打开
    buttonState.value.flag = false;
  }
});

// 0.1 查询图片支付状态
const inquireImgPayStateFn = async (str) => {
  return await inquireImgPayState(str).then((res) => {
    console.log(res);
    // console.log("http://wap.img.soogif.com/" + res.data.data.wmFileName); //有logo
    // console.log("http://wap.img.soogif.com/" + res.data.data.fileName);
    // 已支付
    if (res.data.code == 200) {
      // 调用已支付
      buttonState.value.flag = true;
      gifObj.value = {};
      gifObj.value.newFileName =
        "http://wap.img.soogif.com/" + res.data.data.fileName;
      console.log(gifObj.value);
    }
    // 未支付
    else if (res.data.code == 201) {
      buttonState.value.flag = false;
      gifObj.value = {};
      gifObj.value.newWmFileName =
        "http://wap.img.soogif.com/" + res.data.data.wmFileName;
    }

    // 修改样式 ***
    store.commit("star/setImgOne", false);
    // 修改i的样式
    document.querySelector(".iStyle").style.background = "#836ffa";
    store.commit("star/setImgTwo", false);
    // 修改i的样式
    document.querySelectorAll(".i").forEach((item) => {
      item.style.background = "#836ffa";
    });
  });
};

// 0.2 订单状态查询
const orderState = async (out_trade_no) => {
  axios({
    method: "post",
    url: "http://demo-mobile.soogif.com/wap/app-api/pay/wx/payStatusJS",
    params: {
      memberId: store.state.user.userObj.id,
      out_trade_no,
    },
  }).then((res) => {
    console.log(res);
  });

  // let obj = {
  //   memberId: store.state.user.userObj.id,
  //   out_trade_no,
  // };
  // return await OrderStatusQuery(obj).then((res) => {
  //   console.log(res);
  // });
};

// 1. 点击跳转样式，切换选中             ----- 上 选择压缩大小
const handleComress = (num, num2) => {
  // 如果点击是更多，打开弹出框
  if (num2 === 3) {
    // 打开弹出框
    CompressModalObj.value.flag = true;
  }
  if (num !== null) {
    current.value = num;
    store.commit("compress/setSize", num);
  }
};

// 子组件传来用户选中的大小
const handleMoreNum = (num) => {
  moreNum.value = num;
  current.value = num;
  store.commit("compress/setSize", num);
};

// 让弹出框关闭
const compressSizeFlag = (flag) => {
  CompressModalObj.value.flag = flag;
};

// 1.点击上传视频按钮，打开file文件夹    ------ 下 上传压缩
const handleUplaod = () => {
  buttonState.value.flag = false;
  fileDom.value.click();
};
// 2.input change事件
const FileChange = (e) => {
  // 先判断是否是gif图片
  if (e.target.files[0].type === "image/gif") {
    // 用户选择url
    gifUrl.value = e.target.files[0].name;

    // 跳转样式  ***
    store.commit("star/setImgOne", false);
    // 修改i的样式
    document.querySelector(".iStyle").style.background = "#836ffa";
    //  存储上传的gif文件数据
    files.value = e.target.files[0];

    if (e.target.files[0].type.indexOf("image/gif") > -1) {
      // 获取上传凭证
      getUploadVoucher();
      // 打开弹出框
      modalObj.value.flag = true;
    } else {
      // console.log("-1");
    }
  } else {
    // 不是gif文件，让提示文字弹出框弹出
    Titlemodal.value.flag = true;
    console.log(Titlemodal.value.flag);
  }
};

// 3.获取上传凭证
const getUploadVoucher = () => {
  return new Promise(() => {
    getUploadProof().then((res) => {
      if (res.data.code == 200) {
        requestObj.value = res.data.data;
        //  发起七牛上传接口
        let uploadForm = new FormData();
        uploadForm.append("key", requestObj.value.key);
        uploadForm.append("token", requestObj.value.token);
        uploadForm.append("file", files.value);

        axios({
          method: "post",
          url: "https://up.qiniup.com",
          data: uploadForm,
        }).then((res) => {
          requestObj.value.key = res.data.key;
          setCompressRequest();
        });
      }
    });
  });
};

// 4.提交压缩请求
const setCompressRequest = async () => {
  let obj = {
    fileName: requestObj.value.key,
    keepScale: 1,
    limitSize: 200,
    type: "S_" + compressSize.value,
  };
  return await componentVideo(obj).then((res) => {
    if (res.data.code == 200) {
      // 存储查询进度要用的id
      requestObj.value.persistentId = res.data.data;

      // 轮训 查看压缩进度
      compressTimer.value = window.setInterval(() => {
        queryCompressSchedule();
      }, 1000);
    }
  });
};

// 5.压缩进度查询
const queryCompressSchedule = async () => {
  let persistentId = requestObj.value.persistentId;
  return await getCompressSchedule(persistentId).then((res) => {
    // 压缩成功
    if (res.data.code == 200) {
      // 存储压缩状态
      gifObj.value = res.data.data.data;
      // 拼接有水印url
      gifObj.value.newWmFileName =
        "http://wap.img.soogif.com/" + gifObj.value.wmFileName;

      // 先清除定时器
      clearInterval(compressTimer.value);
      compressTimer.value = null;

      // 关闭弹出框
      modalObj.value.flag = false;

      // 创建制作记录 先获取支付要用的参数，在轮询支付状态
      createMake();

      // 数据记录
      setDataRecord();

      // 修改样式 ***
      store.commit("star/setImgTwo", false);
      // 修改i的样式
      document.querySelectorAll(".i").forEach((item) => {
        item.style.background = "#836ffa";
      });

      // 再轮训添加水印进度
      // compressTimer.value = window.setInterval(() => {
      //   getWatermarkPlan();
      // }, 1000);
    }
  });
};

// 6.添加水印进度查询    ----------------废弃
const getWatermarkPlan = async () => {
  let wmPid = requestObj.value.wmPid;
  return await getWatermarkSchedule(wmPid).then((res) => {
    if (res.data.code == 200) {
      // 清除定时器
      clearInterval(compressTimer.value);
      compressTimer.value = null;

      gifObj.value = res.data.data;
      gifObj.value.newWmFileName =
        "http://wap.img.soogif.com/" + gifObj.value.wmFileName;
      console.log(gifObj.value);

      // 关闭弹出框
      modalObj.value.flag = false;

      // 数据记录
      setDataRecord();

      // 修改样式 ***
      store.commit("star/setImgTwo", false);
      // 修改i的样式
      document.querySelectorAll(".i").forEach((item) => {
        item.style.background = "#836ffa";
      });
    }
  });
};

// 7.数据记录
const setDataRecord = async () => {
  let url = gifObj.value.fileName;
  return await dataRecord(url).then((res) => {
    if (res.data.code == 200) {
      console.log("数据记录", res);
    }
  });
};

// 8.点击重新制作
const anewMake = () => {
  // 清空所有数据
  gifObj.value = null;

  store.commit("star/setImgTwo", true);
  store.commit("star/setImgThree", true);
  store.commit("star/setImgOne", true);
  document.querySelectorAll(".i").forEach((item) => {
    item.style.background = "#e8eefa";
  });
};

// 9.下载gif到相册
const downloadImg = () => {
  let Url = gifObj.value.newWmFileName; //图片路径，也可以传值进来
  var triggerEvent = "touchstart"; //指定下载方式
  var blob = new Blob([""], { type: "application/octet-stream" }); //二进制大型对象blob
  var url = URL.createObjectURL(blob); //创建一个字符串路径空位
  var a = document.createElement("a"); //创建一个 a 标签
  a.href = Url; //把路径赋到a标签的href上
  //正则表达式，这里是把图片文件名分离出来。拿到文件名赋到a.download,作为文件名来使用文本
  a.download = Url.replace(/(.*\/)*([^.]+.*)/gi, "$2").split("?")[0];
  /* var e = document.createEvent('MouseEvents');  //创建事件（MouseEvents鼠标事件）
	    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null); //初始化鼠标事件（initMouseEvent已弃用）*/

  //代替方法。创建鼠标事件并初始化（后面这些参数我也不清楚，参考文档吧 https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/MouseEvent）
  var e = new MouseEvent(
    "click",
    (true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
  );
  //派遣后，它将不再执行任何操作。执行保存到本地
  a.dispatchEvent(e);
  //释放一个已经存在的路径（有创建createObjectURL就要释放revokeObjectURL）
  URL.revokeObjectURL(url);
  // console.log(url)
  // window.open(url, '_blank')
};

// 10.点击一块钱去水印，1.创建制作记录，2.查看图片支付状态
const handlePay = () => {
  // 未支付
  if (buttonState.value.flag == false) {
    onBridgeReady();
  }
  // 已支付
  if (buttonState.value.flag == true) {
    // 调用已支付
    let Url = gifObj.value.newFileName; //图片路径，也可以传值进来
    var triggerEvent = "touchstart"; //指定下载方式
    var blob = new Blob([""], { type: "application/octet-stream" }); //二进制大型对象blob
    var url = URL.createObjectURL(blob); //创建一个字符串路径空位
    var a = document.createElement("a"); //创建一个 a 标签
    a.href = Url; //把路径赋到a标签的href上
    //正则表达式，这里是把图片文件名分离出来。拿到文件名赋到a.download,作为文件名来使用文本
    a.download = Url.replace(/(.*\/)*([^.]+.*)/gi, "$2").split("?")[0];
    /* var e = document.createEvent('MouseEvents');  //创建事件（MouseEvents鼠标事件）
      e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null); //初始化鼠标事件（initMouseEvent已弃用）*/

    //代替方法。创建鼠标事件并初始化（后面这些参数我也不清楚，参考文档吧 https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/MouseEvent）
    var e = new MouseEvent(
      "click",
      (true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    );
    //派遣后，它将不再执行任何操作。执行保存到本地
    a.dispatchEvent(e);
    //释放一个已经存在的路径（有创建createObjectURL就要释放revokeObjectURL）
    URL.revokeObjectURL(url);
  }
};

// 11.创建制作记录
const createMake = async () => {
  let obj = {
    memberId: store.state.user.userObj.id,
    url: "https://wap.img.soogif.com/" + gifObj.value.fileName,
    urlWm: "https://wap.img.soogif.com/" + gifObj.value.wmFileName,
  };
  return await createRecord(obj).then((res) => {
    if (res.data.code == 200) {
      console.log(11111111, res.data.data);
      //  保存mId
      gifObj.value.mId = res.data.data;
      gifObj.value.uniqueId = res.data.data;
    }
  });
};

// 12.1 未支付，微信支付
function onBridgeReady() {
  console.log(store.state.user.loginState);

  // 其他支付 pc端
  if (store.state.user.loginState === "other") {
    wechatNotH5Pay();
  } // 微信支付
  else if (
    store.state.user.loginState === "wechat" ||
    store.state.user.loginState === "wechat-tool"
  ) {
    // 获取需要的参数
    getWeChatPayParams();
  }
}

// 12.1.1 获取微信支付需要的参数
const getWeChatPayParams = async () => {
  let obj = {
    mld: gifObj.value.uniqueId,
    openId: store.state.user.userObj.id,
  };
  console.log(obj);
  return await getJSAPIParams(obj).then((res) => {
    console.log(res);
  });
};

// 12.1.2 非微信支付
const wechatNotH5Pay = async () => {
  console.log(gifObj.value.mId);
  axios({
    method: "post",
    url: "http://demo-mobile.soogif.com/wap/app-api/pay/wx/createUnifiedOrderH5",
    params: {
      memberId: store.state.user.userObj.id,
      mId: gifObj.value.mId,
    },
  }).then((res) => {
    console.log(res);
    if (res.data.code == 200) {
      // gifObj.value.h5PayObj = res.data.data;
      console.log(11111, gifObj.value.uniqueId);

      // 获取数据，跳转支付页面
      let payRedirectUrl =
        res.data.data.mwebUrl +
        "&redirect_url=" +
        encodeURIComponent(
          window.location.origin +
            "/compress?uniqueId=" +
            gifObj.value.uniqueId +
            "&out_trade_no=" +
            res.data.data.out_trade_no
        );

      // 查询图片支付状态
      // inquireImgPayStateFn(gifObj.value.uniqueId);

      window.location.href = payRedirectUrl;
      console.log(payRedirectUrl);
    }
  });

  // return await h5PlaceOrder(obj).then((res) => {
  // });
};
</script>

<style lang="less" scoped>
// 选择压缩大小
.compress-size {
  padding: 0.18rem 0.14rem 0 0.19rem;
  width: 100%;
  height: 1.11rem;
  border: 0.03rem dashed rgba(5, 68, 255, 0.32);
  border-radius: 0.12rem 0.12rem 0 0;
  // border-bottom: none;

  h2 {
    margin-bottom: 0.11rem;
    font-size: 0.12rem;
    font-family: HarmonyOS_Sans_SC;
    color: #121212;
  }
  ul {
    display: flex;
    justify-content: space-between;
    width: 100%;
    li {
      text-align: center;
      width: 1.02rem;
      height: 0.45rem;
      background: rgba(255, 255, 255, 0.4);
      border-radius: 0.08rem;
      border: 0.01rem solid #c8cddf;
      line-height: 0.45rem;
      font-size: 0.14rem;
      font-family: HarmonyOS_Sans_SC_Medium;
      color: #121212;
      font-weight: 600;
    }
    .liStyle {
      color: #fff;
      background: linear-gradient(90deg, #b77af6 0%, #5566ff 100%);
    }
  }
}
// @import url("vue3-video-play/dist/style.css");
// 虚线style
.click-upload {
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 1.43rem;
  border-radius: 0 0 0.12rem 0.12rem;
  border: 0.03rem dashed rgba(5, 68, 255, 0.32);
  border-top: none;
  margin-top: 0.04rem;
  // 去除button默认样式
  button {
    width: 1.85rem;
    height: 0.44rem;
    background: linear-gradient(90deg, #b77af6 0%, #5566ff 100%);
    border-radius: 0.12rem;
    border: none;
    font-size: 0.16rem;
    font-family: AlimamaShuHeiTi;
    color: #fff;
    line-height: 0.16rem;
  }
}

button {
  border: none;
}
// 压缩完成视频
.compress-succeed {
  width: 100%;
  .video-box {
    width: 3.55rem;
    // height: 1.66rem;
    #refPlayerWrap {
      width: 100%;
      height: 100%;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }

  // 按钮div
  .button-box {
    padding-top: 0.24rem;
    padding-bottom: 1.24rem;
    .download-btn {
      display: flex;
      justify-content: space-between;
      padding: 0 0.24rem 0.17rem 0.24rem;
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
          line-height: 92%;
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

    .new-make {
      margin: 0 0.24rem 0.17rem 0.24rem;
      width: 3.08rem;
      height: 0.44rem;
      position: relative;
      text-align: center;
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
        width: 98.6%;
        height: 91%;
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
  }
}

.resize-drag {
  position: relative;
  background: transparent;
  width: 3.22rem;
  height: 0.56rem;
  border-radius: 0.04rem;
  border: 0.05rem solid #af79f7;
  border-left: 0.15rem solid #af79f7;
  border-right: 0.15rem solid #af79f7;
  font-size: 0.2rem;
  font-family: sans-serif;
  touch-action: none;
  box-sizing: border-box;
}
</style>
