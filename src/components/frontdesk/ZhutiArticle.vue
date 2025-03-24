<template>
  <div class="articleList" id="articleList">
    <div class="articleItems">
      <div
        @mouseover="articleItemMouseover"
        @mouseout="articleItemMouseout"
        class="articleItem"
        v-for="item in variable.syArticleData.value.records"
        :key="item.id"
        @click="goArticle(item.id, item.encryption)"
      >
        <div>
          <Image :src="item.img" lazy style="width: 100%; height: 100%">
            <template #placeholder>
              <div class="imgLoading"></div>
            </template>
          </Image>
        </div>
        <div class="title">
          {{ item.title }}
          <svg
            class="icon articlePwdIco"
            aria-hidden="true"
            v-if="item.encryption == 1"
          >
            <use xlink:href="#icon-MBEfenggechangyongtubiao-mima"></use>
          </svg>
        </div>
        <div class="wzdb">
          <div>
            <Icon type="ios-bookmark-outline" size="18" />
            {{ item.type }}
          </div>
          <div>
            <Icon type="md-flame" size="18" color="red" />
            {{ item.see }}
          </div>
          <div>
            <Icon type="ios-time-outline" size="18" />
            {{ item.creationTime }}
          </div>
        </div>

        <div class="top" v-if="item.stick">
          <div>置顶</div>
        </div>
      </div>
    </div>

    <div
      style="display: flex; justify-content: center; padding: 50px 0"
      v-if="variable.syArticleData.value.total > 10"
    >
      <Page
        :total="variable.syArticleData.value.total"
        v-model="variable.syArticleData.value.current"
        @on-change="articleChange"
      />
    </div>
  </div>

  <!-- 抽屉 -->
  <ArticleDrawer />
</template>
<script setup>
const axios = inject("axios");
import { ScrollIntoView } from "view-ui-plus";
import { eventBus } from "../../js/eventBus.js";
import variable from "../../js/variable";
const ArticleDrawer = defineAsyncComponent(() => import("./ArticleDrawer.vue"));

const router = useRouter();

// 查询文章列表函数
function findArticle(pageNum, type) {
  axios
    .post("article/findArticle", {
      pageNum: pageNum,
      type: type,
    })
    .then((response) => {
      let res = response.data;
      if (res.msg == "成功") {
        variable.syArticleData.value.records = res.data.records;
        variable.syArticleData.value.total = res.data.total;
        variable.syArticleData.value.current = res.data.current;
      }
    })
    .catch();
}
eventBus.on("findArticle", (data) => {
  findArticle(1, data.type);
});

//页码改变
function articleChange(pageNum) {
  findArticle(pageNum);

  // 滚动至评论区域顶部
  ScrollIntoView(document.getElementById("articleList"), {
    time: 1000,
    align: {
      topOffset: 150,
    },
  });
}

onMounted(() => {
  // 调用查询文章列表
  findArticle(1);
});

//打开文章
function goArticle(id, encryption) {
  if (encryption != 1) {
    router.push({ name: "Article", params: { id: id } });
  } else {
    variable.wzDrawerStzte.value = true;
    variable.chouTiArticle.value.id = id;
  }
}

//文章列表鼠标移入事件
function articleItemMouseover(e) {
  try {
    const imgElements = e.currentTarget.querySelectorAll("img");
    imgElements[0].style.transition = "transform 0.3s ease";
    imgElements[0].style.transform = "scale(1.1)";
  } catch (error) {}
}
//文章列表鼠标移出事件
function articleItemMouseout(e) {
  try {
    const imgElements = e.currentTarget.querySelectorAll("img");
    imgElements[0].style.transform = "scale(1)";
  } catch (error) {}
}
</script>
<style  scoped>
.articleList {
  min-height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 20px;
}

.articleItems {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.articleItem {
  width: 49%;
  height: 400px;
  max-height: 400px;
  margin-bottom: 20px;
  border-radius: 10px;
  border: solid 1px #fff;
  background-color: #fff;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.top {
  position: absolute;
  top: 0;
  width: 100px;
  height: 100px;
  overflow: hidden;
}

.top > div {
  font-size: 16px;
  box-shadow: 0 0 8px #323a4614, 0 1px #323a4608;
  letter-spacing: 2px;
  background-color: red;
  color: #fff;
  text-align: center;
  transform: rotate(-45deg);
  width: 110px;
  position: absolute;
  top: 19px;
  left: -25px;
}

.articleItem:not(a)::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 200%;
  background: linear-gradient(to right, transparent, white, transparent);
  transform: translateX(-200%);
  transition: transform 0.5s linear;
  z-index: 1;
}

.articleItem:not(a):hover::before {
  transform: translateX(100%) skewX(-60deg);
}

.articleItem > div:nth-child(1) {
  width: 100%;
  height: 70%;
  background-color: #fff;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  overflow: hidden;
}

.title {
  width: 100%;
  height: 20%;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  padding-left: 20px;
  color: #000;
}

.articleItem:hover .title {
  color: #3e4eaf;
}

.articleItem > div:nth-child(3) {
  width: 100%;
  height: 10%;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  display: flex;
  padding-left: 20px;
}

.articleItem > div:nth-child(1) img {
  transition: all 0.6s ease 0s;
  max-width: 100%;
  height: auto;
}

.articleItem img {
  transition: transform 0.3s ease;
}

.articleItem:hover img {
  transform: scale(1.1);
}

.articleItem > div:nth-child(3) > div {
  padding-right: 30px;
}

.articlePwdIco {
  width: 10rem;
  height: 8rem;
  position: absolute;
  right: 10px;
  bottom: 0;
}

@media (max-width: 1200px) {
  .articleList {
    width: 100%;
    margin-top: 20px;
  }

  .articleList > div:nth-child(1) {
    width: 90%;
    margin: 0 auto;
  }

  .articleItem {
    width: 100%;
    height: 400px;
  }

  .wzdb {
    display: none !important;
  }

  .title {
    height: 30% !important;
  }
}
</style>