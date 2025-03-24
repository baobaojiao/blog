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
        <el-button type="danger" :disabled="plscState" @click="removeAn"
          >批量删除</el-button
        >
      </div>

      <!-- 这里是搜索 -->
      <div style="display: flex">
        <DatePicker
          type="daterange"
          v-model="time"
          placement="bottom-end"
          placeholder="选择日期筛选"
          style="width: 350px"
          @on-change="timeChange"
        />
        <Input
          class="mRight-10"
          search
          enter-button
          v-model="ip"
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
      @selection-change="onSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" width="100" />
      <el-table-column prop="ip" label="ip" />
      <el-table-column prop="createTime" label="访问时间" />
      <el-table-column prop="requestUrl" label="访问地址" />
      <el-table-column prop="position" label="用户地址" />
      <el-table-column prop="state" label="访问权限" width="200">
        <template #default="scope">
          <Badge
            text="允许访问"
            v-if="scope.row.state == 1"
            type="success"
          ></Badge>
          <Badge v-else text="禁止访问" type="primary"></Badge>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="200"
        v-if="pathData.includes('Access:del')"
      >
        <template #default="scope">
          <Poptip
            :transfer="true"
            confirm
            title="确认删除吗?"
            @on-ok="bgcz(scope.row.id)"
            placement="bottom"
          >
            <Button type="error" size="small">删除</Button>
          </Poptip>

          &nbsp;

          <Poptip
            :transfer="true"
            confirm
            title="是否确认禁止该ip访问?"
            @on-ok="jzip(scope.row.ip, 2)"
            placement="bottom"
            v-show="scope.row.state == 1"
          >
            <Button
              type="warning"
              size="small"
              v-if="pathData.includes('Access:hmd')"
              >禁止</Button
            >
          </Poptip>

          <Poptip
            :transfer="true"
            confirm
            title="是否确认允许该ip访问?"
            @on-ok="jzip(scope.row.ip, 1)"
            placement="bottom"
            v-show="scope.row.state == 2"
          >
            <Button
              type="primary"
              size="small"
              v-if="pathData.includes('Access:hmd')"
              >移出</Button
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
    title="编辑台词"
    :mask-closable="false"
    v-model="DrawerStzte"
    :width="50"
    @on-close="clearChouti"
  >
    <Input v-model="chouti.content" size="large" placeholder="台词" />
    <Input
      v-model="chouti.figure"
      size="large"
      placeholder="人物"
      style="margin: 20px 0"
    />
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

const ip = ref(null); //查询ip条件
const time = ref(null); //查询时间
const plscState = ref(true); //批量删除按钮禁用状态

const delDataValue = ref([]); //将要批量删除的数据

//当表格选择项发生变化时会触发该事件
function onSelectionChange(arr) {
  if (arr.length > 0) {
    plscState.value = false;
  } else {
    plscState.value = true;
  }

  //抽取id集合
  delDataValue.value = [];
  arr.forEach((item) => {
    delDataValue.value.push(item.id);
  });
}

function timeChange() {
  findlist(1);
}

//刷新
const refresh = () => {
  //先重置搜索框数据
  ip.value = null;
  time.value = null;
  //调用查询
  findlist(1);
};

const DrawerStzte = ref(false); //抽屉状态
const tableData = ref({
  //列表数据
  records: [],
  total: 0,
  current: 1,
});
const chouti = ref({
  //抽屉内数据
  id: 0,
  ip: "",
  createTime: "",
  requestUrl: "",
});

//清空抽屉内数据
function clearChouti() {
  chouti.value.id = 0;
  chouti.value.ip = "";
  chouti.value.createTime = "";
  chouti.value.requestUrl = "";
}

onMounted(() => {
  // 调用查询列表
  findlist(1);
});

// 查询列表函数
function findlist(pageNum) {
  let startDate = null;
  let endtDate = null;
  if (time.value) {
    startDate = time.value[0];
    endtDate = time.value[1];
  }

  axios
    .post("visit/findVisit", {
      pageNum: pageNum,
      ip: ip.value,
      startDate: startDate,
      endDate: endtDate,
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

//表格每一列删除按钮
function bgcz(id) {
  delDataValue.value.push(id);
  removeAn(); //调用删除
}

//删除按钮
function removeAn() {
  axios
    .post("visit/delVisit", { idList: delDataValue.value })
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

//禁止ip访问
function jzip(ip, state) {
  axios
    .get("visit/setState?ip=" + ip + "&state=" + state)
    .then((response) => {
      let res = response.data;
      if (res.msg == "成功") {
        findlist(tableData.value.current);
        Notice.success({
          title: "禁用成功",
        });
      } else {
        Notice.error({
          title: res.msg,
        });
      }
    })
    .catch();
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