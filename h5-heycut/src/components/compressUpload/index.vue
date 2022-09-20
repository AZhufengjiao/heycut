<template>
  <div>
    <!-- 点击上传虚线组件 -->
    <div class="click-upload">
      <button @click="handleUplaod">
        <span> + 点击上传视频 </span>
      </button>

      <input
        ref="fileDom"
        type="file"
        style="display: none"
        name="uoload"
        accept="video/*"
        @change="FileChange"
      />
      <loadingModal :modalObj="modalObj"></loadingModal>
    </div>

    <!-- 压缩完成 -->
    <!-- <div class="compress-succeed">
      <div class="video-box">
        <vue3VideoPlay v-bind="options" :poster="videoUrl" />
      </div>
      <div class="button-box">
        <div class="download-btn">
          <div><button>下载GIF</button></div>
          <div class="div-style">&yen;1.00去水印</div>
        </div>
        <div class="new-make"><button>重新制作</button></div>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { ref, reactive, watch, onUnmounted } from "vue";
import loadingModal from "@/components/modal/loadingModal";
// 视频插件
import { videoPlay } from "vue3-video-play";
// 接口
import { getUploadProof, componentVideo } from "@/api/compress.js";
import { useStore } from "vuex";
components: {
  loadingModal, videoPlay;
}
const store = useStore();
// file Dom            ---------file数据
let fileDom = ref(null);

// 视频url             ------------video数据
let videoUrl = ref(null);

// 1.点击上传视频按钮，打开file文件夹
const handleUplaod = () => {
  fileDom.value.click();
};
// 2.input change事件
const FileChange = (e) => {
  if (e.target.files[0].type.indexOf("video/") > -1) {
    console.log(e.target.files[0].type);
    getUploadVoucher();
    setCompressRequest();
  } else {
    console.log("-1");
  }
};

// 获取上传凭证
const getUploadVoucher = async () => {
  return await getUploadProof().then((res) => {
    if (res.data.code == 200) {
      store.commit("compress/setToken", res.data.data);
    }
  });
};

const setCompressRequest = async () => {
  let obj = {
    fileName: store.state.compress.token.token,
    keepScale: 1,
    limitSize: 200,
    type: "S_1M",
  };
  return await componentVideo(obj).then((res) => {
    console.log(res);
  });
};

// 遮罩层变量           ------------弹出框遮罩层
let modalObj = ref({
  flag: false,
});
// 打开弹出框
const handleBtn = () => {
  // modalObj.value.flag = true;
};
</script>

<style lang="less" scoped>
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
          position: absolute;
          border: none;
          background: #fff;
          top: 2px;
          left: 2px;
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
      width: 308px;
      height: 44px;
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
        top: 2px;
        left: 2px;
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
  font-size: 20px;
  font-family: sans-serif;
  touch-action: none;
  box-sizing: border-box;
}
</style>
