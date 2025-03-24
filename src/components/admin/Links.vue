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
          v-if="pathData.includes('Links:add')"
          >添加</Button
        >
      </div>

      <div>
        <Input
          search
          enter-button
          v-model="account"
          placeholder="输入名称关键字..."
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
      <el-table-column prop="name" label="博客名称" width="200" />
      <el-table-column prop="realmName" label="博客地址" />

      <el-table-column fixed="right" label="博客log" width="200">
        <template #default="scope">
          <el-image
            :src="scope.row.log"
            lazy
            style="width: 40px; height: 40px"
          />
        </template>
      </el-table-column>

      <el-table-column label="状态" width="200">
        <template #default="scope">
          <Badge
            text="正常"
            v-if="scope.row.state == 1"
            status="success"
          ></Badge>
          <Badge v-else text="失联" status="warning"></Badge>
        </template>
      </el-table-column>

      <el-table-column prop="type" label="链接类型">
        <template #default="scope">
          <Badge
            text="推荐链接"
            v-if="scope.row.type == '推荐链接'"
            type="success"
          ></Badge>
          <Badge v-else text="全站链接" type="primary"></Badge>
        </template>
      </el-table-column>

      <el-table-column
        fixed="right"
        label="操作"
        width="200"
        v-if="pathData.includes('Links:edit') || pathData.includes('Links:del')"
      >
        <template #default="scope">
          <Button
            class="mRight-10"
            size="small"
            type="info"
            @click="editAn(scope.row.id)"
            v-if="pathData.includes('Links:edit')"
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
              v-if="pathData.includes('Links:del')"
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
    title="编辑友联"
    :mask-closable="false"
    v-model="DrawerStzte"
    :width="50"
    @on-close="clearChouti"
    :closable="false"
  >
    <div style="margin-bottom: 20px">
      <label>类型：</label>
      <RadioGroup v-model="chouti.type">
        <Radio label="全站友联" :border="chouti.type"></Radio>
        <Radio label="推荐链接" :border="chouti.type"></Radio>
      </RadioGroup>
    </div>
    <Input v-model="chouti.name" size="large" placeholder="名称" />
    <Input
      v-model="chouti.realmName"
      size="large"
      placeholder="地址"
      style="margin-top: 20px"
    />
    <Input
      v-model="chouti.description"
      size="large"
      placeholder="描述"
      style="margin: 20px 0"
    />

    <Tabs value="name1">
      <TabPane label="填写log地址" name="name2">
        <Input
          v-model="chouti.log"
          size="large"
          placeholder="地址"
          style="margin-top: 20px"
        />
      </TabPane>
      <TabPane label="上传log" name="name1">
        <div
          style="
            border: 1px dashed rgb(190, 190, 190);
            display: flex;
            align-items: center;
            justify-content: space-around;
            min-width: 400px;
          "
        >
          <Image width="100px" height="100px" :src="chouti.log">
            <template #error>
              <Icon type="ios-image-outline" size="24" color="#ccc" />
            </template>
          </Image>
          <Upload
            :action="variable.pz_all.value.upload_url + '/uploadImg'"
            :show-upload-list="false"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :before-upload="beforeUpload"
          >
            <Button icon="ios-cloud-upload-outline">上传log</Button>
          </Upload>
        </div>
      </TabPane>
    </Tabs>

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
import variable from "../../js/variable";
import { Notice } from "view-ui-plus";
import { eventBus } from "../../js/eventBus.js";

const tableWidth = inject("tableWidth"); //表格宽度
const pathData = inject("pathData"); //拥有的按钮

//刷新
const refresh = () => {
  //先重置搜索框数据
  account.value = "";
  //调用查询
  findlist(1);
};

const DrawerStzte = ref(false); //抽屉状态
const account = ref(null); //搜索框内容
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
  name: "",
  realmName: "",
  log: "",
  description: "",
  type: "全站友联",
});

//清空抽屉内数据
function clearChouti() {
  chouti.value.id = 0;
  chouti.value.name = "";
  chouti.value.realmName = "";
  chouti.value.log = "";
  chouti.value.description = "";
}

onMounted(() => {
  // 调用查询列表
  findlist(1);

  //调用查询图片上传前缀，确保地址没问题
  eventBus.emit("getImgUploadPrefix");
});

// 查询列表函数
function findlist(pageNum) {
  axios
    .post("links/findLinks", { pageNum: pageNum, name: account.value })
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

//log上传前
function beforeUpload() {
  if (chouti.value.log) {
    let arr = [chouti.value.log];
    axios
      .post("oss/delFiles", arr)
      .then((response) => {})
      .catch();
  }
}

//上传成功函数
function uploadSuccess(response) {
  if (response.code == 200) {
    chouti.value.log = response.data;
  } else {
    Notice.warning({
      title: "上传失败",
      desc: response.msg,
    });
  }
}

//上传失败函数
function uploadError(error, file, fileList) {
  Notice.error({
    title: "上传失败",
    desc: error,
  });
}

//编辑按钮
function editAn(id) {
  axios
    .post("links/findLinks", { id: id })
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
    .post("links/delLinks", { id: id })
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
      .post("links/addLinks", chouti.value)
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
      .post("links/updLinks", chouti.value)
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

//取消按钮
function gbct() {
  DrawerStzte.value = false; //关闭抽屉

  //如果是新增状态取消，删除已上传的log图
  if (chouti.value.id == 0) {
    let arr = [chouti.value.log];
    axios
      .post("oss/delFiles", arr)
      .then((response) => {})
      .catch();
  }

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