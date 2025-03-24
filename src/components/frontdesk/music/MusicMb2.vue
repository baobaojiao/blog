<template>
  <!-- 音乐面板 -->
  <Drawer
    placement="top"
    v-model="variable.musicState.value"
    height="100"
    :lock-scroll="true"
    :styles="{
      'background-image': 'linear-gradient(to top, #6a85b6 0%, #bac8e0 100%)',
    }"
  >
    <template #close>
      <Icon type="md-close-circle" :size="40" />
    </template>

    <div
      id="bg_player"
      :style="{
        'background-image': 'url(' + variable.song.value.album + ')',
      }"
    ></div>
    <div style="position: relative">
      <div>
        <div style="display: flex">
          <p style="font-size: 20px; color: #fff" @click="musicDj">
            音乐面板
          </p>

          <Tooltip content="修改音乐主题" theme="light" style="margin: 0 auto">
            <label class="switch-button" for="switch" @click="setMusicTheme()">
              <div class="switch-outer">
                <input id="switch" type="checkbox" />
                <div class="button">
                  <span class="button-toggle"></span>
                  <span class="button-indicator"></span>
                </div>
              </div>
            </label>
          </Tooltip>
        </div>

        <div style="padding: 50px 100px 0; display: flex">
          <div style="width: 70%">
            <div style="margin-bottom: 40px">
              <Button
                type="default"
                ghost
                icon="ios-arrow-dropright"
                size="large"
                @click="allPlay"
                >全部播放</Button
              >
              <!-- <Button
                type="default"
                ghost
                icon="ios-list"
                size="large"
                style="margin: 0 10px"
                >播放列表</Button
              >
              <Button type="default" ghost icon="ios-search" size="large"
                >歌曲搜索</Button
              > -->
            </div>
            <div id="musicList">
              <ul id="mbUl">
                <li>
                  <span style="padding-left: 20px">歌曲</span>
                  <span>歌手</span>
                  <span>操作</span>
                </li>

                <li
                  :id="'gqzgli_' + item.id"
                  v-for="(item, index) in variable.musciList.value"
                  :key="item.id"
                >
                  <span>{{ index + 1 }}&nbsp;&nbsp;&nbsp;{{ item.name }}</span>
                  <span>{{ item.singer }}</span>
                  <span>
                    <i
                      :id="'gqli_' + item.id"
                      class="iconfont icon-bofang1 kzans"
                      style="font-size: 30px"
                      @click="switchMusic(index, item.name)"
                    ></i>
                    <!-- :id="'kzans' + item.name" -->
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div style="width: 30%; text-align: center">
            <div class="songImg">
              <img
                class="song_info__pic"
                loading="lazy"
                :src="variable.song.value.album"
              />
              <img
                style="margin-left: 22px"
                src="/other/album_cover_player.png"
              />
            </div>
            <div id="geciInfo">
              <span>歌曲名：{{ variable.song.value.name }}</span>
              <span>歌手：{{ variable.song.value.singer }}</span>
            </div>
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

      <div class="bfkj">
        <i
          class="iconfont icon-shangyishou1"
          style="font-size: 40px; color: #fff"
          @click="previous"
        ></i>
        <i
          :class="variable.music_play.value"
          class="iconfont"
          style="font-size: 50px; color: #fff"
          @click="play"
        ></i>
        <i
          class="iconfont icon-xiayishou1"
          style="font-size: 40px; color: #fff"
          @click="next"
        ></i>

        <!-- 歌曲进度条 -->
        <div style="width: 70%; margin: 0 20px 0 40px">
          <span style="color: #e2e2e2"
            >{{ variable.song.value.name }} -
            {{ variable.song.value.singer }}</span
          >
          <Slider
            v-model="variable.currentTime.value"
            show-tip="never"
            :step="0.1"
            :max="variable.song.value.duration"
            @on-change="musicJdOnChange"
          ></Slider>
        </div>

        <!-- 循环模式 -->
        <Tooltip
          :content="variable.xhTip.value"
          placement="top"
          @click="qhxhms"
        >
          <div style="display: flex; margin: 0 20px">
            <Icon
              color="#fff"
              :type="variable.xhIco.value"
              size="40"
              v-show="variable.xhIcoState.value"
            />
            <svg
              style="width: 40px; height: 31px"
              aria-hidden="true"
              v-show="!variable.xhIcoState.value"
            >
              <use xlink:href="#icon-danquxunhuan"></use>
            </svg>
          </div>
        </Tooltip>

        <!-- 音量控制 -->
        <Icon type="ios-volume-up" size="40" color="#fff" />
        <div style="width: 5%; margin-left: 5px">
          <Slider
            v-model="variable.volumeNum.value"
            :max="1"
            :step="0.1"
            show-tip="never"
          ></Slider>
        </div>
      </div>
    </div>
  </Drawer>
</template>
<script setup>
import variable from "../../../js/variable.js";
import { eventBus } from "../../../js/eventBus.js";

//修改面板主题
function setMusicTheme() {
  localStorage.setItem("musicTheme", 1);
  variable.musicTheme.value = 1;
}

onMounted(() => {
  //为了切换到主题时修改正在播放的歌曲按钮
  if (variable.sfzzbf.value) {
    //设置正在播放的歌的按钮为暂停
    eventBus.emit("setGqli");

    //为了切换到主题时定位正在播放歌曲
    setTimeout(() => {
      document
        .getElementById("gqzgli_" + variable.song.value.id)
        .scrollIntoView({ inline: "center" });
    }, 0);
  }
});

//将正在播放的图标恢复(歌曲列表)
function setAnBf() {
  var kzansArr = Array.from(document.getElementsByClassName("kzans"));
  kzansArr.forEach((kzans) => {
    if (kzans.classList.contains("icon-zanting1")) {
      kzans.classList.add("icon-bofang1");
      kzans.classList.remove("icon-zanting1");
    }
  });
}

//-------------音乐播放暂停切换START-------------
function play() {
  eventBus.emit("play");
  //先将正在播放的图标恢复(歌曲列表)
  setAnBf();
}
//----------------音乐播放暂停切换END-------------

//上一首
const previous = () => {
  eventBus.emit("previous");
};

//下一首
const next = () => {
  eventBus.emit("next");
  //先将正在播放的图标恢复(歌曲列表)
  setAnBf();
};

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

//全部播放
const allPlay = () => {
  if (variable.musciList.value.length > 0) {
    variable.song.value = variable.musciList.value[0];
    //设为正在播放
    variable.sfzzbf.value = true;
    setTimeout(() => {
      document.getElementById("videoMusicId").play(); //播放
    }, 500);
  }
};

//------------------------选择歌曲开始播放或暂停START--------------
function switchMusic(index, name) {
  eventBus.emit("switchMusic", { index: index, name: name });
  setAnBf();
}

//歌曲进度条在松开滑动时触发
const musicJdOnChange = (num) => {
  //修改歌曲播放进度
  document.getElementById("videoMusicId").currentTime = num;
  //开始播放
  document.getElementById("videoMusicId").play();
};
</script>
<style  scoped>
.iconfont {
  cursor: pointer;
}

/* 音乐面板 */
#bg_player {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50%;
  filter: blur(85px);
  opacity: 0;
  animation: musicBg 1s linear both;
}

@keyframes musicBg {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 0.6;
  }
}

#musicList {
  height: 500px;
  overflow: auto;
  margin: 0 20px 0 0;
}
#musicList::-webkit-scrollbar {
  width: 0.3rem;
  background-color: #f5f5f5;
}
#musicList::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: #f5f5f5;
}
#musicList::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px #bbbbbb;
  background-color: #eeeeeec7;
}

#mbUl li {
  display: flex;
  font-size: 16px;
  color: #f3f3f3;
  border-bottom: 1px solid rgba(150, 150, 150, 0.3);
  line-height: 50px;
}
#mbUl li span:nth-child(1) {
  width: 60%;
}
#mbUl li span:nth-child(2) {
  width: 30%;
}
#mbUl li span:nth-child(3) {
  width: 10%;
}

.songImg {
  position: relative;
  display: flex;
  justify-content: center;
  height: 186px;
}
.songImg img {
  position: absolute;
  width: 186px;
  height: 186px;
}

#geciInfo {
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 20px 0 50px 0;
  font-size: 16px;
}
#geci {
  height: 300px;
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
  position: fixed;
  bottom: 40px;
  left: 0;
  padding: 0 60px;
  display: flex;
  align-items: center;
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
</style>