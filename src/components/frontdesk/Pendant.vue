<template>
  <div id="main">
    <button
      id="gjAn"
      @click="openAJ($event)"
      @click.stop="handleClickInsideMenu"
    >
      <div>
        <span>
          <p>头像</p>
        </span>
      </div>
      <div>
        <span>
          <p>挂件</p>
        </span>
      </div>
    </button>

    <Card
      style="display: none"
      id="pendantDiv"
      class="pendantDiv"
      @click.stop="handleClickInsideMenu"
    >
      <template #title>
        <Icon type="ios-color-wand" size="20" />
        挑选你的头像挂件
      </template>
      <template #extra>
        <a href="#" @click.prevent="variable.plData.pendant = null">
          取消挂件
        </a>
      </template>

      <ul>
        <li
          v-for="item in 20"
          :key="item"
          @click="variable.plData.pendant = item"
        >
          <Image :src="`/gj/${item}.png`" width="80px" height="80px" />
        </li>
      </ul>
    </Card>
  </div>
</template>
<script setup>
import variable from "../../js/variable";
import { handleClickInsideMenu } from "../../js/stopClosing";

function openAJ(e) {
  // 使用 'e.target' 来获取触发事件的元素
  var clickedElement = e.target;

  // 判断是哪个元素触发的
  if (clickedElement.tagName === "P") {
    var grandParent1 = clickedElement.parentNode;
    var grandParent2 = grandParent1 ? grandParent1.parentNode : null;
    var grandParent3 = grandParent2 ? grandParent2.parentNode : null;
    var grandParent4 = grandParent3 ? grandParent3.nextElementSibling : null;
    let bgState = grandParent4.style.display;
    if (bgState == "none") {
      grandParent4.style.display = "block";
    } else {
      grandParent4.style.display = "none";
    }
  } else if (clickedElement.tagName === "SPAN") {
    var grandParent1 = clickedElement.parentNode;
    var grandParent2 = grandParent1 ? grandParent1.parentNode : null;
    var grandParen3 = grandParent2 ? grandParent2.nextElementSibling : null;
    let bgState = grandParen3.style.display;
    if (bgState == "none") {
      grandParen3.style.display = "block";
    } else {
      grandParen3.style.display = "none";
    }
  }
}
</script>
<style  scoped>
#main {
  position: relative;
  margin-left: 10px;
}

#pendantDiv {
  margin-top: 10px;
  width: 420px;
  position: absolute;
  background-color: #fff;
  z-index: 9;
}
ul {
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  height: 230px;
}
li {
  list-style: none;
  cursor: pointer;
  padding: 5px;
  border: 3px solid #fff;
  transition: border 0.2s;
}
li:hover {
  border: 3px solid #2cd4d4;
}

ul::-webkit-scrollbar {
  display: none;
}

/* ------------------------按钮---------------------------- */
#gjAn {
  outline: 0;
  border: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 140px;
  height: 30px;
  border-radius: 0.5em;
  box-shadow: 0 0.625em 1em 0 rgba(30, 143, 255, 0.35);
  overflow: hidden;
  cursor: pointer;
}

#gjAn div {
  transform: translateY(0px);
  width: 100%;
}

#gjAn,
#gjAn div {
  transition: 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

#gjAn div span {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 30px;
  padding: 0.75em 1.125em;
}

#gjAn div:nth-child(1) {
  background-color: #1e90ff;
}

#gjAn div:nth-child(2) {
  background-color: #21dc62;
}

#gjAn:hover {
  box-shadow: 0 0.625em 1em 0 rgba(33, 220, 98, 0.35);
}

#gjAn:hover div {
  transform: translateY(-30px);
}

#gjAn p {
  font-size: 17px;
  font-weight: bold;
  color: #ffffff;
}

#gjAn:active {
  transform: scale(0.95);
}
/* ------------------------按钮end---------------------------- */

@media (max-width: 800px) {
  #main {
    display: none;
  }
}
</style>