<template>
  <footer :style="{ background: yjBgc }" v-if="state">
    <div>
      <div class="badge" @click="goLink(variable.pz_all.value.author_blog)">
        <div>开发作者</div>
        <div style="background-color: #50cd89">baobaojiao</div>
      </div>

      <div class="badge">
        <div>Copyright © 2025</div>
        <div style="background-color: #00a3ff">
          {{ variable.pz_all.value.blog_name }}
        </div>
      </div>

      <div
        class="badge ba"
        @click="goLink('https://beian.miit.gov.cn/#/Integrated/index')"
      >
        <div>{{ variable.pz_all.value.icp1 }}</div>
        <div style="background-color: #9a65d2">
          {{ variable.pz_all.value.icp2 }}
        </div>
      </div>
    </div>
  </footer>
</template>
<script setup>
const axios = inject("axios");
import variable from "../../js/variable";
const route = useRoute();

const state = ref(true);

const yjBgc = ref("#F7F9FE");

onMounted(() => {
  //查询配置、设置
  axios
    .get("allocation/findYxsj")
    .then((response) => {
      let res = response.data;
      if (res.code == 200) {
        variable.pz_all.value.pzsz = res.data;

        res.data.allocations.forEach((item) => {
          if (item.name == "icp") {
            if (item.content.match(/([^\d]+)(\d+)/)) {
              //处理备案信息
              variable.pz_all.value.icp1 =
                item.content.match(/([^\d]+)(\d+)/)[1]; // 包含文字的部分
              variable.pz_all.value.icp2 =
                item.content.match(/([^\d]+)(\d+)/)[2]; // 包含数字的部分
            }
          }

          //设置网站的favicon图标
          if (item.name == "bloglog") {
            variable.pz_all.value.logo = item.content;

            const faviconLink = document.createElement("link");
            faviconLink.rel = "icon";
            faviconLink.type = "image/png";
            faviconLink.href = item.content;
            document.head.appendChild(faviconLink);
          }

          if (item.name == "bz_tx") {
            variable.pz_all.value.bz_tx = item.content;
          }

          if (item.name == "bz_name") {
            variable.pz_all.value.bz_name = item.content;
          }

          if (item.name == "blog_name") {
            variable.pz_all.value.blog_name = item.content;
          }

          if (item.name == "author_blog") {
            variable.pz_all.value.author_blog = item.content;
          }

          if (item.name == "upload_type") {
            variable.upload_type.value = item.content;
          }
        });
      }
    })
    .catch();
});

//前往
function goLink(url) {
  window.open(url, "_blank");
}

watch(
  () => route.name,
  (newV, oldV) => {
    if (newV == "Zhongxin") {
      yjBgc.value =
        "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #fff 60%)";
    } else if (newV == "TreeHole") {
      //有些页面不显示
      state.value = false;
    } else {
      yjBgc.value = "#F7F9FE";
    }
  }
);

onMounted(() => {
  //防止页面刷新，颜色被改变
  if (route.name == "Zhongxin") {
    yjBgc.value =
      "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #fff 60%)";
  } else if (route.name == "TreeHole") {
    //有些页面不显示
    state.value = false;
  } else {
    yjBgc.value = "#F7F9FE";
  }
});
</script>
<style scoped>
footer {
  min-height: 200px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  user-select: none;
}

footer > div {
  height: 100%;
  display: flex;
  justify-content: center;
  justify-content: space-around;
}

.badge {
  border-radius: 8px;
  margin: 0 10px 20px 0;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
}

.badge div {
  padding: 3px 10px;
  font-size: 12px;
  color: #fff;
}

.badge div:nth-child(1) {
  background-color: #5d5d5d;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}

.badge div:nth-child(2) {
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

.badge div:nth-child(2) {
  background-color: #fff;
}

.badge:hover div:nth-child(2) {
  color: #555555;
}

@media (max-width: 800px) {
  footer {
    display: none;
  }
}
</style>
