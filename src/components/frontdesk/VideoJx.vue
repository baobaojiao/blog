<template>
  <div class="main">
    <div class="wzlxzt">
      <el-card>
        <div class="yghz">
          <div
            class="videoMain"
            id="videoMain"
            @mouseenter="sbyr"
            @mouseleave="handleMouseLeave"
          >
            <iframe
              :src="videoSrc"
              frameborder="0"
              class="video"
              allowfullscreen="true"
            ></iframe>
            <div @click="wyqpSj" id="video_zz">
              <Tooltip content="网页全屏" placement="left" theme="light">
                <Icon type="md-browsers" color="#B5A6A7" />
              </Tooltip>
            </div>
          </div>

          <div style="display: flex; width: 100%">
            <div class="jk">选择接口</div>
            <el-select
              v-model="videoApi"
              style="flex: 1"
              placeholder="默认接口，若无法解析，请更换其它接口"
            >
              <el-option
                v-for="item in videoApiList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>

          <el-input v-model="videoUrl" placeholder="请输入视频地址连接">
            <template #prepend>视频地址</template>
          </el-input>
          <Button type="primary" long @click="play">开 始 解 析</Button>
        </div>
        <div style="margin-top: 30px">
          <h2 class="marginb20">🏳‍🌈解析教程：</h2>
          <p class="marginb10">
            🧡第一步：进入【<a>影视的官网</a>】 ,比如<a
              href="https://v.qq.com/"
              target="_blank"
              >腾讯视频</a
            >
          </p>
          <p class="marginb10">
            💛第二步：点击进入你需要看的影视页面，选择你要看的集数（例如：《繁花》--&gt;第一集）,复制链接（浏览器上的视频地址）。
          </p>
          <p class="marginb10">
            💚第三步：将复制的链接粘贴到上面的【视频地址】输入框中，然后点击【开始解析】，然后就可以免费看啦！
          </p>
          <p class="marginb20">
            💌<span style="color: red"
              ><strong>注：</strong>如果不能正常解析，请更换解析路线</span
            >
          </p>
          <h2 class="marginb10">🈸免责声明：</h2>
          <p style="background-color: #f4dbf2; padding: 20px">
            <strong
              ><h3 style="color: #fb2121">
                本站服务器仅展示第三方网站接口页面，并不存储任何视频资源。因此经由本站搜索所产生的任何结果皆不代表本站立场，本站不对其真实合法性以及版权负责，亦不承担任何法律责任。本站所有接口皆源于互联网，仅供学习交流。
              </h3></strong
            >
          </p>
        </div>
      </el-card>
    </div>
  </div>
</template>
  <script setup>
//视频接口
const videoApiList = ref([
  {
    label: "默认接口，若无法解析，请更换其它接口",
    value: "https://jx.xmflv.cc/?url=",
  },
  {
    label: "备用接口1",
    value: "https://z1.m1907.top/?jx=",
  },

  {
    label: "备用接口3",
    value: "https://api.qianqi.net/vip/?url=",
  },
  {
    label: "备用接口4",
    value: "https://jx.m3u8.tv/jiexi/?url=",
  },
  {
    label: "备用接口5",
    value: "https://www.yemu.xyz/?url=",
  },
  {
    label: "备用接口6",
    value: "https://jx.aidouer.net/?url=",
  },
  {
    label: "备用接口7",
    value: "https://im1907.top/?jx=",
  },
  {
    label: "备用接口8",
    value: "https://43.240.74.102:4433?url=",
  },
  {
    label: "备用接口9",
    value: "https://jx.xmflv.com/?url=",
  },
  {
    label: "备用接口10",
    value: "https://www.pouyun.com/?url=",
  },
  {
    label: "备用接口11",
    value: "https://www.8090g.cn/?url=",
  },
  {
    label: "备用接口12",
    value: "https://jx.playerjy.com/?url=",
  },
  {
    label: "备用接口13",
    value: "https://jx.yangtu.top/?url=",
  },
  {
    label: "备用接口14",
    value: "https://www.ckplayer.vip/jiexi/?url=",
  },
  {
    label: "备用接口15",
    value: "https://jx.jsonplayer.com/player/?url=",
  },
]);
//当前选中的api
const videoApi = ref("https://jx.xmflv.cc/?url=");
//视频地址
const videoUrl = ref();
//视频播放的src
const videoSrc = ref("https://jx.xmflv.cc/?url=");

//开始解析
const play = () => {
  videoSrc.value = videoApi.value + videoUrl.value;
  document.getElementById("video_zz").style.opacity = "1";
};

//网页全屏
let qpState = false;
const wyqpSj = () => {
  var videoMain = document.getElementById("videoMain");
  if (!qpState) {
    videoMain.style.position = "fixed";
    videoMain.style.top = "0";
    videoMain.style.left = "0";
    videoMain.style.width = "100%";
    videoMain.style.height = "100%";
    videoMain.style.zIndex = "999";
  } else {
    videoMain.style.position = "";
    videoMain.style.top = "";
    videoMain.style.left = "";
    videoMain.style.width = "";
    videoMain.style.height = "";
    videoMain.style.zIndex = "";
  }
  qpState = !qpState;
};

//鼠标移入事件
const sbyr = () => {
  document.getElementById("video_zz").style.opacity = "1";
};

const handleMouseLeave = () => {
  document.getElementById("video_zz").style.opacity = "0";
};
</script>
  <style scoped>
.main {
  /* user-select: none; */
  width: 100%;
  margin-top: 70px;
  background-color: #f1f3f4;
  display: flex;
  min-height: 800px;
}

.wzlxzt {
  width: 75%;
  margin: 20px auto;
  border-radius: 5px;
  box-shadow: 0 8px 16px -4px #2c2d300c;
  letter-spacing: 1px;
}

.yghz {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 770px;
}
p {
  font-size: 16px;
}

.marginb10 {
  margin-bottom: 10px;
}
.marginb20 {
  margin-bottom: 20px;
}
.videoMain {
  position: relative;
  width: 100%;
  height: 600px;
}
.video {
  width: 100%;
  height: 100%;
  background-color: #000;
  border-radius: 10px;
  position: absolute;
}
#video_zz {
  position: absolute;
  right: 20px;
  top: 30%;
  background-color: #000000b3;
  z-index: 1200;
  padding: 8px 11px;
  border-radius: 50%;
  cursor: pointer;
  opacity: 0;
}

.jk {
  background-color: #f5f7fa;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom-left-radius: 2px;
  border-top-left-radius: 3px;
  border-top: 1px solid #dcdfe6;
  border-left: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
  color: #909399;
}

/* -----------评论START-------------- */
.comment > h2 {
  padding: 70px 0 20px;
}

#yjplk {
  position: relative;
}

/* -----------评论END-------------- */

@media (max-width: 1000px) {
  .wzlxzt {
    width: 100%;
    margin: 0;
  }
  .videoMain {
    height: 300px;
  }

  .yghz {
    flex-direction: column;
    height: 500px;
  }

  .sj {
    width: 100%;
  }

  .sjDIv {
    top: 20px;
    left: 10px;
  }

  .game {
    display: none;
  }

  .comment {
    display: none;
  }
}
</style>