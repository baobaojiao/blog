<template>
  <div id="main">
    <div id="messageMain">
      <p class="title">留言贴纸</p>
      <div id="lyqy" ref="lyqy">
        <MessageItem v-for="item in messageData" :key="item.id">
          <template v-slot:avatar>
            <Avatar icon="ios-person" size="small" :src="item.avatarUrl" />
          </template>
          <template v-slot:name> {{ item.nickname }} </template>
          <template v-slot:content>
              <MdPreview
                      class="messageMdPreview commentListYL"
                      :modelValue="item.content"
              />
          </template>
          <template v-slot:time>
            <Time :time="item.creationTime" :interval="1" />
          </template>
        </MessageItem>
      </div>

      <hr />

      <CommentAll> 留言 </CommentAll>
    </div>
  </div>
</template>

<script setup>
import { MdPreview } from "md-editor-v3";
import MessageItem from "../message/MessageItem.vue";
import CommentAll from "../comment/CommentAll.vue";
const axios = inject("axios");

// 创建一个响应式引用，用于存储可拖拽区域的元素
const lyqy = ref(null);
provide("lyqy", lyqy);

//用于记录当前贴纸最高层级
const zIndex = ref(0);
provide("zIndex", zIndex);

const messageData = ref(null);
onMounted(() => {
  (async () => {
    try {
      const response = await axios.get("comment/getMessage?num=20");
      let res = response.data;
      if (res.msg == "成功") {
        messageData.value = res.data;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  })();
});
</script>
<style  scoped>
#main {
  user-select: none;
  width: 100%;
  margin-top: 70px;
  background-color: #f7f9fe;
  display: flex;
  justify-content: center;
}

#messageMain {
  border-radius: 10px;
  margin: 50px 0 0 0;
  width: 80%;
  background-color: #fff;
  box-shadow: 0 0px 10px -5px #949494;
}

.title {
  color: #333;
  font-size: 24px;
  margin-bottom: 15px;
  padding-top: 40px;
  text-align: center;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
}

#lyqy {
  width: 95%;
  margin: 0 auto;
  height: 600px;
  position: relative;
}

hr {
  position: relative;
  margin: 20px auto 10px;
  border: 2px dashed #b7a0e0;
}

@media (max-width: 1000px) {
  #messageMain {
    width: 100%;
  }
}
</style>
