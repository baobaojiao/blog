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
          v-if="pathData.includes('Menu:add')"
          >添加</Button
        >
      </div>

      <div>
        <Input
          class="mRight-10"
          search
          enter-button
          v-model="findData"
          placeholder="权限名称模糊搜索"
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
    >
      <el-table-column prop="name" label="权限名称" width="400" />
      <el-table-column prop="path" label="路由" width="400" />
      <el-table-column label="图标" width="300">
        <template #default="scope">
          <i class="iconfont" :class="scope.row.ico"></i>
        </template>
      </el-table-column>
      <el-table-column label="类型">
        <template #default="scope">
          <el-tag v-if="scope.row.grade == 1">菜单目录</el-tag>
          <el-tag v-else-if="scope.row.grade == 2" type="success"
            >菜单项</el-tag
          >
          <el-tag v-else type="info">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="200"
        v-if="pathData.includes('Menu:edit') || pathData.includes('Menu:del')"
      >
        <template #default="scope">
          <Button
            class="mRight-10"
            size="small"
            type="info"
            @click="edit(scope.row)"
            v-if="pathData.includes('Menu:edit')"
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
              v-if="pathData.includes('Menu:del')"
              >删除</Button
            >
          </Poptip>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog
    :close-on-click-modal="false"
    :draggable="true"
    v-model="dialogVisible"
    width="50%"
    :before-close="handleClose"
  >
    <el-form ref="form" :model="formData" style="padding: 0 100px">
      <el-form-item label="类型" :required="true">
        <el-radio-group v-model="formData.grade">
          <el-radio value="1" size="large" border>菜单目录</el-radio>
          <el-radio value="2" size="large" border>菜单项</el-radio>
          <el-radio value="3" size="large" border>按钮</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        label="上级菜单"
        v-show="formData.grade != 1"
        :required="true"
      >
        <el-tree-select
          v-model="formData.menuId"
          check-strictly
          :data="topMenuTree"
          :render-after-expand="false"
          placeholder="请选择"
        />
      </el-form-item>

      <el-form-item label="名称" :required="true">
        <el-input
          v-model="formData.name"
          placeholder="请输入名称"
          maxlength="11"
        />
      </el-form-item>

      <el-form-item
        label="路由路径"
        :required="true"
        v-show="formData.grade != 3"
      >
        <el-input
          v-model="formData.path"
          placeholder="web端路由路径，无须以`/`开头，如：Menu"
          maxlength="18"
        />
      </el-form-item>

      <el-form-item
        label="菜单图标"
        :required="true"
        v-show="formData.grade != 3"
      >
        <el-select v-model="formData.ico" placeholder="请选择图标">
          <el-option v-for="item in icoList" :label="item" :value="item">
            <i class="iconfont" :class="item"></i>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="排序" v-show="formData.grade != 3">
        <el-input-number v-model="formData.sort" :min="1" />
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
import { Refresh, Search } from "@element-plus/icons-vue";
const axios = inject("axios");
const tableWidth = inject("tableWidth"); //表格宽度
const pathData = inject("pathData"); //拥有的按钮

const findData = ref(); //搜索框中的数据
const tableData = ref([]); //表格数据
const dialogVisible = ref(false); //对话框状态
const formData = ref({
  //对话框中的数据
  id: "",
  grade: "1",
  name: "",
  path: "",
  ico: "",
  sort: 1,
  menuId: null,
});
const topMenuTree = ref([]); //对话框-上级菜单

//图标列表
const icoList = [
  "icon-jiaoseguanli",
  "icon-caidanguanli1",
  "icon-qiyequanxianchaxun",
  "icon-quanxianguanli-",
  "icon-zuzhiyuquanxian",
  "icon-menu_kongzhitai",
  "icon-chengjichaxun",
  "icon-bangongbanantubiao-",
  "icon-yuangongguanli",
  "icon-qiye",
  "icon-qiyeguanli",
  "icon-yonghutongxunxinyong",
  "icon-renyuanxinxi",
  "icon-pengyouquan1",
  "icon-biaoqing",
  "icon-lianjie1",
  "icon-comment",
  "icon-quanxianguanli",
  "icon-pinglunguanli",
  "icon-yingxionglianmeng1",
  "icon-dashang",
  "icon-xitong",
  "icon-xitong1",
  "icon-pinglun",
  "icon-a-yinlebofangliebiaoyinle",
  "icon-shu",
  "icon-wenjian-",
  "icon-wenjianjia",
];

onMounted(() => {
  findList();
});

//查询上级菜单树
function findTopMenuTree() {
  axios
    .get("/menu/findTopMenuTree")
    .then((response) => {
      let res = response.data;
      if (res.code == 200) {
        topMenuTree.value = res.data;
      }
    })
    .catch();
}

//查询表格数据
const findList = () => {
  axios
    .post("/menu/findMenuList", { name: findData.value })
    .then((response) => {
      let res = response.data;
      if (res.code == 200) {
        tableData.value = [];
        tableData.value = res.data;
      }
    })
    .catch();
};

//编辑
const edit = (row) => {
  findTopMenuTree();

  axios
    .post("/menu/findMenuList", { id: row.id })
    .then((response) => {
      let res = response.data;
      if (res.code == 200) {
        formData.value.id = res.data[0].id;
        formData.value.grade = res.data[0].grade.toString();
        formData.value.menuId = res.data[0].menuId;
        formData.value.name = res.data[0].name;
        formData.value.path = res.data[0].path;
        formData.value.sort = res.data[0].sort;
        formData.value.ico = res.data[0].ico;
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
    .post("/menu/delMenu", { id: row.id })
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
  findTopMenuTree();
  dialogVisible.value = true;
};

//保存
const saveRole = () => {
  if (formData.value.path == "" && formData.value.grade != 3) {
    ElMessage({
      message: "路径路由不能为空",
      type: "warning",
    });
    return false;
  }

  if (formData.value.id == "") {
    axios
      .post("/menu/addMenu", formData.value)
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
      .post("/menu/updMenu", formData.value)
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
      formData.value.grade = "1";
      formData.value.name = "";
      formData.value.path = "";
      formData.value.ico = "";
      formData.value.sort = 1;
      formData.value.menuId = null;
    }
  }
);

//搜索按钮
const findAn = () => {
  findList();
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

.iconfont {
  font-size: 25px;
}
</style>