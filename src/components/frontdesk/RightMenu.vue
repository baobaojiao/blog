<template>
  <!-- 右击菜单 -->
  <transition name="ease">
    <ul
      class="RightMenu"
      v-show="variable.visible.value"
      :style="{
        left: variable.yjLeft.value + 'px',
        top: variable.yjTop.value + 'px',
      }"
      @click.stop="handleClickInsideMenu"
    >
      <div id="menu_top">
        <Tooltip content="复制" placement="top" class="copy" @click.stop="copy">
          <div><Icon type="md-copy" size="20" /></div>
        </Tooltip>

        <Tooltip
          content="粘贴"
          placement="top"
          class="zt"
          @click.stop="zhantie"
        >
          <div><Icon type="md-clipboard" size="20" /></div>
        </Tooltip>
      </div>

      <div>
        <div class="musicKz">
          <p class="xsgc" @click="updGcState">{{ lyricFont }}</p>
          <Tooltip
            class="xh"
            :content="variable.xhTip.value"
            placement="top"
            @click="qhxhms"
          >
            <div style="display: flex">
              <Icon
                :type="variable.xhIco.value"
                size="25"
                v-show="variable.xhIcoState.value"
              />
              <svg
                class="icon"
                aria-hidden="true"
                v-show="!variable.xhIcoState.value"
              >
                <use xlink:href="#icon-danquxunhuan"></use>
              </svg>
            </div>
          </Tooltip>
        </div>
        <div class="lijdkz">
          <Icon class="li" type="md-volume-down" size="20" />
          <Slider
            class="slider"
            v-model="variable.volumeNum.value"
            :max="1"
            :step="0.1"
            show-tip="never"
          ></Slider>
        </div>
      </div>

      <div @click="refreshPage" class="caid">
        <Icon type="md-refresh" size="20" />
        &nbsp; &nbsp;
        <p>刷新网页</p>
      </div>

      <div @click="goLink" id="about">
        <Icon type="ios-information-circle" size="20" />
        &nbsp; &nbsp;
        <p>关于博客</p>
      </div>
    </ul>
  </transition>
</template>
<script setup>
import { Copy, Notice } from "view-ui-plus";
import variable from "../../js/variable";
import { handleClickInsideMenu } from "../../js/stopClosing";
const router = useRouter();

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

//修改歌词状态
const lyricFont = ref("显示歌词");

function updGcState() {
  variable.lyricState.value = !variable.lyricState.value;
  if (variable.lyricState.value) {
    lyricFont.value = "关闭歌词";
  } else {
    lyricFont.value = "显示歌词";
  }
}

//刷新页面
function refreshPage() {
  window.location.reload();
}

//复制选中的文本
const copy = () => {
  if (variable.selectedText.value != null) {
    Copy({
      text: variable.selectedText.value,
    });
  } else {
    Notice.warning({
      title: "你要复制什么呢？",
    });
  }
  variable.visible.value = false; //关闭右击菜单
};

//粘贴
const zhantie = () => {
  let event = variable.jycsdz.value.target.nodeName;
  if (event == "INPUT" || event == "TEXTAREA") {
    navigator.clipboard
      .readText()
      .then((text) => {
        variable.jycsdz.value.target.value += text;
      })
      .catch((err) => {
        Notice.warning({
          title: "权限被拒绝",
        });
      });
  } else {
    Notice.warning({
      title: "此位置不支持粘贴",
    });
  }
  variable.visible.value = false; //关闭右击菜单
};

const goLink = () => {
  router.push({ name: "About" });
  variable.visible.value = false; //关闭右击菜单
};
</script>

<style  scoped>
.RightMenu {
  width: 150px;
  border-radius: 10px;
  position: absolute;
  z-index: 99999;
  background-color: #fff;
  color: #000;
  border: 1px solid #757575;
  box-shadow: 7.1px 5.4px 18.5px rgba(0, 0, 0, 0.065),
    57px 43px 148px rgba(0, 0, 0, 0.13);
}

.caid {
  cursor: pointer;
  display: flex;
  padding: 12px 15px 12px 15px;
}

.caid:hover {
  background-color: #8ea9e2;
  color: #fff;
}

#about {
  cursor: pointer;
  display: flex;
  padding: 15px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

#about:hover {
  background-color: #8ea9e2;
  color: #fff;
}

.RightMenu > li {
  line-height: 50px;
  letter-spacing: 1px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.musicKz {
  display: flex;
  align-items: center;
  line-height: 50px;
  letter-spacing: 1px;
  cursor: pointer;
  border-top: 1px solid rgb(223, 223, 223);
  border-bottom: 1px solid rgb(223, 223, 223);
}

.musicKz > p {
  text-align: center;
  flex: 2;
  border-right: 1px solid rgb(223, 223, 223);
}

.xh {
  flex: 1;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.xsgc:hover {
  background-color: #8ea9e2;
  color: #fff;
}

.xh:hover {
  background-color: #8ea9e2;
  color: #fff;
}

.lijdkz {
  width: 100%;
  padding: 0 15px 10px 15px;
  display: flex;
  align-items: center;
}

.li {
  flex: 1;
  padding-right: 10px;
}

.slider {
  flex: 3;
}

.icon {
  width: 20px;
  height: 20px;
}

#menu_top {
  height: 45px;
  display: flex;
  justify-content: space-between;
}
#menu_top > div {
  cursor: pointer;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.copy {
  border-top-left-radius: 10px;
}

.zt {
  border-top-right-radius: 10px;
}

#menu_top > div:hover {
  background-color: #8ea9e2;
  color: #fff;
}
</style>