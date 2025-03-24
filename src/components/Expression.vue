<template>
  <div style="position: relative">
    <div id="bqan" @click="open($event)" @click.stop="handleClickInsideMenu">
      <Icon type="md-happy" :size="25" />
    </div>

    <div class="bq" style="display: none" @click.stop="handleClickInsideMenu">
      <Tabs @on-click="dqTab" v-model="TabPaneTYpe">
        <TabPane
          v-for="(item, index) in variable.ExpressionType.value"
          :key="index"
          :label="item"
          :name="item"
        >
          <ul v-infinite-scroll="load" :infinite-scroll-immediate="false">
            <li
              v-for="item in variable.ExpressionList.value"
              :key="item.id"
              @click="$emit('click-emoji', item)"
            >
              <span v-if="item.type == 'emoji'">{{ item.tip }}</span>
              <Image
                v-else
                :src="item.file"
                fit="contain"
                width="40px"
                height="40px"
                lazy
              >
                <template #placeholder>
                  <div class="imgLoading"></div>
                </template>
              </Image>
            </li>
          </ul>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>
<script setup>
const axios = inject("axios");
import variable from "../js/variable";
import { handleClickInsideMenu } from "../js/stopClosing";

//当前在哪个tab
const TabPaneTYpe = ref(null);

let pages = 0; //总页数
let current = 3; //下拉页数
function load() {
  if (current <= pages) {
    findExpressionAdd(TabPaneTYpe.value, current, 20);
    current++;
  }
}

//打开表情盒子
function open(e) {
  // 使用 'e.target' 来获取触发事件的元素
  var clickedElement = e.target;
  // 检查元素的标签名(很可能会被子元素触发，所以这里判断是哪个元素触发的)
  if (clickedElement.tagName === "I") {
    let bgState = clickedElement.parentNode.nextElementSibling.style.display;
    if (bgState == "none") {
      clickedElement.parentNode.nextElementSibling.style.display = "block";
      findExpressionType();
    } else {
      clickedElement.parentNode.nextElementSibling.style.display = "none";
    }
  } else if (clickedElement.tagName === "DIV") {
    let bgState = clickedElement.nextElementSibling.style.display;
    if (bgState == "none") {
      clickedElement.nextElementSibling.style.display = "block";
      findExpressionType();
    } else {
      clickedElement.nextElementSibling.style.display = "none";
    }
  }
}

function findExpressionType() {
  axios
    .get("expression/findExpressionType")
    .then((response) => {
      let res = response.data;
      if (res.code == 200) {
        variable.ExpressionType.value = res.data;
        TabPaneTYpe.value = res.data[0];
        if (TabPaneTYpe.value == null) {
          findExpression(res.data[0], 1);
        } else {
          findExpression(TabPaneTYpe.value, 1);
        }
      }
    })
    .catch();
}

//查询表情列表
function findExpression(type, pageNum) {
  axios
    .post("expression/findExpression", {
      type: type,
      pageNum: pageNum,
      pageSize: 20,
    })
    .then((response) => {
      let res = response.data;
      if (res.code == 200) {
        variable.ExpressionList.value = res.data.records;
        pages = res.data.pages;
      }
    })
    .catch();
}

//查询表情列表，添加新的
function findExpressionAdd(type, pageNum, pageSize) {
  axios
    .post("expression/findExpression", {
      type: type,
      pageNum: pageNum,
      pageSize: pageSize,
    })
    .then((response) => {
      let res = response.data;
      if (res.code == 200) {
        variable.ExpressionList.value = variable.ExpressionList.value.concat(
          res.data.records
        );
        pages = res.data.pages;
      }
    })
    .catch();
}

//表情导航点击时
function dqTab(name) {
  current = 3;
  TabPaneTYpe.value = name;
  findExpression(name, 1);
}

defineEmits(["click-emoji"]);
</script>
<style  scoped>
#bqan {
  cursor: pointer;
}

.bq {
  position: absolute;
  z-index: 1;
  background-color: #fff;
  padding: 10px;
  width: 400px;
  height: 320px;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

ul {
  height: 230px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  overflow: auto;
}

ul::-webkit-scrollbar {
  display: none;
}

li {
  padding: 10px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  list-style: none;
}

li:hover {
  background-color: #ebebeb;
}

#bqScrool {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
}

@media (max-width: 500px) {
  .bq {
    width: 300px;
  }
}
</style>