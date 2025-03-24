<template>
  <div class="commentList" id="commentList" v-if="variable.commentData.value">
    <h2 v-if="variable.commentData.value">
      {{ variable.commentData.value.spare }}条评论
    </h2>
    <SkeletonItem
      v-else
      :animated="true"
      type="rect"
      size="small"
    ></SkeletonItem>

    <div
      v-if="variable.commentData.value"
      class="commentItem"
      v-for="fpl in variable.commentData.value.records"
      :key="fpl.id"
    >
      <div>
        <div class="txandnc" @click="goUrl(fpl.blogUrl)">
          <div style="position: relative; height: 55px">
            <div style="border-radius: 50%; position: relative">
              <Image class="fplTx" :src="fpl.avatarUrl">
                <template #error>
                  <Avatar icon="ios-person" size="large" />
                </template>
              </Image>
              <Image
                v-if="fpl.pendant"
                :src="`/gj/${fpl.pendant}.png`"
                id="guajian"
              />
            </div>
          </div>

          <div style="display: flex">
            <div style="display: flex">
              <span
                class="nicknameSpan"
                style="color: #6483da"
                v-if="fpl.email == variable.adminEmail.value"
              >
                {{ fpl.nickname }}
                <div class="bzDiv">博主</div>
              </span>

              <span class="nicknameSpan" v-else>
                {{ fpl.nickname }}
              </span>

              <div class="time">
                <Time :time="fpl.creationTime" :interval="1" />
              </div>
            </div>

            <div class="positionORtype">
              <Icon type="md-pin" size="14" />
              {{ fpl.address }}
            </div>
          </div>
        </div>

        <div
          class="reply"
          @mouseover="replyOver(fpl.id)"
          @mouseout="replyOut"
          @click="updReplyState(fpl.id, fpl.id)"
        >
          <Icon
            type="ios-text-outline"
            size="30"
            color="#3b73c7"
            :id="`replyIco` + fpl.id"
          />
        </div>
      </div>
      <MdPreview class="commentListYL" :modelValue="fpl.content" />
      <div
        style="width: 90%; margin: 0 auto; display: none; padding: 0 0 20px 0"
        :id="`reply` + fpl.id"
        class="replyDiv"
      >
        <Comment />
        <div style="text-align: center">
          <Button type="primary" ghost @click="qxhf">取消回复</Button>
        </div>
      </div>

      <!-- -------子评论列表----- -->
      <div
        class="zpl"
        v-for="zpl in clList(fpl.showAll, fpl.children)"
        :key="zpl.id"
      >
        <div class="zpl_main">
          <div class="zpl_main_1">
            <div>
              <div
                style="position: relative; height: 45px; cursor: pointer"
                @click="goUrl(zpl.blogUrl)"
              >
                <div style="border-radius: 50%; position: relative">
                  <Image class="fplTx" :src="zpl.avatarUrl">
                    <template #error>
                      <Avatar icon="ios-person" size="large" />
                    </template>
                  </Image>
                  <Image
                    v-if="zpl.pendant"
                    :src="`/gj/${zpl.pendant}.png`"
                    id="guajian"
                  />
                </div>
              </div>

              <div style="display: flex">
                <div style="display: flex">
                  <span
                    class="nicknameSpan"
                    style="color: #6483da"
                    v-if="zpl.email == variable.adminEmail.value"
                  >
                    {{ zpl.nickname }}
                    <div class="bzDiv">博主</div>
                  </span>

                  <span class="nicknameSpan" v-else>
                    {{ zpl.nickname }}
                  </span>

                  <div class="time">
                    <span
                      >回复 <a>{{ zpl.bhfName }}</a></span
                    >
                    <span class="zplTime">
                      <Time :time="zpl.creationTime" :interval="1" />
                    </span>
                  </div>
                </div>

                <div class="zplAddress positionORtype">
                  <Icon type="md-pin" size="14" />
                  {{ zpl.address }}
                </div>
              </div>
            </div>

            <div
              class="reply"
              @mouseover="replyOver(zpl.id)"
              @mouseout="replyOut"
              @click="updReplyState(fpl.id, zpl.id)"
            >
              <Icon
                type="ios-text-outline"
                size="30"
                color="#3b73c7"
                :id="`replyIco` + zpl.id"
              />
            </div>
          </div>
          <MdPreview class="commentListYL" :modelValue="zpl.content" />

          <div
            style="margin: 0 auto; display: none"
            :id="`reply` + zpl.id"
            class="replyDiv"
          >
            <Comment />
            <div style="text-align: center; margin: 20px">
              <Button type="primary" ghost @click="qxhf">取消回复</Button>
            </div>
          </div>
        </div>
      </div>

      <Button
        v-if="fpl?.children?.length > 2 && !fpl.showAll"
        @click="toggleShowAll(fpl)"
        long
        >展开<Icon type="ios-arrow-down"
      /></Button>
      <Button
        v-if="fpl?.children?.length > 2 && fpl.showAll"
        @click="toggleShowAll(fpl)"
        long
        >收起<Icon type="ios-arrow-up"
      /></Button>
    </div>
    <Skeleton v-else loading avatar animated />

    <!-- 分页 -->
    <div
      style="text-align: center; margin-top: 100px"
      v-if="variable.commentData.value.pages > 1"
    >
      <Page
        v-if="variable.commentData.value"
        :page-size="5"
        :total="variable.commentData.value.total"
        v-model="variable.commentData.value.current"
        @on-change="commentChange"
      />
    </div>
  </div>

  <div style="text-align: center" v-else>
    <svg
      t="1694937809784"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="17141"
      width="100"
      height="100"
    >
      <path
        d="M 891.554 775.204 H 129.105 l -0.145256 -10.3132 v -2.61461 c 0 -75.6785 39.2192 -139.009 113.591 -183.022 c 67.6893 -40.2361 162.833 -62.3149 267.852 -62.3149 s 200.162 22.0789 267.852 62.3149 c 74.3711 44.1578 113.591 107.489 113.591 183.022 v 2.61461 l -0.290511 10.3132 Z m -743.711 -18.8833 h 724.974 c -4.50294 -152.373 -184.33 -220.644 -362.413 -220.644 s -358.056 68.2703 -362.559 220.644 Z"
        fill="#e6e6e6"
        p-id="17142"
      ></path>
      <path
        d="M 128.959 766.052 c -6.24602 -228.633 -40.5265 -263.929 -55.1972 -278.891 c -2.03358 -2.03358 -3.77666 -3.92192 -5.51972 -5.95551 c -1.01679 -1.30731 -3.05038 -3.63142 -5.51972 -6.24602 c -20.4811 -22.9506 -68.2703 -76.5499 -52.4375 -121.288 c 9.15114 -25.7105 37.6213 -42.7052 84.8295 -50.4039 c 39.2192 -8.2796 73.6448 -1.01679 102.26 21.6432 c 83.5223 65.801 89.3325 238.948 89.6232 246.208 l -18.8833 0.581024 c 0 -1.74307 -5.81024 -171.692 -82.3602 -231.974 c -24.1124 -19.0286 -53.4541 -24.9841 -86.8631 -17.8666 l -0.435769 0.145256 c -39.9454 6.53652 -63.6223 19.3191 -70.304 38.2024 c -12.2014 34.2803 32.1016 83.8128 48.6606 102.55 c 2.90511 3.19563 4.93872 5.51972 6.24602 7.2628 c 1.01679 1.30731 2.46934 2.75988 4.06718 4.50294 c 17.576 18.0119 54.1805 55.4878 60.5717 291.528 h -18.7379 Z M 890.537 766.052 l -18.8833 -0.581024 c 6.39127 -236.042 42.9958 -273.517 60.5717 -291.528 c 1.74307 -1.74307 3.19563 -3.19563 4.06718 -4.50294 c 1.30731 -1.74307 3.34089 -4.06718 6.24602 -7.2628 c 16.7046 -18.5927 60.8624 -68.2703 48.6606 -102.55 c -6.68178 -18.7379 -30.3585 -31.6658 -70.304 -38.2024 l -0.435769 -0.145256 c -33.6995 -7.11754 -63.041 -1.16204 -87.1537 17.8666 c -76.4047 60.136 -82.0697 228.778 -82.0697 230.375 l -18.8833 -0.581024 c 0.145256 -7.2628 5.95551 -179.246 89.3325 -244.756 c 28.7607 -22.6599 63.3316 -29.9227 102.55 -21.6432 c 47.2082 7.69856 75.6785 24.6934 84.8295 50.4039 c 15.8329 44.7388 -31.9563 98.4835 -52.4375 121.288 c -2.46934 2.75988 -4.50294 5.08396 -5.51972 6.24602 c -1.59782 2.03358 -3.48614 3.92192 -5.51972 5.95551 c -14.5256 15.6877 -48.806 50.8396 -55.0521 279.617 Z"
        fill="#e6e6e6"
        p-id="17143"
      ></path>
      <path
        d="M 242.259 380.398 l -18.8833 -1.16204 c 0.145256 -2.75988 4.35769 -67.9799 41.979 -134.361 c 22.2241 -39.2192 51.4207 -70.4492 87.0083 -93.109 c 44.3031 -28.0343 98.1932 -42.4148 160.363 -42.7052 h 1.30731 c 61.5885 0 114.898 14.0898 158.618 41.8337 c 35.2973 22.3695 64.0579 53.7447 85.8464 92.964 c 36.6045 66.382 39.9454 131.891 40.0908 134.651 l -18.8833 0.871537 c 0 -0.581024 -3.34089 -64.3483 -38.057 -126.953 c -45.9009 -82.5055 -122.451 -124.341 -227.471 -124.341 h -1.30731 c -105.747 0.290511 -183.458 42.5601 -230.666 125.503 c -35.733 62.6053 -39.9454 126.082 -39.9454 126.808 Z M 128.234 906.952 c -8.13433 0 -16.5593 -0.871537 -23.5315 -3.92192 c -5.95551 -2.46934 -10.3132 -7.69856 -11.3301 -13.3636 c -0.871537 -4.93872 0.871537 -9.87742 4.79346 -13.5087 c 43.2864 -39.2192 31.0848 -108.216 30.9396 -108.797 l 18.5927 -3.48614 c 0.581024 3.19563 13.5087 76.1141 -32.973 122.596 c 6.97229 1.88833 17.4307 1.88833 31.3753 0.145256 c 6.97229 -0.871537 10.8942 -2.61461 12.492 -5.37447 c 5.08396 -9.15114 6.53652 -30.6491 8.13433 -55.4878 c 1.16204 -17.576 2.46934 -37.4761 5.22922 -59.2645 l 18.7379 2.46934 c -2.75988 21.0623 -4.06718 40.6718 -5.08396 57.9572 c -1.88833 29.4869 -3.34089 50.6945 -10.4585 63.4768 c -6.82703 12.3469 -21.6432 14.2351 -26.4365 14.8161 c -6.10077 1.01679 -13.2185 1.74307 -20.4811 1.74307 Z M 891.991 906.226 c -7.2628 0 -14.3803 -0.72628 -20.1905 -1.45256 c -4.79346 -0.581024 -19.6096 -2.61461 -26.4365 -14.8161 c -7.11754 -12.7826 -8.57012 -34.1352 -10.4585 -63.4768 c -1.16204 -17.2853 -2.46934 -36.895 -5.08396 -57.9572 l 18.7379 -2.46934 c 2.75988 21.6432 4.06718 41.6885 5.22922 59.2645 c 1.59782 24.9841 3.05038 46.4821 8.13433 55.4878 c 1.59782 2.75988 5.51972 4.50294 12.492 5.37447 c 13.7994 1.88833 24.4031 1.74307 31.3753 -0.145256 c -46.4821 -46.4821 -33.5543 -119.4 -32.973 -122.596 l 18.5927 3.48614 l -9.2964 -1.74307 l 9.2964 1.74307 c -0.145256 0.72628 -12.2014 69.7229 30.9396 108.797 c 3.92192 3.63142 5.66497 8.42485 4.79346 13.5087 c -1.01679 5.66497 -5.37447 10.8942 -11.3301 13.3636 c -7.40805 2.75988 -15.6877 3.63142 -23.8221 3.63142 Z M 332.898 867.152 h -28.3249 c -3.92192 0 -7.69856 -1.74307 -10.3132 -4.64821 c -2.61461 -3.05038 -3.77666 -6.97229 -3.19563 -10.8942 l 12.9278 -86.2822 l 18.7379 2.75988 l -11.911 80.1813 h 17.1403 l 6.10077 -81.7793 l 18.8833 1.45256 l -6.53652 86.7178 c -0.581024 6.97229 -6.39127 12.492 -13.5087 12.492 Z M 716.667 866.715 h -28.3249 c -6.97229 0 -12.9278 -5.51972 -13.5087 -12.492 l -6.53652 -86.7178 l 18.8833 -1.45256 l 6.10077 81.7793 h 17.1403 l -11.911 -80.1813 l 18.7379 -2.75988 l 12.9278 86.2822 c 0.581024 3.92192 -0.581024 7.84383 -3.19563 10.8942 c -2.75988 2.90511 -6.39127 4.64821 -10.3132 4.64821 Z"
        fill="#e6e6e6"
        p-id="17144"
      ></path>
      <path
        d="M 313.435 866.426 c -36.0235 3.05038 -142.351 25.1291 -142.351 25.1291 H 848.995 l -137.994 -25.7105 c 0 0.145256 -297.484 -8.13433 -397.567 0.581024 Z"
        fill="#e6e6e6"
        p-id="17145"
      ></path>
      <path
        d="M 310.675 439.226 l -23.8221 -2.17884 c 0.435769 -3.34089 13.3636 -80.6171 152.955 -121.724 l 8.42485 17.7213 c -125.937 37.0403 -137.412 105.455 -137.557 106.182 Z M 700.252 437.774 c 0 -0.145256 -2.75988 -17.576 -19.9 -39.0737 c -15.8329 -20.0453 -47.6439 -47.7893 -109.233 -67.1084 l 7.84383 -17.7213 c 131.023 40.9622 143.223 118.385 143.658 121.724 l -22.3695 2.17884 Z M 511.853 327.525 l -29.7775 -42.7052 l 29.3417 -48.6606 l 28.6155 46.7725 Z"
        fill="#e6e6e6"
        p-id="17146"
      ></path>
      <path
        d="M 512 332.754 l -33.4089 -47.9346 l 32.8279 -54.3258 l 31.9563 52.4375 l -31.3753 49.8229 Z m -26.4365 -48.0798 l 26.2914 37.6213 l 24.8388 -39.3644 l -25.2746 -41.1075 l -25.8557 42.8506 Z"
        fill="#e6e6e6"
        p-id="17147"
      ></path>
    </svg>
    <p style="letter-spacing: 1px">快抢沙发...</p>
  </div>
</template>
<script setup>
import { MdPreview } from "md-editor-v3";
import Comment from "./Comment.vue";
import { ScrollIntoView } from "view-ui-plus";
const axios = inject("axios");
import { eventBus } from "../../../js/eventBus.js";
import variable from "../../../js/variable.js";
const route = useRoute();

onMounted(() => {
  pdPlLx();
});

function pdPlLx() {
  //防止未关闭回复区域，然后跳转新页面了
  qxhf();

  //判断当前是哪个页面的评论框，设置对应数据
  if (route.name == "Article") {
    variable.plData.classify = +1;
    variable.plData.targetId = +route.params.id; //文章id
    variable.plData.content = "";
    variable.findPl.targetId = +route.params.id; //文章id
    variable.findPl.classify = +1;
  } else if (route.name == "About" || route.name == "Message") {
    variable.plData.targetId = +0;
    variable.plData.content = "";
    variable.plData.classify = +2;
    variable.findPl.targetId = +0;
    variable.findPl.classify = +2;
  } else if (route.name == "Moments") {
    variable.plData.classify = +3;
    variable.plData.content = "";
    variable.plData.targetId = +0;
    variable.findPl.targetId = +0;
    variable.findPl.classify = +3;
  } else if (route.name == "Links") {
    variable.findPl.classify = +4;
    variable.findPl.targetId = +0;
    variable.plData.targetId = +0;
    variable.plData.classify = +4;
  }

  //查询评论列表
  findComment(1);
}

//查询所有评论
const findComment = (pageNum) => {
  if (pageNum) {
    variable.findPl.pageNum = pageNum;
  }
  (async () => {
    try {
      const response = await axios.post("comment/findComment", variable.findPl);
      let res = response.data;
      if (res.msg == "成功") {
        if (res.data) {
          // 使用 map 函数为每个对象增加 showAll 属性,用于默认折叠评论
          res.data.records = res.data.records.map((item) => ({
            ...item,
            showAll: false,
          }));
        }

        variable.commentData.value = res.data;
      }
    } catch (error) {
      // 请求失败，捕获并处理错误
      console.error("Error:", error);
    }
  })();
};
// 订阅事件，当事件触发时执行相应的函数
eventBus.on("findComment", findComment);

//评论翻页
function commentChange(pageNum) {
  findComment(pageNum);

  // 滚动至评论区域顶部
  ScrollIntoView(document.getElementById("commentList"), {
    time: 1000,
    align: {
      top: 0,
      topOffset: 30,
    },
  });
}

// -----回复评论START------------

//鼠标悬停图片改变样式
function replyOver(commentId) {
  document
    .getElementById("replyIco" + commentId)
    .classList.add("ivu-icon-ios-text");
  document
    .getElementById("replyIco" + commentId)
    .classList.remove("ivu-icon-ios-text-outline");
}
const xtIco = document.getElementsByClassName("ivu-icon-ios-text"); //悬停所有回复按钮图标
//鼠标移出图片改变样式
function replyOut() {
  xtIco[0].classList.add("ivu-icon-ios-text-outline");
  xtIco[0].classList.remove("ivu-icon-ios-text");
}

//显示回复评论框
function updReplyState(commentId, bhfId) {
  //回复图标点击显示、隐藏评论框
  const replyDivElements = document.querySelectorAll(".replyDiv");
  // 遍历这些元素并将它们隐藏
  replyDivElements.forEach((element) => {
    element.style.display = "none";
  });
  //再显示需要回复的评论框
  document.getElementById("reply" + bhfId).style.display = "block";
  //显示一级评论框遮罩层
  variable.yjplkZz.value = true;
  //重置发送评论数据
  emptyPlData();
  //设置回复id
  variable.plData.commentId = commentId;
  variable.plData.bhfId = bhfId;
  variable.plData.content = "";
}

// 取消回复
function qxhf() {
  // 获取所有具有 class 为 replyDiv 的元素
  const replyDivElements = document.querySelectorAll(".replyDiv");
  // 遍历这些元素并将它们隐藏
  replyDivElements.forEach((element) => {
    element.style.display = "none";
  });
  //隐藏一级评论框遮罩层
  if (route.name != "Moments") {
    variable.yjplkZz.value = false;
  }
  //清空评论框数据
  emptyPlData();
}
// 订阅事件，当事件触发时执行相应的函数
eventBus.on("qxhf", qxhf);

//重置发送评论数据
function emptyPlData() {
  variable.plData.type = null;
  variable.plData.content = "";
  variable.plData.commentId = null;
  variable.plData.bhfId = null;
}
// 订阅事件，当事件触发时执行相应的函数
eventBus.on("emptyPlData", emptyPlData);

// -----回复评论END------------

//前往评论的博客
function goUrl(url) {
  if (url) {
    if (url.startsWith("http")) {
      window.open(url, "_blank");
    } else {
      window.open("http://" + url, "_blank");
    }
  }
}

//处理显示的评论数量（折叠状态显示2条数据）
function clList(state, list) {
  if (!state && list && list.length > 2) {
    return list.slice(0, 2);
  } else {
    return list;
  }
}

//展开评论
function toggleShowAll(fpl) {
  fpl.showAll = !fpl.showAll;
}
</script>

<style scoped>
#guajian {
  border-radius: 50%;
  width: 70px;
  height: 70px;
  position: absolute;
  left: -12px;
  top: -15px;
}

.commentList {
  padding: 60px 0 20px 0;
}

.commentItem {
  padding: 10px 0;
  margin: 20px 0;
  border-top: 1px dotted #cfcfcf;
}

.commentItem > div:nth-child(1) {
  display: flex;
  align-items: center;
}

.commentListYL {
  padding: 0 60px;
}

.fplTx {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  overflow: hidden;
}

.nicknameSpan {
  padding: 0 10px;
  font-weight: 600;
  font-size: 22px;
  display: flex;
  align-items: center;
}

.bzDiv {
  height: 20px;
  font-size: 10px;
  margin-left: 2px;
  color: #fff;
  padding: 0 5px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  background-color: #6483da;
}

.txandnc {
  display: flex;
  cursor: pointer;
}

.time {
  color: #8a8a8a;
  font-size: 12px;
  display: flex;
  align-items: center;
}

.time {
  margin-right: 20px;
}

.zplTime {
  margin-left: 10px;
}

.positionORtype {
  color: #8a8a8a;
  font-size: 12px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  justify-content: space-between;
  align-items: center;
}

.reply {
  cursor: pointer;
  margin-left: auto;
}

.zpl {
  display: flex;
  justify-content: flex-end;
}

.zpl_main {
  border-top: 1px solid rgb(228, 228, 228);
  width: 95%;
  padding-top: 20px;
}

.zpl_main_1 {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.zpl_main_1 > div:nth-child(1) {
  display: flex;
  align-items: center;
}

div.default-theme img {
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  border-radius: 0 !important;
}

@media (max-width: 700px) {
  .positionORtype {
    display: none;
  }
  .zplAddress {
    display: none;
  }
}

@media (max-width: 600px) {
  .zplTime {
    display: none;
  }
}
</style>