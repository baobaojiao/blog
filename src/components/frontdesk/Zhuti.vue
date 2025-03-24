<template>
  <div class="blog_main">
    <!-- 闲言碎语 -->
    <div class="gossip">
      <Icon
        type="md-aperture"
        style="position: absolute; top: 13px; left: 10px; z-index: 1"
        size="25"
      />

      <el-carousel height="50px" direction="vertical" indicator-position="none">
        <el-carousel-item v-for="item in syMomentsData" :key="item.id">
          <router-link :to="{ name: 'Moments' }" v-line-clamp="1">{{
            item.content
          }}</router-link>
        </el-carousel-item>
      </el-carousel>

      <div class="go_gossip" @click="router.push({ name: 'Moments' })">
        <Icon type="md-return-right" />
      </div>
    </div>

    <div class="blog_main_one">
      <!-- 关于 -->
      <ZhutiAbout />

      <!-- 友联 -->
      <div class="linksDiv introduce">
        <el-carousel direction="vertical" :motion-blur="true">
          <el-carousel-item
            v-for="item in variable.linksTableData.value.records"
            :key="item.id"
            class="link_itme"
            @click="goUrl(item.realmName)"
          >
            <div v-if="item.state">
                <Image :src="item.log" width="40px" height="40px">
                    <template #error>
                        <Icon type="ios-image-outline" size="24" color="#ccc" />
                    </template>
                </Image>
              <Badge status="success" style="top: -16px"> </Badge>
            </div>
            <div v-else>
                <Image :src="item.log" width="40px" height="40px">
                    <template #error>
                        <Icon type="ios-image-outline" size="24" color="#ccc" />
                    </template>
                </Image>
              <Badge status="warning" style="top: -16px"> </Badge>
            </div>

            <div style="margin-left: 10px; color: #000; letter-spacing: 1px">
              <h3 v-html="item.name"></h3>
              <Ellipsis
                style="color: #e7e7e7; font-size: 15px"
                :text="item.description"
                :height="30"
              />
            </div>
          </el-carousel-item>
        </el-carousel>

        <div id="qwLink" @click="router.push({ name: 'Links' })">
          <button class="link_btn" type="button">
            <strong id="link_wz1">我的朋友们</strong>
            <strong id="link_wz2">我的朋友们 ▶</strong>

            <div id="container-stars">
              <div id="stars"></div>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- 数据 -->
    <ZhutiData />

    <div class="wz_main">
      <div id="wz_main_div1">
        <!-- 文章分类导航 -->
        <div class="articleClassification">
          <div style="width: 95%">
            <span
              class="articleClassification_dvi liBgc"
              @click="liClick(0, '')"
              >全部</span
            >
            <span
              class="articleClassification_dvi"
              v-for="(item, index) in ArticleTypes"
              @click="liClick(index + 1, item)"
              :key="index"
              >{{ item }}</span
            >
          </div>
          <router-link
            :to="{ name: 'Archives', params: {}, query: {} }"
            class="gd"
            >更多</router-link
          >
        </div>

        <!-- 文章列表 -->
        <ZhutiArticle />
      </div>

      <div class="wz_yc">
        <Affix :offset-top="80">
          <!-- 博主面板 -->
          <ZhutiUser />
        </Affix>
      </div>
    </div>
  </div>
</template>
<script setup>
const axios = inject("axios");
import { eventBus } from "../../js/eventBus.js";
import variable from "../../js/variable";
import ZhutiAbout from "./ZhutiAbout.vue";
import ZhutiData from "./ZhutiData.vue";
import ZhutiArticle from "./ZhutiArticle.vue";
import ZhutiUser from "./ZhutiUser.vue";

const router = useRouter();

onMounted(() => {
  //调用查询所有文章分类
  findArticleType();
  //调用查询所有说说
  findMoments(15);
  findlist(8);
});

// 查询友联列表
function findlist(pageNum) {
  axios
    .post("links/findLinks", { pageNum: pageNum })
    .then((response) => {
      let res = response.data;
      if (res.msg == "成功") {
        variable.linksTableData.value.records = res.data.records;
        variable.linksTableData.value.total = res.data.total;
        variable.linksTableData.value.current = res.data.current;
      }
    })
    .catch();
}

//打开新的页面{友联}
const goUrl = (url) => {
  window.open(url, "_blank");
};

//查询所有文章分类
const ArticleTypes = ref(null);
function findArticleType() {
  axios
    .get("article/findArticleType")
    .then((response) => {
      let res = response.data;
      if (res.msg == "成功") {
        ArticleTypes.value = res.data;
      }
    })
    .catch();
}

//查询所有说说
const syMomentsData = ref(null);
const findMoments = (pageNum) => {
  axios
    .post("moments/findMomentsForIndex")
    .then((response) => {
      let res = response.data;
      if (res.msg == "成功") {
        syMomentsData.value = res.data.records;
      }
    })
    .catch();
};

//分类点击事件
function liClick(index, type) {
  //查询文章列表
  eventBus.emit("findArticle", { type: type });

  // 获取页面中所有的 <li> 元素
  const liElements = document.getElementsByClassName(
    "articleClassification_dvi"
  );
  // 转换成数组并使用 forEach
  Array.from(liElements).forEach((li) => {
    li.classList.remove("liBgc");
  });
  // 然后将选定的 <li> 元素添加 "liBgc" 类
  liElements[index].classList.add("liBgc");
}
</script>
<style scoped>
.gossip {
  width: 80%;
  height: 50px;
  background-color: #fff;
  margin: 0 auto;
  border-radius: 10px;
  position: relative;
}

.el-carousel {
  border-radius: 10px;
}

.el-carousel__item {
  color: #000;
  letter-spacing: 1px;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
}

.el-carousel__item a {
  cursor: pointer;
  color: #000;
}

.el-carousel__item a:hover {
  color: #687bf2;
}

.go_gossip {
  position: absolute;
  top: 15px;
  right: 10px;
  padding: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  background-color: #353535;
  color: #fff;
}

.go_gossip:hover {
  background-color: #687bf2;
  color: #fff;
}

/* ----------------------- */

.blog_main {
  user-select: none;
  min-height: 1000px;
}

.blog_main_one {
  user-select: none;
  height: 250px;
  width: 80%;
  margin: 10px auto;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
}

.link_itme {
  /* background-color: #949393; */
  background-color: rgba(134, 174, 197, 0.3);
  border-radius: 20px;
  width: 97%;
}

.linksDiv {
  height: 100%;
  width: 49%;
  position: relative;
  overflow: hidden;
}

#qwLink {
  background-color: #fff;
  height: 70px;
  width: 97%;
  position: absolute;
  bottom: 0;
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
}

/* ******友联按钮********** */
#link_wz2 {
  display: none;
}
#qwLink:hover #link_wz1 {
  display: none;
}

#qwLink:hover #link_wz2 {
  display: block;
}

.link_btn {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  overflow: hidden;
  backdrop-filter: blur(1rem);
  background-size: 300% 300%;
  transition: 0.5s;
  animation: gradient_301 5s ease infinite;
  /* border: double 4px transparent; */
  background-image: linear-gradient(#212121, #212121),
    linear-gradient(
      137.48deg,
      #ffdb3b 10%,
      #fe53bb 45%,
      #8f51ea 67%,
      #0044ff 87%
    );
  background-origin: border-box;
  background-clip: content-box, border-box;
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
}

#container-stars {
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  transition: 0.5s;
  backdrop-filter: blur(1rem);
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
}

.link_btn strong {
  z-index: 2;
  font-family: "Avalors Personal Use";
  font-size: 12px;
  letter-spacing: 5px;
  color: #ffffff;
  text-shadow: 0 0 4px white;
}

.link_btn:hover #container-stars {
  z-index: 1;
  background-color: #212121;
}

.link_btn:active {
  background-origin: border-box;
  background-clip: content-box, border-box;
  animation: none;
}

#stars {
  position: relative;
  background: transparent;
  width: 200rem;
  height: 200rem;
}

#stars::after {
  content: "";
  position: absolute;
  top: -10rem;
  left: -100rem;
  width: 100%;
  height: 100%;
  animation: animStarRotate 90s linear infinite;
}

#stars::after {
  background-image: radial-gradient(#ffffff 1px, transparent 1%);
  background-size: 50px 50px;
}

#stars::before {
  content: "";
  position: absolute;
  top: 0;
  left: -50%;
  width: 170%;
  height: 500%;
  animation: animStar 60s linear infinite;
}

#stars::before {
  background-image: radial-gradient(#ffffff 1px, transparent 1%);
  background-size: 50px 50px;
  opacity: 0.5;
}

@keyframes gradient_301 {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

@keyframes animStar {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(-135rem);
  }
}

@keyframes animStarRotate {
  from {
    transform: rotate(360deg);
  }

  to {
    transform: rotate(0);
  }
}

@keyframes pulse_3011 {
  0% {
    transform: scale(0.75);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
  }

  100% {
    transform: scale(0.75);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
}
/* **************** */

.introduce {
  height: 140%;
}

.liBgc {
  background-color: #425aef;
  color: #fff !important;
}

.wz_main {
  width: 80%;
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  user-select: none;
}

#wz_main_div1 {
  width: 80%;
}

.wz_yc {
  display: flex;
  flex-direction: column;
  width: 18%;
}

.articleClassification {
  background-color: #fff;
  height: 50px;
  line-height: 50px;
  border-radius: 10px;
  display: flex;
}

.gd {
  margin: 0 0 0 10px;
  color: #000;
  font-size: 16px;
  border-radius: 10px;
  cursor: pointer;
  margin-right: 20px;
  width: 50px;
}

.gd:hover {
  color: #2853df;
}

.articleClassification_dvi {
  padding: 5px 15px;
  margin: 0 0 0 10px;
  color: #000;
  font-size: 16px;
  border-radius: 10px;
  cursor: pointer;
}

.articleClassification_dvi:hover {
  background-color: #2853df;
  color: #fff;
}

@media (max-width: 1200px) {
  .wz_main {
    width: 100%;
    justify-content: center;
  }

  #wz_main_div1 {
    width: 100%;
  }

  .wz_yc {
    display: none !important;
  }
  .blog_main_one {
    display: none !important;
  }

  .articleClassification {
    display: none !important;
  }

  .gossip {
    width: 90%;
  }
}
</style>
