<template>
  <div id="main">
    <Timeline line id="timeline">
      <TimelineItem lineItem v-for="(item, index) in recencyData" :key="index">
        <template #dot>
          <Icon v-if="item.type == 1" type="ios-link" />
          <Icon
            v-if="item.type == 2 || item.type == 5 || item.type == 7"
            type="md-book"
          />
          <Icon v-if="item.type == 3" type="logo-twitch" />
          <Icon v-if="item.type == 4" type="ios-chatboxes" />
          <Icon v-if="item.type == 6" type="md-thumbs-up" />
          <Icon v-if="item.type == 8" type="ios-quote" />
          <Icon v-if="item.type == 9" type="ios-paper-plane" />
          <Icon v-if="item.type == 10" type="md-planet" size="17" />
        </template>
        <div v-if="item.type == 1">
          <Time class="time" :time="item.time" :interval="1" />
          <div>
            <Avatar
              :src="item.avatarUrl"
              size="small"
              style="margin-right: 5px"
            />
            <span class="fontW7">{{ item.name }}</span>
            <span class="fontS12" v-if="item.bhfName != null">
              在友联回复：
              <span class="fontW7">
                <Avatar
                  :src="item.bhfAvatar"
                  size="small"
                  style="margin: 0 5px"
                />
                {{ item.bhfName }}</span
              >
            </span>
            <span class="fontS12" v-else> 在友联说： </span>
            <br /><br />
            <MdPreview
              class="recencyMd comment"
              previewTheme="cyanosis"
              @click="router.push({ name: 'Links' })"
              :modelValue="item.matter"
            />
          </div>
        </div>
        <div v-else-if="item.type == 2">
          <Time class="time" :time="item.time" :interval="1" />
          <div>
            <Avatar
              :src="item.avatarUrl"
              size="small"
              style="margin-right: 5px"
            />
            <span class="fontW7">{{ item.name }}</span>

            <span class="fontS12"> 在文章</span>
            <span class="fontW7" @click="openArticle(item.articleId)">
              《{{ item.sourceName }}》</span
            >

            <span class="fontS12" v-if="item.bhfName != null">
              中回复

              <span class="fontW7"
                ><Avatar
                  :src="item.bhfAvatar"
                  size="small"
                  style="margin: 0 5px"
                />{{ item.bhfName }}</span
              >
            </span>
            <span class="fontS12" v-else> 说： </span>

            <br /><br />
            <MdPreview
              class="recencyMd comment"
              previewTheme="cyanosis"
              @click="openArticle(item.articleId)"
              :modelValue="item.matter"
            />
          </div>
        </div>
        <div v-else-if="item.type == 3">
          <Time class="time" :time="item.time" :interval="1" />
          <div>
            <Avatar
              :src="item.avatarUrl"
              size="small"
              style="margin-right: 5px"
            />
            <span class="fontW7">{{ item.name }}</span>
            <span class="fontS12" v-if="item.bhfName != null">
              在留言中回复
              <span class="fontW7"
                ><Avatar
                  :src="item.bhfAvatar"
                  size="small"
                  style="margin: 0 5px"
                />{{ item.bhfName }}</span
              >
            </span>
            <span class="fontS12" v-else> 留言： </span>

            <br /><br />
            <MdPreview
              class="recencyMd comment"
              previewTheme="cyanosis"
              @click="router.push({ name: 'About' })"
              :modelValue="item.matter"
            />
          </div>
        </div>
        <div v-else-if="item.type == 4">
          <Time class="time" :time="item.time" :interval="1" />
          <div>
            <Avatar
              :src="item.avatarUrl"
              size="small"
              style="margin-right: 5px"
            />
            <span class="fontW7">{{ item.name }}</span>
            <span class="fontS12" v-if="item.bhfName != null">
              在闲言碎语中回复
              <span class="fontW7"
                ><Avatar
                  :src="item.bhfAvatar"
                  size="small"
                  style="margin: 0 5px"
                />{{ item.bhfName }}</span
              >
            </span>
            <span class="fontS12" v-else> 在{{ item.sourceName }}说： </span>
            <br /><br />
            <MdPreview
              class="recencyMd comment"
              previewTheme="cyanosis"
              @click="router.push({ name: 'Moments' })"
              :modelValue="item.matter"
            />
          </div>
        </div>
        <div v-else-if="item.type == 5">
          <Time class="time" :time="item.time" :interval="1" />
          <div>
            有人阅读了
            <span class="fontW7" @click="openArticle(item.articleId)">
              《{{ item.sourceName }}》</span
            >
          </div>
        </div>
        <div v-else-if="item.type == 6">
          <Time class="time" :time="item.time" :interval="1" />
          <p>有人赞了{{ item.sourceName }}</p>
        </div>
        <div v-else-if="item.type == 7">
          <span class="time">{{ item.matter }}</span>

          <span class="fontS12"> 博主发布了文章</span>
          <span class="fontW7" @click="openArticle(item.articleId)">
            《{{ item.sourceName }}》</span
          >
        </div>
        <div v-else-if="item.type == 8">
          <Time class="time" :time="item.time" :interval="1" />
          <p>博主唠叨：</p>
          <MdPreview
            class="recencyMd comment"
            previewTheme="cyanosis"
            @click="router.push({ name: 'Moments' })"
            :modelValue="item.sourceName"
          />
        </div>
        <div v-else-if="item.type == 9">
          <Time class="time" :time="item.time" :interval="1" />
          <div>
            有朋友来访，Ta来自：
            <span style="font-size: 14px; font-weight: 700">{{
              item.sourceName
            }}</span>
          </div>
        </div>
        <div v-else-if="item.type == 10">
            <Time class="time" :time="item.time" :interval="1" />
            <div>
                <Avatar
                        :src="item.avatarUrl"
                        size="small"
                        style="margin-right: 5px"
                />
                <span class="fontW7">{{ item.name }}</span>
                <span>{{ item.matter }}</span>
            </div>
        </div>
      </TimelineItem>
    </Timeline>
  </div>
</template>
<script setup>
import { MdPreview } from "md-editor-v3";
const axios = inject("axios");
const router = useRouter();

const recencyData = ref(null);

onMounted(() => {
  (async () => {
    try {
      const response = await axios.get("other/recency");
      let res = response.data;
      if (res.code == 200) {
        recencyData.value = res.data;
      }
    } catch (error) {
      // 请求失败，捕获并处理错误
      console.error("Error:", error);
    }
  })();
});

//跳转文章页
const openArticle = (id) => {
  router.push({ name: "Article", params: { id: id } });
};
</script>
<style  scoped>
#main {
  position: relative;
  padding: 10px;
  height: 450px;
}

#main::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px; /* 根据需要调整高度 */
  background: linear-gradient(
    to top,
    rgba(255, 255, 255, 1),
    rgba(255, 255, 255, 0)
  );
  pointer-events: none; /* 防止伪元素影响点击事件 */
}

#timeline {
  height: 100%;
  padding: 0.2rem;
  overflow: auto;
}

.time {
  color: #949494;
  font-size: 12px;
}

.fontS12 {
  font-size: 12px;
}

.fontW7 {
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
  color: rgb(64, 112, 218);
}

.fontW7:hover {
  color: rgb(116, 144, 206);
}

.comment {
  background-color: #f1f1f1;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  border: 1px solid #fff;
  transition: 0.1s;
}

.comment:hover {
  border: 1px solid blue;
}

/* 定义滚动条的基本样式，但初始时不显示 */
#timeline::-webkit-scrollbar {
  width: 0.2rem;
  opacity: 0;
}

/* 当鼠标悬停在元素上时，滚动条出现 */
#timeline:hover::-webkit-scrollbar {
  opacity: 1;
}

#timeline:hover::-webkit-scrollbar-track {
  border-radius: 10px;
}
#timeline:hover::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px #bbbbbb;
  background-color: blue;
}
</style>
