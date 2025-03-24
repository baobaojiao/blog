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
          v-if="pathData.includes('BQ:add')"
          >添加</Button
        >
      </div>

      <div style="display: flex">
        <Select
          v-model="type"
          style="width: 200px; margin-left: 20px"
          @on-change="classifyChange"
          :clearable="true"
          @clearSingleSelect="classifyClearSingleSelect"
        >
          <Option
            :key="item"
            :value="item"
            v-for="item in variable.ExpressionType.value"
            >{{ item }}</Option
          >
        </Select>
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
      <el-table-column prop="type" label="表情类型" />
      <el-table-column prop="tip" label="文字提示" />
      <el-table-column prop="sort" label="排序" />
      <el-table-column label="表情" width="200">
        <template #default="scope">
          <Image
            :src="scope.row.file"
            fit="contain"
            width="40px"
            height="40px"
            lazy
          >
            <template #placeholder>
              <div class="imgLoading"></div>
            </template>
          </Image>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="200"
        v-if="pathData.includes('BQ:edit') || pathData.includes('BQ:del')"
      >
        <template #default="scope">
          <Button
            class="mRight-10"
            size="small"
            type="info"
            @click="editAn(scope.row.id)"
            v-if="pathData.includes('BQ:edit')"
            >编辑</Button
          >

          <Poptip
            :transfer="true"
            confirm
            title="确认删除吗?"
            @on-ok="removeAn(scope.row.id)"
            placement="bottom"
          >
            <Button type="error" size="small" v-if="pathData.includes('BQ:del')"
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
    title="编辑表情"
    :mask-closable="false"
    v-model="DrawerStzte"
    :width="50"
    @on-close="clearChouti"
  >
    <div>
      <label>表情类型：</label>
      <Select
        v-model="chouti.type"
        style="width: 200px"
        filterable
        allow-create
        @on-create="wzLxOnCsreate"
      >
        <Option
          :key="index"
          :value="item"
          v-for="(item, index) in variable.ExpressionType.value"
          >{{ item }}</Option
        >
      </Select>
    </div>

    <Input
      v-model="chouti.file"
      size="large"
      placeholder="文件名称"
      style="margin: 20px 0"
    />
    <Input
      v-model="chouti.tip"
      size="large"
      placeholder="文字提示"
      style="margin: 20px 0"
    />
    <div style="margin-bottom: 20px">
      <span style="padding-right: 30px">排序：</span>
      <InputNumber v-model="chouti.sort" controls-outside :min="0" />
    </div>

    <Upload
      multiple
      type="drag"
      :show-upload-list="false"
      :action="urlPrefix + '/upload/uploadFlieRName'"
      :on-success="uploadFmSuccess"
    >
      <div style="padding: 20px 0">
        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
        <p>识别文件名称</p>
      </div>
    </Upload>

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
const urlPrefix = inject("prefix"); //地址前缀
import { Notice } from "view-ui-plus";
import variable from "../../js/variable";

const tableWidth = inject("tableWidth"); //表格宽度
const pathData = inject("pathData"); //拥有的按钮

//刷新
const refresh = () => {
  //先重置搜索框数据
  type.value = null;
  //调用查询
  findlist(1);
};

const DrawerStzte = ref(false); //抽屉状态
const type = ref(null); //搜索框内容
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
  type: "",
  file: "",
  tip: "",
  sort: 0,
});

//清空抽屉内数据
function clearChouti() {
  chouti.value.id = 0;
  chouti.value.type = "";
  chouti.value.file = "";
  chouti.value.tip = "";
  chouti.value.sort = 0;
}

onMounted(() => {
  // 调用查询列表
  findlist(1);
});

// 查询列表函数
function findlist(pageNum) {
  axios
    .post("expression/findExpression", { pageNum: pageNum, type: type.value })
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
    .post("expression/findExpression", { id: id })
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
    .post("expression/delExpression", { id: id })
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
      .post("expression/addExpression", chouti.value)
      .then((response) => {
        let res = response.data;
        if (res.msg == "成功") {
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
      .post("expression/updExpression", chouti.value)
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

//拖动修改排序
function ondragdrop(index1, index2) {
  // 根据索引找到对应的数据
  const id1 = tableData.value.records[index1].id;
  const sort1 = tableData.value.records[index1].sort;

  const id2 = tableData.value.records[index2].id;
  const sort2 = tableData.value.records[index2].sort;

  const bq1 = id1 + "-" + sort1;
  const bq2 = id2 + "-" + sort2;

  axios
    .post("expression/updExpressionSort", { bq1: bq1, bq2: bq2 })
    .then((response) => {
      let res = response.data;
      if (res.msg == "成功") {
        findlist(tableData.value.current); // 调用查询列表
      } else {
        Notice.error({
          title: res.msg,
        });
      }
    })
    .catch();
}

//查询所有分类
onMounted(() => {
  axios
    .get("expression/findExpressionType")
    .then((response) => {
      let res = response.data;
      if (res.code == 200) {
        variable.ExpressionType.value = res.data;
      }
    })
    .catch();
});

//下拉框切换时触发
function classifyChange(value) {
  type.value = value;
  findlist(1);
}

//下拉框清空触发
function classifyClearSingleSelect() {
  findlist(1);
}

//分类选择框回车事件
function wzLxOnCsreate(val) {
  variable.ExpressionType.value.push(val);
}

//封面图上传成功函数
function uploadFmSuccess(response, file, fileList) {
  chouti.value.file = file.name;
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