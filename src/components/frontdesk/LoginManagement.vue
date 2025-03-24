<template>
  <!-- 登录后 功能管理 -->
  <Dropdown @on-click="userClick">
    <Avatar :src="variable.userInfo.value.avatar" size="large" shape="square" />
    <template #list>
      <DropdownMenu>
        <DropdownItem
          name="admin"
          v-if="
            variable.userInfo.value &&
            variable.userInfo.value.roleName == '管理员'
          "
          >后台
        </DropdownItem>
        <DropdownItem name="individual">个人中心</DropdownItem>
        <DropdownItem name="exit">退出</DropdownItem>
      </DropdownMenu>
    </template>
  </Dropdown>

  <!-- 修改个人信息 -->
  <Modal v-model="grzxState" :mask-closable="false" @on-ok="onOk">
    <template #close>
      <Icon type="md-close-circle" :size="25" />
    </template>

    <Space
      direction="vertical"
      size="large"
      style="margin: 20px 0; padding-left: 40px"
    >
      <Space>
        头像：
        <div class="avatarUploader">
          <el-upload
            :action="variable.pz_all.value.upload_url + '/uploadImg'"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img
              style="width: 100px; height: 100px"
              v-if="userData.avatar"
              :src="userData.avatar"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><i-ep-Plus /></el-icon>
          </el-upload>
        </div>
      </Space>
      <Space>
        昵称：
        <Input
          placeholder="请输入昵称"
          style="width: 300px"
          v-model="userData.nickname"
        />
      </Space>
      <Space>
        账号：
        <Input
          placeholder="请输入账号"
          style="width: 300px"
          v-model="userData.account"
        />
      </Space>
      <Space>
        密码：
        <Input
          password
          type="password"
          placeholder="请输入密码"
          style="width: 300px"
          v-model="userData.password"
        />
      </Space>
      <Space>
        邮箱：
        <Input
          placeholder="请输入密码"
          style="width: 300px"
          v-model="userData.email"
        />
      </Space>
      <Space>
        手机号：
        <Input
          placeholder="请输入手机号"
          style="width: 300px"
          v-model="userData.phone"
        />
      </Space>
    </Space>
  </Modal>
</template>
<script setup>
import variable from "../../js/variable";
import { eventBus } from "../../js/eventBus.js";

const router = useRouter();
const axios = inject("axios");

function userClick(name) {
  if (name == "exit") {
    variable.userInfo.value = null;

    localStorage.removeItem("aduBlogToken");
    variable.aduBlogToken.value = null;

    ElNotification({
      message: "退出成功！",
      type: "success",
      offset: 100,
    });
  } else if (name == "admin") {
    //跳转后台
    let routeUrl = router.resolve({
      name: "Admin",
    });
    window.open(routeUrl.href, "_blank");
  } else if (name == "individual") {
    if (!variable.pz_all.value.upload_url) {
      //调用查询图片上传前缀，确保地址没问题
      eventBus.emit("getImgUploadPrefix");
    }

    //打开个人中心
    axios
      .get("/user/getUserInfo")
      .then((response) => {
        let res = response.data;
        if (res.code == 200) {
          userData.value.id = res.data.id;
          userData.value.account = res.data.account;
          userData.value.nickname = res.data.nickname;
          userData.value.avatar = res.data.avatar;
          userData.value.email = res.data.email;
          userData.value.phone = res.data.phone;
          userData.value.password = res.data.password;
          grzxState.value = true;
        } else {
          ElMessage({
            message: res.msg,
            type: "warning",
          });
        }
      })
      .catch();
  }
}

// -----------------修改个人信息---------------
const grzxState = ref(false); //个人信息对话框
const userData = ref({
  //对话框中的数据
  id: null,
  account: null,
  nickname: null,
  avatar: null,
  email: null,
  phone: null,
  password: null,
});

//头像上传成功函数
const handleAvatarSuccess = (response, uploadFile) => {
  if (response.code == 200) {
    userData.value.avatar = response.data;
  } else {
    ElMessage({
      message: res.msg,
      type: "warning",
    });
  }
};

//修改信息
function onOk() {
  axios
    .post("/user/updUser", userData.value)
    .then((response) => {
      let res = response.data;
      if (res.code == 200) {
        ElMessage({
          message: "修改成功",
          type: "success",
        });
        //刷新token
        refreshToken(variable.aduBlogToken.value);
      } else {
        ElMessage({
          message: res.msg,
          type: "warning",
        });
      }
    })
    .catch();
}

//刷新 token
function refreshToken(token) {
  axios
    .get("/user/refreshToken?token=" + token)
    .then((response) => {
      let res = response.data;
      if (res.code == 200) {
        //获取最新用户信息
        getUserInfo(res.data);
        //设置新的token
        localStorage.setItem("aduBlogToken", res.data);
        variable.aduBlogToken.value = res.data;
      } else {
        ElMessage({
          message: res.msg,
          type: "warning",
        });
      }
    })
    .catch();
}
// -----------------修改个人信息end---------------
</script>
<style  scoped>
</style>