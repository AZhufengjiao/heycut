<template>
  <div style="overflow: hidden">
    <!-- 点击上传虚线组件 -->
    <div class="click-upload" v-if="videoPlayFlag == 1 || videoPlayFlag == 2">
      <button @click="handleUpLoading">
        <span v-if="videoPlayFlag == 1"> + 点击上传视频 </span>
        <div
          v-if="videoPlayFlag == 2"
          style="display: flex; justify-content: center; align-items: center"
        >
          <div>
            <van-loading style="margin-right: 0.08rem" color="#fff" size="40" />
          </div>
          视频处理中
        </div>
      </button>

      <input
        type="file"
        style="display: none"
        name="uoload"
        ref="uploadDom"
        accept="video/*"
        @change="handleFileInput"
      />
      <video
        ref="videoDom"
        controls
        autoplay
        :src="videoUrl"
        @canplaythrough="getVideoDate2"
        :style="{ width: '100%', height: '1.66rem', display: 'none' }"
      ></video>
    </div>

    <!-- <video
      :src="videoUrl"
      ref="videoDom"
      :style="{ height: '100px', width: '100%' }"
      @canplaythrough="myFunction"
    ></video> -->

    <!-- v-show="videoPlayFlag == true" -->
    <div style="opacity: 0" class="video-box">
      <!-- 视频播放 -->
      <div ref="v" class="video-plugIn">
        <!-- <video
          ref="videoDom"
          controls
          autoplay
          :src="videoUrl"
          @canplaythrough="getVideoDate2"
          :style="{ width: '100%', height: '1.66rem' }"
        ></video> -->
        <vue3VideoPlay
          v-if="videoUrl !== null"
          v-bind="options"
          :poster="videoUrl"
          @canplaythrough="getVideoDate"
          @play="onPlay"
          @timeupdate="handleseeking"
          @error="handleVideoError"
          @canplay="onCanplay"
          @seeking="handleSeeking"
        />
      </div>
      <!-- 拖拽 -->
      <!-- 拖拽 -->
      <div class="video-cut-out">
        <div class="resize-drag">
          <!-- 左 -->
          <div
            class="drag-left"
            @touchstart="handleDownLeft"
            @touchend="mouseUpLeft"
            @click="clickLeft"
          >
            <span></span>
          </div>
          <!-- 右 -->
          <div
            class="drag-right"
            @touchstart="handleDownRight"
            @touchend="mouseUpRight"
            @click="clickRight"
          >
            <span></span>
          </div>
          <!-- 中 -->
          <div class="progressBar"></div>
        </div>
        <ul>
          <li v-for="item in videoFrameList" :key="item">
            <img style="zoom: 100%" :src="item" alt="" />
          </li>
        </ul>
        <div class="maskLayerLeft"></div>
        <div class="maskLayerRight"></div>
      </div>

      <h1 @touchstart="handleDown">拖动边框选择截取需要部分</h1>
      <button @click="handleCreateBtn">生成GIF</button>
      <canvas style="display: none" id="myCanvas"></canvas>
    </div>

    <!-- 滑动画面  -->
    <div class="slide-module" :style="{ marginTop: marginTop }">
      <ul class="ul-top">
        <li class="liBlock">
          <h1>如何使用</h1>
          <div class="li-box">
            <!-- 左 -->
            <div class="box-img"><img src="" alt="" /></div>
            <!-- 右 -->
            <div class="sidebar">
              <div>
                <h2>Stp 01</h2>
                <p>只需三步，1分钟将视频转为GIF</p>
              </div>
              <div>
                <h2>Stp 02</h2>
                <p>只需三步，1分钟将视频转为GIF</p>
              </div>
            </div>
          </div>
        </li>
        <li></li>
        <li></li>
      </ul>

      <!-- 下面的点 -->
      <div class="foolter">
        <ul class="ul-dot">
          <li class="li-dot-bj"></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onUnmounted } from "vue";
// 视频插件
import { videoPlay } from "vue3-video-play";
import interact from "interactjs";
import GIF from "../../../static/gif.js";
import { getGifWorker } from "../../../static/gif.worker.js";
import { useStore } from "vuex";
component: {
  videoPlay;
}
let store = useStore();
// file文件 DOM                        ----- file文件
let uploadDom = ref(null);
// 视频url
let videoUrl = ref(null);
// 视频video DOM
let videoDom = ref(null);
let file = ref(null);

// video时长                           ----- video变量
let videoTime = ref(null);
// 视频剪辑flag
let videoGifFlag = ref(false);
// 视频定时器
let setGifTimer = ref(null);
// 视频每一帧数组
let videoFrameList = ref([]);
// 视频能否播放
let videoPlayFlag = ref(1); // 1是正常状态  2是load状态 3是隐藏
// 视频每一帧定时器
let timers = ref(null);
let marginTop = ref("-3.2rem");

// 视频截至时间                     ----- 视频剪辑插件
let endTime = ref(null);
// 视频开始时间
let startTime = ref(0);
// 拖拽的x轴位置
let dragX = ref(null);
// 定时器  //用来赋值requestAnimationFrame的id，为之后取消它做准备
var animationId = ref(null);
// flag
let flag = ref(true);
// 视频自动播放flag
let videoFlag = ref(false);
// 点击上传视频
const handleUpLoading = () => {
  uploadDom.value.click();
};

// 用户选择视频
const handleFileInput = (e) => {
  file.value = e.target.files[0];
  // 跳转样式  ***
  store.commit("star/setImgOne", false);
  // 修改i的样式
  document.querySelector(".iStyle").style.background = "#836ffa";
  // 获取视频播放的格式
  videoUrl.value = URL.createObjectURL(e.target.files[0]);
  videoPlayFlag.value = 2;
};

// 1.1vodeo插件 视频参数
const options = reactive({
  width: "100%", //播放器高度
  height: "100%", //播放器高度
  color: "#409eff", //主题色
  title: "", //视频名称
  src: videoUrl, //视频源
  muted: false, //静音
  webFullScreen: false,

  speedRate: ["0.75", "1.0", "1.25", "1.5", "2.0"], //播放倍速
  autoPlay: false, //自动播放
  loop: false, //循环播放
  mirror: false, //镜像画面
  ligthOff: false, //关灯模式
  volume: 0.3, //默认音量大小
  control: true, //是否显示控制
  controlBtns: [
    "audioTrack",
    "quality",
    "speedRate",
    "volume",
    "setting",
    "pip",
    "pageFullScreen",
    "fullScreen",
  ], //显示所有按钮,
});
// 1.2 获取视频时间 视频数据加载完成, 可以正常播放且无需停顿和缓冲时触发
const getVideoDate = (e) => {
  let resizeDragDom = document.querySelector(".resize-drag");
  // 视频时长
  videoTime.value = e.target.duration;
  // 盒子终点宽度   盒子不要边框的净宽
  let terminuWidth = resizeDragDom.clientWidth;

  // 获取截取宽度播放终点时间=总时长/总宽度*截取视频宽度
  endTime.value = (videoTime.value / 325) * terminuWidth;

  if (flag.value) {
    // 视频总数
    let time = Math.floor(parseInt(videoTime.value) / 7);
    let arr = [];
    let num = 0;
    function sum(time) {
      if (num + time > videoTime.value) {
        return arr;
      } else {
        num = time + num;
        arr.push(num);
        return sum(time);
      }
    }
    sum(time);

    let num2 = 0;
    function fn() {
      if (num2 >= arr.length) {
        // 让播放位置回到起点
        document.getElementById("dPlayerVideoMain").currentTime = 0;
        // 让视频自动播放
        videoFlag.value = true;
        // 视频能播放
        videoPlayFlag.value = 3; // 拖动时设置遮罩层

        document.querySelector(".video-box").style.opacity = 1;
        marginTop.value = 0;
        // 修改样式 ***
        store.commit("star/setImgTwo", false);
        // 修改i的样式
        document.querySelectorAll(".i").forEach((item) => {
          item.style.background = "#836ffa";
        });

        return;
      } else {
        let video = document.getElementById("dPlayerVideoMain");
        video.currentTime = arr[num2];
        video.play();
        video.controls = "controls";
        let videoDom = document.getElementById("dPlayerVideoMain");
        let canvas = document.getElementById("myCanvas");
        canvas.width = videoDom.videoWidth;
        canvas.height = videoDom.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(videoDom, 0, 0, canvas.width, canvas.height);
        let dataURL = canvas.toDataURL("image/jpeg"); // 转换为base64

        canvas.width = 0;

        videoFrameList.value.push(dataURL);

        num2 += 1;

        return setTimeout(() => fn(), 20);
      }
    }
    fn();

    flag.value = false;
  }
};

// 视频开始播放
const onPlay = (e) => {
  // 可以播放
  if (e) {
    // console.log(document.querySelector(".resize-drag").style.width);
    // document.querySelector(".maskLayerRight").style.width =
    //   355 -
    //   14 -
    //   parseInt(document.querySelector(".resize-drag").style.width) +
    //   "px";
  }
};

// 1.3 视频时长更新
const handleseeking = (e) => {
  // 功能一  实时更新video的结尾时间
  // 重新赋值结束时间
  endTime.value =
    (videoTime.value / 325) *
    (dragX.value + document.querySelector(".resize-drag").clientWidth);
  // 视频播放时间
  let currentTime = document.querySelector("#dPlayerVideoMain").currentTime;
  // 整个拖动的盒子
  let resizeDragDom = document.querySelector(".resize-drag");
  // 如果是自动播放就回到起点，不是自动播放就停在原地
  if (currentTime >= endTime.value && videoFlag.value == true) {
    document.querySelector("#dPlayerVideoMain").currentTime =
      (videoTime.value / 325) * dragX.value;
  } else if (currentTime >= endTime.value && videoFlag.value == false) {
    // 盒子移动
    if (resizeDragDom.style.transform) {
      document.querySelector("#dPlayerVideoMain").currentTime =
        (videoTime.value / 325) *
        (resizeDragDom.style.transform
          .split("(")[1]
          .split(",")[0]
          .split("p")[0] +
          document.querySelector(".resize-drag").clientWidth);
    } else {
      document.querySelector("#dPlayerVideoMain").currentTime =
        (videoTime.value / 325) *
        document.querySelector(".resize-drag").clientWidth;
    }
  }

  // 功能二  实时更新进度条的位置
  // 获取每秒占盒子多宽
  let time = 335 / videoTime.value;
  let width = document.querySelector(".resize-drag").clientWidth;
  if (videoFlag.value) {
    if (resizeDragDom.style.transform) {
      document.querySelector(".progressBar").style.left =
        time * document.querySelector("#dPlayerVideoMain").currentTime -
        resizeDragDom.style.transform
          .split("(")[1]
          .split(",")[0]
          .split("p")[0] +
        "px";
    } else {
      document.querySelector(".progressBar").style.left =
        time * document.querySelector("#dPlayerVideoMain").currentTime + "px";
    }
  }
};

// 1.4 视频播放错误
const handleVideoError = (e) => {
  // 视频不能播放
  if (e) {
    setTimeout(() => {
      videoPlayFlag.value = 1;
    }, 1000);
  }
};

// 1.5 可播放监听事件，当浏览器能够开始播放指定的音频/视频时触发
const onCanplay = (e) => {
  // 判断是否点击生成按钮，点了开启定时器获取视频帧
  if (videoGifFlag.value) {
    console.log(111);
    let gif = new GIF({
      workers: 2,
      quality: 10,
      width: document.getElementById("dPlayerVideoMain").videoWidth,
      height: document.getElementById("dPlayerVideoMain").videoHeight,
      workerScript: getGifWorker(), //自定义worker地址
    });

    // 开启定时器
    let drawTimestamp = 0;
    setGifTimer.value = window.setInterval(() => {
      // 判断视频播放到底了清除定时器
      if (
        document.querySelector("#dPlayerVideoMain").currentTime >= endTime.value
      ) {
        // // 渲染图片
        gif.on("finished", (blob) => {
          window.open(URL.createObjectURL(blob));
        });
        gif.render();
        return clearInterval(setGifTimer.value);
      }
      if (drawTimestamp === 100) {
        let videoDom = document.getElementById("dPlayerVideoMain");
        let canvas = document.getElementById("myCanvas");
        canvas.width = videoDom.videoWidth;
        canvas.height = videoDom.videoHeight;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(videoDom, 0, 0, canvas.width, canvas.height);
        gif.addFrame(canvas, { delay: 100, copy: true });
        drawTimestamp = 0;
      }

      // let dataURL = canvas.toDataURL("image/jpeg"); // 转换为base64
      drawTimestamp += 50;
    }, 50);

    // 操作完之后关闭开关
    videoGifFlag.value = false;
  }
};

// 时长变化。当指定的音频/视频的时长数据发生变化时触发，
const handleSeeking = (e) => {
  // video DOM
  let video = document.querySelector("#dPlayerVideoMain");
  video.pause();

  // video.addEventListener("pause", function (e) {
  //   console.log("暂停播放");
  //   console.log(e);
  // });
};

// 2.1 视频剪辑插件
interact(".resize-drag")
  .resizable({
    // resize from all edges and corners
    edges: { left: true, right: true, bottom: false, top: false },

    listeners: {
      move(event) {
        let sanshi = 30 * (325 / videoTime.value);
        let boxWidth = document.querySelector(".resize-drag").clientWidth;
        // 加个判断不能大于30s视频
        if (boxWidth > sanshi) {
          return;
        }

        var target = event.target;
        var x = parseFloat(target.getAttribute("data-x")) || 0;
        var y = parseFloat(target.getAttribute("data-y")) || 0;

        // update the element's style
        target.style.width = event.rect.width + "px";
        target.style.height = event.rect.height + "px";

        // translate when resizing from top or left edges
        x += event.deltaRect.left;
        y += event.deltaRect.top;

        target.style.transform = "translate(" + x + "px," + y + "px)";

        target.setAttribute("data-x", x);
        target.setAttribute("data-y", y);
        dragX.value = x;

        // 拖动时设置遮罩层
        document.querySelector(".maskLayerLeft").style.width = x - 14 + "px";
        document.querySelector(".maskLayerRight").style.width =
          355 -
          x -
          14 -
          parseInt(document.querySelector(".resize-drag").style.width) +
          1 +
          "px";
        // 改变宽高，触发事件
        dragFn(1000);
      },
    },
    modifiers: [
      // keep the edges inside the parent
      interact.modifiers.restrictEdges({
        outer: "parent",
      }),

      // 最小尺寸 minimum size
      interact.modifiers.restrictSize({
        min: { width: 150, height: 56 },
      }),
    ],

    inertia: true,
  })
  .draggable({
    // enable inertial throwing
    inertia: false,
    // 将元素保持在其父元素的区域内
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: "parent",
        endOnly: false,
      }),
    ],
    // enable autoScroll
    autoScroll: true,

    listeners: {
      // call this function on every dragmove event
      move: dragMoveListener,

      // 拖动事件 call this function on every dragend event
      end(event) {
        var textEl = event.target.querySelector("p");

        textEl &&
          (textEl.textContent =
            "moved a distance of " +
            Math.sqrt(
              (Math.pow(event.pageX - event.x0, 2) +
                Math.pow(event.pageY - event.y0, 2)) |
                0
            ).toFixed(2) +
            "px");
      },
    },
  });

// 节流
let timer = null;
// 2.2 拖动改变宽高，触发事件并节流
const dragFn = (date) => {
  return (function () {
    if (timer) {
      return;
    } else {
      timer = window.setTimeout(() => {
        // 判断拖拽插件x轴的水平位置 小于0就让等于0
        if (dragX.value <= 0) {
          dragX.value = 0;
        }

        if (dragX.value !== startTime.value) {
          // 设置视频起始时间
          startTime.value = (videoTime.value / 325) * dragX.value;
          document.querySelector("#dPlayerVideoMain").currentTime =
            startTime.value;
        }

        let boxMargin =
          325 -
          (document.querySelector(".resize-drag").clientWidth + dragX.value);
        // 获取终点时间=总时长/总宽度*截取视频宽度
        endTime.value =
          (videoTime.value / 325) *
          (dragX.value + document.querySelector(".resize-drag").clientWidth);

        // 清除定时器
        timer = null;
        clearTimeout(timer);
      }, date);
    }
  })();
};

// 2.3 视频剪辑器拖动事件
function dragMoveListener(event) {
  // video DOM
  let video = document.querySelector("#dPlayerVideoMain");
  // 整个拖动的盒子
  let resizeDragDom = document.querySelector(".resize-drag");
  video.pause();
  document.querySelector(".progressBar").style.left = "50%";

  var target = event.target;
  // keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
  dragX.value = x;
  // translate the element
  target.style.transform = "translate(" + x + "px)";

  // update the posiion attributes
  target.setAttribute("data-x", x);

  // 设置视频起始时间
  if (dragX.value !== startTime.value) {
    startTime.value = (videoTime.value / 325) * dragX.value;
    document.querySelector("#dPlayerVideoMain").currentTime = startTime.value;
  }

  // 获取终点时间=总时长/总宽度*截取视频宽度
  endTime.value =
    (videoTime.value / 325) *
    (document.querySelector(".resize-drag").clientWidth + dragX.value);

  // 设置视频播放的时间
  video.currentTime =
    (videoTime.value / 325) *
    (parseInt(
      resizeDragDom.style.transform.split("(")[1].split(",")[0].split("p")[0]
    ) +
      parseInt(resizeDragDom.clientWidth / 2));

  video.pause();
}
// this function is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener;

// 2.4.1 按下 点击拖动框左边按钮，让视频和进度条在最左侧
const handleDownLeft = () => {
  // 取消自动播放
  videoFlag.value = false;
  // 左按钮DOM
  let left = document.querySelector(".drag-left");
  // video DOM
  let video = document.querySelector("#dPlayerVideoMain");
  video.pause();

  // 盒子拖动事件
  left.ontouchmove = () => {
    video.pause();
    // 整个拖动的盒子
    let resizeDragDom = document.querySelector(".resize-drag");

    // 设置视频播放的时间
    // video.currentTime =
    //   (videoTime.value / 325) *
    //   resizeDragDom.style.transform.split("(")[1].split(",")[0].split("p")[0];

    // 设置进度条
    document.querySelector(".progressBar").style.left = 0;
    video.pause();
  };
};
// 2.4.2 抬起
const mouseUpLeft = () => {
  // 开启自动播放

  // setTimeout(() => {
  videoFlag.value = true;
  // }, 1000);

  let left = document.querySelector(".drag-left");
  left.ontouchmove = null;
};

// 2.5.1 按下 点击拖动框右边按钮，让视频和进度条在最右侧
const handleDownRight = () => {
  // 取消自动播放
  videoFlag.value = false;

  // 右按钮
  let right = document.querySelector(".drag-right");
  // video DOM
  let video = document.querySelector("#dPlayerVideoMain");
  // 让video不播放
  video.pause();

  // 盒子拖动事件
  right.ontouchmove = () => {
    // 让video不播放
    video.pause();
    // 整个拖动的盒子
    let resizeDragDom = document.querySelector(".resize-drag");
    // 设置视频播放的时间
    video.currentTime =
      (videoTime.value / 325) *
      (parseInt(
        resizeDragDom.style.transform.split("(")[1].split(",")[0].split("p")[0]
      ) +
        parseInt(resizeDragDom.clientWidth));
    // video.currentTime = resizeDragDom.clientWidth * (videoTime.value / 325);

    // 设置进度条
    document.querySelector(".progressBar").style.left =
      resizeDragDom.clientWidth + "px";
    // 让video不播放
    video.pause();
  };
};
// 2.5.2 抬起
const mouseUpRight = () => {
  // 开启自动播放

  // setTimeout(() => {
  videoFlag.value = true;
  // }, 1000);

  let right = document.querySelector(".drag-right");
  right.ontouchmove = null;

  // 整个拖动的盒子
  let resizeDragDom = document.querySelector(".resize-drag");
  // video DOM
  let video = document.querySelector("#dPlayerVideoMain");
  video.currentTime =
    (videoTime.value / 325) *
    resizeDragDom.style.transform.split("(")[1].split(",")[0].split("p")[0];
};

// 3.1 点击生成按钮
const handleCreateBtn = () => {
  // 让视频回到起点，开始获取视频帧
  // document.querySelector("#dPlayerVideoMain").currentTime = dragX.value;
  // 开启开关,onCanplay 事件中生成gif
  videoGifFlag.value = true;
};

// mp4boxFile 测试
const checkVideoCode = async (file) => {
  return new Promise((resolve, reject) => {
    const mp4boxFile = MP4Box.createFile();
    const reader = new FileReader();
    reader.readAsArrayBuffer(file.tempFile);
    reader.onload = function (e) {
      const arrayBuffer = e.target.result;
      arrayBuffer.fileStart = 0;
      mp4boxFile.appendBuffer(arrayBuffer);
    };
    mp4boxFile.onReady = function (info) {
      resolve(info);
    };
    mp4boxFile.onError = function (info) {
      reject(info);
    };
  });
};
</script>

<style lang="less" scoped>
@import url("vue3-video-play/dist/style.css");
// 虚线style
.click-upload {
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 1.66rem;
  border-radius: 0.12rem;
  border: 0.03rem dashed rgba(5, 68, 255, 0.32);
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
    ::v-deep .van-loading__spinner {
      color: rgb(255, 255, 255);
      font-size: 0.24rem !important;
      width: 0.24rem !important;
      height: 0.24rem !important;
      .van-loading__circular {
        circle {
          stroke-width: 4;
        }
      }
    }
  }
}

// 视频
.video-box {
  overflow: hidden;
  padding-bottom: 0.46rem;
  width: 100%;
  .video-plugIn {
    margin-bottom: 0.1rem;
    width: 100%;
    height: 1.66rem;
  }
  // 截取帧率
  .video-cut-out {
    position: relative;
    width: 100%;
    height: 0.56rem;
    background: transparent;
    // 拖拽框
    .drag {
      z-index: 1;
      position: absolute;
      top: 0;
      left: 0;
      background: transparent;
      width: 3.22rem;
      height: 0.56rem;
      border-radius: 0.04rem;
      border: 0.05rem solid #af79f7;
      border-left: 0.15rem solid #af79f7;
      border-right: 0.15rem solid #af79f7;
    }
    .drag-left {
      z-index: 3;
      position: absolute;
      width: 0.15rem;
      height: 121%;
      left: -0.15rem;
      border-radius: 0.04rem;
      bottom: -0.05rem;
    }
    .drag-right {
      z-index: 3;
      width: 0.15rem;
      height: 121%;
      position: absolute;
      border-radius: 0.04rem;
      right: -0.15rem;
      top: -0.05rem;
    }
    div {
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        display: block;
        width: 0.02rem;
        height: 0.12rem;
        background: #fff;
      }
    }
    // 遮罩层
    .maskLayerRight {
      position: absolute;
      top: 4px;
      right: 13px;
      width: 0.2rem;
      // width: 0;
      height: 86%;
      background: rgba(0, 0, 0, 0.2);
      // background: rgba(red);
    }
    .maskLayerLeft {
      position: absolute;
      top: 4px;
      left: 13px;
      width: 0;
      height: 86%;
      background: rgba(0, 0, 0, 0.2);
    }
    ul {
      position: absolute;
      width: 92%;
      top: 0.05rem;
      left: 0.14rem;
      display: flex;
      li {
        width: 51px;
        height: 46px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  h1 {
    margin-top: 0.08rem;
    font-size: 0.12rem;
    font-family: HarmonyOS_Sans_SC;
    color: #121212;
  }
  button {
    display: block;
    width: 1.85rem;
    height: 0.44rem;
    background: linear-gradient(90deg, #b77af6 0%, #5566ff 100%);
    border-radius: 0.12rem;
    border: none;
    margin: 0.2rem auto 0;
    font-weight: 600;
    font-size: 0.16rem;
    font-family: AlimamaShuHeiTi;
    color: #ffffff;
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
  z-index: 20;
  .progressBar {
    position: absolute;
    top: -0.07rem;
    left: 50%;
    transform: translate(-50%, 0);
    width: 0.02rem;
    height: 0.62rem;
    background: #0dbc79;
  }
}

.slide-module {
  margin-bottom: 0.32rem;
  width: 100%;
  // margin-top: -3.2rem;
  .ul-top {
    width: 100%;
    li {
      display: none;
      h1 {
        margin-bottom: 0.2rem;
        font-weight: 600;
        text-align: center;
        font-size: 0.18rem;
        font-family: AlimamaShuHeiTi;
        color: #020202;
      }

      //  下面盒子
      .li-box {
        margin-bottom: 0.25rem;
        width: 100%;
        display: flex;
        // 左边img
        .box-img {
          margin-right: 0.12rem;
          width: 1.95rem;
          height: 1.17rem;
          border-radius: 0.09rem;
          background: #045dfe;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
        // 右边
        .sidebar {
          text-align: left;
          width: 1.45rem;
          div:first-child {
            margin-bottom: 0.16rem;
          }
          div {
            padding-top: 0.05rem;
            font-size: 0.12rem;
            color: #121212;
            line-height: 0.12rem;
            h2 {
              height: 0.12rem;
              margin-bottom: 0.07rem;
              font-family: HarmonyOS_Sans_SC_Bold;
              font-weight: 600;
            }
            p {
              height: 0.24rem;
              font-family: HarmonyOS_Sans_SC;
            }
          }
        }
      }
    }
    .liBlock {
      display: block;
    }
  }
  // 下面的点
  .foolter {
    display: flex;
    justify-content: center;
    .ul-dot {
      display: flex;
      li {
        margin: 0 0.02rem;
        width: 0.06rem;
        height: 0.06rem;
        background: #d4dae5;
        border-radius: 50%;
      }
      .li-dot-bj {
        background: #005dfe;
      }
    }
  }
}
</style>
