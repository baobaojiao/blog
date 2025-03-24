<template>
  <!-- 返回置顶猫 -->
  <div id="ztzj" :style="'top:' + ztTop + '%'" @click="backToTop"></div>
</template>

<script setup>
// 说明：如果更换图片，那么需要修改#ztzj中的height（根据图片高度来），以及ztTop，不同图片隐藏高度不同

const route = useRoute();

//返回页面顶部
function backToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth", // 平滑滚动
  });

  //添加动画
  document.getElementById("ztzj").classList.add("zoomOutUp");
  setTimeout(() => {
    //移出动画
    document.getElementById("ztzj").classList.remove("zoomOutUp");
  }, 1000);
}

//置顶元素位置
const ztTop = ref(-15);
// 创建一个响应式引用来存储页面滚动的百分比
const scrollPercentage = ref(0);
// 定义一个方法来处理滚动事件
function handleScroll() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const percentage = (scrollTop / scrollHeight) * 100;
  scrollPercentage.value = Math.round(percentage); // 四舍五入到最接近的整数
  ztTop.value = -15;
  ztTop.value = ztTop.value + scrollPercentage.value;
  // if (scrollPercentage.value > 80) {
  //   ztTop.value = -20;
  // }
}

onMounted(() => {
  // 页面挂载后添加滚动事件监听器
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  // 页面卸载前移除滚动事件监听器
  window.removeEventListener("scroll", handleScroll);
});

watch(
  () => route.name,
  (newV, oldV) => {
    setTimeout(() => {
      ztTop.value = -15;
    }, 100);
  }
);
</script>

<style scoped>
#ztzj {
  width: 100px;
  height: 133px;
  position: fixed;
  right: 0;
  top: 0;
  background: url(/other/hx.png) no-repeat;
  cursor: pointer;
}

@media (max-width: 1000px) {
  #ztzj {
    display: none;
  }
}

/* --------点击消失动画--------------- */
.zoomOutUp {
  animation-name: zoomOutUp;
  transform-origin: center bottom;
  animation-duration: 1s;
  animation-fill-mode: both;
}

@keyframes zoomOutUp {
  40% {
    opacity: 1;
    transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }

  to {
    opacity: 0;
    transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -2000px, 0);
    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
  }
}
/* --------点击消失动画end--------------- */

/* --------蹦跶动画---------- */

@keyframes bounce {
  from,
  20%,
  53%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    transform: translate3d(0, 0, 0);
  }

  40%,
  43% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translate3d(0, -30px, 0) scaleY(1.1);
  }

  70% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translate3d(0, -15px, 0) scaleY(1.05);
  }

  80% {
    transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    transform: translate3d(0, 0, 0) scaleY(0.95);
  }

  90% {
    transform: translate3d(0, -4px, 0) scaleY(1.02);
  }
}
#ztzj:hover {
  animation-duration: 1s;
  animation-fill-mode: both;
  animation-name: bounce;
  transform-origin: center bottom;
}
/* --------蹦跶动画end---------- */
</style>