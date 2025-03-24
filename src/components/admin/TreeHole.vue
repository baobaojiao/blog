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
          @click="DrawerStzte = true"
          v-if="pathData.includes('LOL:add')"
          >添加</Button
        >
      </div>
    </div>

    <el-table
      :data="tableData.records"
      :style="{ maxWidth: tableWidth }"
      style="margin-bottom: 20px"
      row-key="id"
      border
      default-expand-all
    >
      <el-table-column prop="id" label="ID" width="100" />
      <el-table-column prop="content" label="内容" />
      <el-table-column prop="creationTime" label="创建时间" width="200" />
      <el-table-column
        fixed="right"
        label="操作"
        width="200"
        v-if="
          pathData.includes('TreeHole:edit') ||
          pathData.includes('TreeHole:del')
        "
      >
        <template #default="scope">
          <Button
            class="mRight-10"
            size="small"
            type="info"
            @click="editAn(scope.row.id)"
            v-if="pathData.includes('TreeHole:edit')"
            >编辑</Button
          >

          <Poptip
            :transfer="true"
            confirm
            title="确认删除吗?"
            @on-ok="removeAn(scope.row.id)"
            placement="bottom"
          >
            <Button
              type="error"
              size="small"
              v-if="pathData.includes('TreeHole:del')"
              >删除</Button
            >
          </Poptip>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @current-change="ymChange(tableData.current)"
      v-model:current-page="tableData.current"
      background
      layout="prev, pager, next"
      :total="parseInt(tableData.total)"
    />
  </div>

  <!-- 抽屉 -->
  <Drawer
    v-if="tableData"
    title="编辑"
    :mask-closable="false"
    v-model="DrawerStzte"
    :width="50"
    @on-close="clearChouti"
  >
    <Input v-model="chouti.content" size="large" placeholder="内容" />
    <div style="position: absolute; bottom: 30px; right: 50px">
      <Button type="primary" style="width: 100px" size="large" @click="TiJiao"
        >提交</Button
      >
      <Button style="margin-left: 20px" size="large" @click="gbct">取消</Button>
    </div>
  </Drawer>
</template>
  <script setup>
const axios = inject("axios");
import { Notice } from "view-ui-plus";

const tableWidth = inject("tableWidth"); //表格宽度
const pathData = inject("pathData"); //拥有的按钮

//刷新
const refresh = () => {
  //调用查询
  findlist(1);
};

const DrawerStzte = ref(false); //抽屉状态
const tableData = ref({
  //列表数据
  records: [],
  total: 0,
  current: 1,
  pages: 0,
});
const chouti = ref({
  //抽屉内数据
  id: 0,
  content: "",
  figure: "",
});

//清空抽屉内数据
function clearChouti() {
  chouti.value.id = 0;
  chouti.value.content = "";
  chouti.value.figure = "";
}

onMounted(() => {
  // 调用查询列表
  findlist(1);
});

// 查询列表函数
function findlist(pageNum) {
  axios
    .post("treeHole/getTreeHole", {
      pageNum: pageNum,
    })
    .then((response) => {
      let res = response.data;
      if (res.msg == "成功") {
        tableData.value.records = res.data.records;
        tableData.value.total = res.data.total;
        tableData.value.current = res.data.current;
        tableData.value.pages = res.data.pages;
      }
    })
    .catch();
}

//页码改变
function ymChange(pageNum) {
  findlist(pageNum);
}

//编辑按钮
function editAn(id) {
  axios
    .post("treeHole/getTreeHole", { id: id })
    .then((response) => {
      let res = response.data;
      if (res.msg == "成功") {
        DrawerStzte.value = true; //打开抽屉
        chouti.value = res.data.records[0];
      } else {
        Notice.error({
          title: res.msg,
        });
      }
    })
    .catch();
}

//删除按钮
function removeAn(id) {
  axios
    .post("treeHole/delTreeHole", { id: id })
    .then((response) => {
      let res = response.data;
      if (res.msg == "成功") {
        findlist(tableData.value.current);
        Notice.success({
          title: "删除成功",
        });
      } else {
        Notice.error({
          title: res.msg,
        });
      }
    })
    .catch();
}

//编辑中提交按钮
function TiJiao() {
  if (chouti.value.id == 0) {
    //新增
    axios
      .post("treeHole/addTreeHole", chouti.value)
      .then((response) => {
        let res = response.data;
        if (res.msg == "成功") {
          Notice.success({
            title: "新增成功！",
          });
          DrawerStzte.value = false; //关闭抽屉
          findlist(tableData.value.current); // 调用查询列表
          clearChouti(); //清空抽屉数据
        } else {
          Notice.error({
            title: res.msg,
          });
        }
      })
      .catch();
  } else {
    //修改
    axios
      .post("treeHole/updTreeHole", chouti.value)
      .then((response) => {
        let res = response.data;
        if (res.msg == "成功") {
          Notice.success({
            title: "修改成功！",
          });
          DrawerStzte.value = false; //关闭抽屉
          findlist(tableData.value.current); // 调用查询列表
          clearChouti(); //清空抽屉数据
        } else {
          Notice.error({
            title: res.msg,
          });
        }
      })
      .catch();
  }
}

//关闭抽屉
function gbct() {
  DrawerStzte.value = false; //关闭抽屉
  clearChouti();
}
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
</style>