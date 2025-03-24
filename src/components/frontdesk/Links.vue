<template>
  <div class="main">
    <div class="zx">
      <el-tabs class="tabs" v-model="activeName">
        <el-tab-pane label="申请友联" name="sqyl">
          <div style="padding: 10px 10px 0 0">
            <h2>
              申请友联的要求
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-tonggao"></use>
              </svg>
            </h2>
            <div class="yq">
              <Badge :count="1" type="primary"></Badge>
              <p>能够正常访问</p>
            </div>
            <div class="yq">
              <Badge :count="2" type="primary"></Badge>
              <p>已经将本站添加至你的博客中</p>
            </div>
            <div class="yq">
              <Badge :count="3" type="primary"></Badge>
              <p>不接受污秽、暴力、广告的网站</p>
            </div>
            <h2 style="margin: 50px 0 20px 0">
              本站友链信息以及申请格式
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-wodeliucheng"></use>
              </svg>
            </h2>
            <Card>
              <template #title>
                <span class="yuan bgc_red"></span>
                <span class="yuan bgc_orange"></span>
                <span class="yuan bgc_green"></span>
              </template>
              <div>
                <div class="yq">
                  🍀 博客名称：<Paragraph
                        style="margin-bottom: 0"
                        copyable
                        :copy-config="{ tooltips: false }"
                >{{ variable.pz_all.value.blog_name }}</Paragraph
                >
                </div>
                <div class="yq">🍄 博客地址：<Paragraph
                        style="margin-bottom: 0"
                        copyable
                        :copy-config="{ tooltips: false }"
                >url</Paragraph
                ></div>
                <div class="yq">
                  🌻 博客logo
                  <p style="color: red; font-size: 12px; margin-top: 2px">
                    (最好提供https地址)
                  </p>
                  ：<Paragraph
                        style="margin-bottom: 0"
                        copyable
                        :copy-config="{ tooltips: false }"
                >https://xxxx/logo.png</Paragraph
                >
                </div>
                <div class="yq">🌷 博客描述：<Paragraph
                        style="margin-bottom: 0"
                        copyable
                        :copy-config="{ tooltips: false }"
                >xxxx</Paragraph
                ></div>
              </div>
            </Card>
          </div>

          <CommentAll>
              评论
              <button class="btn_ks" type="button" @click="kssq">
                  <strong>快速申请</strong>
                  <div id="container-stars">
                      <div id="stars"></div>
                  </div>

                  <div id="glow">
                      <div class="circle"></div>
                      <div class="circle"></div>
                  </div>
              </button>
          </CommentAll>
        </el-tab-pane>

        <el-tab-pane label="全站友联" name="qzyl">
          <div class="ylkp">
            <Card
              style="width: 48%; margin-bottom: 10px; cursor: pointer"
              v-for="item in filterDataByType('全站友联')"
              :key="item.id"
              @click="goUrl(item.realmName)"
            >
              <div style="display: flex">
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
                <div
                  style="margin-left: 10px; color: #000; letter-spacing: 1px"
                >
                  <h3 v-html="item.name"></h3>
                  <Ellipsis
                    style="color: #727272"
                    :text="item.description"
                    :height="30"
                    tooltip
                  />
                </div>
              </div>
            </Card>
          </div>
        </el-tab-pane>

        <el-tab-pane label="推荐链接" name="tjyl">
          <div class="ylkp">
            <Card
              style="width: 48%; margin-bottom: 10px; cursor: pointer"
              v-for="item in filterDataByType('推荐链接')"
              :key="item.id"
              @click="goUrl(item.realmName)"
            >
              <div style="display: flex">
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
                <div
                  style="margin-left: 10px; color: #000; letter-spacing: 1px"
                >
                  <h3 v-html="item.name"></h3>
                  <Ellipsis
                    style="color: #727272"
                    :text="item.description"
                    :height="30"
                    tooltip
                  />
                </div>
              </div>
            </Card>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script setup>
const axios = inject("axios");
import Loading from "./Loading.vue";
import variable from "../../js/variable";
const CommentAll = defineAsyncComponent({
    loader: () => import("./comment/CommentAll.vue"),
    loadingComponent: Loading,
});

const activeName = ref("sqyl"); //选中tab

// 查询列表函数
async function findlist(pageSize) {
  try {
    const response = await axios.post("links/findLinks", {
      pageSize: pageSize,
    });
    let res = response.data;
    if (res.msg == "成功") {
      //插入作者友联，购买者请不要将开发作者友联删掉，违者将不再获得更新版本！
      res.data.records.unshift({
        id: 0,
        name: "阿杜博客",
        realmName: variable.pz_all.value.author_blog,
        description: "本博客开发作者",
        creationTime: "2024年05月20 13:14",
        log: "https://adu88.top/logo.png",
        state: true,
        type: "推荐链接",
      });

      variable.linksTableData.value.records = res.data.records;
      variable.linksTableData.value.total = res.data.total;
      variable.linksTableData.value.current = res.data.current;
    }
  } catch (error) {
    console.error(error);
  }
}

// 创建一个方法来根据类型过滤数据
const filterDataByType = (type) => {
  return variable.linksTableData.value.records.filter(
    (item) => item.type === type
  );
};

onMounted(() => {
  findlist(999);
});

const goUrl = (url) => {
  window.open(url, "_blank");
};

const kssq = () => {
  variable.plData.content = `博客名称：
博客地址：
博客logo：
博客描述：`;
};
</script>
<style  scoped>
.main {
  background-color: #f7f9fe;
  margin-top: 70px;
}

.zx {
  width: 70%;
  margin: 0 auto;
  padding-top: 30px;
}

.tabs {
  background-color: #fff;
  padding: 10px;
  min-height: 80vh;
}

.yq {
  display: flex;
  margin-top: 10px;
  font-size: 15px;
}

.yq > p {
  margin-left: 10px;
  letter-spacing: 1px;
}

.yuan {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
}

.bgc_red {
  background-color: red;
}

.bgc_orange {
  background-color: orange;
}

.bgc_green {
  background-color: green;
}

.ylkp {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}


/* ------快速申请按钮------ */
.btn_ks {
  margin: 0 0 0 30px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 10rem;
  height: 2.5rem;
  overflow: hidden;
  background-size: 300% 300%;
  backdrop-filter: blur(1rem);
  border-radius: 5rem;
  transition: 0.5s;
  animation: gradient_301 5s ease infinite;
  border: double 4px transparent;
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
}

#container-stars {
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  transition: 0.5s;
  backdrop-filter: blur(1rem);
  border-radius: 5rem;
}

strong {
  z-index: 2;
  font-family: "Avalors Personal Use";
  font-size: 12px;
  letter-spacing: 5px;
  color: #ffffff;
  text-shadow: 0 0 4px white;
}

#glow {
  position: absolute;
  display: flex;
  width: 12rem;
}

.circle {
  width: 100%;
  height: 30px;
  filter: blur(2rem);
  animation: pulse_3011 4s infinite;
  z-index: -1;
}

.circle:nth-of-type(1) {
  background: rgba(254, 83, 186, 0.636);
}

.circle:nth-of-type(2) {
  background: rgba(142, 81, 234, 0.704);
}

.btn_ks:hover #container-stars {
  z-index: 1;
  background-color: #212121;
}

.btn_ks:hover {
  transform: scale(1.1);
}

.btn_ks:active {
  border: double 4px #fe53bb;
  background-origin: border-box;
  background-clip: content-box, border-box;
  animation: none;
}

.btn_ks:active .circle {
  background: #fe53bb;
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
/* ------快速申请按钮end------ */

@media (max-width: 1000px) {
  .zx {
    width: 95%;
  }
}
</style>
