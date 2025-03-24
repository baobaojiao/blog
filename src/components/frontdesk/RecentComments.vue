<template>
  <!-- 最新评论 -->
  <ul>
    <li v-for="item in commentData" :key="item.id" @click="goUrl(item)">
      <Avatar
        shape="square"
        :src="item.avatarUrl"
        size="large"
        style="margin-right: 10px"
      />
      <div style="width: 85%">
        <p>{{ item.nickname }}</p>
        <span v-html="item.content"></span>
      </div>
    </li>
  </ul>
</template>
<script setup>
const axios = inject("axios");
const router = useRouter();

//接收组件传过来的条数
const props = defineProps({
  pageSize: {
    type: Number,
    default: 10, // 默认条数
  },
});

const commentData = ref(null);
onMounted(() => {
  (async () => {
    try {
      const response = await axios.post("comment/findRecentComment", {
        pageSize: props.pageSize,
      });
      let res = response.data;
      if (res.msg == "成功") {
        commentData.value = res.data;
      }
    } catch (error) {
      // 请求失败，捕获并处理错误
      console.error("Error:", error);
    }
  })();
});

//点击评论头像跳转至对应页面
const goUrl = (comment) => {
  if (comment.classify == 1) {
    router.push({ name: "Article", params: { id: comment.targetId } });
  } else if (comment.classify == 2) {
    router.push({ name: "About" });
  } else if (comment.classify == 3) {
    router.push({ name: "Moments" });
  } else if (comment.classify == 4) {
    router.push({ name: "Links" });
  }
};
</script>
<style  scoped>
ul {
  padding-left: 20px;
}
li {
  display: flex;
  margin-bottom: 20px;
  cursor: pointer;
}
p {
  font-weight: 600;
}
span {
  font-size: 13px;
}
</style>