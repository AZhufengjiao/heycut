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
      <img :src="gifObj.fileName" alt="" />
    </div>
    <div class="button-box">
      <div class="download-btn">
        <div><button>下载GIF</button></div>
        <div class="div-style">&yen;1.00去水印</div>
      </div>
      <div class="new-make"><button>重新制作</button></div>
    </div>
  </div>

  <!-- 选择压缩大小弹出框 -->
  <compressSizeModal
    :modalObj="CompressModalObj"
    @updateFlag="compressSizeFlag"
    @moreNum="handleMoreNum"
  ></compressSizeModal>
</template>

<script setup>
import { ref, reactive, watch, onUnmounted, computed, onMounted } from "vue";
import loadingModal from "@/components/modal/loadingModal"; // 上传 upload弹出框
import compressSizeModal from "@/components/modal/compressSize/index.vue"; // 选择压缩大小弹出框
// 视频插件
import { videoPlay } from "vue3-video-play";
// 接口
import {
  getUploadProof,
  componentVideo,
  getCompressSchedule,
  getWatermarkSchedule,
} from "@/api/compress.js";
import { useStore } from "vuex";
import axios from "axios";
components: {
  loadingModal, videoPlay, compressSizeModal;
}
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
// 请求参数 token key
let requestObj = ref(null);
// 压缩轮训定时器
let compressTimer = ref(null);
// 压缩大小
let compressSize = computed(() => store.state.compress.size);
// gif 图片  无码和有码
let gifObj = ref(null);

// 遮罩层变量           ------------upload弹出框遮罩层
let modalObj = ref({
  flag: false,
});
// 遮罩层变量           ------------选择压缩大小弹出框遮罩层
let CompressModalObj = ref({
  flag: false,
});

onMounted(() => {
  current.value = "1M";
  store.commit("compress/setSize", "1M");
});

// 1. 点击跳转样式，切换选中             ----- 上
const handleComress = (num, num2) => {
  // 如果点击是更多，打开弹出框
  if (num2 === 3) {
    // 打开弹出框
    CompressModalObj.value.flag = true;
  } else {
    // 让更多为空
    moreNum.value = null;
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

// 1.点击上传视频按钮，打开file文件夹    ------ 下
const handleUplaod = () => {
  fileDom.value.click();
};
// 2.input change事件
const FileChange = (e) => {
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
    if (res.data.code == 200) {
      // 先清除定时器
      clearInterval(compressTimer.value);
      compressTimer.value = null;
      // 赋值添加水印需要的wmPid
      requestObj.value.wmPid = res.data.data.data.wmPid;

      // 再轮训添加水印进度
      compressTimer.value = window.setInterval(() => {
        getWatermarkPlan();
      }, 1000);
    }
  });
};

// 6.添加水印进度查询
const getWatermarkPlan = async () => {
  let wmPid = requestObj.value.wmPid;
  return await getWatermarkSchedule(wmPid).then((res) => {
    if (res.data.code == 200) {
      // 清除定时器
      clearInterval(compressTimer.value);
      compressTimer.value = null;

      gifObj.value = res.data.data;
      gifObj.value.fileName =
        "http://wap.img.soogif.com/" + gifObj.value.fileName;
      console.log(gifObj.value);

      // 关闭弹出框
      modalObj.value.flag = false;
    }
  });
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
    height: 1.66rem;
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
      border-radius: 0px 0px 0.12rem 0.12rem;
      div {
        position: relative;
        // clip-path: inset(0 0 round 5px);
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
