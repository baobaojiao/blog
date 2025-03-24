<template>
    <div class="nr" v-if="articleYear">
        <el-collapse v-model="activeName" accordion @change="collapseChange">
            <el-collapse-item
                    :id="`item_` + item.year"
                    v-for="item in articleYear"
                    :key="item.year"
                    style="
          border-left: 1px solid #ebeef5;
          border-right: 1px solid #ebeef5;
          padding: 10px;
        "
                    title="Consistency"
                    :name="item.year"
            >
                <template #title>
          <span style="font-size: 18px; color: #41b6fb"
          ><a style="font-size: 15px; vertical-align: 3px">📅</a>
            {{ item.year }} 年</span
          >
                    <span style="font-size: 18px; color: #41b6fb; margin-left: 50px">
            <svg class="iconNmu" aria-hidden="true">
              <use xlink:href="#icon-guidang"></use>
            </svg>
            {{ item.count }} 篇
          </span>
                </template>
                <List border>
                    <ListItem
                            class="wzItem"
                            v-for="article in articleList"
                            :key="article.id"
                            @click="goArticle(article.id, article.encryption)"
                    >
            <span style="background-color: #fff9f0; color: #fc9d31">{{
                article.creationTime
                }}</span>
                        <span style="margin-left: 10px">{{ article.title }}</span>
                    </ListItem>
                </List>
            </el-collapse-item>
        </el-collapse>
  </div>

  <!-- 加载动画 -->
  <div class="loaderET" v-else>
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
  </div>

  <!-- 抽屉 -->
  <ArticleDrawer />
</template>
<script setup>
import { ScrollIntoView } from "view-ui-plus";
const axios = inject("axios");
import variable from "../../js/variable";
const ArticleDrawer = defineAsyncComponent(() => import("./ArticleDrawer.vue"));

const router = useRouter();

const activeName = ref(null);
//文章年份
const articleYear = ref(null);
//展示的文章列表
const articleList = ref(null);

onMounted(() => {
    axios
        .get("article/getArticleYear")
        .then((response) => {
            let res = response.data;
            if (res.code == 200 && res.data) {
                articleYear.value = res.data;
                activeName.value = res.data[0].year;
                findArticleGD(res.data[0].year);
            }
        })
        .catch();
});


//按照年份查询文章列表
function findArticleGD(year) {
    axios
        .get("article/findArticleGD?year=" + year)
        .then((response) => {
            let res = response.data;
            if (res.code == 200) {
                articleList.value = res.data;
            }
        })
        .catch();
}

//切换
function collapseChange(name) {
    if (name) {
        findArticleGD(name);

        // 滚动至列表顶部
        ScrollIntoView(document.getElementById("item_" + name), {
            time: 1000,
        });
    }
}

//打开文章
function goArticle(id, encryption) {
  if (encryption != 1) {
    router.push({ name: "Article", params: { id: id } });
  } else {
    variable.wzDrawerStzte.value = true;
    variable.chouTiArticle.value.id = id;
  }
}
</script>

<style scoped>
li {
  list-style-type: none;
}

.wzItem:hover {
    background-color: #f7f7f7;
    cursor: pointer;
}


.iconNmu {
    width: 19px;
    height: 19px;
    vertical-align: -2px;
}

.nr {
    padding: 10px;
    user-select: none;
}

/* -------------loader------------------------ */
.loaderET {
  margin-top: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
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

/* -------------loader------------------------ */
</style>
