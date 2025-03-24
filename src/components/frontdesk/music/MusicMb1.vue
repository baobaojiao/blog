<template>
  <!-- 音乐面板 -->
  <Drawer
    placement="top"
    v-model="variable.musicState.value"
    height="100"
    :lock-scroll="true"
    :styles="{
      'background-color': '#525252',
    }"
  >
    <template #close>
      <div>
        <Icon type="md-close-circle" :size="40" color="#000" />
      </div>
    </template>

    <div id="yymbtb">
      <div style="display: flex">
        <p style="font-size: 20px; color: #fff" @click="musicDj">音乐面板</p>

        <Tooltip theme="light" content="修改音乐主题" style="margin: 0 auto">
          <label class="switch-button" for="switch" @click="setMusicTheme()">
            <div class="switch-outer">
              <input id="switch" type="checkbox" checked />
              <div class="button">
                <span class="button-toggle"></span>
                <span class="button-indicator"></span>
              </div>
            </div>
          </label>
        </Tooltip>
      </div>
      <div style="height: 60vh; display: flex">
        <!-- 歌曲控制 -->
        <div style="width: 50%; padding: 50px 100px">
          <div id="kzmb">
            <div
              class="songImg_Circle"
              :class="{ dxdh: variable.sfzzbf.value }"
            >
              <Circle
                trail-color="#525252"
                :percent="variable.timeBfb.value"
                :size="170"
                :stroke-width="2"
                :trail-width="2"
              >
                <img
                  class="song_info__pic"
                  loading="lazy"
                  :src="variable.song.value.album"
                />
              </Circle>
            </div>

            <p
              style="
                color: #fff;
                text-align: center;
                margin-top: 20px;
                font-size: 18px;
              "
            >
              {{ variable.song.value.name }} -
              {{ variable.song.value.singer }}
            </p>

            <div class="bfkj">
              <i class="iconfont icon-shangyishou1 kzan" @click="previous"></i>
              <i
                :class="variable.music_play.value"
                class="iconfont kzan"
                @click="play"
              ></i>
              <i class="iconfont icon-xiayishou1 kzan" @click="next"></i>

              <!-- 循环模式 -->
              <Tooltip
                :content="variable.xhTip.value"
                placement="top"
                @click="qhxhms"
              >
                <div style="margin: 0 40px; cursor: pointer" class="kzan">
                  <Icon
                    color="#a0a0a0"
                    :type="variable.xhIco.value"
                    size="40"
                    v-show="variable.xhIcoState.value"
                  />
                  <svg
                    style="width: 30px; height: 30px"
                    aria-hidden="true"
                    v-show="!variable.xhIcoState.value"
                  >
                    <use xlink:href="#icon-danquxunhuan"></use>
                  </svg>
                </div>
              </Tooltip>

              <!-- 音量控制 -->
              <Icon type="ios-volume-up" size="40" color="#fff" />
              <div style="width: 100px; margin-left: 5px">
                <Slider
                  v-model="variable.volumeNum.value"
                  :max="1"
                  :step="0.1"
                  show-tip="never"
                ></Slider>
              </div>
            </div>
          </div>
        </div>

        <!-- 歌词 -->
        <div style="width: 50%; text-align: center; padding: 50px 100px">
          <ul id="geci">
            <li
              class="lyricLi"
              v-for="(item, index) in variable.lyricsObjArr.value"
              :key="item.uid"
              :id="'geci' + index"
            >
              {{ item.lyric }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 歌曲列表 -->
    <ul
      id="yykpLi"
      ref="yykpLi"
      @mousedown="handleMouseDown"
      @mouseleave="handleMouseLeave"
      @mouseup="handleMouseUp"
      @mousemove="handleMouseMove"
    >
      <li
        v-for="item in variable.musciList.value"
        :key="item.id"
        :id="'gqzgli_' + item.id"
      >
        <img
          :id="'gqimg_' + item.id"
          class="song_img"
          loading="lazy"
          :src="item.album"
        />
        <div style="margin-left: 40px">
          <p style="font-size: 20px; font-weight: 700; letter-spacing: 3px">
            {{ item.name }}
          </p>
          <p>{{ item.singer }}</p>
        </div>
        <i
          :id="'gqli_' + item.id"
          class="iconfont kzans icon-bofang1"
          @click="liplay(item, $event)"
        ></i>
      </li>
    </ul>
  </Drawer>
</template>
<script setup>
import variable from "../../../js/variable.js";
import { eventBus } from "../../../js/eventBus.js";

//修改面板主题
function setMusicTheme() {
  localStorage.setItem("musicTheme", 2);
  variable.musicTheme.value = 2;
}

onMounted(() => {
  //为了切换到主题时修改正在播放的歌曲
  if (variable.sfzzbf.value) {
    //设置正在播放的歌的按钮为暂停
    eventBus.emit("setGqli");

    //歌曲列表定位到正在播放的歌
    setTimeout(() => {
      document
        .getElementById("gqzgli_" + variable.song.value.id)
        .scrollIntoView({ inline: "center" });
    }, 0);

    //歌曲列表中的歌专辑开始旋转,先移除正在旋转的，再添加
    var kzansArr = Array.from(document.getElementsByClassName("wxxz"));
    if (kzansArr.length != 0) {
      kzansArr[0].classList.remove("wxxz");
    }
    document
      .getElementById("gqimg_" + variable.song.value.id)
      .classList.add("wxxz");
  }
});

//歌曲列表中的歌专辑停止旋转
function tzxz() {
  var kzansArr = Array.from(document.getElementsByClassName("wxxz"));
  if (kzansArr.length != 0) {
    kzansArr[0].classList.remove("wxxz");
  }
}

//-------------音乐播放暂停切换START-------------
function play() {
  eventBus.emit("play");
  //歌曲列表中的歌专辑停止旋转
  tzxz();
}
//----------------音乐播放暂停切换END-------------

//-------------------每首歌曲列表播放按钮(面板)
function liplay(music, event) {
  //当前元素
  const clickedElement = event.target;
  if (event.target.classList.contains("icon-zanting1")) {
    //设为未播放
    variable.sfzzbf.value = false;
    //正在播放，给暂停
    clickedElement.classList.add("icon-bofang1");
    clickedElement.classList.remove("icon-zanting1");
    document.getElementById("videoMusicId").pause(); //暂停
    //歌曲列表中的歌专辑停止旋转
    tzxz();
  } else {
    //设为正在播放
    variable.sfzzbf.value = true;
    //将正在播放的图标恢复(歌曲列表)
    hfkzans();
    //再将要播放的图标设置
    clickedElement.classList.add("icon-zanting1");
    clickedElement.classList.remove("icon-bofang1");
    // 更新当前播放歌曲
    variable.song.value = music;
    setTimeout(() => {
      variable.music_play.value = "icon-zanting1";
      document.getElementById("videoMusicId").play();
    }, 100);
  }
}

//上一首
const previous = () => {
  eventBus.emit("previous");
  //将正在播放的图标恢复(歌曲列表)
  hfkzans();
};

//下一首
const next = () => {
  eventBus.emit("next");
  //将正在播放的图标恢复(歌曲列表)
  hfkzans();
};

//-----将正在播放的图标恢复(歌曲列表)
function hfkzans() {
  var kzansArr = Array.from(document.getElementsByClassName("kzans"));
  kzansArr.forEach((kzans) => {
    if (kzans.classList.contains("icon-zanting1")) {
      kzans.classList.add("icon-bofang1");
      kzans.classList.remove("icon-zanting1");
    }
  });
}

//切换音乐循环模式
function qhxhms() {
  if (variable.xhIco.value == "ios-repeat") {
    variable.xhIco.value = "ios-shuffle";
    variable.xhTip.value = "随机播放";
  } else if (variable.xhIco.value == "ios-shuffle") {
    variable.xhIcoState.value = false;
    variable.xhIco.value = "dqxh";
    variable.xhTip.value = "单曲循环";
  } else {
    variable.xhIcoState.value = true;
    variable.xhIco.value = "ios-repeat";
    variable.xhTip.value = "顺序播放";
  }
}

// --------------面板音乐列表拖动开始---------------
let isDown = false;
let startX;
let scrollLeft;
const yykpLi = ref(null);

const handleMouseDown = (e) => {
  isDown = true;
  startX = e.pageX - yykpLi.value.offsetLeft;
  scrollLeft = yykpLi.value.scrollLeft;
};

const handleMouseLeave = () => {
  isDown = false;
};

const handleMouseUp = () => {
  isDown = false;
};

const handleMouseMove = (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - yykpLi.value.offsetLeft;
  const walk = (x - startX) * 1; // 调整滑动速度
  yykpLi.value.scrollLeft = scrollLeft - walk;
};

// --------------音乐li拖动结束---------------

// -----------------------------------面板音乐列表鼠标滚轮控制
function scrollInit() {
  // 获取要绑定事件的元素
  const nav = document.getElementById("yykpLi");
  // 添加滚轮滚动监听事件
  nav.addEventListener("wheel", handler, false);
  // 滚动事件的处理函数
  function handler(event) {
    // 获取滚动方向
    const detail = event.wheelDelta || -event.detail;
    // 定义滚动方向，这里使用正负号来表示滚动方向
    const moveForwardStep = 100; // 向前滚动的步长
    const moveBackStep = -100; // 向后滚动的步长
    // 根据滚动方向计算滚动步长
    let step = detail > 0 ? moveBackStep : moveForwardStep;
    // 对需要滚动的元素进行滚动操作
    nav.scrollLeft += step;
  }
}

onMounted(scrollInit);
// -----------------------------------面板音乐列表鼠标滚轮控制
</script>

<style scoped>
/* ------------------------音响一大一小动画------------------------------------------------ */

@keyframes DXscale {
  0% {
    transform: scale(1);
    /* 初始状态，原始大小 */
  }

  50% {
    transform: scale(0.95);
    /* 动画中间，变为两倍大 */
  }

  100% {
    transform: scale(1);
    /* 动画结束，回到原始大小 */
  }
}

/* 将动画应用到元素 */
.dxdh {
  animation-name: DXscale;
  /* 引用动画名称 */
  animation-duration: 2s;
  /* 动画持续时间 */
  animation-timing-function: ease-in-out;
  /* 动画速度曲线 */
  animation-iteration-count: infinite;
  /* 动画无限循环 */
  animation-direction: alternate;
  /* 动画交替进行 */
}

/* ------------------------音响一大一小动画end------------------------------------------------ */

.iconfont {
  cursor: pointer;
}

.songImg_Circle {
  position: relative;
  text-align: center;
  border-radius: 50%;
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: inset 20px 20px 60px #272727, inset -20px -20px 60px #7d7d7d;
  pointer-events: none;
}

.song_info__pic {
  border-radius: 50%;

  width: 140px;
  height: 140px;
}

#geci {
  height: 100%;
  overflow: auto;
  font-size: 16px;
}

#geci::-webkit-scrollbar {
  /*隐藏滚轮*/
  display: none;
}

#geci li {
  color: #fff;
  height: 30px;
  letter-spacing: 1px;
}

.bfkj {
  width: 100%;
  position: absolute;
  bottom: 50px;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

#kzmb {
  padding: 10px 0 0 0;
  background-color: rgba(255, 255, 255, 0.4);
  background-color: #dedede;
  width: 100%;
  height: 100%;
  border-radius: 31px;
  background: #525252;
  box-shadow: 41px 41px 82px #474747, -41px -41px 82px #5d5d5d;
  position: relative;
}

.kzan {
  cursor: pointer;
  color: #a0a0a0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  font-size: 30px;
  border-radius: 50%;
  margin-left: 40px;
  background: linear-gradient(145deg, #585858, #4a4a4a);
  box-shadow: 9px 9px 19px #272727, -9px -9px 19px #7d7d7d;
}

.kzan:active {
  background: #525252;
  box-shadow: inset 5px 5px 10px #212121, inset -5px -5px 10px #838383;
}

#yymbtb {
  position: relative;
  -webkit-user-select: none;
  /* Safari */
  -moz-user-select: none;
  /* Firefox */
  -ms-user-select: none;
  /* IE 10+ */
  user-select: none;
  /* 普通浏览器 */
}

#yykpLi {
  display: flex;
  white-space: nowrap;
  overflow-x: hidden;
  display: flex;
  margin-top: 20px;
  cursor: grabbing;
  /* 改变鼠标指针形状 */
  -webkit-user-select: none;
  /* Safari */
  -moz-user-select: none;
  /* Firefox */
  -ms-user-select: none;
  /* IE 10+ */
  user-select: none;
  /* 普通浏览器 */
}

#yykpLi li {
  position: relative;
  background: #525252;
  box-shadow: inset 5px 5px 11px #212121, inset -5px -5px 11px #838383;
  color: #b9b9b9;
  padding: 0 10px 0 20px;
  width: 400px;
  height: 220px;
  margin-right: 50px;
  border-radius: 20px;
  flex: 0 0 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
}

.song_img {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  pointer-events: none;
}

.kzans {
  position: absolute;
  bottom: 20px;
  right: 20px;
  color: #a0a0a0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  font-size: 30px;
  border-radius: 50%;
  margin-left: 40px;
  background: linear-gradient(145deg, #4a4a4a, #585858);
  box-shadow: 5px 5px 10px #212121, -5px -5px 10px #838383;
}

.kzans:active {
  background: #525252;
  box-shadow: inset 5px 5px 10px #212121, inset -5px -5px 10px #838383;
}

/* ---------------------更换主题按钮-------------- */
.switch-button {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  justify-content: center;
  margin: auto;
  height: 35px;
}

.switch-button .switch-outer {
  height: 100%;
  background: #252532;
  width: 100px;
  border-radius: 165px;
  -webkit-box-shadow: inset 0px 5px 10px 0px #16151c, 0px 3px 6px -2px #403f4e;
  box-shadow: inset 0px 5px 10px 0px #16151c, 0px 3px 6px -2px #403f4e;
  border: 1px solid #32303e;
  padding: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.switch-button .switch-outer input[type="checkbox"] {
  opacity: 0;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  position: absolute;
}

.switch-button .switch-outer .button-toggle {
  height: 25px;
  width: 25px;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(#3b3a4e),
    to(#272733)
  );
  background: -o-linear-gradient(#3b3a4e, #272733);
  background: linear-gradient(#3b3a4e, #272733);
  border-radius: 100%;
  -webkit-box-shadow: inset 0px 5px 4px 0px #424151, 0px 4px 15px 0px #0f0e17;
  box-shadow: inset 0px 5px 4px 0px #424151, 0px 4px 15px 0px #0f0e17;
  position: relative;
  z-index: 2;
  -webkit-transition: left 0.3s ease-in;
  -o-transition: left 0.3s ease-in;
  transition: left 0.3s ease-in;
  left: 0;
}

.switch-button
  .switch-outer
  input[type="checkbox"]:checked
  + .button
  .button-toggle {
  left: 58%;
}

.switch-button
  .switch-outer
  input[type="checkbox"]:checked
  + .button
  .button-indicator {
  -webkit-animation: indicator 1s forwards;
  animation: indicator 1s forwards;
}

.switch-button .switch-outer .button {
  width: 100%;
  height: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  position: relative;
  -webkit-box-pack: justify;
  justify-content: space-between;
}

.switch-button .switch-outer .button-indicator {
  height: 25px;
  width: 25px;
  top: 50%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  border-radius: 50%;
  border: 3px solid #ef565f;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  right: 10px;
  position: relative;
}

@-webkit-keyframes indicator {
  30% {
    opacity: 0;
  }

  0% {
    opacity: 1;
  }

  100% {
    opacity: 1;
    border: 3px solid #60d480;
    left: -68%;
  }
}

@keyframes indicator {
  30% {
    opacity: 0;
  }

  0% {
    opacity: 1;
  }

  100% {
    opacity: 1;
    border: 3px solid #60d480;
    left: -68%;
  }
}

/* ---------------------更换主题按钮end-------------- */

/* 360度无限旋转 */
.wxxz {
  animation: rotate360 5s linear infinite;
}

@keyframes rotate360 {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* 360度无限旋转ned */
</style>