<template>
  <div class="main">
    <!-- 侧边 -->
    <div>
      <div class="logDiv">
        <img
          @click="goHome"
          v-show="!navState"
          :src="variable.pz_all.value.logo"
          style="max-width: 130px; padding: 10px 50px 10px 20px; height: 55px"
        />
        <el-icon
          :size="30"
          color="#409EFF"
          @click="updNavState"
          style="height: 100%; padding: 10px; cursor: pointer"
        >
          <el-icon v-show="!navState"><i-ep-Fold /></el-icon>
          <el-icon v-show="navState"><i-ep-Expand /></el-icon>
        </el-icon>
      </div>
      <el-menu
        style="height: 90vh; padding-top: 10px"
        :collapse="navState"
        :default-active="defaultActive"
        router
      >
        <div v-for="fMenu in menuLsit" :key="fMenu.name">
          <el-sub-menu :index="fMenu.path" v-if="fMenu.child.length > 0">
            <template #title>
              <i class="iconfont" :class="fMenu.ico"></i>
              <span v-show="!navState">{{ fMenu.name }}</span>
            </template>

            <el-menu-item
              v-if="fMenu.child"
              :index="zMenu.path"
              v-for="zMenu in fMenu.child"
              :key="zMenu.name"
            >
              <i class="iconfont" :class="zMenu.ico"></i>
              <span>{{ zMenu.name }}</span>
            </el-menu-item>
          </el-sub-menu>

          <el-menu-item :index="fMenu.path" v-else>
            <i class="iconfont" :class="fMenu.ico"></i>
            <span v-show="!navState">{{ fMenu.name }}</span>
          </el-menu-item>
        </div>
      </el-menu>
    </div>

    <!-- 顶部 -->
    <div id="userNav">
      <div class="userDiv">
        <el-dropdown>
          <div class="userInfo">
            <span class="userName">{{ userInfo.nickname }}</span>
            <el-avatar :size="40" :src="userInfo.avatar" />
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="exit">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <!-- 中心 -->
      <div class="zx">
        <router-view></router-view>
      </div>
    </div>
  </div>
  <Yejiao style="display: none" />
</template>

<script setup>
import variable from "../../js/variable";
import { Notice } from "view-ui-plus";
import { eventBus } from "../../js/eventBus.js";
const router = useRouter();
const route = useRoute();
const axios = inject("axios");

const uploadFileState = ref(false); //上传视频对话框状态
provide("uploadFileState", uploadFileState);

const pathData = ref([]); //拥有的路由路径
provide("pathData", pathData);

const menuLsit = ref(null); //导航菜单栏
const defaultActive = ref("Dashboard"); //菜单栏默认选中项
const userInfo = ref({
  //用户信息
  nickname: "",
  avatar: "",
  roleName: "",
});
// provide("userInfo", userInfo);

const navState = ref(false); //导航栏默认不展开

//修改侧边栏状态
const updNavState = () => {
  navState.value = !navState.value;
};

//退出
const exit = () => {
  localStorage.removeItem("aduBlogToken");
  //清除用户信息
  variable.userInfo.value = null;
  router.push("/");
};

onMounted(() => {
  pathSetNav();

  findButByMenu();

  //查询用户信息和菜单，用于导航栏
  axios
    .get("/user/userMenu")
    .then((response) => {
      let res = response.data;
      if (res.code == 200) {
        menuLsit.value = res.data.menu;
        userInfo.value.nickname = res.data.nickname;
        userInfo.value.avatar = res.data.avatar;
        userInfo.value.roleName = res.data.roleName;

        if (userInfo.value.roleName != "管理员") {
          Notice.warning({
            title: "无权限",
          });
          router.push("/");
        }
      }
    })
    .catch();
});

//判断当前路由，更改导航栏选中项
const pathSetNav = () => {
  defaultActive.value = route.path.split("/")[2];
};

//查询拥有的路由路径
function findButByMenu() {
  axios
    .get("/menu/findAllMenuPathByUserId")
    .then((response) => {
      let res = response.data;
      if (res.code == 200) {
        pathData.value = res.data;
      }
    })
    .catch();
}

//根据侧边栏状态动态计算表格宽度
const tableWidth = ref("calc(100vw - 250px)"); //表格宽度
provide("tableWidth", tableWidth);
watch(
  () => navState.value,
  (newV, oldV) => {
    if (newV) {
      tableWidth.value = "calc(100vw - 100px)";
    } else {
      tableWidth.value = "calc(100vw - 250px)";
    }
  }
);

//logo点击前往首页
function goHome() {
  let routeUrl = router.resolve({
    path: "/",
  });
  window.open(routeUrl.href, "_blank");
  variable.navDrawerState.value = false;
}
</script>
<style  scoped>
.main {
  display: flex;
}

.logDiv {
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #dcdfe6;
}

.iconfont {
  font-size: 20px;
  margin-right: 10px;
}

#userNav {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}
.userDiv {
  background-color: #fff;
  display: flex;
  flex-direction: row-reverse;
}
.userInfo {
  height: 60px;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
}
.userName {
  margin: 0 20px 0 5px;
}
.zx {
  background-color: #f5f5f5;
  padding: 20px;
}
</style>
