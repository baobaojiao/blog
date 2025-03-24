<template>
  <!-- 私密文章访问抽屉 -->
  <Drawer
    :mask-closable="false"
    v-model="variable.wzDrawerStzte.value"
    :width="100"
    @on-close="clearChouti"
    :lock-scroll="true"
    :styles="{
      backgroundColor: '#000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }"
  >
    <div style="position: relative">
      <svg class="icon ctIco1" aria-hidden="true">
        <use xlink:href="#icon-wenzhangguanli3x"></use>
      </svg>
      <svg class="icon ctIco2" aria-hidden="true">
        <use xlink:href="#icon-simidanganzhang"></use>
      </svg>
    </div>
    <Input
      v-model="variable.chouTiArticle.value.pwd"
      size="large"
      placeholder="输入访问密码"
      style="width: 270px; margin-top: 20px"
      @on-enter="tijiao"
    >
      <template #suffix>
        <Button
          @click="tijiao"
          type="success"
          icon="md-arrow-round-forward color_white"
          style="height: 100%; width: 60px"
        ></Button>
      </template>
    </Input>
  </Drawer>
</template>
<script setup>
const axios = inject("axios");
import variable from "../../js/variable";
import { Notice } from "view-ui-plus";

const router = useRouter();

//清空抽屉内数据
function clearChouti() {
  variable.wzDrawerStzte.value = false;
  variable.chouTiArticle.value.pwd = "";
  variable.chouTiArticle.value.id = 0;
  // router.push("/");
}

//提交按钮
function tijiao() {
  axios
    .post("allocation/APC", {
      id: variable.chouTiArticle.value.id,
      pwd: variable.chouTiArticle.value.pwd,
    })
    .then((response) => {
      let res = response.data;
      if (res.msg == "成功") {
        if (res.data) {
          variable.wzDrawerStzte.value = false;
          router.push({
            name: "Article",
            params: { id: variable.chouTiArticle.value.id },
          });
        } else {
          Notice.warning({
            title: "密码错误",
            desc: response.msg,
          });
        }
      } else {
        Notice.warning({
          title: res.msg,
          desc: response.msg,
        });
      }
    })
    .catch();
}
</script>
<style scoped>
/* 抽屉 */
.ctIco {
  width: 120px;
  height: 120px;
}

.ctIco1 {
  width: 120px;
  height: 120px;
}

.ctIco2 {
  width: 250px;
  height: 250px;
  position: absolute;
  right: -60px;
  bottom: -60px;
}
</style>
