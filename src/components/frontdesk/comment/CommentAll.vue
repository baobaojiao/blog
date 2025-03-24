<template>
  <div class="comment">
    <p id="comment_title">
      <Icon type="ios-chatbubbles" />
      <slot></slot>
    </p>
    <div style="position: relative">
      <Comment />
      <Spin fix :show="variable.yjplkZz.value">回复评论中...</Spin>
    </div>
    <CommentList />
  </div>
</template>
<script setup>
import variable from "../../../js/variable";
import Comment from "./Comment.vue";
import CommentList from "./CommentList.vue";
</script>
<style  scoped>
.comment {
  background-color: #fff;
  padding: 40px 20px 20px 20px;
}

#comment_title {
  font-size: 20px;
  padding-bottom: 10px;
  margin-bottom: 30px;
  border-bottom: 1px solid rgb(231, 231, 231);
  position: relative;

  display: flex;
  align-items: center;
}

#comment_title::after {
  background-color: #9999ff;
  content: "";
  left: 0;
  width: 60px;
  height: 2px;
  bottom: -2px;
  position: absolute;
  -webkit-transition: 0.5s;
  -moz-transition: 0.5s;
  -ms-transition: 0.5s;
  -o-transition: 0.5s;
  transition: 0.5s;
}

.comment:hover #comment_title::after {
  width: 150px;
}
</style>