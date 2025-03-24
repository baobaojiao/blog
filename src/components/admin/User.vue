<template>
  <div class="main">
    <div class="mBottom-20 main_top">
      <div>
        <Button
          style="width: 45px; background-color: #40485b; color: #fff"
          class="mRight-10"
          @click="refresh"
          icon="md-refresh"
        >
        </Button>

        <Button
          type="primary"
          @click="addData"
          v-if="pathData.includes('User:add')"
          >添加</Button
        >
      </div>

      <div style="display: flex">
        <Select v-model="xlk" style="width: 95px">
          <Option value="昵称">昵称</Option>
          <Option value="手机号">手机号</Option>
        </Select>
        <Input
          class="mRight-10"
          search
          enter-button
          v-model="findData"
          placeholder="模糊搜索"
          @on-search="findAn"
        />
      </div>
    </div>

    <el-table
      :data="tableData"
      :style="{ maxWidth: tableWidth }"
      style="margin-bottom: 20px"
      row-key="id"
      border
      default-expand-all
    >
      <el-table-column prop="id" label="ID" width="100" />
      <el-table-column prop="account" label="账号" width="200" />
      <el-table-column prop="nickname" label="昵称" width="200" />
      <el-table-column label="角色组" width="200">
        <template #default="scope">
          <div v-for="item in scope.row.roleList">
            <el-tag>{{ item.name }}</el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="头像" width="100">
        <template #default="scope">
          <el-avatar shape="square" :size="50" :src="scope.row.avatar" />
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column
        fixed="right"
        label="操作"
        width="200"
        v-if="pathData.includes('User:edit') || pathData.includes('User:del')"
      >
        <template #default="scope">
          <Button
            class="mRight-10"
            size="small"
            type="info"
            @click="edit(scope.row)"
            v-if="pathData.includes('User:edit')"
            >编辑</Button
          >

          <Poptip
            :transfer="true"
            confirm
            title="确认删除吗?"
            @on-ok="del(scope.row)"
            placement="bottom"
          >
            <Button
              type="error"
              size="small"
              v-if="pathData.includes('User:del')"
              >删除</Button
            >
          </Poptip>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @current-change="ymChange(currentPage)"
      v-model:current-page="currentPage"
      background
      layout="prev, pager, next"
      :total="parseInt(fyTotal)"
    />
  </div>

  <el-dialog
    :close-on-click-modal="false"
    :draggable="true"
    v-model="dialogVisible"
    width="50%"
    :before-close="handleClose"
  >
    <el-form ref="form" :model="formData" style="padding: 0 100px">
      <el-form-item label="头像" :required="true">
        <div class="avatarUploader">
          <el-upload
            :action="variable.pz_all.value.upload_url + '/uploadImg'"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="formData.avatar" :src="formData.avatar" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><i-ep-Plus /></el-icon>
          </el-upload>
        </div>
      </el-form-item>

      <el-form-item label="昵称" :required="true">
        <el-input
          v-model="formData.nickname"
          placeholder="请输入昵称"
          required
          maxlength="20"
        />
      </el-form-item>

      <el-form-item label="账号" :required="true">
        <el-input
          v-model="formData.account"
          placeholder="请输入账号"
          maxlength="20"
        />
      </el-form-item>

      <el-form-item label="密码" :required="true">
        <el-input
          v-model="formData.password"
          placeholder="请输入密码"
          maxlength="18"
        />
      </el-form-item>

      <el-form-item label="角色" :required="true">
        <el-tree-select
          v-model="formData.roleList"
          :data="roleList"
          multiple
          :render-after-expand="false"
          placeholder="请选择角色"
        />
      </el-form-item>

      <el-form-item label="邮箱">
        <el-input
          v-model="formData.email"
          placeholder="请输入邮箱"
          maxlength="20"
        />
      </el-form-item>

      <el-form-item label="手机">
        <el-input
          v-model="formData.phone"
          placeholder="请输入手机号"
          maxlength="11"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <Button class="mRight-10" @click="dialogVisible = false">取消</Button>
        <Button type="primary" @click="saveRole">保存</Button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
const axios = inject("axios");
import variable from "../../js/variable";
import { eventBus } from "../../js/eventBus.js";

const tableWidth = inject("tableWidth"); //表格宽度
const pathData = inject("pathData"); //拥有的按钮

const xlk = ref(); //搜索下拉框选择的数据
const findData = ref(); //搜索框中的数据
const tableData = ref([]); //表格数据
const dialogVisible = ref(false); //对话框状态
const formData = ref({
  //对话框中的数据
  id: "",
  account: "",
  nickname: "",
  avatar: "",
  email: "",
  phone: "",
  password: "",
  roleList: null,
});
const fyTotal = ref(); //分页总数
const currentPage = ref(1); //当前页
const roleList = ref([]); //所有角色树

//页码改变
function ymChange(pageNum) {
  findList(pageNum);
}

onMounted(() => {
  findList();
  //调用查询图片上传前缀，确保地址没问题
  eventBus.emit("getImgUploadPrefix");
});

//查询所有角色
function findRoleList() {
  axios
    .get("/role/findRoleTree", {})
    .then((response) => {
      let res = response.data;
      if (res.code == 200) {
        roleList.value = res.data;
      }
    })
    .catch();
}

//查询表格数据
const findList = (pageNum, id, nickname, phone) => {
  axios
    .post("/user/findUser", {
      id: id,
      nickname: nickname,
      phone: phone,
      pageNum: pageNum,
    })
    .then((response) => {
      let res = response.data;
      if (res.code == 200) {
        tableData.value = [];
        fyTotal.value = res.data.total;
        tableData.value = res.data.records;
      }
    })
    .catch();
};

//编辑
const edit = (row) => {
  findRoleList();

  axios
    .post("/user/findUserById", { id: row.id })
    .then((response) => {
      let res = response.data;
      if (res.code == 200) {
        formData.value.id = res.data.id;
        formData.value.account = res.data.account;
        formData.value.nickname = res.data.nickname;
        formData.value.avatar = res.data.avatar;
        formData.value.email = res.data.email;
        formData.value.phone = res.data.phone;
        formData.value.password = res.data.password;
        formData.value.roleList = res.data.roleIdList;
        dialogVisible.value = true;
      } else {
        ElMessage({
          message: res.msg,
          type: "warning",
        });
      }
    })
    .catch();
};

//删除
const del = (row) => {
  axios
    .post("/user/delUser", { id: row.id })
    .then((response) => {
      let res = response.data;
      if (res.code == 200) {
        ElMessage({
          message: "删除成功",
          type: "success",
        });
        dialogVisible.value = false;
        findList();
      } else {
        ElMessage({
          message: res.msg,
          type: "warning",
        });
      }
    })
    .catch();
};

//添加按钮
const addData = () => {
  findRoleList();
  dialogVisible.value = true;
};

//图片上传成功函数
const handleAvatarSuccess = (response, uploadFile) => {
  if (response.code == 200) {
    formData.value.avatar = response.data;
  } else {
    ElMessage({
      message: res.msg,
      type: "warning",
    });
  }
};

//保存
const saveRole = () => {
  if (formData.value.id == "") {
    axios
      .post("/user/addUserSetRole", formData.value)
      .then((response) => {
        let res = response.data;
        if (res.code == 200) {
          ElMessage({
            message: "新增成功",
            type: "success",
          });
          dialogVisible.value = false;
          findList();
        } else {
          ElMessage({
            message: res.msg,
            type: "warning",
          });
        }
      })
      .catch();
  } else {
    axios
      .post("/user/updUserSetRole", formData.value)
      .then((response) => {
        let res = response.data;
        if (res.code == 200) {
          ElMessage({
            message: "修改成功",
            type: "success",
          });
          dialogVisible.value = false;
          findList();
        } else {
          ElMessage({
            message: res.msg,
            type: "warning",
          });
        }
      })
      .catch();
  }
};

//关闭事件
const handleClose = () => {
  //关闭对话框
  dialogVisible.value = false;
};

//刷新表格数据
const refresh = () => {
  //先重置搜索框数据
  xlk.value = "";
  findData.value = "";
  //调用查询
  findList();
};

//对话框关闭重置数据
watch(
  () => dialogVisible.value,
  (newV, oldV) => {
    if (!newV) {
      //清空对话框内的数据
      formData.value.id = "";
      formData.value.account = "";
      formData.value.nickname = "";
      formData.value.avatar = "";
      formData.value.email = "";
      formData.value.phone = "";
      formData.value.password = "";
      formData.value.roleList = null;
    }
  }
);

//搜索按钮
const findAn = () => {
  if (findData.value !== undefined && xlk.value == undefined) {
    ElMessage({
      message: "请先选择搜索类型",
      type: "warning",
    });
  }
  if (xlk.value != undefined) {
    if (xlk.value == "手机号") {
      findList("", "", "", findData.value);
    } else if (xlk.value == "昵称") {
      findList("", "", findData.value);
    }
  }
};
</script>
<style  scoped>
.main {
  background-color: #fff;
  padding: 15px;
  display: flex;
  flex-direction: column;
}

.main_top {
  display: flex;
  justify-content: space-between;
}

.avatarUploader,
.avatar {
  width: 178px;
  height: 178px;
  border: 1px dashed rgb(214, 214, 214);
  cursor: pointer;
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>