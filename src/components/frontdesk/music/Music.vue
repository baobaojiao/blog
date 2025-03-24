<template>
  <div class="img" style="width: 60px">
    <Avatar
      icon="ios-image-outline"
      size="large"
      :src="variable.song.value.album"
      :style="{
        transform: 'rotate(' + variable.rotateDegree.value + 'deg)',
        width: '45px',
        height: '45px',
      }"
      style="cursor: pointer"
      @on-error="zjError"
      @click="openMusicMb"
    >
    </Avatar>

    <transition name="slide-up">
      <div
        v-show="variable.musicListState.value"
        class="gqlbxd music_playlist"
        @click.stop="handleClickInsideMenu"
      >
        <div
          :id="'navGqLi_' + item.id"
          class="loader"
          v-for="(item, index) in variable.musciList.value"
          :key="item.id"
          @click="switchMusic(index, item.name)"
        >
          <div class="song">
            <Ellipsis class="name" :text="item.name" :lines="1" />
            <Ellipsis class="artist" :text="item.singer" :lines="1" />
          </div>
          <div class="albumcover">
            <img
              :src="item.album"
              style="border-radius: 10px; width: 100%; height: 100%"
            />
          </div>
          <div class="loading" v-if="variable.song.value.id === item.id">
            <div class="load"></div>
            <div class="load"></div>
            <div class="load"></div>
            <div class="load"></div>
          </div>
          <div class="play" v-else></div>
        </div>
      </div>
    </transition>
  </div>

  <div style="width: 180px">
    <div class="music">
      <div class="music_title">{{ variable.song.value.name }}</div>
      <div
        class="music_ico"
        @mouseover="hornMouseOver"
        @mouseout="hornMouseOut"
      >
        <i
          class="iconfont icon-shangyishou1"
          style="font-size: 20px"
          @click="previous"
        ></i>
        <i
          :class="variable.music_play.value"
          class="iconfont"
          style="font-size: 20px"
          @click="play"
        ></i>
        <i
          class="iconfont icon-xiayishou1"
          style="font-size: 20px"
          @click="next"
        ></i>
        <i
          :class="variable.horn.value"
          class="iconfont horn"
          style="font-size: 10px"
          @click="volume"
          v-bind:style="{ opacity: variable.hornState.value }"
        ></i>
      </div>
    </div>
  </div>

  <div>
    <i
      class="iconfont icon-yinle2"
      style="font-size: 30px"
      @click.stop="openList"
    ></i>

    <audio
      @pause="pauseYy"
      @playing="handlePlaying"
      :src="variable.song.value.url"
      id="videoMusicId"
      style="display: none"
      :volume="variable.volumeNum.value"
      @timeupdate="audioTime"
    ></audio>
  </div>

  <!-- 音乐面板 -->
  <MusicMb1 v-if="variable.musicTheme.value == 1" />
  <MusicMb2 v-else />
</template>
<script setup>
import {  Notice } from "view-ui-plus";
import variable from "../../../js/variable.js";
import { eventBus } from "../../../js/eventBus.js";
const MusicMb1 = defineAsyncComponent(() => import("./MusicMb1.vue"));
const MusicMb2 = defineAsyncComponent(() => import("./MusicMb2.vue"));
const axios = inject("axios");

//-------------音乐播放暂停切换START-------------
function play() {
  if (!variable.sfzzbf.value) {
    variable.sfzzbf.value = true;
    document.getElementById("videoMusicId").play(); //播放
  } else {
    variable.sfzzbf.value = false;
    document.getElementById("videoMusicId").pause(); //暂停
  }
}
eventBus.on("play", play);
//----------------音乐播放暂停切换END-------------

//专辑图片加载失败回调函数
function zjError() {
  variable.song.value.album = "";
}

//专辑旋转
function zjxz() {
  //专辑旋转角度置0
  variable.rotateDegree.value = 0;
  //专辑先停止旋转
  clearInterval(variable.intervalIdMusic.value);
  //专辑开始旋转
  variable.intervalIdMusic.value = setInterval(() => {
    variable.rotateDegree.value += 1;
  }, 10);
}

//播放回调函数
function handlePlaying() {
  //设为正在播放
  variable.sfzzbf.value = true;
  //设置播放时长
  variable.song.value.duration =
    document.getElementById("videoMusicId").duration;
  //设置为暂停按钮
  variable.music_play.value = "icon-zanting1";
  //专辑旋转
  zjxz();
  //歌曲播放失败
  document
    .getElementById("videoMusicId")
    .addEventListener("error", function (event) {
      Notice.error({
        title: "歌曲播放失败，自动切换下一首",
      });
      next();
    });

  //歌曲列表定位到正在播放的歌
  document.getElementById("gqzgli_" + variable.song.value.id).scrollIntoView({
    inline: "center",
    behavior: "smooth",
  });

  //根据主题设置不同的回调
  if (variable.musicTheme.value == 1) {
    bfhd1();
  } else {
    bfhd2();
  }
}

//主题1的播放回调方法
function bfhd1() {
  //设置正在播放的歌的按钮为暂停
  setGqli();
  //歌曲列表中的歌专辑开始旋转,先移除正在旋转的，再添加
  var kzansArr = Array.from(document.getElementsByClassName("wxxz"));
  if (kzansArr.length != 0) {
    kzansArr[0].classList.remove("wxxz");
  }
  document
    .getElementById("gqimg_" + variable.song.value.id)
    .classList.add("wxxz");
}

//主题2的播放回调方法
function bfhd2() {
  //歌曲列表对应的歌播放按钮改为暂停按钮（逻辑：先重置所有图标，再设置正在播放的歌）
  setKzans();
  //设置正在播放的歌的按钮为暂停
  setGqli();
}

//歌曲列表对应的歌播放按钮改为暂停按钮（逻辑：先重置所有图标，再设置正在播放的歌）
function setKzans() {
  var kzansArr = Array.from(document.getElementsByClassName("kzans"));
  kzansArr.forEach((kzans) => {
    if (kzans.classList.contains("icon-zanting1")) {
      kzans.classList.add("icon-bofang1");
      kzans.classList.remove("icon-zanting1");
    }
  });
}

//设置正在播放的歌的按钮为暂停
function setGqli() {
  document
    .getElementById("gqli_" + variable.song.value.id)
    .classList.add("icon-zanting1");
  document
    .getElementById("gqli_" + variable.song.value.id)
    .classList.remove("icon-bofang1");
}
eventBus.on("setGqli", setGqli);

//监听当前播放的歌曲
watch(variable.song, (newValue, oldValue) => {
  variable.lyricsObjArr.value.splice(0, variable.lyricsObjArr.value.length); //先清空歌词
  //处理歌词 字符串转数组
  if (variable.song.value.lyric) {
    const lyricsArr = variable.song.value.lyric.split("♡").filter(Boolean);
    lyricsArr.forEach((item) => {
      if (item === "") return;
      const obj = {};
      const time = item.match(/\[\d{2}:\d{2}.\d{2,3}\]/);
      obj.lyric =
        item.split("]")[1].trim() === "" ? "" : item.split("]")[1].trim();
      obj.time = time
        ? formatLyricTime(time[0].slice(1, time[0].length - 1))
        : 0;
      obj.uid = Math.random().toString().slice(-6);
      if (obj.lyric != "") {
        variable.lyricsObjArr.value.push(obj);
      }
    });
  }

  if (variable.musicTheme.value == 2 && variable.musicState.value) {
    //音乐面板中的背景设置专辑图片
    document.getElementById("bg_player").style.display = "none";
    setTimeout(() => {
      document.getElementById("bg_player").style.display = "block";
    }, 1000);
  }
});

//暂停回调函数
function pauseYy() {
  //将图标改为播放按钮
  variable.music_play.value = "icon-bofang1";
  //专辑停止旋转
  clearInterval(variable.intervalIdMusic.value);
  //设为当前未播放
  variable.sfzzbf.value = false;

  //主题1的
  if (variable.musicTheme.value == 1) {
    //先将正在播放的图标恢复（歌曲列表）
    setKzans();
  }
}

const lyricUlRef = ref(null); // 歌单ul标签Dom

//实时获取歌曲播放时间进度
function audioTime(e) {
  var time = e.target.currentTime; //当前播放器时间
  variable.currentTime.value = time;
  variable.timeBfb.value = (time / variable.song.value.duration) * 100; //计算实时播放进度（百分比）

  //----处理页面底部的歌词-----------
    eventBus.emit("cldbgc");

    // 处理音乐面板中的歌词
  if (variable.musicState.value) {
    for (var i = 0; i < variable.lyricsObjArr.value.length; i++) {
      // 遍历歌词列表
      if (time <= variable.lyricsObjArr.value[i].time) {
        if (i > 0) {
          //改变当前播放的歌词颜色
          document.getElementById("geci" + (i - 1).toString()).style.color =
            "#42BD81";
        }
        if (i > 1) {
          //修改已播放的歌词颜色  透明
          document.getElementById("geci" + (i - 2).toString()).style.color =
            "hsla(0,0%,88.2%,.5)";
        }
        if (i > 3) {
          // 计算当前文字绝对高度
          var current_height = i * 30;
          // 滚动滚动条
          document.getElementById("geci").scrollTop = current_height - 30 * 3;
          //修改已播放的歌词颜色  透明
          document.getElementById("geci" + (i - 2).toString()).style.color =
            "hsla(0,0%,88.2%,.8)";
          document.getElementById("geci" + (i - 3).toString()).style.color =
            "hsla(0,0%,88.2%,.5)";
        }
        break;
      }
    }
  }
}

// 格式化歌词的时间 转换成 sss:ms
function formatLyricTime(time) {
  const regMin = /.*:/;
  const regSec = /:.*\./;
  const regMs = /\./;
  const min = parseInt(time.match(regMin)[0].slice(0, 2));
  let sec = parseInt(time.match(regSec)[0].slice(1, 3));
  const ms = time.slice(
    time.match(regMs).index + 1,
    time.match(regMs).index + 3
  );
  if (min !== 0) {
    sec += min * 60;
  }
  return Number(sec + "." + ms);
}

onMounted(() => {
  //查询歌曲列表
  axios
    .post("/music/findMusic", { pageSize: 999 })
    .then((response) => {
      let res = response.data;
      if (res.code == 200 && res.msg == "成功") {
        variable.musciList.value = res.data.records;
        //默认第一首为设为正在播放
        variable.song.value = res.data.records[0];
      }
    })
    .catch();

  // 在组件挂载时监听音乐播放结束事件
  document.getElementById("videoMusicId").addEventListener("ended", () => {
    next();
  });
});

//------------------上一首START--------------------
function previous() {
  // 找到当前播放歌曲在列表中的索引
  const currentIndex = variable.musciList.value.findIndex(
    (item) => item.id === variable.song.value.id
  );
  // 计算上一首歌曲的索引
  const previousIndex =
    (currentIndex - 1 + variable.musciList.value.length) %
    variable.musciList.value.length;
  // 更新当前播放歌曲
  variable.song.value = variable.musciList.value[previousIndex];
  // 直接开始播放
  setTimeout(() => {
    variable.music_play.value = "icon-zanting1";
    document.getElementById("videoMusicId").play();
  }, 100);
  //专辑旋转
  zjxz();
}
eventBus.on("previous", previous);
//------------------上一首END--------------------

//-------------------下一首START------------------
function next() {
  let num = 1; //默认下一首
  // 找到当前播放歌曲在列表中的索引
  const currentIndex = variable.musciList.value.findIndex(
    (item) => item.id === variable.song.value.id
  );
  //判断播放模式
  if (variable.xhIco.value == "ios-shuffle") {
    let sycd = variable.musciList.value.length - currentIndex; //剩余歌曲长度
    num = sycd + Math.floor(Math.random() * sycd); //在剩余歌曲中随机获取一个
  } else if (variable.xhIco.value == "dqxh") {
    num = 0;
  }
  // 计算下一首歌曲的索引
  const nextIndex = (currentIndex + num) % variable.musciList.value.length;
  // 更新当前播放歌曲
  variable.song.value = variable.musciList.value[nextIndex];
  // 直接开始播放
  setTimeout(() => {
    variable.music_play.value = "icon-zanting1";
    document.getElementById("videoMusicId").play();
  }, 100);
  //专辑旋转
  zjxz();
}
eventBus.on("next", next);
//-------------------下一首END------------------

//------------------------选择歌曲开始播放或暂停START--------------
function switchMusic(index, name) {
  //如果选中的是当前播放的正常执行播放或暂停逻辑
  if (variable.song.value.name == name) {
    //当前为暂停，所以开始播放
    if (!variable.sfzzbf.value) {
      // 更新当前播放歌曲
      variable.song.value = variable.musciList.value[index];
      //设为当前正在播放
      variable.sfzzbf.value = true;
      // 直接开始播放
      setTimeout(() => {
        variable.music_play.value = "icon-zanting1";
        document.getElementById("videoMusicId").play();
      }, 100);
      //专辑旋转
      zjxz();
    } else {
      //设为当前未播放
      variable.sfzzbf.value = false;
      //暂停
      document.getElementById("videoMusicId").pause();
      //修改图标为播放
      variable.music_play.value = "icon-bofang1";
      //专辑停止旋转
      clearInterval(variable.intervalIdMusic.value);
    }
  } else {
    //如果选中的不是当前播放的直接更换选中的歌曲开始播放
    //设为当前正在播放
    variable.sfzzbf.value = true;
    // 更新当前播放歌曲
    variable.song.value = variable.musciList.value[index];
    // 直接开始播放
    setTimeout(() => {
      variable.music_play.value = "icon-zanting1";
      document.getElementById("videoMusicId").play();
    }, 100);
    //专辑旋转
    zjxz();
  }
}
eventBus.on("switchMusic", (data) => {
  switchMusic(data.index, data.name);
});
//------------------------选择歌曲开始播放或暂停END--------------

//---------------------音量切换START------------------
function volume() {
  if (variable.horn.value == "icon-24gf-volumeHigh") {
    variable.horn.value = "icon-24gf-volumeLow";
    variable.volumeNum.value = 0.5;
  } else if (variable.horn.value == "icon-24gf-volumeLow") {
    variable.horn.value = "icon-24gf-volumeCross";
    variable.volumeNum.value = 0;
  } else {
    variable.horn.value = "icon-24gf-volumeHigh";
    variable.volumeNum.value = 1;
  }
}
//---------------------音量切换END------------------

//------------------音量显示与隐藏START--------------------
function hornMouseOver() {
  variable.hornState.value = 1;
}
function hornMouseOut() {
  variable.hornState.value = 0;
}
//------------------音量显示与隐藏END--------------------

//打开音乐面板
const openMusicMb = () => {
  variable.musicState.value = !variable.musicState.value;
  //歌曲列表定位到正在播放的歌
  setTimeout(() => {
    document
      .getElementById("gqzgli_" + variable.song.value.id)
      .scrollIntoView({ inline: "center" });
  }, 0);

  if (variable.sfzzbf.value) {
    //设置正在播放的歌的按钮为暂停
    setGqli();
  }
};

//打开音乐列表（导航栏）
function openList() {
  variable.musicListState.value = !variable.musicListState.value;
  //定位歌曲
  setTimeout(() => {
    document
      .getElementById("navGqLi_" + variable.song.value.id)
      .scrollIntoView({
        inline: "center",
        behavior: "smooth",
      });
  }, 0);
}
</script>

<style scoped>
.iconfont {
  cursor: pointer;
}

.music {
  margin-left: 5px;
  color: #d0d5f0;
}

.music_title {
  width: 80%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #fff;
  mix-blend-mode: difference;
}

.music_ico {
  width: 65%;
  display: flex;
  justify-content: space-between;
  color: #fff;
  mix-blend-mode: difference;
}

#gdjzan {
  color: #fff;
  mix-blend-mode: difference;
}

.horn {
  margin-top: 10px;
  cursor: pointer;
}

.m_ico {
  cursor: pointer;
}

#jdt {
  width: 99%;
  position: absolute;
  bottom: 0px;
  left: 0;
}

#yyapiDiv {
  display: flex;
  justify-content: space-between;
  padding-top: 10px;
}

/* --------------外部音乐列表--------------------- */
.music_playlist {
  overflow: auto;
  width: 260px;
  height: 240px;
  background-color: rgb(109, 131, 187, 0.9);
  position: fixed;
  top: 70px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.music_playlist::-webkit-scrollbar {
  display: none;
}

.gqlbxd {
  background-color: white;
  padding: 1em;
  padding-bottom: 1.1em;
  border-radius: 15px;
  margin: 1em;
}

.loader {
  display: flex;
  flex-direction: row;
  height: 4em;
  padding-left: 1em;
  padding-right: 1em;
  transform: rotate(180deg);
  justify-content: right;
  border-radius: 10px;
  transition: 0.4s ease-in-out;
}

.loader:hover {
  cursor: pointer;
  background-color: lightgray;
}

.loading {
  display: flex;
  margin-top: 1em;
  margin-left: 0.3em;
}

.load {
  width: 2px;
  height: 33px;
  background-color: limegreen;
  animation: 1s move6 infinite;
  border-radius: 5px;
  margin: 0.1em;
}

.load:nth-child(1) {
  animation-delay: 0.2s;
}

.load:nth-child(2) {
  animation-delay: 0.4s;
}

.load:nth-child(3) {
  animation-delay: 0.6s;
}

.play {
  position: relative;
  left: 0.35em;
  height: 1.6em;
  width: 1.6em;
  clip-path: polygon(50% 50%, 100% 50%, 75% 6.6%);
  background-color: black;
  transform: rotate(-90deg);
  align-self: center;
  margin-top: 0.7em;
  justify-self: center;
}

.albumcover {
  position: relative;
  margin-right: 1em;
  height: 40px;
  width: 40px;
  background-color: rgb(233, 232, 232);
  align-self: center;
  border-radius: 5px;
}

.song {
  position: relative;
  transform: rotate(180deg);
  margin-right: 1em;
  color: black;
  align-self: center;
}

.artist {
  font-size: 0.6em;
}

@keyframes move6 {
  0% {
    height: 0.2em;
  }

  25% {
    height: 0.7em;
  }

  50% {
    height: 1.5em;
  }

  100% {
    height: 0.2em;
  }
}

/* --------------外部音乐列表end--------------------- */
</style>
