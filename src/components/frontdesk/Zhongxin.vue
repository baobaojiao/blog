<template>
  <div class="info" :style="`height: ${mainHeight}px;`">
    <h1>{{ variable.pz_all.value.blog_name }}</h1>
    <div style="display: flex">
      <div id="typed"></div>
    </div>

    <div id="xlyd" @click="xlyd">
      <div class="scrolldown" style="--color: #fff">
        <div class="chevrons">
          <div class="chevrondown"></div>
          <div class="chevrondown"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- 主体 -->
  <Zhuti />
</template>
<script setup>
import Zhuti from "./Zhuti.vue";
import Typed from "typed.js";
import variable from "../../js/variable";

//------------------获取窗口高度，设置第一页的高度START--------------------
const mainHeight = ref(0); //首页第一页高度

onMounted(() => {
  mainHeight.value = window.innerHeight - 70;
});
//------------------获取窗口高度，设置第一页的高度END--------------------

//下拉引导
const xlyd = () => {
  window.scrollTo({
    top: window.innerHeight - 80,
    behavior: "smooth",
  });
};

// 打字特效
const initTyped = () => {
  new Typed("#typed", {
    strings: ["欢迎来到", "baobaojiao的博客"], //数组：可以放多个打印内容
    typeSpeed: 150, //打印速度，单位是毫秒。
    backSpeed: 40, //回退速度，单位是毫秒。
    loop: true, //是否循环播放。
  });
};

onMounted(initTyped);
</script>
<style scoped>
.info {
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #fff;
  font-size: 20px;
  margin-top: 70px;
  position: relative;
}

.info span {
  font-size: 23px;
}

/* ----------下拉引导------------- */
#xlyd {
  position: absolute;
  bottom: 10px;
}
.scrolldown {
  --color: white;
  --sizeX: 30px;
  --sizeY: 50px;
  position: relative;
  width: var(--sizeX);
  height: var(--sizeY);
  margin-left: var(sizeX / 2);
  border: calc(var(--sizeX) / 10) solid rgba(255, 255, 255, 1);
  border-radius: 50px;
  box-sizing: border-box;
  margin-bottom: 16px;
  cursor: pointer;
}

.scrolldown::before {
  content: "";
  position: absolute;
  bottom: 30px;
  left: 50%;
  width: 6px;
  height: 6px;
  margin-left: -3px;
  background-color: var(--color);
  border-radius: 100%;
  animation: scrolldown-anim 2s infinite;
  box-sizing: border-box;
  box-shadow: 0px -5px 3px 1px #2a547066;
}

@keyframes scrolldown-anim {
  0% {
    opacity: 0;
    height: 6px;
  }

  40% {
    opacity: 1;
    height: 10px;
  }

  80% {
    transform: translate(0, 20px);
    height: 10px;
    opacity: 0;
  }

  100% {
    height: 3px;
    opacity: 0;
  }
}

.chevrons {
  padding: 6px 0 0 0;
  margin-left: -3px;
  margin-top: 48px;
  width: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chevrondown {
  margin-top: -6px;
  position: relative;
  border: solid var(--color);
  border-width: 0 3px 3px 0;
  display: inline-block;
  width: 10px;
  height: 10px;
  transform: rotate(45deg);
}

.chevrondown:nth-child(odd) {
  animation: pulse54012 500ms ease infinite alternate;
}

.chevrondown:nth-child(even) {
  animation: pulse54012 500ms ease infinite alternate 250ms;
}

@keyframes pulse54012 {
  from {
    opacity: 0;
  }

  to {
    opacity: 0.5;
  }
}
/* ----------下拉引导end------------- */
</style>