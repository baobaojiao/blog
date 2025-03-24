<template>
  <div class="main">
    <div class="itemDiv">
      <label>博客名称：</label>
      <Input
        v-model="variable.pz_all.value.blog_name"
        style="width: 200px"
        @on-enter="updPeizhi('blog_name')"
        @on-blur="updPeizhi('blog_name')"
      />
    </div>

    <div class="itemDiv">
      <label>网站logo：</label>
      <img
        :src="variable.pz_all.value.logo"
        style="
          width: 50px;
          height: 50px;
          border: 1px dashed #9c9c9c;
          margin-right: 20px;
        "
      />
      <Upload
        type="drag"
        :show-upload-list="false"
        :action="variable.pz_all.value.upload_url + '/uploadImg'"
        :on-success="uploadFmSuccess"
        :on-error="uploadFmError"
        :before-upload="beforeUpload"
      >
        <div style="padding: 15px">
          <Icon type="ios-cloud-upload" size="20" style="color: #3399ff"></Icon>
        </div>
      </Upload>
    </div>

    <div class="itemDiv">
      <label>博客运行开始时间：</label>
      <DatePicker
        type="date"
        v-model="kssj"
        placeholder="请选择"
        style="width: 200px"
        @on-change="timeOnChange"
      />
    </div>

    <div class="itemDiv">
      <label>文章访问密码：</label>
      <Input
        v-model="wzpwd"
        style="width: 400px"
        @on-enter="updPeizhi('文章访问密码')"
        @on-blur="updPeizhi('文章访问密码')"
        placeholder="********"
      />
    </div>

    <div class="itemDiv">
      <label>网站备案：</label>
      <Input
        v-model="icp"
        style="width: 200px"
        @on-enter="updPeizhi('icp')"
        @on-blur="updPeizhi('icp')"
      />
    </div>

    <div class="itemDiv">
      <label>博主名称：</label>
      <Input
        v-model="variable.pz_all.value.bz_name"
        style="width: 200px"
        @on-enter="updPeizhi('bz_name')"
        @on-blur="updPeizhi('bz_name')"
      />
    </div>

    <div class="itemDiv">
      <label>博主头像：</label>
      <img
        :src="variable.pz_all.value.bz_tx"
        style="
          width: 50px;
          height: 50px;
          border: 1px dashed #9c9c9c;
          margin-right: 20px;
        "
      />
      <Upload
        type="drag"
        :show-upload-list="false"
        :action="variable.pz_all.value.upload_url + '/uploadImg'"
        :on-success="uploadTxSuccess"
        :on-error="uploadFmError"
        :before-upload="beforeUploadTx"
      >
        <div style="padding: 15px">
          <Icon type="ios-cloud-upload" size="20" style="color: #3399ff"></Icon>
        </div>
      </Upload>
    </div>

    <div class="itemDiv">
      <label>图片上传位置：</label>
      <RadioGroup v-model="imgUpload" @on-change="updPeizhi">
        <Radio label="本地" border></Radio>
        <Radio label="阿里OSS" border></Radio>
      </RadioGroup>
    </div>
  </div>
</template>
<script setup>
const axios = inject("axios");
import { Notice } from "view-ui-plus";
import variable from "../../js/variable";
import { eventBus } from "../../js/eventBus.js";

const kssj = ref(null);
const wzpwd = ref(null);
const icp = ref(null);
const imgUpload = ref(null);

onMounted(() => {
  findYxsj();
  //调用查询图片上传前缀，确保地址没问题
  eventBus.emit("getImgUploadPrefix");
});

//查询配置、设置
function findYxsj() {
  axios
    .get("allocation/findYxsj")
    .then((response) => {
      let res = response.data;
      if (res.code == 200) {
        variable.pz_all.value.pzsz = res.data;
        res.data.allocations.forEach((item) => {
          if (item.name == "运行时间") {
            kssj.value = item.content;
          }
          if (item.name == "icp") {
            icp.value = item.content;
          }
          if (item.name == "upload_url") {
            if (item.content == "/oss") {
              imgUpload.value = "阿里OSS";
            } else {
              imgUpload.value = "本地";
            }
          }
        });
      }
    })
    .catch();
}

//运行时间发生变化时触发
function timeOnChange(time) {
  axios
    .post("allocation/updAllocation", { name: "运行时间", content: time })
    .then((response) => {
      let res = response.data;
      if (res.msg == "成功") {
        Notice.success({
          title: "修改成功",
        });
      } else {
        Notice.error({
          title: res.msg,
        });
      }
    })
    .catch();
}

//修改配置
function updPeizhi(type) {

  let sj;
  if (type == "blog_name") {
    sj = variable.pz_all.value.blog_name;
  } else if (type == "icp") {
    sj = icp.value;
  } else if (type == "bz_name") {
    sj = variable.pz_all.value.bz_name;
  } else if (type == "文章访问密码") {
    sj = wzpwd.value;
  } else if (type == "本地") {
    type = "upload_url";
    sj = "/upload";
  } else if (type == "阿里OSS") {
    type = "upload_url";
    sj = "/oss";
  }

  axios
    .post("allocation/updAllocation", { name: type, content: sj })
    .then((response) => {
      let res = response.data;
      if (res.msg == "成功") {
        findYxsj();

        Notice.success({
          title: "修改成功",
        });
      } else {
        Notice.error({
          title: res.msg,
        });
      }
    })
    .catch();
}

//封面图上传前
function beforeUpload() {
  if (variable.pz_all.value.logo) {
    let arr = [variable.pz_all.value.logo];
    axios
      .post("oss/delFiles", arr)
      .then((response) => {})
      .catch();
  }
}

function beforeUploadTx() {
  if (variable.pz_all.value.bz_tx) {
    let arr = [variable.pz_all.value.bz_tx];
    axios
      .post("oss/delFiles", arr)
      .then((response) => {})
      .catch();
  }
}

//封面图上传成功函数
function uploadFmSuccess(response, file, fileList) {
  if (response.code == 200) {
    variable.pz_all.value.logo = response.data;
    Notice.success({
      title: "上传成功！",
    });
    axios
      .post("allocation/updAllocation", {
        name: "bloglog",
        content: response.data,
      })
      .then((response) => {})
      .catch();
  } else {
    Notice.warning({
      title: "上传失败",
      desc: response.msg,
    });
  }
}

//文章页头像上传成功函数
function uploadTxSuccess(response, file, fileList) {
  if (response.code == 200) {
    variable.pz_all.value.bz_tx = response.data;
    Notice.success({
      title: "上传成功！",
    });
    axios
      .post("allocation/updAllocation", {
        name: "bz_tx",
        content: response.data,
      })
      .then((response) => {})
      .catch();
  } else {
    Notice.warning({
      title: "上传失败",
      desc: response.msg,
    });
  }
}

//封面图上传失败函数
function uploadFmError(error, file, fileList) {
  Notice.error({
    title: "上传失败",
    desc: error,
  });
}
</script>


<style  scoped>
.main {
  width: 80%;
  min-height: 80vh;
  background-color: #fff;
  box-shadow: rgb(236, 236, 236) 0 0 1rem 0;
  margin-top: 20px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  /* justify-content: space-between; */
  flex-wrap: wrap;
}

label {
  font-size: 16px;
}

.itemDiv {
  border-bottom: 1px solid rgb(196, 196, 196);
  display: flex;
  align-items: center;
  height: 50px;
  padding: 50px 50px;
}
</style>
