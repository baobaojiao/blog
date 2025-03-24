<template>
  <Starrysky />

  <div @click="closeMenu($event)" @contextmenu.prevent="openMenu($event)" style="position: relative" id="IMain">
    <div class="main">
      <!-- 顶部导航 -->
      <Navbar />

      <!-- 中心 -->
      <router-view> </router-view>

      <!-- 右击菜单 -->
      <RightMenu />

      <!-- 底部歌词 -->
      <ul class="lyricUl" ref="lyricUlRef" v-if="variable.lyricState.value">
        <li class="lyricLi" v-for="item in variable.lyricsObjArr.value" :key="item.uid" :style="{
          color: variable.currentTime.value >= item.time ? '#fff' : '#5c5c5c',
        }">
          {{ item.lyric }}
        </li>
      </ul>
    </div>

    <BackTopCat />
    <Yejiao />
  </div>
</template>

<script setup>
import { eventBus } from "../../js/eventBus.js";
import { ScrollTop } from "view-ui-plus";
import Starrysky from "../Starrysky.vue";
import variable from "../../js/variable";
import Navbar from "./Navbar.vue";
import WelcomeLog from "../WelcomeLoading.vue";
const RightMenu = defineAsyncComponent(() => import("./RightMenu.vue"));
const Yejiao = defineAsyncComponent(() => import("./Yejiao.vue"));
const BackTopCat = defineAsyncComponent(() => import("./BackTopCat.vue"));

const axios = inject("axios");
const route = useRoute();
onMounted(() => {
  //首次进入欢迎弹窗
  (async () => {
    if (!localStorage.getItem("adublogHY")) {
      try {
        const response = await axios.get(
          "https://api.vvhan.com/api/visitor.info"
        );
        const data = response.data;
        if (data.success) {
          ElNotification({
            icon: WelcomeLog,
            title: "你好",
            dangerouslyUseHTMLString: true,
            message:
              "欢迎来自" +
              data.location +
              "的小伙伴<br/><a>" +
              data.system +
              " " +
              data.browser +
              "</a>",
            showClose: false,
            offset: 80,
            duration: 2500,
          });
          localStorage.setItem("adublogHY", true);
        }
      } catch (error) {
        // 请求失败，捕获并处理错误
        console.error("Error:", error);
      }
    }
  })();
  //粒子
  async (engine) => {
    await loadSlim(engine);
  };

  // 实时监听窗口大小
  window.addEventListener("resize", () => {
    variable.windowWidth.value = window.innerWidth;
  });
});
onUnmounted(() => {
  window.removeEventListener("resize", () => {
    variable.windowWidth.value = window.innerWidth;
  });
});

//打开右击菜单
function openMenu(e) {
  //阻止默认右键事件
  e.preventDefault();
  //阻止冒泡
  e.stopPropagation();

  // 获取鼠标点击的坐标
  const x = e.clientX;
  const y = e.clientY;

  // 考虑页面滚动
  const scrollX = window.pageXOffset;
  const scrollY = window.pageYOffset;

  // 计算菜单应该出现的位置
  variable.yjLeft.value = x + scrollX + 10;

  if (route.name != "Article") {
    variable.yjTop.value = y + scrollY - 70;
  } else {
    variable.yjTop.value = y + scrollY;
  }

  //显示
  variable.visible.value = true;

  // 获取当前选中的文本
  const selection = window.getSelection();
  const selectedText = selection.toString();
  if (selectedText.trim() != "") {
    variable.selectedText.value = selectedText.trim();
  } else {
    variable.selectedText.value = null;
  }
  // 获取当前选中的文本 end

  //将右击地方处的事件储存起来【用于粘贴】
  variable.jycsdz.value = e;
}

// 全局点击关闭
function closeMenu(e) {
  variable.visible.value = false; //关闭右击菜单
  variable.musicListState.value = false; //关闭歌单列表
  //关闭表情
  Array.from(document.getElementsByClassName("bq")).forEach(function (el) {
    el.style.display = "none";
  });

  //关闭头像挂件
  Array.from(document.getElementsByClassName("pendantDiv")).forEach(function (
    el
  ) {
    el.style.display = "none";
  });
}


//---------------------处理页面底部的歌词---------------
const lyricUlRef = ref(null); // 歌单ul标签Dom
function cldbgc() {
  // 获取所有颜色为白色的歌词li元素
  const lyricLiCollection = document.getElementsByClassName("lyricLi");
  const whiteLiArray = Array.from(lyricLiCollection).filter(
    (li) => li.style.color === "rgb(255, 255, 255)"
  );
  const whiteLiCount = whiteLiArray.length;
  //根据白色li个数定位到指定的位置
  ScrollTop(lyricUlRef.value, {
    to: (whiteLiCount - 1) * 20,
    time: 1000,
  });
}
eventBus.on("cldbgc", cldbgc);
//---------------------处理页面底部的歌词end---------------
</script>

<style scoped>
/* ------------歌词---------------------- */
.lyricUl {
  text-align: center;
  width: 100%;
  height: 40px;
  position: fixed;
  bottom: 0;
  left: 0;
  overflow: auto;
  color: #ddd;
  font-size: 14px;
  font-weight: normal;
  border-left: none;
  letter-spacing: 2px;
  background-color: rgb(121 121 121 / 30%);
}

.lyricUl::-webkit-scrollbar {
  display: none;
}

.lyricLi {
  height: 20px;
}

/* ------------歌词end---------------------- */
</style>
