<template>
  <div>
    <!-- 点击上传虚线组件 -->
    <div v-if="videoUrl == null" class="click-upload">
      <button @click="handleUpLoading">+点击上传视频</button>
      <input
        type="file"
        style="display: none"
        name="uoload"
        ref="uploadDom"
        accept="video/*"
        @change="handleFileInput"
      />
    </div>
    <div class="video-box" v-if="videoUrl !== null">
      <!-- 视频播放 -->
      <div ref="v" class="video-plugIn">
        <!-- <video
          ref="videoDom"
          controls
          autoplay
          :src="videoUrl"
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
          @stalled="handleVideoStalled"
          @canplay="onCanplay"
        />
      </div>
      <!-- 拖拽 -->
      <!-- 拖拽 -->
      <div class="video-cut-out">
        <div class="resize-drag">
          <div
            class="drag-left"
            @touchstart="handleDownLeft"
            @touchend="mouseUpLeft"
            @click="clickLeft"
          >
            <span></span>
          </div>
          <div
            class="drag-right"
            @touchstart="handleDownRight"
            @touchend="mouseUpRight"
            @click="clickRight"
          >
            <span></span>
          </div>
        </div>
      </div>

      <h1 @touchstart="handleDown">拖动边框选择截取需要部分</h1>
      <button @click="handleCreateBtn">生成GIF</button>
      <canvas style="display: none" id="myCanvas"></canvas>
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
component: {
  videoPlay;
}
// file文件 DOM                        ----- file文件
let uploadDom = ref(null);
// 视频url
let videoUrl = ref(null);
// 视频video DOM
let videoDom = ref(null);

// video时长                           ----- video变量
let videoTime = ref(null);
// 视频剪辑flag
let videoGifFlag = ref(false);
// 视频定时器
let setGifTimer = ref(null);
// 视频每一帧数组
let videoFrameList = ref([]);

// 视频截至时间                     ----- 视频剪辑插件
let endTime = ref(null);
// 视频开始时间
let startTime = ref(0);
// 拖拽的x轴位置
let dragX = ref(null);
// 定时器  //用来赋值requestAnimationFrame的id，为之后取消它做准备
var animationId = ref(null);

// 点击上传视频
const handleUpLoading = () => {
  uploadDom.value.click();
};

// 用户选择视频
const handleFileInput = (e) => {
  // 获取视频播放的格式
  videoUrl.value = URL.createObjectURL(e.target.files[0]);
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

// 1.2 获取视频时间
const getVideoDate = (e) => {
  let resizeDragDom = document.querySelector(".resize-drag");
  // 视频时长
  videoTime.value = e.target.duration;
  // 盒子终点宽度   盒子不要边框的净宽
  let terminuWidth = resizeDragDom.clientWidth;

  // 获取截取宽度播放终点时间=总时长/总宽度*截取视频宽度
  endTime.value = (videoTime.value / 325) * terminuWidth;
};
// 视频开始播放
const onPlay = (e) => {
  // function step() {
  //   // 视频播放时间
  //   let currentTime = document.querySelector("#dPlayerVideoMain").currentTime;
  //   if (currentTime >= endTime.value) {
  //     document.querySelector("#dPlayerVideoMain").currentTime = startTime.value;
  //   } else {
  //     console.log("12tgvfdv");
  //     animationId.value = requestAnimationFrame(step); //为了在之后的每次浏览器刷新前都执行回调，递归调用回调
  //   }
  // }
  // animationId.value = requestAnimationFrame(step); //最开始的调用
  // console.log(endTime.value, "播放");
};

// 1.3 视频时长更新
const handleseeking = (e) => {
  // 重新赋值结束时间
  endTime.value =
    (videoTime.value / 325) *
    (dragX.value + document.querySelector(".resize-drag").clientWidth);
  // 视频播放时间
  let currentTime = document.querySelector("#dPlayerVideoMain").currentTime;
  if (currentTime >= endTime.value) {
    document.querySelector("#dPlayerVideoMain").currentTime =
      (videoTime.value / 325) * dragX.value;
  }
};
const handleVideoStalled = (e) => {
  console.log(e);
  if (e) {
    alert("视频出错啦");
  }
};
// 1.4 视频播放错误
const handleVideoError = (e) => {
  if (e) {
    alert("视频出错啦");
  }
};

// 1.5 可播放监听事件，当浏览器能够开始播放指定的音频/视频时触发
const onCanplay = (e) => {
  // 判断是否点击生成按钮，点了开启定时器获取视频帧
  if (videoGifFlag.value) {
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
        // videoDom.setAttribute("crossOrigin", "anonymous"); // 处理跨域
        let canvas = document.getElementById("myCanvas");
        canvas.width = videoDom.videoWidth;
        canvas.height = videoDom.videoHeight;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(videoDom, 0, 0, canvas.width, canvas.height);
        gif.addFrame(canvas, { delay: 100, copy: true });
        drawTimestamp = 0;
      }

      // let dataURL = canvas.toDataURL("image/jpeg"); // 转换为base64
      // videoFrameList.value.push(canvas);
      drawTimestamp += 50;
    }, 50);

    // 操作完之后关闭开关
    videoGifFlag.value = false;
  }
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

        console.log(sanshi, videoTime.value);
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
}
// this function is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener;

// 3.1 点击生成按钮
const handleCreateBtn = () => {
  // 让视频回到起点，开始获取视频帧
  document.querySelector("#dPlayerVideoMain").currentTime = dragX.value;
  // 开启开关
  videoGifFlag.value = true;
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
      width: 15px;
      height: 121%;
      left: -15px;
      border-radius: 0.04rem;
      bottom: -5px;
    }
    .drag-right {
      z-index: 3;
      width: 15px;
      height: 121%;
      position: absolute;
      border-radius: 0.04rem;
      right: -15px;
      top: -5px;
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
    // .drag::after {
    //   background: green;
    //   width: 11px;
    //   height: 100%;
    //   position: absolute;
    //   right: -12px;
    //   content: "";
    //   display: block;
    //   clear: both;
    // }
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
  font-size: 20px;
  font-family: sans-serif;
  touch-action: none;
  box-sizing: border-box;
}
</style>
