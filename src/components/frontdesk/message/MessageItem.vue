<template>
  <div
    :style="{ background: getRandomColor() }"
    class="docket"
    ref="draggable"
    @mousedown="dragStart"
  >
    <div class="tou">
      <div class="tou_div">
        <slot name="avatar"></slot>
        <span class="maLf5">
          <slot name="name"></slot>
        </span>
      </div>
      <slot name="time"></slot>
    </div>
    <div class="nr">
      <slot name="content"></slot>
    </div>
  </div>
</template>
<script setup>
// 接收用于存储可拖拽区域的元素
const lyqy = inject("lyqy");
// 创建一个响应式引用，用于存储可拖拽元素的引用
const draggable = ref();
// 创建一个响应式引用，用于标记是否处于激活（拖拽中）状态
const active = ref(false);
// 创建响应式引用，用于存储当前鼠标位置相对于初始位置的偏移量
const currentX = ref(0);
const currentY = ref(0);
// 创建响应式引用，用于存储鼠标按下时的位置
const initialX = ref(0);
const initialY = ref(0);
// 创建响应式引用，用于存储元素的初始偏移量
const xOffset = ref(0);
const yOffset = ref(0);
//获取当前贴纸最高层级z-index
const zIndex = inject("zIndex");

// 定义拖拽开始的事件处理函数（鼠标按下）
const dragStart = (e) => {
  // 计算初始位置的偏移量
  initialX.value = e.clientX - xOffset.value;
  initialY.value = e.clientY - yOffset.value;

  // 如果有可拖拽的元素，激活拖拽状态，并添加鼠标事件监听
  if (draggable.value) {
    active.value = true;
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", dragEnd);
  }

  // 将该元素设为最高层
  zIndex.value = zIndex.value + 1;
  draggable.value.style.zIndex = zIndex.value + 1;
};

// 定义拖拽结束的事件处理函数（鼠标松开）
const dragEnd = () => {
  // 更新初始位置为当前位置
  initialX.value = currentX.value;
  initialY.value = currentY.value;
  // 取消激活状态
  active.value = false;
  // 移除鼠标事件监听
  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", dragEnd);
};

// 定义拖拽过程中的事件处理函数
const drag = (e) => {
  // 如果处于激活状态
  if (active.value) {
    // 阻止默认事件
    e.preventDefault();
    // 计算元素可以移动的最大范围
    let maxX = lyqy.value.offsetWidth - draggable.value.offsetWidth;
      let maxY = lyqy.value.offsetHeight - draggable.value.offsetHeight;

    // 更新当前位置，确保不会超出最大范围
    currentX.value = Math.min(Math.max(0, e.clientX - initialX.value), maxX);
    currentY.value = Math.min(Math.max(0, e.clientY - initialY.value), maxY);

    // 更新偏移量
    xOffset.value = currentX.value;
    yOffset.value = currentY.value;
    // 调用函数设置元素的位移
    setTranslate();
  }
};

// 定义设置元素位移的函数
const setTranslate = () => {
  // 如果有可拖拽的元素
  if (draggable.value) {
    // 设置元素的位移
    draggable.value.style.transform = `translate3d(${currentX.value}px, ${currentY.value}px, 0)`;
  }
};

// 定义生成随机数的函数（位置）
const getRandomArbitrary = (min, max) => {
  return Math.random() * (max - min) + min;
};

onMounted(() => {
  // 计算父元素内元素可以移动的最大范围
    let maxX = lyqy.value.offsetWidth - draggable.value.offsetWidth;
    let maxY = lyqy.value.offsetHeight - draggable.value.offsetHeight;
  // 确保 maxX 和 maxY 是正数
  if (maxX < 0) maxX = 0;
  if (maxY < 0) maxY = 0;
  // 设置初始偏移量为随机值
  xOffset.value = getRandomArbitrary(0, maxX);
  yOffset.value = getRandomArbitrary(0, maxY);
  // 更新元素的位移,使得初始位置随机
  draggable.value.style.transform = `translate3d(${xOffset.value}px, ${yOffset.value}px, 0)`;
});

// 在组件卸载后执行的函数
onUnmounted(() => {
  // 移除鼠标事件监听
  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", dragEnd);
});

// 定义生成随机颜色的函数
function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
</script>
<style  scoped>
.docket {
  border-radius: 400px 30px 30px 40px / 40px 500px 400px 300px;
  box-shadow: 0 2px 10px 1px rgba(0, 0, 0, 0.2);
  opacity: 0.88;
  overflow: hidden;
  user-select: none;
  width: 200px;
  height: 200px;
  cursor: move;
  user-select: none;
  position: absolute;
}

.tou {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  padding: 5px 5px 10px 0;
}

.tou_div {
  padding: 5px 0 0 5px;
  display: flex;
  align-items: end;
}

.maLf5 {
  margin-left: 5px;
}
.nr {
  border-top: 1px dashed hsla(0, 0%, 100%, 0.85);
  color: #fff;
  padding: 10px;
  height: 150px;
  overflow: auto;
}

/* 定义滚动条的基本样式 */
.nr::-webkit-scrollbar {
  width: 0.3rem;
}

.nr::-webkit-scrollbar-track {
  border-radius: 10px;
}
.nr::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px #bbbbbb;
  background-color: blue;
}

.iconfont {
  float: right;
  margin-right: 5px;
  width: 25px;
  height: 25px;
}
</style>
