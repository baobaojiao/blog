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
      </div>

      <div style="display: flex">
        <Input
          class="mRight-10"
          search
          enter-button
          v-model="nickname"
          placeholder="输入昵称关键字..."
          @on-search="findlist(1)"
        />

        <Select
          v-model="classify"
          style="width: 200px; margin-left: 20px"
          @on-change="classifyChange"
          :clearable="true"
          @clearSingleSelect="classifyClearSingleSelect"
        >
          <Option value="1">文章</Option>
          <Option value="2">留言</Option>
          <Option value="3">说说</Option>
          <Option value="4">友联</Option>
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

      <el-table-column label="分类" width="200">
        <template #default="scope">
          <Badge
            text="文章"
            v-if="scope.row.classify == 1"
            type="primary"
          ></Badge>
          <Badge
            text="留言"
            v-else-if="scope.row.classify == 2"
            type="success"
          ></Badge>
          <Badge
            text="说说"
            v-else-if="scope.row.classify == 3"
            type="warning"
          ></Badge>
          <Badge
            text="友联"
            v-else-if="scope.row.classify == 4"
            type="info"
          ></Badge>
        </template>
      </el-table-column>

      <el-table-column prop="nickname" label="昵称" width="200" />
      <el-table-column label="头像" width="200">
        <template #default="scope">
          <el-image
            :src="scope.row.avatarUrl"
            lazy
            style="width: 40px; height: 40px"
          />
        </template>
      </el-table-column>
      <el-table-column label="评论内容">
        <template #default="scope">
            <MdPreview class="commentListYL" :modelValue="scope.row.content" />
        </template>
      </el-table-column>

      <el-table-column
        fixed="right"
        label="操作"
        width="300"
        v-if="
          pathData.includes('Comment:edit') || pathData.includes('Comment:del')
        "
      >
        <template #default="scope">
          <Button
            type="primary"
            size="small"
            style="margin-right: 5px"
            @click="editAn(scope.row.id)"
            v-if="pathData.includes('Comment:edit')"
            >编辑</Button
          >
          <Poptip
            :transfer="true"
            confirm
            title="确认删除吗?"
            @on-ok="removeAn(scope.row.id, false)"
            placement="bottom"
          >
            <Button
              type="warning"
              size="small"
              v-if="pathData.includes('Comment:edit')"
              >假删除</Button
            >
          </Poptip>
          &nbsp;
          <Poptip
            :transfer="true"
            confirm
            title="确认删除吗?"
            @on-ok="removeAn(scope.row.id, true)"
            placement="bottom"
          >
            <Button
              type="error"
              size="small"
              v-if="pathData.includes('Comment:edit')"
              >真删除</Button
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
    title="编辑评论"
    :mask-closable="false"
    v-model="DrawerStzte"
    :width="100"
    @on-close="clearChouti"
  >
    <MdEditor
      v-model="chouti.content"
      :toolbars="toolbars"
      @onUploadImg="onUploadImg"
    >
      <template #defToolbars>
        <Emoji />
      </template>
    </MdEditor>
    <br /><br />

    <div style="display: flex; align-items: center">
      <label style="width: 80px">博客地址：</label>
      <Input v-model="chouti.blogUrl" size="large" placeholder="博客地址" />
    </div>
    <br /><br />
    <div
      style="
        border: 1px dashed rgb(190, 190, 190);
        display: flex;
        align-items: center;
        justify-content: space-around;
        min-width: 400px;
      "
    >
      <Image width="100px" height="100px" :src="chouti.avatarUrl">
        <template #error>
          <Icon type="ios-image-outline" size="24" color="#ccc" />
        </template>
      </Image>
      <Upload
        :action="variable.pz_all.value.upload_url + '/uploadImg'"
        :show-upload-list="false"
        :on-success="uploadSuccess"
        :on-error="uploadError"
      >
        <Button icon="ios-cloud-upload-outline">上传头像</Button>
      </Upload>
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
import { MdEditor, NormalToolbar, MdPreview } from "md-editor-v3";
import { Emoji } from "@vavt/v3-extension";
import "md-editor-v3/lib/style.css";
import { toolbars } from "../../js/toolbars";
import { eventBus } from "../../js/eventBus.js";
const axios = inject("axios");
import { Notice } from "view-ui-plus";
import variable from "../../js/variable";

const tableWidth = inject("tableWidth"); //表格宽度
const pathData = inject("pathData"); //拥有的按钮

const imageList1 = ref([]); //已上传的所有文件

// 上传图片的配置
const onUploadImg = async (files, callback) => {
  const res = await Promise.all(
    files.map((file) => {
      return new Promise((rev, rej) => {
        const form = new FormData();
        form.append("file", file);

        axios
          .post(variable.pz_all.value.upload_url + "/uploadImg", form, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            if (res.data.code == 200) {
              rev(res.data.data);

              //插入到集合中
              imageList1.value.push(res.data.data);
            } else {
              Notice.error({
                title: "上传失败",
                desc: error,
              });
            }
          })
          .catch((error) => rej(error));
      });
    })
  );

  callback(res);
};

//刷新
const refresh = () => {
  //先重置搜索框数据
  nickname.value = null;
  classify.value = null;
  //调用查询
  findlist(1);
};

const DrawerStzte = ref(false); //抽屉状态
const nickname = ref(null); //搜索框内容
const classify = ref(null); //下拉选择框
const tableData = ref({
  //列表数据
  records: [],
  total: 0,
  current: 1,
});
const chouti = ref({
  //抽屉内数据
  id: 0,
  content: "",
  blogUrl: "",
  avatarUrl: "",
});

//清空抽屉内数据
function clearChouti() {
  chouti.value.id = 0;
  chouti.value.content = "";
  chouti.value.blogUrl = "";
  chouti.value.avatarUrl = "";
  imageList1.value = [];
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
    .post("comment/findComment", {
      pageNum: pageNum,
      nickname: nickname.value,
      classify: classify.value,
    })
    .then((response) => {
      let res = response.data;
      if (res.msg == "成功" && res.data != null) {
        tableData.value.records = res.data.records;
        tableData.value.total = res.data.total;
        tableData.value.current = res.data.current;
      }
    })
    .catch();
}

//页码改变
function ymChange(pageNum) {
  findlist(pageNum);
}

//上传成功函数
function uploadSuccess(response) {
  if (response.code == 200) {
    chouti.value.avatarUrl = response.data;
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
    .post("comment/findCommentById", { id: id })
    .then((response) => {
      let res = response.data;
      if (res.msg == "成功") {
        DrawerStzte.value = true; //打开抽屉
        chouti.value = res.data;
      } else {
        Notice.error({
          title: "失败",
          desc: res.msg,
        });
      }
    })
    .catch();
}

//删除按钮
function removeAn(id, type) {
  axios
    .post("comment/delComment", { id: id, type: type })
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
  axios
    .post("comment/updComment", chouti.value)
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
          title: "失败",
          desc: res.msg,
        });
      }
    })
    .catch();
}

//关闭抽屉
function gbct() {
  DrawerStzte.value = false; //关闭抽屉

  //删除已上传的文件
  axios
    .post("oss/delFiles", imageList1.value)
    .then((response) => {})
    .catch();

  clearChouti();
}

//切换时触发
function classifyChange(value) {
  classify.value = value;
  findlist(1);
}

//下拉框清空触发
function classifyClearSingleSelect() {
  findlist(1);
}
</script>
<style scoped>
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
