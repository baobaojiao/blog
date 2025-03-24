<template>
  <div
    style="display: flex; justify-content: space-between; position: relative"
  >
    <div class="plktx">
      <div style="position: relative">
        <Avatar icon="ios-person" size="large" :src="txUrl" v-show="!txUrl" />
        <Avatar icon="ios-person" size="large" :src="txUrl" v-show="txUrl" />
        <Image
          v-if="variable.plData.pendant"
          :src="`/gj/${variable.plData.pendant}.png`"
          id="guajian"
        />
      </div>
    </div>

    <div style="width: 95%">
      <div class="plinfo">
        <Input
          class="user_input"
          v-model="variable.plData.nickname"
          maxlength="8"
          placeholder="必填"
        >
          <template #prepend>
            <span>昵称</span>
          </template>
          <template #append>
            <div
              style="width: 20px; height: 20px; cursor: pointer"
              @click="variable.plData.nickname = formationName()"
            >
              <Image src="/other/sz.png" lazy />
            </div>
          </template>
        </Input>

        <Input
          class="user_input"
          type="number"
          v-model="variable.plData.email"
          maxlength="10"
          placeholder="必填"
        >
          <template #prepend>
            <span>邮箱</span>
          </template>
          <template #append> <span>@qq.com</span> </template>
        </Input>

        <Input
          class="user_input"
          v-model="variable.plData.blogUrl"
          maxlength="100"
          show-word-limit
          placeholder="选填"
        >
          <template #prepend>
            <span>网址</span>
          </template>
        </Input>
      </div>

      <div style="position: relative">
        <MdEditor
          @focus="handleFocus"
          @blur="handleBlur"
          class="mdEditor"
          ref="commentEditorRef"
          editorId="commentBjq"
          v-model="variable.plData.content"
          :toolbars="[]"
          :preview="false"
          :footers="[]"
          :maxLength="500"
        >
        </MdEditor>

        <!-- 字数 -->
        <div
          style="
            position: absolute;
            bottom: 5px;
            left: 10px;
            color: rgb(190, 190, 190);
            font-size: 12px;
          "
        >
          <span>{{ variable.plData.content.length }}</span
          >/500
        </div>

        <!-- 提示文字 -->
        <div
          @click="commentEditorRef.focus()"
          class="srkTip"
          v-if="variable.plData.content == ''"
        >
          <span>
            <svg
              style="width: 18px"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 512"
            >
              <path
                d="M593.8 59.1H46.2C20.7 59.1 0 79.8 0 105.2v301.5c0 25.5 20.7 46.2 46.2 46.2h547.7c25.5 0 46.2-20.7 46.1-46.1V105.2c0-25.4-20.7-46.1-46.2-46.1zM338.5 360.6H277v-120l-61.5 76.9-61.5-76.9v120H92.3V151.4h61.5l61.5 76.9 61.5-76.9h61.5v209.2zm135.3 3.1L381.5 256H443V151.4h61.5V256H566z"
              ></path>
            </svg>
            支持Mardown语法</span
          >
          <span>🐧 在邮箱处框输入QQ号会自动获取头像</span>
          <span
            >📧本站已开启邮件通知，回复您评论的同时会发送通知邮箱给您，所以务必确保邮箱的有效性</span
          >
        </div>

        <!-- 插画 -->
        <Image
          :src="chahua"
          width="100px"
          class="chahua"
          @click="commentEditorRef.focus()"
        />
      </div>

      <!-- 表情、提交、预览 -->
      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
        "
      >
        <div style="display: flex; align-items: center">
          <Expression @click-emoji="append" />
          <Pendant />
        </div>

        <div>
          <Button
            style="margin-right: 10px"
            :disabled="variable.plData.content == ''"
            @click="yulanState = !yulanState"
            >预览</Button
          >

          <Button type="primary" @click="fbpl" :disabled="fbplanState"
            >发表</Button
          >
        </div>
      </div>

      <!-- 预览组件 -->
      <MdPreview
        id="commentYl"
        v-show="yulanState"
        style="border: 1px solid #d3cccc"
        :modelValue="variable.plData.content"
      />
    </div>

    <!-- 发送评论加载区域 -->
    <Spin fix :show="addLodingState">
      <div id="addLoding">
        <img
          :src="
            'https://q1.qlogo.cn/g?b=qq&nk=' + variable.plData.email + '&s=100'
          "
        />

        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="200px"
          width="200px"
          viewBox="0 0 200 200"
          class="pencil"
        >
          <defs>
            <clipPath id="pencil-eraser">
              <rect height="30" width="30" ry="5" rx="5"></rect>
            </clipPath>
          </defs>
          <circle
            transform="rotate(-113,100,100)"
            stroke-linecap="round"
            stroke-dashoffset="439.82"
            stroke-dasharray="439.82 439.82"
            stroke-width="2"
            stroke="currentColor"
            fill="none"
            r="70"
            class="pencil__stroke"
          ></circle>
          <g transform="translate(100,100)" class="pencil__rotate">
            <g fill="none">
              <circle
                transform="rotate(-90)"
                stroke-dashoffset="402"
                stroke-dasharray="402.12 402.12"
                stroke-width="30"
                stroke="hsl(223,90%,50%)"
                r="64"
                class="pencil__body1"
              ></circle>
              <circle
                transform="rotate(-90)"
                stroke-dashoffset="465"
                stroke-dasharray="464.96 464.96"
                stroke-width="10"
                stroke="hsl(223,90%,60%)"
                r="74"
                class="pencil__body2"
              ></circle>
              <circle
                transform="rotate(-90)"
                stroke-dashoffset="339"
                stroke-dasharray="339.29 339.29"
                stroke-width="10"
                stroke="hsl(223,90%,40%)"
                r="54"
                class="pencil__body3"
              ></circle>
            </g>
            <g transform="rotate(-90) translate(49,0)" class="pencil__eraser">
              <g class="pencil__eraser-skew">
                <rect
                  height="30"
                  width="30"
                  ry="5"
                  rx="5"
                  fill="hsl(223,90%,70%)"
                ></rect>
                <rect
                  clip-path="url(#pencil-eraser)"
                  height="30"
                  width="5"
                  fill="hsl(223,90%,60%)"
                ></rect>
                <rect height="20" width="30" fill="hsl(223,10%,90%)"></rect>
                <rect height="20" width="15" fill="hsl(223,10%,70%)"></rect>
                <rect height="20" width="5" fill="hsl(223,10%,80%)"></rect>
                <rect
                  height="2"
                  width="30"
                  y="6"
                  fill="hsla(223,10%,10%,0.2)"
                ></rect>
                <rect
                  height="2"
                  width="30"
                  y="13"
                  fill="hsla(223,10%,10%,0.2)"
                ></rect>
              </g>
            </g>
            <g transform="rotate(-90) translate(49,-30)" class="pencil__point">
              <polygon
                points="15 0,30 30,0 30"
                fill="hsl(33,90%,70%)"
              ></polygon>
              <polygon points="15 0,6 30,0 30" fill="hsl(33,90%,50%)"></polygon>
              <polygon
                points="15 0,20 10,10 10"
                fill="hsl(223,10%,10%)"
              ></polygon>
            </g>
          </g>
        </svg>
      </div>
    </Spin>
  </div>
</template>
<script setup>
import { MdEditor, MdPreview } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { Notice } from "view-ui-plus";
import { eventBus } from "../../../js/eventBus.js";
import variable from "../../../js/variable";
import Expression from "../../Expression.vue";
import Pendant from "../Pendant.vue";
import { formationName } from "../../../js/randomName.js";

const route = useRoute();

const axios = inject("axios");
const commentEditorRef = ref(null); //编辑器ref
const fbplanState = ref(true); //发表按钮状态
const txUrl = ref(null); //输入框头像
const yulanState = ref(false); //预览状态
const chahua = ref("/other/gd.png"); //评论框插画

// 评论内容输入框聚焦回调函数
const handleFocus = () => {
  //改变边框颜色
  var editors = document.querySelectorAll(".mdEditor");
  editors.forEach(function (editor) {
    editor.style.border = "1px solid #57A3F3";
  });

  //切换插画
  chahua.value = "/other/xedx.png";
};

//评论内容输入框失焦回调函数
const handleBlur = () => {
  //改变边框颜色
  var editors = document.querySelectorAll(".mdEditor");
  editors.forEach(function (editor) {
    editor.style.border = "1px solid #E6E6E6";
  });

  //切换插画
  chahua.value = "/other/gd.png";
};

onMounted(() => {
  // 回显评论用户信息
  let commentUser = JSON.parse(localStorage.getItem("commentUser"));
  if (commentUser != null) {
    variable.plData.nickname = commentUser.nickname;
    variable.plData.email = commentUser.email.split("@")[0];
    variable.plData.blogUrl = commentUser.blogUrl;
  }

  //判断用户是否登录回显评论框
  if (variable.userInfo.value) {
      variable.plData.nickname = variable.userInfo.value.nickname;
      variable.plData.email = variable.userInfo.value.email?.split("@")[0] ?? "";
      txUrl.value = variable.userInfo.value.avatar;
  }

  //判断当前是哪个页面的评论框，设置对应数据
  if (route.name == "Article") {
    variable.plData.classify = +1;
    variable.plData.targetId = +route.params.id; //文章id
    variable.plData.content = "";
    variable.findPl.targetId = +route.params.id; //文章id
    variable.findPl.classify = +1;
  } else if (route.name == "About") {
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
});

//添加表情
function append(data) {
  variable.plData.content += "![](" + data.file + ")";

  commentEditorRef.value.focus(); //聚焦
}

//发送评论
const addLodingState = ref(false);
function fbpl() {
  addLodingState.value = true; //打开加载动画
  let now = new Date();
  let incipientTime = now.getTime();

  if (variable.plData.commentId != null) {
    variable.plData.type = 2;
  } else {
    variable.plData.type = 1;
  }

  variable.plData.email += "@qq.com";

  axios
    .post("comment/addComment", variable.plData)
    .then((response) => {
      //发送评论之后再去掉 @qq.com
      variable.plData.email = variable.plData.email.split("@")[0];
      let endTime = now.getTime();
      if (endTime - incipientTime < 1000) {
        setTimeout(() => {
          addLodingState.value = false; //关闭加载动画
        }, 500);
      } else {
        addLodingState.value = false; //关闭加载动画
      }

      let res = response.data;
      if (res.code != 200) {
        Notice.error({
          title: "失败",
          desc: res.msg,
        });
      } else {
        Notice.success({
          title: "评论成功！",
        });
        //------------如果是回复评论则需要关闭回复评论框
        if (variable.plData.type == 2 || route.name == "Moments") {
          eventBus.emit("qxhf");
        }
        //重置发送评论数据
        eventBus.emit("emptyPlData");
        //重新查询评论数据
        if (route.name == "Moments") {
          eventBus.emit("findMoments");
        } else {
          eventBus.emit("findComment");
        }
        //关闭预览
        yulanState.value = false;
        //评论者的信息存入localStorage
        localStorage.setItem(
          "commentUser",
          JSON.stringify({
            nickname: variable.plData.nickname,
            blogUrl: variable.plData.blogUrl,
            email: variable.plData.email,
          })
        );
      }
    })
    .catch(() => {});
}

watch(variable.plData, (newValue, oldValue) => {
  // 监视评论框中数据改变发表评论按钮状态
  if (oldValue.content && oldValue.nickname && oldValue.email) {
    fbplanState.value = false;
  } else {
    fbplanState.value = true;
  }

  //如果未登录qq转头像
  if (!variable.userInfo.value?.avatar) {
      if (newValue.email) {
          txUrl.value =
              "https://q1.qlogo.cn/g?b=qq&nk=" + newValue.email + "&s=100";
      } else {
          txUrl.value = null;
      }
  }
});
</script>
<style scoped>
.plinfo {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: 10px 0;
  color: rgb(190, 190, 190);
}

.plktx {
  width: 80px;
  display: flex;
  justify-content: center;
  padding-top: 25px;
}

#guajian {
  border-radius: 50%;
  width: 65px;
  height: 65px;
  position: absolute;
  left: -12px;
  top: -15px;
}

.user_input {
  width: 32%;
}

.mdEditor {
  padding-bottom: 20px;
  height: 150px;
  border-radius: 10px;
  transition: 0.5s;
}

.srkTip {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 15px;
  left: 20px;
  cursor: text;
  color: rgb(170, 170, 170);
}

.chahua {
  position: absolute;
  bottom: 0;
  right: 0;
  cursor: text;
}
/* ----------------------------------发送评论加载区域---------- */
#addLoding {
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}

#addLoding img {
  width: 70px;
  height: 70px;
  border-radius: 50%;
}

/* 往下都是铅笔动画 */
.pencil {
  display: block;
  width: 12em;
  height: 12em;
  position: absolute;
}

.pencil__body1,
.pencil__body2,
.pencil__body3,
.pencil__eraser,
.pencil__eraser-skew,
.pencil__point,
.pencil__rotate,
.pencil__stroke {
  animation-duration: 3s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.pencil__body1,
.pencil__body2,
.pencil__body3 {
  transform: rotate(-90deg);
}

.pencil__body1 {
  animation-name: pencilBody1;
}

.pencil__body2 {
  animation-name: pencilBody2;
}

.pencil__body3 {
  animation-name: pencilBody3;
}

.pencil__eraser {
  animation-name: pencilEraser;
  transform: rotate(-90deg) translate(49px, 0);
}

.pencil__eraser-skew {
  animation-name: pencilEraserSkew;
  animation-timing-function: ease-in-out;
}

.pencil__point {
  animation-name: pencilPoint;
  transform: rotate(-90deg) translate(49px, -30px);
}

.pencil__rotate {
  animation-name: pencilRotate;
}

.pencil__stroke {
  animation-name: pencilStroke;
  transform: translate(100px, 100px) rotate(-113deg);
}

@keyframes pencilBody1 {
  from,
  to {
    stroke-dashoffset: 351.86;
    transform: rotate(-90deg);
  }

  50% {
    stroke-dashoffset: 150.8;
    /* 3/8 of diameter */
    transform: rotate(-225deg);
  }
}

@keyframes pencilBody2 {
  from,
  to {
    stroke-dashoffset: 406.84;
    transform: rotate(-90deg);
  }

  50% {
    stroke-dashoffset: 174.36;
    transform: rotate(-225deg);
  }
}

@keyframes pencilBody3 {
  from,
  to {
    stroke-dashoffset: 296.88;
    transform: rotate(-90deg);
  }

  50% {
    stroke-dashoffset: 127.23;
    transform: rotate(-225deg);
  }
}

@keyframes pencilEraser {
  from,
  to {
    transform: rotate(-45deg) translate(49px, 0);
  }

  50% {
    transform: rotate(0deg) translate(49px, 0);
  }
}

@keyframes pencilEraserSkew {
  from,
  32.5%,
  67.5%,
  to {
    transform: skewX(0);
  }

  35%,
  65% {
    transform: skewX(-4deg);
  }

  37.5%,
  62.5% {
    transform: skewX(8deg);
  }

  40%,
  45%,
  50%,
  55%,
  60% {
    transform: skewX(-15deg);
  }

  42.5%,
  47.5%,
  52.5%,
  57.5% {
    transform: skewX(15deg);
  }
}

@keyframes pencilPoint {
  from,
  to {
    transform: rotate(-90deg) translate(49px, -30px);
  }

  50% {
    transform: rotate(-225deg) translate(49px, -30px);
  }
}

@keyframes pencilRotate {
  from {
    transform: translate(100px, 100px) rotate(0);
  }

  to {
    transform: translate(100px, 100px) rotate(720deg);
  }
}

@keyframes pencilStroke {
  from {
    stroke-dashoffset: 439.82;
    transform: translate(100px, 100px) rotate(-113deg);
  }

  50% {
    stroke-dashoffset: 164.93;
    transform: translate(100px, 100px) rotate(-113deg);
  }

  75%,
  to {
    stroke-dashoffset: 439.82;
    transform: translate(100px, 100px) rotate(112deg);
  }
}

/* -------------------------------发送评论加载区域end---------- */

@media (max-width: 1330px) {
  .user_input {
    width: 49%;
  }
}

@media (max-width: 800px) {
  .plktx {
    display: none;
  }

  .user_input {
    width: 100%;
  }

  .chahua {
    display: none;
  }
}
</style>
