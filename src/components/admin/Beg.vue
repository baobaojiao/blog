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
          v-if="pathData.includes('Beg:add')"
          >添加</Button
        >
      </div>

      <div style="display: flex">
        <Input
          class="mRight-10"
          search
          enter-button
          v-model="name"
          placeholder="输入昵称关键字..."
          @on-search="findlist(1)"
        />
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
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="money" label="金额" width="200" />
        <el-table-column prop="creationTime" label="打赏时间" width="200" />
      <el-table-column
        fixed="right"
        label="操作"
        width="200"
        v-if="pathData.includes('Beg:edit') || pathData.includes('Beg:del')"
      >
        <template #default="scope">
          <Button
            class="mRight-10"
            size="small"
            type="info"
            @click="editAn(scope.row.id)"
            v-if="pathData.includes('Beg:edit')"
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
              v-if="pathData.includes('Beg:del')"
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
    title="编辑打赏"
    :mask-closable="false"
    v-model="DrawerStzte"
    :width="50"
    @on-close="clearChouti"
  >
    <div style="margin: 30px 0">
      <label>类型：</label>
      <RadioGroup v-model="datype">
        <Radio label="打赏" value="1" :border="chouti.type"></Radio>
        <!-- <Radio label="购买博客" :border="chouti.type"></Radio> -->
      </RadioGroup>
    </div>

    <Input
      style="margin-bottom: 30px"
      v-model="chouti.name"
      size="large"
      placeholder="姓名、昵称"
    />
    <div>
      <span style="padding-right: 30px">金额：</span>
      <InputNumber
        v-model="chouti.money"
        controls-outside
        :min="0"
        :step="0.1"
      />
    </div>

      <div style="padding: 20px 0">
          <span style="padding-right: 30px">打赏时间：</span>
          <DatePicker
                  type="datetime"
                  placeholder="打赏时间"
                  v-model="chouti.creationTime"
          />
      </div>

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
  //先重置搜索框数据
  name.value = "";
  //调用查询
  findlist(1);
};

const DrawerStzte = ref(false); //抽屉状态
const name = ref(null); //搜索框内容
const tableData = ref({
  //列表数据
  records: [],
  total: 0,
  current: 1,
  pages: 0,
});
const datype = ref("打赏"); //抽屉状态
const chouti = ref({
  //抽屉内数据
  id: 0,
  name: "",
  money: +0,
  type: 1,
    creationTime: "",
});

//清空抽屉内数据
function clearChouti() {
  chouti.value.id = 0;
  chouti.value.name = "";
    chouti.value.creationTime = "";
  chouti.value.money = 0;
}

onMounted(() => {
  // 调用查询列表
  findlist(1);
});

// 查询列表函数
function findlist(pageNum) {
  axios
    .post("beg/findBeg", { pageNum: pageNum, name: name.value })
    .then((response) => {
      let res = response.data;
      if (res.msg == "成功") {
        tableData.value.records = res.data.records;
        tableData.value.total = res.data.total;
        tableData.value.current = res.data.current;
      }
      tableData.value.loading = false;
    })
    .catch();
}

//页码改变
function ymChange(pageNum) {
  tableData.value.loading = true;
  findlist(pageNum);
}

//编辑按钮
function editAn(id) {
  axios
    .post("beg/findBeg", { id: id })
    .then((response) => {
      let res = response.data;
      if (res.msg == "成功") {
        DrawerStzte.value = true; //打开抽屉
        chouti.value = res.data.records[0];
        if (res.data.records[0].type == 1) {
          datype.value = "打赏";
        } else {
          datype.value = "购买博客";
        }
      } else {
        Notice.error({
          title: res.msg,
        });
      }
      tableData.value.loading = false;
    })
    .catch();
}

//删除按钮
function removeAn(id) {
  tableData.value.loading = true;

  axios
    .post("beg/delBeg", { id: id })
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
      tableData.value.loading = false;
    })
    .catch();
}

//编辑中提交按钮
function TiJiao() {
  if (datype.value == "打赏") {
    chouti.value.type = 1;
  } else {
    chouti.value.type = 2;
  }

  if (chouti.value.id == 0) {
    //新增
    axios
      .post("beg/addBeg", chouti.value)
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
        tableData.value.loading = false;
      })
      .catch();
  } else {
    //修改
    axios
      .post("beg/updBeg", chouti.value)
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
        tableData.value.loading = false;
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
