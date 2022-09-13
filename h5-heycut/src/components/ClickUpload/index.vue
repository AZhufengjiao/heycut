<template>
  <div>
    <!-- 点击上传虚线组件 -->
    <div v-if="vldeoUrl == null" class="click-upload">
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
    <div class="video-box" v-if="vldeoUrl !== null">
      <!-- 视频播放 -->
      <div ref="v" class="video-plugIn">
        <!-- <video
          ref="videoDom"
          controls
          autoplay
          :src="vldeoUrl"
          :style="{ width: '100%', height: '1.66rem' }"
        ></video> -->
        <vue3VideoPlay
          v-bind="options"
          :poster="vldeoUrl"
          @canplaythrough="getVideoDate"
          @play="onPlay"
        />
      </div>
      <!-- 拖拽 -->
      <div class="video-cut-out">
        <!-- 拖拽框 -->
        <div
          class="drag"
          :style="{
            width: dragWidth + 'px',
            marginLeft: dragMargin + 'px',
            left: 0 + 'px',
          }"
          @touchstart="handleDragClick"
          @touchend="handleDragEnd"
        >
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
      <h1 @touchstart="handleDown">
        拖动边框选择截取需要部分 {{ CountMargin }} {{ dragMargin }}
      </h1>
      <button>生成GIF</button>
      <canvas style="display: none" id="myCanvas"></canvas>

      <div class="resize-drag"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
// 视频插件
import { videoPlay } from "vue3-video-play";
import interact from "interactjs";
component: {
  videoPlay;
}
// file文件 DOM
let uploadDom = ref(null);
// 视频url
let vldeoUrl = ref(null);
// 视频video DOM
let videoDom = ref(null);

// 点击上传视频
const handleUpLoading = () => {
  uploadDom.value.click();
};

// 用户选择视频
const handleFileInput = (e) => {
  console.log(e.target.files[0]);
  // 获取视频播放的格式
  vldeoUrl.value = URL.createObjectURL(e.target.files[0]);
};

// 拖拽功能
// 移动盒子宽度
let dragWidth = ref(300);
// 移动盒子margin
let dragMargin = ref(0);
// 固定margin
let CountMargin = ref(0);
//  移动盒子left
let dragLeft = ref(0);

// 3.1 鼠标按下
let shubX = ref(0); // 鼠标距离div的距离
const handleDragClick = (e) => {
  shubX.value =
    e.changedTouches[0].clientX - (screen.width - 355) / 2 - dragMargin.value;
  document.addEventListener("touchmove", handleDownDrag);
};
// 3.2 移动 移动的盒子
const handleDownDrag = (e) => {
  dragMargin.value =
    e.changedTouches[0].clientX -
    (screen.width - 355) / 2 -
    parseInt(
      getComputedStyle(document.querySelector(".drag")).left.slice(0, -2)
    ) -
    shubX.value;
  if (dragMargin.value <= 0) {
    document.querySelector(".drag").style.left = 0;
    dragMargin.value = 0;
  }
  if (
    parseInt(
      getComputedStyle(document.querySelector(".drag")).width.slice(0, -2)
    ) +
      dragMargin.value >=
    355
  ) {
    dragMargin.value =
      355 -
      parseInt(
        getComputedStyle(document.querySelector(".drag")).width.slice(0, -2)
      );
  }
};
// 3.3 鼠标抬起
const handleDragEnd = () => {
  document.removeEventListener("touchmove", handleDownDrag);
};
// 1.1 右边拖拽鼠标按下
const handleDownRight = () => {
  // document.querySelector(".drag").style.pointerEvents = "none";
  // document.querySelector(".drag-right").style.pointerEvents = "auto";
  CountMargin.value = parseInt(
    getComputedStyle(document.querySelector(".drag")).marginLeft.slice(0, -2)
  );
  // 获取盒子的宽
  dragWidth.value = document.querySelector(".drag").offsetWidth;
  // 调用鼠标移动事件
  document.addEventListener("touchmove", rightMove);
};
// 1.2 右边移动事件
let rightMove = (e) => {
  console.log(222222222222);
  document.querySelector(".drag").style.marginLeft = CountMargin.value;
  document.querySelector(".drag").style.left = 10;
  // document.querySelector(".drag").setAttribute("marginLeft", CountMargin.value);
  // document.querySelector(".drag").setAttribute("left", CountMargin.value);
  document.querySelector(
    ".drag"
  ).style.cssText = `margin-left:${CountMargin.value}px`;
  dragMargin.value = CountMargin.value;
  // 移动的宽高
  let widthX = e.changedTouches[0].clientX;
  // 获取最小宽度 盒子两边的margin
  let minWidth = (screen.width - 355) / 2;
  if (widthX - minWidth >= 355) {
    document.removeEventListener("touchmove", rightMove);
  } else {
    if (dragWidth.value < 100) {
      dragWidth.value = 100;
      document.removeEventListener("touchmove", rightMove);
    } else {
      dragWidth.value = widthX - minWidth - CountMargin.value;
    }
  }
};
//  1.3 右边鼠标离开
const mouseUpRight = () => {
  document.removeEventListener("touchmove", rightMove);
};

// 固定盒子的宽
let countNum = ref(null);
// 2.1 左边拖拽鼠标按下
const handleDownLeft = (e) => {
  console.log(2222222222222);
  // 获取盒子右边的距离
  CountMargin.value =
    355 -
    parseInt(
      getComputedStyle(document.querySelector(".drag")).width.slice(0, -2)
    ) -
    parseInt(
      getComputedStyle(document.querySelector(".drag")).marginLeft.slice(0, -2)
    );
  // 获取盒子的宽
  countNum.value = document.querySelector(".drag").offsetWidth;
  // 调用鼠标移动事件
  document.addEventListener("touchmove", leftMove);
};
// 2.2 左边移动事件
const leftMove = (e) => {
  console.log(11111111111);
  // 盒子的宽度
  dragWidth.value = document.querySelector(".drag").offsetWidth;
  // 鼠标的位置
  let widthX = e.changedTouches[0].pageX;
  // 获取最小宽度
  let minWidth = (screen.width - 355) / 2;
  // 如果移动的宽度小于最小宽度就让他等于最小宽度 ， 不让他超出盒子
  if (widthX <= minWidth) {
    dragWidth.value = dragWidth.value - 0;
  } else {
    if (dragWidth.value <= 100) {
      dragWidth.value = 100;
      // dragMargin.value = widthX;
      // console.log(getComputedStyle(document.querySelector(".drag")).marginLeft);
      // document.removeEventListener("touchmove", leftMove);
    } else if (dragMargin.value === 0 && dragWidth.value === 100) {
      // document.removeEventListener("touchmove", leftMove);
    } else {
      dragMargin.value = widthX - minWidth;
      dragWidth.value = 355 - dragMargin.value - CountMargin.value;
    }
  }
};
// 2.3 左边鼠标离开
const mouseUpLeft = () => {
  document.removeEventListener("touchmove", leftMove);
};

// 监听video标签 是否有值
watch(
  () => videoDom.value,
  (newValue) => {
    // 有值
    if (newValue !== null) {
      // 视频播放了
      videoDom.value.addEventListener("play", () => {
        // 画布
        let canvas = document.getElementById("myCanvas");
        canvas.width = videoDom.value.videoWidth;
        canvas.height = videoDom.value.videoHeight;
        var ctx = canvas.getContext("2d");
        console.log(canvas.width, canvas.height);
        ctx.drawImage(videoDom.value, 0, 0, canvas.width, canvas.height);
        var oGrayImg = canvas.toDataURL("image/png");
        console.log(oGrayImg);
      });
    }
  },
  { immediate: true }
);

// 视频参数
const options = reactive({
  width: "100%", //播放器高度
  height: "100%", //播放器高度
  color: "#409eff", //主题色
  title: "", //视频名称
  src: vldeoUrl, //视频源
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

// 获取视频时间
const getVideoDate = (e) => {
  let resizeDragDom = document.querySelector(".resize-drag");
  console.log(resizeDragDom);
  console.log(e.target.duration);
};

const onPlay = (ev) => {
  console.log("播放");
};

interact(".resize-drag")
  .resizable({
    // resize from all edges and corners
    edges: { left: true, right: true, bottom: false, top: false },

    listeners: {
      move(event) {
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

        // 改变宽高，触发事件
        dragFn(1000);
      },
    },
    modifiers: [
      // keep the edges inside the parent
      interact.modifiers.restrictEdges({
        outer: "parent",
      }),

      // minimum size
      interact.modifiers.restrictSize({
        min: { width: 100, height: 50 },
      }),
    ],

    inertia: true,
  })
  .draggable({
    // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: "parent",
        endOnly: true,
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
// 拖动改变宽高，触发事件
const dragFn = (date) => {
  return (function () {
    if (timer) {
      return;
    } else {
      timer = window.setTimeout(() => {
        console.log(111);
        timer = null;
        clearTimeout(timer);
      }, date);
    }
  })();
};

// 视频剪辑器拖动事件
function dragMoveListener(event) {
  var target = event.target;
  // keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;

  // if (x <= 0) {
  //   x = 0;
  // }

  // if (x >= 30) {
  //   x = 30;
  // }

  // translate the element
  target.style.transform = "translate(" + x + "px)";

  // update the posiion attributes
  target.setAttribute("data-x", x);
}

// this function is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener;

// const onCanplay = (ev) => {
//   console.log(ev, "可以播放");
//   let videoDome = document.getElementById("dPlayerVideoMain");
//   let canvas = document.getElementById("myCanvas");
//   canvas.width = videoDome.videoWidth;
//   canvas.height = videoDome.videoHeight;
//   console.log("canplay ", videoDome.videoWidth, videoDome.videoHeight);
// };

// 视频播放事件
// const onPlay = (ev) => {
//   console.log("播放");
//   let videoDome = document.getElementById("dPlayerVideoMain");
//   // 画布
//   let canvas = document.getElementById("myCanvas");
//   console.log("play", canvas.width, canvas.height);
//   // videoDome.pause();
//   setTimeout(() => {
//     var ctx = canvas.getContext("2d");
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.save();
//     ctx.fillStyle = "rgba(255,255,255,1)";
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
//     console.log("play canvas rect：", canvas.width, canvas.height);
//     console.log(
//       "play video rect：",
//       videoDome.videoWidth,
//       videoDome.videoHeight
//     );
//     ctx.drawImage(videoDome, 0, 0, canvas.width, canvas.height);
//     ctx.restore();
//     var oGrayImg = canvas.toDataURL("image/png");
//     console.log(oGrayImg);
//   }, 1000);
// };
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

  /* This makes things *much* easier */
  box-sizing: border-box;
}
</style>
