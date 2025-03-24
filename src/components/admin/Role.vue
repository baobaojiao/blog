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
          v-if="pathData.includes('Role:add')"
          >添加</Button
        >
      </div>

      <div>
        <el-select
          style="min-width: 150px"
          v-model="xlk"
          clearable
          filterable
          placeholder="请选择组织"
          @change="xlkChange"
        >
          <el-option
            v-for="(item, index) in xlkData"
            :key="index"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
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
      <el-table-column prop="organization" label="组织名称" width="300" />
      <el-table-column prop="name" label="角色名称" width="300" />
      <el-table-column prop="remarks" label="备注" />
      <el-table-column
        fixed="right"
        label="操作"
        width="200"
        v-if="pathData.includes('Role:edit') || pathData.includes('Role:del')"
      >
        <template #default="scope">
          <Button
            class="mRight-10"
            size="small"
            type="info"
            @click="edit(scope.row)"
            v-if="pathData.includes('Role:edit')"
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
              v-if="pathData.includes('Role:del')"
              >删除</Button
            >
          </Poptip>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog
    :close-on-click-modal="false"
    v-model="dialogVisible"
    width="50%"
    :before-close="handleClose"
  >
    <el-form :model="formData" style="padding: 0 100px">
      <el-form-item label="组织名称" :required="true">
        <el-select
          v-model="formData.organization"
          style="width: 100%"
          filterable
          allow-create
          default-first-option
          :reserve-keyword="false"
          placeholder="请选择或输入一个新的组织"
        >
          <el-option
            v-for="(item, index) in xlkData"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="角色名称" :required="true">
        <el-input
          v-model="formData.name"
          placeholder="请输入角色名称"
          maxlength="11"
        />
      </el-form-item>

      <el-form-item label="角色备注">
        <el-input
          v-model="formData.remarks"
          placeholder="请输入备注"
          maxlength="11"
        />
      </el-form-item>

      <el-form-item label="角色权限" :required="true">
        <el-tree
          ref="treeRef"
          :data="treeData"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defaultChecked"
          :check-strictly="true"
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
import { Refresh } from "@element-plus/icons-vue";
const route = useRoute();
const axios = inject("axios");
const tableWidth = inject("tableWidth"); //表格宽度
const pathData = inject("pathData"); //拥有的按钮

const xlkData = ref(); //搜索下拉框列表数据
const xlk = ref(); //搜索下拉框选择的数据
const tableData = ref([]); //表格数据
const dialogVisible = ref(false); //对话框状态
const formData = ref({
  //对话框中的数据
  id: "",
  organization: "",
  name: "",
  remarks: "",
});
const treeData = ref([]); //菜单树 所有数据
const treeRef = ref(null); //菜单树ref（dom）
const defaultChecked = ref([1]); //菜单树中被选中的数据（id）

onMounted(() => {
  findList();

  //查询所有组织
  axios
    .get("/role/organizationList")
    .then((response) => {
      let res = response.data;
      if (res.code == 200) {
        xlkData.value = res.data;
      }
    })
    .catch();

  //查询所有菜单树
  findMunuTree();
});

//查询所有菜单树
const findMunuTree = () => {
  axios
    .get("/menu/menuList", { path: route.path.split("/")[2] })
    .then((response) => {
      let res = response.data;
      if (res.code == 200) {
        treeData.value = [];
        treeData.value = res.data;
      }
    })
    .catch();
};

//搜索下拉框切换触发
const xlkChange = (organization) => {
  findList(organization);
};

//查询表格数据
const findList = (organization) => {
  axios
    .post("/role/findRole", { organization: organization })
    .then((response) => {
      let res = response.data;
      if (res.code == 200) {
        tableData.value = [];
        res.data.forEach((item) => {
          tableData.value.push({
            id: item.id,
            organization: item.organization,
            name: item.name,
            remarks: item.remarks,
          });
        });
      }
    })
    .catch();
};

//编辑
const edit = (row) => {
  axios
    .post("/role/findRoleMenuById", { id: row.id })
    .then((response) => {
      let res = response.data;
      if (res.code == 200) {
        dialogVisible.value = true;
        formData.value.id = res.data.id;
        formData.value.organization = res.data.organization;
        formData.value.name = res.data.name;
        formData.value.remarks = res.data.remarks;
        defaultChecked.value = res.data.menuIdList;
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
    .post("/role/delRole", { id: row.id })
    .then((response) => {
      let res = response.data;
      if (res.code == 200) {
        ElMessage({
          message: "删除成功",
          type: "success",
        });
        dialogVisible.value = false;
        findList(xlk.value);
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
  defaultChecked.value = [1];
  dialogVisible.value = true;
};

//保存
const saveRole = () => {
  if (formData.value.id == "") {
    axios
      .post("/role/addRoleSetMenu", {
        menuIdList: treeRef.value.getCheckedKeys(false),
        name: formData.value.name,
        organization: formData.value.organization,
        remarks: formData.value.remarks,
      })
      .then((response) => {
        let res = response.data;
        if (res.code == 200) {
          ElMessage({
            message: "新增成功",
            type: "success",
          });
          dialogVisible.value = false;
          findList(xlk.value);
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
      .post("/role/updRoleSetMenu", {
        id: formData.value.id,
        menuIdList: treeRef.value.getCheckedKeys(false),
        name: formData.value.name,
        organization: formData.value.organization,
        remarks: formData.value.remarks,
      })
      .then((response) => {
        let res = response.data;
        if (res.code == 200) {
          ElMessage({
            message: "修改成功",
            type: "success",
          });
          dialogVisible.value = false;
          findList(xlk.value);
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
      formData.value.organization = "";
      formData.value.name = "";
      formData.value.remarks = "";
      defaultChecked.value = [];
      //查询所有菜单树 如果不查询，重置选中的树无效
      findMunuTree();
    }
  }
);
</script>
<style  scoped>
.main {
  background-color: #fff;
  padding: 15px;
  /* display: flex;
  flex-direction: column; */
}
.main_top {
  display: flex;
  justify-content: space-between;
}
</style>