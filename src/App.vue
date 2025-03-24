
<template>
  <!-- 过度动画 -->
  <section class="loader_ly" v-show="variable.lyjzdh.value">
    <div class="slider_ly" style="--i: 0"></div>
    <div class="slider_ly" style="--i: 1"></div>
    <div class="slider_ly" style="--i: 2"></div>
    <div class="slider_ly" style="--i: 3"></div>
  </section>

  <router-view />

  <div id="dscDiv">
    <video id="dscVideo">
      <source src="/dsc/dscnygsm.mp4" type="video/mp4" />
    </video>
  </div>
</template>

<script setup>
import variable from "./js/variable";
import "./js/click-colorful";
import { eventBus } from "./js/eventBus.js";

const axios = inject("axios");
const route = useRoute();


watch(
  () => route.name,
  (newV, oldV) => {
    if (newV != "Zhongxin") {
      //页面打开后至于最顶部
      window.scrollTo({
        top: 0,
      });
    }
  }
);

//禁用f12
if (window.location.hostname != "localhost") {
  document.addEventListener("DOMContentLoaded", function () {
    window.addEventListener("keydown", function (e) {
      if (e.key === "F12" || (e.ctrlKey && e.shiftKey && e.keyCode === 73)) {
        //禁用F12
        e.preventDefault();

        //弹出视频
        document.getElementById("dscDiv").style.display = "block";
        document.getElementById("dscVideo").play();
        setTimeout(() => {
          document.getElementById("dscDiv").style.display = "none";
        }, 2500);
      }
    });
  });
}

// 定义一个方法来阻止右键菜单
const preventContextMenu = (event) => event.preventDefault();
onMounted(() => {
  // 组件挂载时添加事件监听器
  document.addEventListener("contextmenu", preventContextMenu);
});
onUnmounted(() => {
  // 组件卸载前移除事件监听器
  document.removeEventListener("contextmenu", preventContextMenu);
});

//获取上传位置
const prefix = inject("prefix"); //地址前缀
function getImgUploadPrefix() {
    axios
        .get("allocation/findYxsj")
        .then((response) => {
            let res = response.data;
            if (res.code == 200) {
                variable.pz_all.value.pzsz = res.data;
                res.data.allocations.forEach((item) => {
                    if (item.name == "upload_url") {
                        variable.pz_all.value.upload_url = prefix + item.content;
                    }
                });
            }
        })
        .catch();
}
// 订阅事件，当事件触发时执行相应的函数
eventBus.on("getImgUploadPrefix", getImgUploadPrefix);


// -----------------------------------------登录用户信息------------------
onMounted(() => {
    getUserInfo(variable.aduBlogToken.value);
});

// 刷新token
function refreshToken() {
    axios
        .get("user/refreshToken?token=" + localStorage.getItem("refreshToken"))
        .then((response) => {
            let res = response.data;
            if (res.code == 200) {
                localStorage.setItem("aduBlogToken", res.data.accessToken);
                localStorage.setItem("refreshToken", res.data.refreshToken);
                variable.aduBlogToken.value = res.data.accessToken;
            }
        })
        .catch();
}

//获取用户信息
async function getUserInfo(token) {
    try {
        const response = await axios.get("user/getUserInfoByToken?token=" + token);
        let res = response.data;
        if (res.code == 200) {
            variable.userInfo.value = res.data;
        } else if (res.code == 10) {
            refreshToken();
        } else {
            localStorage.removeItem("aduBlogToken");
            variable.userInfo.value = null;
        }
    } catch (error) {
        console.error(error);
    }
}

// 创建一个用于监听 token 变化的函数
watch(variable.aduBlogToken, (newValue, oldValue) => {
    getUserInfo(newValue);
});
// -----------------------------------------登录用户信息end------------------

</script>

<style scoped>
#dscDiv {
  z-index: 999999;
  display: none;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  position: fixed;
  top: 0;
}

#dscVideo {
  width: 30vw;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>

