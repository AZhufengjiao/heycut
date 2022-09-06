<template>
  <!-- 滑动画面  -->
  <div class="slide-module">
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
</template>

<script setup></script>

<style lang="less" scoped>
.slide-module {
  width: 100%;
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
            padding-top: 0.06rem;
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
