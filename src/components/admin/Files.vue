<template>
  <div class="main">
    <div class="mBottom-20 main_top">
      <div>
        <Tooltip content="获取最新数据，默认从缓存中取" placement="top">
          <Button
            style="width: 45px; background-color: #40485b; color: #fff"
            class="mRight-10"
            @click="refresh"
            icon="md-refresh"
          >
          </Button>
        </Tooltip>

        <Button
          type="primary"
          @click="DrawerStzte = true"
          v-if="pathData.includes('BQ:add')"
          >上传</Button
        >
      </div>
      <span style="color: blue"
        >注意：此页面功能只用于OSS，<br />
        若前端中直接使用的文件会显示未使用，可点击加入按钮设为正在使用</span
      >

      <div style="display: flex">
        <RadioGroup
          v-model="wjsxState"
          type="button"
          style="width: 400px"
          @on-change="stateOnChange"
        >
          <Radio label="全部"></Radio>
          <Radio label="正在使用"></Radio>
          <Radio label="未使用"></Radio>
        </RadioGroup>
        <Select
          v-model="type"
          style="width: 200px; margin-left: 20px"
          @on-change="classifyChange"
        >
          <Option key="1" value="1">图片</Option>
          <!-- <Option key="2" value="2">音乐</Option>
          <Option key="3" value="3">视频</Option> -->
        </Select>
        <Input
          clearable
          search
          enter-button
          v-model="fileName"
          placeholder="输入文件名"
          @on-search="findlist(1, true)"
          @on-clear="findlist(1, true)"
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
      <el-table-column prop="state" label="使用状态" width="200">
        <template #default="scope">
          <div style="text-align: center">
            <Tag color="success" v-if="scope.row.state">正在使用</Tag>
            <Tag color="error" v-else>未使用</Tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="url" />
      <el-table-column prop="lastModified" label="上传时间" />

      <el-table-column label="文件">
        <template #default="scope">
          <Image
            v-if="type == 1"
            transfer
            :src="scope.row.fileUrl"
            width="100px"
            height="60px"
            lazy
            preview
            :preview-list="[scope.row.fileUrl]"
          />

          <audio v-if="type == 2" :src="scope.row.fileUrl" controls></audio>

          <video
            v-if="type == 3"
            :src="scope.row.fileUrl"
            controls="controls"
            width="300"
          ></video>
        </template>
      </el-table-column>

      <el-table-column
        fixed="right"
        label="操作"
        width="200"
        v-if="pathData.includes('Files:del') || pathData.includes('Files:gl')"
      >
        <template #default="scope">
          <Poptip
            :transfer="true"
            confirm
            title="确认删除吗?"
            @on-ok="removeAn(scope.row.url)"
            placement="bottom"
          >
            <Button
              type="error"
              size="small"
              v-if="pathData.includes('Files:del')"
              >删除</Button
            >
          </Poptip>
          &nbsp;

          <Poptip
            :transfer="true"
            confirm
            title="确认此文件正在使用?"
            @on-ok="guolv(scope.row.url)"
            placement="bottom"
            v-show="!scope.row.state"
          >
            <Button
              type="primary"
              size="small"
              v-if="pathData.includes('Files:gl')"
              >加入</Button
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
  <Drawer v-if="tableData" title="上传文件" v-model="DrawerStzte" :width="50">
    <div>
      <label>文件类型：</label>
      <Select
        v-model="chouType"
        style="width: 200px"
        @on-change="chouTiOnChange"
      >
        <Option key="1" value="1">图片</Option>
        <!-- <Option key="2" value="2">音乐</Option>
        <Option key="3" value="3">视频</Option> -->
      </Select>
    </div>
    <br />
    <br />

    <Upload
      :disabled="chouType == null"
      multiple
      type="drag"
      :show-upload-list="false"
      :action="uploadUrl"
      :on-success="uploadFmSuccess"
    >
      <div style="padding: 20px 0">
        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
        <p>上传文件</p>
      </div>
    </Upload>
  </Drawer>
</template>
<script setup>
const axios = inject("axios");
const urlPrefix = inject("prefix"); //地址前缀
import { Notice } from "view-ui-plus";

const tableWidth = inject("tableWidth"); //表格宽度
const pathData = inject("pathData"); //拥有的按钮

const uploadUrl = ref(null);

const fileName = ref(null); //查询框
const type = ref(1); //搜索下拉框

//抽屉中的类型
const chouType = ref(null);
//抽屉中类型选择
function chouTiOnChange(value) {
  chouType.value = value;
  if (value == 1) {
    uploadUrl.value = urlPrefix + "/oss/uploadImg";
  } else if (value == 2) {
    uploadUrl.value = urlPrefix + "/oss/uploadMusic";
  }
  if (value == 3) {
    uploadUrl.value = urlPrefix + "/oss/uploadVideo";
  }
}

//搜索类型筛选
const wjsxState = ref("全部");

//根据使用状态筛选
function stateOnChange(state) {
  axios
    .post(
      "oss/getFiles",
      {
        type: type.value,
        redis: false,
        fileName: fileName.value,
      },
      { loading: true }
    )
    .then((response) => {
      let res = response.data;
      if (res.msg == "成功") {
        if (state == "正在使用") {
          let newArr = res.data.filter((item) => item.state === true);
          tableData.value.data = newArr;
          tableData.value.records = newArr.slice(0, 10);
          tableData.value.total = newArr.length; // 设置总页数
          tableData.value.pages = Math.ceil(newArr.length / 10); // 设置总页数
        } else if (state == "未使用") {
          let newArr = res.data.filter((item) => item.state === false);
          tableData.value.data = newArr;
          tableData.value.records = newArr.slice(0, 10);
          tableData.value.total = newArr.length; // 设置总页数
          tableData.value.pages = Math.ceil(newArr.length / 10); // 设置总页数
        } else {
          tableData.value.data = res.data;
          tableData.value.records = res.data.slice(0, 10);
          tableData.value.total = res.data.length; // 设置总页数
          tableData.value.pages = Math.ceil(res.data.length / 10); // 设置总页数
        }
      }
    })
    .catch();
}

//刷新
const refresh = () => {
  //先重置搜索框数据
  type.value = 1;
  //调用查询
  findlist(1, false);
};

const DrawerStzte = ref(false); //抽屉状态
const tableData = ref({
  //列表数据
  records: [], //当前分页后的数据
  data: [], //为分页数据（所有）
  total: 0,
  current: 1,
  pages: 0,
});

onMounted(() => {
  // 调用查询列表
  findlist(1, true);
});

// 查询列表函数
function findlist(pageNum, redis) {
  axios
    .post("oss/getFiles", {
      type: type.value,
      redis: redis,
      fileName: fileName.value,
    })
    .then((response) => {
      let res = response.data;
      if (res.msg == "成功") {
        tableData.value.data = res.data;
        tableData.value.records = res.data.slice(pageNum - 1, 10);
        tableData.value.total = res.data.length; // 设置总页数
        tableData.value.pages = Math.ceil(res.data.length / 10); // 设置总页数
      }
    })
    .catch();
}

//页码改变
function ymChange(pageNum) {
  const start = (pageNum - 1) * 10;
  const end = pageNum * 10;
  tableData.value.records = tableData.value.data.slice(start, end); // 更新当前页数据
}

//删除按钮
function removeAn(url) {
  let arr = [url];

  axios
    .post("oss/delFiles", arr)
    .then((response) => {
      let res = response.data;
      if (res.msg == "成功") {
        stateOnChange(wjsxState.value);
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

//更改按钮
function guolv(url) {
  axios
    .get("oss/addFilterFiles?file=" + url)
    .then((response) => {
      let res = response.data;
      if (res.msg == "成功") {
        stateOnChange(wjsxState.value);
        Notice.success({
          title: "更改成功",
        });
      } else {
        Notice.error({
          title: res.msg,
        });
      }
    })
    .catch();
}

//搜索下拉框切换时触发
function classifyChange(value) {
  type.value = value;
  tableData.value.current = 1;
  findlist(1, true);
}

//封面图上传成功函数
function uploadFmSuccess(response, file, fileList) {
  Notice.success({
    title: "上传成功",
  });
  findlist(1, false);
  DrawerStzte.value = false;
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