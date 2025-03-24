<template>
  <div class="main">
    <div class="zx">
      <div class="bzDiv">
        <Image src="/other/2.gif" width="100%" height="300px" lazy>
          <template #placeholder>
            <div class="imgLoading"></div>
          </template>
        </Image>
        <h1 class="ssn">一些碎碎念</h1>
      </div>
      <ul id="ssUl" v-if="momentsData">
        <li v-for="item in momentsData.records" :key="item.id">
          <div class="user">
            <Avatar
              icon="ios-person"
              size="large"
              :src="variable.pz_all.value.bz_tx"
            />
            <div>
              <p style="font-size: 18px">{{ variable.pz_all.value.bz_name }}</p>
              <p style="color: #b6b6b6">{{ item.createTime }}</p>
            </div>
          </div>

          <MdPreview
            class="moment_content"
            :modelValue="item.content"
            previewTheme="mk-cute"
          />

          <div
            style="
              height: 30px;
              display: flex;
              align-items: center;
              margin-bottom: 10px;
            "
          >
            <Icon
              type="ios-chatbubbles-outline"
              size="20"
              style="cursor: pointer"
              @click="hfpl(null, null, item.id)"
            />

            <Icon
              @click="dz($event, item.id)"
              :type="item.sfStick ? 'ios-thumbs-up' : 'ios-thumbs-up-outline'"
              size="20"
              style="margin: 0 3px 0 10px; cursor: pointer"
            />

            <span>{{ item.stick }}</span>
          </div>

          <div
            style="margin: 0 auto; display: none; padding: 0 0 20px 0"
            :id="`reply` + item.id"
            class="replyDiv"
          >
            <Comment />
            <div style="text-align: center">
              <Button type="primary" ghost @click="qxhf">取消回复</Button>
            </div>
          </div>

            <div v-for="fpl in item.comments" :key="fpl.id" class="pllb">
            <div>
              <div class="hfplDiv">
                <div style="display: flex; align-items: center">
                  <div
                    style="position: relative; height: 25px; margin-right: 5px"
                  >
                    <Avatar
                      icon="ios-person"
                      size="small"
                      :src="fpl.avatarUrl"
                    />&nbsp;
                    <div
                      class="bozhu"
                      v-if="fpl.email == variable.adminEmail.value"
                    >
                      <Tooltip content="博主" placement="right">
                        <Icon type="logo-angular" :size="12" />
                      </Tooltip>
                    </div>
                  </div>
                  <div>
                    <h3>
                      {{ fpl.nickname }}
                      <Time
                        style="
                          font-size: 10px;
                          font-weight: 400;
                          margin-left: 20px;
                        "
                        :time="fpl.creationTime"
                        :interval="1"
                      />
                    </h3>
                      <MdPreview class="moment_content" :modelValue="item.content" />
                  </div>
                </div>
                <!-- 回复按钮 -->
                  <button class="chatBtn" @click="hfpl(fpl.id, fpl.id, item.id)">
                  <svg
                    height="1.3em"
                    fill="white"
                    xml:space="preserve"
                    viewBox="0 0 1000 1000"
                    y="0px"
                    x="0px"
                    version="1.1"
                  >
                    <path
                      d="M881.1,720.5H434.7L173.3,941V720.5h-54.4C58.8,720.5,10,671.1,10,610.2v-441C10,108.4,58.8,59,118.9,59h762.2C941.2,59,990,108.4,990,169.3v441C990,671.1,941.2,720.5,881.1,720.5L881.1,720.5z M935.6,169.3c0-30.4-24.4-55.2-54.5-55.2H118.9c-30.1,0-54.5,24.7-54.5,55.2v441c0,30.4,24.4,55.1,54.5,55.1h54.4h54.4v110.3l163.3-110.2H500h381.1c30.1,0,54.5-24.7,54.5-55.1V169.3L935.6,169.3z M717.8,444.8c-30.1,0-54.4-24.7-54.4-55.1c0-30.4,24.3-55.2,54.4-55.2c30.1,0,54.5,24.7,54.5,55.2C772.2,420.2,747.8,444.8,717.8,444.8L717.8,444.8z M500,444.8c-30.1,0-54.4-24.7-54.4-55.1c0-30.4,24.3-55.2,54.4-55.2c30.1,0,54.4,24.7,54.4,55.2C554.4,420.2,530.1,444.8,500,444.8L500,444.8z M282.2,444.8c-30.1,0-54.5-24.7-54.5-55.1c0-30.4,24.4-55.2,54.5-55.2c30.1,0,54.4,24.7,54.4,55.2C336.7,420.2,312.3,444.8,282.2,444.8L282.2,444.8z"
                    ></path>
                  </svg>
                  <span class="tooltip">回复</span>
                </button>
              </div>
              <div
                style="margin: 0 auto; display: none; padding: 0 0 20px 0"
                :id="`reply` + fpl.id"
                class="replyDiv"
              >
                <Comment />
                <div style="text-align: center">
                  <Button type="primary" ghost @click="qxhf">取消回复</Button>
                </div>
              </div>
            </div>

            <div v-for="zpl in fpl.children" :key="zpl.id">
              <div class="hhfplDiv">
                <div style="display: flex; align-items: center">
                  <div
                    style="position: relative; height: 25px; margin-right: 5px"
                  >
                    <Tooltip :content="zpl.nickname" placement="right">
                      <Avatar
                        icon="ios-person"
                        size="small"
                        :src="zpl.avatarUrl"
                      />&nbsp;
                    </Tooltip>
                    <div
                      class="bozhu"
                      v-if="zpl.email == variable.adminEmail.value"
                    >
                      <Tooltip content="博主" placement="right">
                        <Icon type="logo-angular" :size="12" />
                      </Tooltip>
                    </div>
                  </div>
                  <div>
                    <h3>
                      {{ zpl.nickname }}
                      <a style="font-size: 14px">{{
                        "&nbsp;@" + zpl.bhfName
                      }}</a>
                      <Time
                        style="
                          font-size: 10px;
                          font-weight: 400;
                          margin-left: 20px;
                        "
                        :time="zpl.creationTime"
                        :interval="1"
                      />
                    </h3>
                    <MdPreview
                      class="momentsContent"
                      :modelValue="zpl.content"
                    />
                  </div>
                </div>
                <!-- 回复按钮 -->
                    <button class="chatBtn" @click="hfpl(fpl.id, zpl.id, item.id)">
                  <svg
                    height="1.3em"
                    fill="white"
                    xml:space="preserve"
                    viewBox="0 0 1000 1000"
                    y="0px"
                    x="0px"
                    version="1.1"
                  >
                    <path
                      d="M881.1,720.5H434.7L173.3,941V720.5h-54.4C58.8,720.5,10,671.1,10,610.2v-441C10,108.4,58.8,59,118.9,59h762.2C941.2,59,990,108.4,990,169.3v441C990,671.1,941.2,720.5,881.1,720.5L881.1,720.5z M935.6,169.3c0-30.4-24.4-55.2-54.5-55.2H118.9c-30.1,0-54.5,24.7-54.5,55.2v441c0,30.4,24.4,55.1,54.5,55.1h54.4h54.4v110.3l163.3-110.2H500h381.1c30.1,0,54.5-24.7,54.5-55.1V169.3L935.6,169.3z M717.8,444.8c-30.1,0-54.4-24.7-54.4-55.1c0-30.4,24.3-55.2,54.4-55.2c30.1,0,54.5,24.7,54.5,55.2C772.2,420.2,747.8,444.8,717.8,444.8L717.8,444.8z M500,444.8c-30.1,0-54.4-24.7-54.4-55.1c0-30.4,24.3-55.2,54.4-55.2c30.1,0,54.4,24.7,54.4,55.2C554.4,420.2,530.1,444.8,500,444.8L500,444.8z M282.2,444.8c-30.1,0-54.5-24.7-54.5-55.1c0-30.4,24.4-55.2,54.5-55.2c30.1,0,54.4,24.7,54.4,55.2C336.7,420.2,312.3,444.8,282.2,444.8L282.2,444.8z"
                    ></path>
                  </svg>
                  <span class="tooltip">回复</span>
                </button>
              </div>
              <div
                style="margin: 10px auto 0; display: none; padding: 0 0 20px 0"
                :id="`reply` + zpl.id"
                class="replyDiv"
              >
                <Comment />
                <div style="text-align: center">
                  <Button type="primary" ghost @click="qxhf">取消回复</Button>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>

      <div
        style="text-align: center; margin-top: 100px"
        v-if="momentsData && momentsData.pages > 1"
      >
        <Page
          v-if="momentsData"
          :total="momentsData.total"
          v-model="momentsData.current"
          @on-change="commentChange"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
const axios = inject("axios");
import { MdPreview } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { ScrollIntoView } from "view-ui-plus";
import Comment from "./comment/Comment.vue";
import { eventBus } from "../../js/eventBus.js";
import variable from "../../js/variable";
import "../../js/click-colorful";

const momentsData = ref(null); //说说数据

//查询所有说说
const findMoments = (pageNum) => {
  if (variable.userInfo.value && variable.userInfo.value.roleName == "管理员") {
    axios
      .post("moments/findMoments", { pageNum: pageNum })
      .then((response) => {
        let res = response.data;
        if (res.msg == "成功") {
          momentsData.value = res.data;
        }
      })
      .catch();
  } else {
    axios
      .post("moments/findMoments", { pageNum: pageNum })
      .then((response) => {
        let res = response.data;
        if (res.msg == "成功") {
          momentsData.value = res.data;
        }
      })
      .catch();
  }
};
eventBus.on("findMoments", findMoments);

//说说翻页
function commentChange(pageNum) {
  findMoments(pageNum);

  // 滚动至评论区域顶部
  ScrollIntoView(document.getElementById("ssUl"), {
    time: 1000,
    align: {
      topOffset: 100,
    },
  });
}

//点赞
function dz(event, id) {
  //点击特效
  new colorBall().fly(event.clientX, event.clientY, 10);

  axios
    .post("moments/likeMoments", { id: id })
    .then((response) => {
      let res = response.data;
      findMoments(1);
    })
    .catch();
}

//回复按钮
function hfpl(commentId, bhfId, targetId) {
    //显示评论框
    document.getElementById("reply" + targetId).style.display = "block";
    //重置发送评论数据
    emptyPlData();
    //父评论id，最大一级
    variable.plData.commentId = commentId;
    if (targetId != 1) {
        variable.plData.bhfId = bhfId;
    }
    //说说id
    variable.plData.targetId = targetId;
}

//取消回复
function qxhf() {
  // 获取所有具有 class 为 replyDiv 的元素
  const replyDivElements = document.querySelectorAll(".replyDiv");
  // 遍历这些元素并将它们隐藏
  replyDivElements.forEach((element) => {
    element.style.display = "none";
  });
}
eventBus.on("qxhf", qxhf);

//重置发送评论数据
function emptyPlData() {
  variable.plData.content = "";
  variable.plData.commentId = null;
  variable.plData.bhfId = null;
}

onMounted(() => {
  findMoments(1);
});
</script>
<style  scoped>
.bozhu {
  background-color: #00b7ff;
  width: 15px;
  height: 15px;
  line-height: 15px;
  text-align: center;
  color: #fff;
  border-radius: 50%;
  position: absolute;
  bottom: 0;
  right: 0;
}

.main {
  background-color: #f7f9fe;
  margin-top: 70px;
}

.zx {
  width: 70%;
  margin: 0 auto;
  padding-top: 30px;
}

.bzDiv {
  position: relative;
  margin-bottom: 20px;
  border-radius: 10px;
  overflow: hidden;
}

.ssn {
  position: absolute;
  top: 0;
  padding: 40px;
  color: #fff;
  letter-spacing: 2px;
}

li {
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 10px;
  margin-top: 30px;
  list-style-type: none;
}

.user {
  display: flex;
  align-items: center;
}

.user > div {
  margin-left: 10px;
}

@font-face {
  font-family: "sxt";
  src: url(/ttf/sxt.ttf);
}

.moment_content {
  border-top: 1px solid rgb(236, 236, 236);
  border-bottom: 1px solid rgb(236, 236, 236);
  min-height: 50px;
  padding: 15px 0px 0px 40px;
  font-family: "sxt", Arial, sans-serif;

  background-image: linear-gradient(
          90deg,
          transparent 50px,
          #ffb4b8 50px,
          #ffb4b8 52px,
          transparent 52px
  ),
  linear-gradient(#e1e1e1 0.1em, transparent 0.1em);
  background-size: 100% 29px;
}

.pllb {
    color: #808080;
    background-image: linear-gradient(
            90deg,
            transparent 53px,
            #ffb4b8 50px,
            #ffb4b8 52px,
            transparent 52px
    ),
    linear-gradient(#e1e1e1 0.1em, transparent 0.1em);
    background-size: 100% 29px;
}

.hfplDiv {
  padding-bottom: 10px;
  display: flex;
  justify-content: space-between;
}

.hfplDiv:hover,
.hhfplDiv:hover {
  background-color: #f5f5f5;
}

.hhfplDiv {
  padding: 0 0 10px 25px;
  display: flex;
  justify-content: space-between;
}

.hfIco {
  cursor: pointer;
  display: none;
  color: red;
  margin-top: 20px;
}

.hfIco:hover {
  color: #00b7ff;
}

p {
  display: flex;
  align-items: center;
}

/* -------------------------回复按钮-------------------------------------------- */
.chatBtn {
  opacity: 0;
  margin: 10px 20px 0 0;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: none;
  background-color: #ffe53b;
  background-image: linear-gradient(147deg, #ffe53b, #ff2525, #ffe53b);
  cursor: pointer;
  padding-top: 3px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.164);
  position: relative;
  background-size: 300%;
  background-position: left;
  transition-duration: 1s;
}

.hfplDiv:hover .chatBtn {
  opacity: 1;
}

.hhfplDiv:hover .chatBtn {
  opacity: 1;
}

.tooltip {
  width: 50px;
  position: absolute;
  top: -40px;
  opacity: 0;
  background-color: rgb(255, 180, 82);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition-duration: 0.5s;
  pointer-events: none;
  letter-spacing: 0.5px;
}

.chatBtn:hover .tooltip {
  opacity: 1;
  transition-duration: 0.5s;
}

.chatBtn:hover {
  background-position: right;
  transition-duration: 1s;
}
/* -------------------------回复按钮end-------------------------------------------- */

@media (max-width: 1000px) {
  .zx {
    width: 90%;
  }
  /* .moment_content {
    font-family: Arial, sans-serif;
  } */
}
</style>
