<template>
<transition name="move-up">
    <div
            class="dbNav"
            :style="{ backgroundColor: variable.navBackground.value }"
            v-show="navState"
    >
    <div class="NAV dbNav_log">
      <div
        @click="goHome"
        @mouseenter="homeHandleMouseEnter"
        @mouseleave="HomeHhandleMouseLeave"
      >
        <Image class="logo" :src="variable.pz_all.value.logo" v-show="logoType">
          <template #error>
            <Icon type="ios-image-outline" size="28" />
          </template>
        </Image>

        <Image class="logo" v-show="!logoType">
          <template #error>
            <Icon type="md-home" size="28" color="#fff" v-show="!logoType" />
          </template>
        </Image>
      </div>
    </div>

    <div class="NAV dbNav_weather">
      <transition name="move-up">
        <div v-show="variable.tqState.value">
          <!-- 这里可以放天气插件 -->
        </div>
      </transition>
      <div v-show="!variable.tqState.value">
        <Input
          search
          placeholder="搜索文章"
          @on-focus="searchModalState = true"
        >
          <template #prefix>
            <svg class="ssIco" aria-hidden="true">
              <use xlink:href="#icon-yushouhuore"></use>
            </svg>
          </template>
        </Input>
      </div>

      <Modal v-model="searchModalState" :footer-hide="true" :width="30">
        <div style="height: 60vh">
          <span style="font-size: 23px; font-weight: 700; color: #49b1f5"
            >本地搜索</span
          >
          <input
            v-model="ssTitle"
            type="text"
            id="searchInput"
            placeholder="搜索文章"
            autocomplete="off"
          />

          <!-- 分割特效 -->
          <div
            style="display: flex; justify-content: space-between; padding: 10px"
          >
            <div class="loader">
              <svg viewBox="0 0 80 80">
                <rect x="8" y="8" width="64" height="64"></rect>
                <text
                  x="50%"
                  y="60%"
                  text-anchor="middle"
                  fill="black"
                  font-size="24"
                  font-weight="bold"
                >
                  热
                </text>
              </svg>
            </div>

            <div class="loader">
              <svg viewBox="0 0 80 80">
                <rect x="8" y="8" width="64" height="64"></rect>
                <text
                  x="50%"
                  y="60%"
                  text-anchor="middle"
                  fill="black"
                  font-size="24"
                  font-weight="bold"
                >
                  搜
                </text>
              </svg>
            </div>

            <div class="loader">
              <svg viewBox="0 0 80 80">
                <rect x="8" y="8" width="64" height="64"></rect>
                <text
                  x="50%"
                  y="60%"
                  text-anchor="middle"
                  fill="black"
                  font-size="24"
                  font-weight="bold"
                >
                  文
                </text>
              </svg>
            </div>

            <div class="loader">
              <svg viewBox="0 0 80 80">
                <rect x="8" y="8" width="64" height="64"></rect>
                <text
                  x="50%"
                  y="60%"
                  text-anchor="middle"
                  fill="black"
                  font-size="24"
                  font-weight="bold"
                >
                  章
                </text>
              </svg>
            </div>
          </div>

          <!-- 文章 -->
          <ul id="ss_ul" v-if="topSearchDate">
            <li
              class="ss_li"
              v-for="item in topSearchDate"
              :key="item.id"
              @click="goArticle(item.id, item.encryption)"
            >
              <div style="display: flex; align-items: center">
                <div class="yuan"></div>
                <Ellipsis class="ss_title" :text="item.title" :lines="2" />
              </div>
            </li>
          </ul>

          <!-- 空状态 -->
          <div class="loaderJZ" v-if="topSearchDate == ''">
            <div class="loaderMiniContainer">
              <div class="barContainer">
                <span class="bar"></span>
                <span class="bar bar2"></span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 101 114"
                class="svgIcon"
              >
                <circle
                  stroke-width="7"
                  stroke="black"
                  transform="rotate(36.0692 46.1726 46.1727)"
                  r="29.5497"
                  cy="46.1727"
                  cx="46.1726"
                ></circle>
                <line
                  stroke-width="7"
                  stroke="black"
                  y2="111.784"
                  x2="97.7088"
                  y1="67.7837"
                  x1="61.7089"
                ></line>
              </svg>
            </div>
            <h2>没有搜到相关文章</h2>
          </div>
        </div>
      </Modal>
    </div>

    <div class="NAV dbNav_dh">
      <transition name="move-up">
        <ul class="menus" v-show="variable.navTitleState.value">
          <li
            @mouseover="menusMouseOver(1)"
            @mouseleave="menusMouseLeave"
            @click="goPage('Archives')"
          >
            <h2 :style="{ color: variable.dhwzys.value }">归档</h2>
          </li>
          <li @mouseover="menusMouseOver(2)" @mouseleave="menusMouseLeave">
            <h2 :style="{ color: variable.dhwzys.value }">逛逛</h2>
            <div v-show="menus_child_state_2">
              <ol
                class="menus_child slide-up-my"
                v-show="menus_child_state_2"
                style="left: -30px"
              >
                <li @click="goPage('Moments')">
                  <div class="menus_child_item">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-wenjuan"></use>
                    </svg>
                    &nbsp;
                    <h2 style="width: 100px">闲言碎语</h2>
                  </div>
                </li>
                <li @click="goPage('Links')">
                  <div class="menus_child_item">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-lianjie"></use>
                    </svg>
                    <h2 style="width: 50px">友联</h2>
                  </div>
                </li>
                <li @click="goPage('TreeHole')">
                  <div class="menus_child_item">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-shudong"></use>
                    </svg>
                    <h2 style="width: 50px">树洞</h2>
                  </div>
                </li>
                <li @click="goPage('Message')">
                    <div class="menus_child_item">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-liuyanban"></use>
                        </svg>
                        &nbsp;
                        <h2 style="width: 80px">留言板</h2>
                    </div>
                </li>
                <li @click="goPage('About')">
                  <div class="menus_child_item">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-bangzhuguanyuwomen"></use>
                    </svg>
                    &nbsp;
                    <h2 style="width: 50px">关于</h2>
                  </div>
                </li>
              </ol>
            </div>
          </li>
          <li @mouseover="menusMouseOver(3)" @mouseleave="menusMouseLeave">
            <h2 :style="{ color: variable.dhwzys.value }">发现</h2>
            <div v-show="menus_child_state_3">
              <ol
                class="menus_child slide-up-my"
                v-show="menus_child_state_3"
                style="left: 20px"
              >
                <!-- <li @click="goNewLink('https://zyj.adu88.top')">
                  <div class="menus_child_item">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-xiangji"></use>
                    </svg>
                    <h2 style="width: 80px">照妖镜</h2>
                  </div>
                </li> -->
                <!-- <li>
                  <div class="menus_child_item">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-shangpinguanli"></use>
                    </svg>
                    <h2 style="width: 65px">卡盟</h2>
                  </div>
                </li> -->
                <li @click="goPage('VideoJx')">
                  <div class="menus_child_item">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-shipindianying-"></use>
                    </svg>
                    <h2 style="width: 100px">视频解析</h2>
                  </div>
                </li>
              </ol>
            </div>
          </li>
        </ul>
      </transition>
    </div>

    <div class="NAV dbNav_Music">
      <Music />
    </div>

    <!-- 登录 -->
    <div
      class="loader_dl"
      @click="variable.loginState.value = true"
      v-if="!variable.userInfo.value"
    >
      <div class="box box-1">
        <div class="side-left"></div>
        <div class="side-right"></div>
        <div class="side-top"></div>
      </div>
      <div class="box box-2">
        <div class="side-left"></div>
        <div class="side-right"></div>
        <div class="side-top"></div>
      </div>
      <div class="box box-3">
        <div class="side-left"></div>
        <div class="side-right"></div>
        <div class="side-top"></div>
      </div>
      <div class="box box-4">
        <div class="side-left"></div>
        <div class="side-right"></div>
        <div class="side-top"></div>
      </div>
    </div>

    <!-- 登录后 -->
    <div class="NAV userDiv" v-if="variable.userInfo.value">
        <loginManagement />
    </div>

    <div
      class="NAV dbNav_yddhl"
      @click="variable.navDrawerState.value = !variable.navDrawerState.value"
    >
      <Icon
        type="md-menu"
        size="40"
        style="cursor: pointer; margin-top: 10px"
      />
    </div>
  </div>
</transition>

  <!-- 登录组件 -->
  <Login />

  <!-- 移动端导航栏抽屉 -->
  <Drawer
    placement="left"
    :closable="false"
    v-model="variable.navDrawerState.value"
    width="70"
    :styles="{ backgroundColor: '#F6F8FA' }"
  >
    <ul class="yddhl">
      <li class="ctys" @click="goHome">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-shouye"></use>
        </svg>
        &nbsp;&nbsp;首页
      </li>
      <li class="ctys" @click="goPage('Archives')">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-guidang"></use>
        </svg>
        &nbsp;&nbsp;归档
      </li>
      <li>
        <p>逛逛</p>
        <div class="ctys" @click="goPage('Moments')">
          <svg class="icon" aria-hidden="true" style="">
            <use xlink:href="#icon-wenjuan"></use>
          </svg>
          &nbsp;&nbsp;闲言碎语
        </div>
        <div class="ctZ">
          <div class="ctys" style="width: 48%" @click="goPage('Links')">
            <svg class="icon" aria-hidden="true" style="">
              <use xlink:href="#icon-lianjie"></use>
            </svg>
            &nbsp;&nbsp;友联
          </div>

          <div class="ctys" style="width: 48%" @click="goPage('Message')">
              <svg class="icon" aria-hidden="true" style="">
                  <use xlink:href="#icon-liuyanban"></use>
              </svg>
              &nbsp;&nbsp;留言板
          </div>

          <div class="ctys" style="width: 48%" @click="goPage('About')">
            <svg class="icon" aria-hidden="true" style="">
              <use xlink:href="#icon-bangzhuguanyuwomen"></use>
            </svg>
            &nbsp;&nbsp;关于
          </div>
        </div>
      </li>
      <li>
        <p>发现</p>
        <div class="ctZ">
          <!-- <div class="ctys zfx" @click="goNewLink('https://adu23.cn')">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-xiangji"></use>
            </svg>
            照妖镜
          </div> -->
          <!-- <div class="ctys zfx">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-shangpinguanli"></use>
            </svg>
            卡 盟
          </div> -->
          <div class="ctys zfx" @click="goPage('VideoJx')">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-shipindianying-"></use>
            </svg>
            视频解析
          </div>
        </div>
      </li>
    </ul>
  </Drawer>
</template>

<script setup>
import { Notice } from "view-ui-plus";
import variable from "../../js/variable";
import Loading from "./Loading.vue";

const Login = defineAsyncComponent(() => import("./Login.vue"));
const loginManagement = defineAsyncComponent(() =>
    import("./LoginManagement.vue")
);
const Music = defineAsyncComponent({
    loader: () => import("./music/Music.vue"),
    loadingComponent: Loading,
});
const axios = inject("axios");
const route = useRoute();
const router = useRouter();


// -----------------logo鼠标悬停---------------
const logoType = ref(true);
function homeHandleMouseEnter() {
  logoType.value = false;
}
function HomeHhandleMouseLeave() {
  logoType.value = true;
}
// -----------------logo鼠标悬停end---------------

// --------------------------------------------热搜
const ssTitle = ref(null); //搜索框值
const topSearchDate = ref(null); //热搜列表

const searchModalState = ref(false); //搜索对话框状态
watch(
  () => searchModalState.value,
  (newV, oldV) => {
    topSearch();
  }
);

watch(
  () => ssTitle.value,
  (newV, oldV) => {
    topSearch();
  }
);

//打开文章
function goArticle(id, encryption) {
  searchModalState.value = false;
  if (encryption != 1) {
    router.push({ name: "Article", params: { id: id } });
  } else {
    variable.wzDrawerStzte.value = true;
    variable.chouTiArticle.value.id = id;
  }
}

// -----------------------------切换页面调整导航栏中样式-------------------

function topSearch() {
  axios
    .post("article/topSearch", { title: ssTitle.value })
    .then((response) => {
      let res = response.data;
      if (res.code == 200) {
        topSearchDate.value = res.data;
      }
    })
    .catch();
}

watch(
  () => route.name,
  (newV, oldV) => {
    //如果页面回退之后立即使用 window.scrollY，可能会得到 0

    setTimeout(() => {
      if (route.name == "TreeHole") {
        variable.navBackground.value = "transparent";
        variable.navTitleState.value = true;
        variable.tqState.value = true;
      } else if (route.name != "Zhongxin" || window.scrollY > 0) {
        variable.navBackground.value = "#fff";
        variable.navTitleState.value = true;
        variable.tqState.value = false;
      } else {
        variable.navBackground.value = "transparent";
        variable.navTitleState.value = false;
        variable.tqState.value = true;
      }

      //导航栏文字颜色
      if (route.name == "TreeHole") {
        variable.dhwzys.value = "#fff";
      } else {
        variable.dhwzys.value = "#363636";
      }
    }, 100);
  }
);

//导航栏状态
const navState = ref(true);
//用于存储上一次的滚动位置
const lastScrollTop = ref(0);
//页面下拉改变导航栏样式
const handleScroll = () => {
  if (route.name != "Zhongxin" || window.scrollY > 50) {
    variable.navBackground.value = "#fff";
    variable.navTitleState.value = true;
    variable.tqState.value = false;
  } else {
    variable.navBackground.value = "transparent";
    variable.navTitleState.value = false;
    variable.tqState.value = true;
  }

    //向下滚动隐藏导航，向上显示
    const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
    if (currentScrollTop > lastScrollTop.value) {
        // 向下滚动
        navState.value = false;
    } else {
        // 向上滚动
        navState.value = true;
    }
    lastScrollTop.value = currentScrollTop;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);

  //防止页面刷新，样式被改变

  if (route.name == "TreeHole") {
    variable.navBackground.value = "transparent";
    variable.navTitleState.value = true;
    variable.tqState.value = true;
  } else if (route.name != "Zhongxin" || window.scrollY != 0) {
    variable.navBackground.value = "#fff";
    variable.navTitleState.value = true;
    variable.tqState.value = false;
  }

  //改变登录铃铛颜色（防止页面刷新）
  if (
    window.scrollY == 0 &&
    route.name != "Zhongxin" &&
    route.name != "TreeHole"
  ) {
  }
  //导航栏文字颜色
  if (route.name == "TreeHole") {
    variable.dhwzys.value = "#fff";
  } else {
    variable.dhwzys.value = "#363636";
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});

// ------------------------------切换页面调整导航栏中和页脚样式end-------------------

//logo点击前往首页
function goHome() {
  router.push("/");
  variable.navDrawerState.value = false;
}

//导航前往新页面
function goNewLink(name) {
    let routeUrl = router.resolve({
        name: name,
    });
    window.open(routeUrl.href, "_blank");
}

//导航至页面
function goPage(name) {
  router.push({
    name: name,
    path: name,
  });
  variable.navDrawerState.value = false;
}

// ------------------- 导航栏鼠标悬停移开显示消失START------------------------
let menus_child_state_1 = ref(false);
let menus_child_state_2 = ref(false);
let menus_child_state_3 = ref(false);

function menusMouseOver(type) {
  if (type == 1) {
    menus_child_state_1.value = true;
  } else if (type == 2) {
    menus_child_state_2.value = true;
  } else if (type == 3) {
    menus_child_state_3.value = true;
  }
}
function menusMouseLeave() {
  menus_child_state_1.value = false;
  menus_child_state_2.value = false;
  menus_child_state_3.value = false;
}
// ------------------- 导航栏鼠标悬停移开显示消失END------------------------
</script>

<style scoped>

.avatarUploader {
    width: 100px;
    height: 100px;
    border: 1px dashed rgb(214, 214, 214);
    cursor: pointer;
}
.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    text-align: center;
}

li {
  list-style-type: none;
}

* {
  user-select: none;
}

/* --------------搜索对话框-------------------- */
#searchInput {
  width: 100%;
  border: 2px solid #49b1f5;
  border-radius: 10px;
  padding: 2px 8px;
  outline: none;
  margin: 10px 0;
}

#ss_ul {
  padding: 10px;
}

.ss_li {
  cursor: pointer;
}

.ss_li:hover .yuan {
  border: 4px solid #dfa964;
}

.ss_li:hover .ss_title {
  color: #49b1f5;
}

.yuan {
  width: 15px;
  height: 15px;
  border: 4px solid #49b1f5;
  border-radius: 50%;
}

.ss_title {
  font-weight: 700;
  font-size: 16px !important;
}

/* --------------搜索对话框end-------------------- */

/* --------------搜索对话框分割线特效-------------------- */
.loader {
  --path: #2f3545;
  --dot: #fb992b;
  --duration: 3s;
  width: 44px;
  height: 44px;
  position: relative;
}

.loader:before {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 50%;
  position: absolute;
  display: block;
  background: var(--dot);
  top: 37px;
  left: 19px;
  transform: translate(-18px, -18px);
  animation: dotRect var(--duration) cubic-bezier(0.785, 0.135, 0.15, 0.86)
    infinite;
}

.loader svg {
  display: block;
  width: 100%;
  height: 100%;
}

.loader svg rect,
.loader svg polygon,
.loader svg circle {
  fill: none;
  stroke: var(--path);
  stroke-width: 10px;
  stroke-linejoin: round;
  stroke-linecap: round;
}

.loader svg polygon {
  stroke-dasharray: 145 76 145 76;
  stroke-dashoffset: 0;
  animation: pathTriangle var(--duration) cubic-bezier(0.785, 0.135, 0.15, 0.86)
    infinite;
}

.loader svg rect {
  stroke-dasharray: 192 64 192 64;
  stroke-dashoffset: 0;
  animation: pathRect 3s cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite;
}

.loader svg circle {
  stroke-dasharray: 150 50 150 50;
  stroke-dashoffset: 75;
  animation: pathCircle var(--duration) cubic-bezier(0.785, 0.135, 0.15, 0.86)
    infinite;
}

.loader.triangle {
  width: 48px;
}

.loader.triangle:before {
  left: 21px;
  transform: translate(-10px, -18px);
  animation: dotTriangle var(--duration) cubic-bezier(0.785, 0.135, 0.15, 0.86)
    infinite;
}

@keyframes pathTriangle {
  33% {
    stroke-dashoffset: 74;
  }

  66% {
    stroke-dashoffset: 147;
  }

  100% {
    stroke-dashoffset: 221;
  }
}

@keyframes dotTriangle {
  33% {
    transform: translate(0, 0);
  }

  66% {
    transform: translate(10px, -18px);
  }

  100% {
    transform: translate(-10px, -18px);
  }
}

@keyframes pathRect {
  25% {
    stroke-dashoffset: 64;
  }

  50% {
    stroke-dashoffset: 128;
  }

  75% {
    stroke-dashoffset: 192;
  }

  100% {
    stroke-dashoffset: 256;
  }
}

@keyframes dotRect {
  25% {
    transform: translate(0, 0);
  }

  50% {
    transform: translate(18px, -18px);
  }

  75% {
    transform: translate(0, -36px);
  }

  100% {
    transform: translate(-18px, -18px);
  }
}

@keyframes pathCircle {
  25% {
    stroke-dashoffset: 125;
  }

  50% {
    stroke-dashoffset: 175;
  }

  75% {
    stroke-dashoffset: 225;
  }

  100% {
    stroke-dashoffset: 275;
  }
}

.loader {
  display: inline-block;
  margin: 0 16px;
}

/* --------------搜索对话框分割线特效end-------------------- */

.ssIco {
  width: 15px;
  height: 15px;
  vertical-align: -0.8em;
}

.ssIco1 {
  width: 20px;
  height: 20px;
  vertical-align: -0.4em;
}

.sshz {
  background-color: #fff;
  width: 260px;
  min-height: 200px;
  position: absolute;
  top: 70px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}

.ss_title {
  display: flex;
  padding: 10px;
  font-size: 17px;
}

.rshz {
  display: flex;
  flex-wrap: wrap;
}

.rshz_div {
  width: 50%;
  display: flex;
  cursor: pointer;
  padding: 10px;
}

.rshz_div:hover {
  background-color: #f2f3f5;
}

.rshz_div p:nth-child(1) {
  padding-right: 10px;
}

.NAV {
  display: flex;
  align-items: center;
  height: 70px;
  padding-left: 20px;
}

.menus > li > h2 {
  padding: 0 13px 0 18px;
  border-radius: 20px;
}

.dbNav {
  height: 70px;
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  transition: 0.5s all;
}

.navoneDdi {
    display: flex;
    align-items: center;
}

.navoneDdiicon {
    font-size: 20px;
    cursor: pointer;
}

.dbNav_log {
  width: 19%;
  display: flex;
  justify-content: center;
}

.dbNav_log > div {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
}

.dbNav_log > div:hover {
  background-color: #425aef;
}

.dbNav_log > div:hover .logo {
  height: 40px;
}

.dbNav_weather {
  width: 19%;
}

.dbNav_dh {
  width: 37%;
}

.logo {
  width: 80px;
  height: 70px;
  cursor: pointer;
}

.search {
  width: 23%;
}

/* 导航栏start */
.menus {
  display: flex;
  color: #fff;
  font-size: 12px;
  color: #363636;
  letter-spacing: 5px;
}

.menus > li {
  margin-left: 50px;
  cursor: pointer;
  height: 60px;
  line-height: 40px;
  margin-top: 20px;
  position: relative;
}

.menus > li > h2:hover {
  background-color: #425aef;
  color: #fff !important;
}

.menus_child {
  position: absolute;
  top: 55px;
  border-radius: 55px;
  background-color: #fff;
  color: #000;
  display: flex;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
}

.menus_child li {
  padding: 8px 15px;
}

.menus_child_item {
  display: flex;
  align-items: center;
  justify-content: center;
}

.menus_child li > div {
  padding: 0 10px;
}

.menus_child li > div:hover {
  border-radius: 15px;
  background-color: #425aef;
  color: #fff;
}

.menus_child_item h2 {
  width: 45px;
}

@keyframes slide-up-my {
  0% {
    transform: translate(-40%, -10%);
    opacity: 0;
  }

  100% {
    transform: translate(-40%, 0);
    opacity: 1;
  }
}

.slide-up-my {
  animation: slide-up-my 0.3s ease both;
}

.dbNav_yddhl {
  margin-left: auto;
  width: 100px;
  display: none;
}

/* 导航栏end */

.login {
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  position: absolute;
  right: 90px;
  top: 90px;
}

/* ----------移动端导航栏-------------- */
.yddhl li {
  font-size: 16px;
  margin-bottom: 20px;
}

.yddhl p {
  margin-top: 30px;
}

.ctys {
  background-color: #fff;
  border: 1px solid #e3e8f7;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  padding: 5px 0;
  color: #252525;
  cursor: pointer;
  margin-top: 5px;
}

.iconfont {
  cursor: pointer;
}

.ctZ {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.zfx {
  flex-direction: column;
  width: 48%;
  height: 100px;
}

.userDiv {
  margin: 0 auto;
  cursor: pointer;
}

@media (max-width: 1400px) {
  .loader_dl {
    display: none;
  }
}

@media (max-width: 1200px) {
  .notification {
    display: none !important;
  }

  .dbNav_yddhl {
    display: block;
  }

  .dbNav_weather {
    display: none !important;
  }

  .dbNav_dh {
    display: none !important;
  }

  .dbNav_Music {
    display: none !important;
  }

  .userDiv {
    display: none;
  }
}

/* --------------------搜索空状态----------------- */
.loaderJZ {
  height: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}

.loaderMiniContainer {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 130px;
  height: fit-content;
}

.barContainer {
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 10px;
  background-position: left;
}

.bar {
  width: 100%;
  height: 8px;
  background: linear-gradient(
    to right,
    rgb(161, 94, 255),
    rgb(217, 190, 255),
    rgb(161, 94, 255)
  );
  background-size: 200% 100%;
  border-radius: 10px;
  animation: bar ease-in-out 3s infinite alternate-reverse;
}

@keyframes bar {
  0% {
    background-position: left;
  }

  100% {
    background-position: right;
  }
}

.bar2 {
  width: 50%;
}

.svgIcon {
  position: absolute;
  left: -25px;
  margin-top: 18px;
  z-index: 2;
  width: 70%;
  animation: search ease-in-out 3s infinite alternate-reverse;
}

@keyframes search {
  0% {
    transform: translateX(0%) rotate(70deg);
  }

  100% {
    transform: translateX(100px) rotate(10deg);
  }
}

.svgIcon circle,
line {
  stroke: rgb(162, 55, 255);
}

.svgIcon circle {
  fill: rgba(98, 65, 142, 0.238);
}

/* --------------------搜索空状态end----------------- */

/* -------------------------------------登录按钮--------------- */
.loader_dl {
  height: 50px;
  width: 40px;
  margin: 0 auto;
  cursor: pointer;
}

.box {
  position: relative;
  opacity: 0;
  left: 10px;
}

.side-left {
  position: absolute;
  background-color: #286cb5;
  width: 19px;
  height: 5px;
  transform: skew(0deg, -25deg);
  top: 14px;
  left: 10px;
}

.side-right {
  position: absolute;
  background-color: #2f85e0;
  width: 19px;
  height: 5px;
  transform: skew(0deg, 25deg);
  top: 14px;
  left: -9px;
}

.side-top {
  position: absolute;
  background-color: #5fa8f5;
  width: 20px;
  height: 20px;
  rotate: 45deg;
  transform: skew(-20deg, -20deg);
}

.box-1 {
  animation: from-left 4s infinite;
}

.box-2 {
  animation: from-right 4s infinite;
  animation-delay: 1s;
}

.box-3 {
  animation: from-left 4s infinite;
  animation-delay: 2s;
}

.box-4 {
  animation: from-right 4s infinite;
  animation-delay: 3s;
}

@keyframes from-left {
  0% {
    z-index: 20;
    opacity: 0;
    translate: -20px -6px;
  }

  20% {
    z-index: 10;
    opacity: 1;
    translate: 0px 0px;
  }

  40% {
    z-index: 9;
    translate: 0px 4px;
  }

  60% {
    z-index: 8;
    translate: 0px 8px;
  }

  80% {
    z-index: 7;
    opacity: 1;
    translate: 0px 12px;
  }

  100% {
    z-index: 5;
    translate: 0px 30px;
    opacity: 0;
  }
}

@keyframes from-right {
  0% {
    z-index: 20;
    opacity: 0;
    translate: 20px -6px;
  }

  20% {
    z-index: 10;
    opacity: 1;
    translate: 0px 0px;
  }

  40% {
    z-index: 9;
    translate: 0px 4px;
  }

  60% {
    z-index: 8;
    translate: 0px 8px;
  }

  80% {
    z-index: 7;
    opacity: 1;
    translate: 0px 12px;
  }

  100% {
    z-index: 5;
    translate: 0px 30px;
    opacity: 0;
  }
}

/* -------------------------------------登录按钮end--------------- */
</style>
