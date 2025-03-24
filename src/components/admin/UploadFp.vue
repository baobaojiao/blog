<template>
  <div class="container">
    <el-upload
      drag
      :auto-upload="false"
      :on-change="handleChange"
      accept="video/*"
      :limit="1"
      :on-exceed="onExceed"
    >
      <div style="width: 200px">（拖拽）选择视频</div>

      <div class="el-upload__tip">
        <el-progress
          :style="{ width: percentage + '%' }"
          :text-inside="true"
          :stroke-width="24"
          :percentage="percentage"
          :status="uploadStatus"
        ></el-progress>
      </div>
    </el-upload>
    <Button :loading="loadingState" type="primary" @click="submitUpload"
      >上传到服务器</Button
    >
  </div>
</template>
  
<script setup>
const axios = inject("axios");
import SparkMD5 from "spark-md5";

const uploadFileState = inject("uploadFileState"); //上传视频对话框状态
const chouti = inject("chouti"); //抽屉内数据
const fileList = ref([]);
const CHUNK_SIZE = 1024 * 1024 * 5; // 100MB
const percentage = ref(0);
const chunkNo = ref(0);
const uploadStatus = ref("");

const fileHash = async (file) => {
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  const spark = new SparkMD5();
  for (let i = 0; i < totalChunks; i++) {
    await new Promise((resolve) => {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const bytes = e.target.result;
        spark.append(bytes);
        resolve();
      };
      fileReader.readAsArrayBuffer(chunk);
    });
  }
  return spark.end();
};

const loadingState = ref(false); //上传按钮加载状态

const submitUpload = async () => {
  loadingState.value = true;

  const fileValue = fileList.value[0].raw;

  const md5 = await fileHash(fileValue);
  const totalChunks = Math.ceil(fileValue.size / CHUNK_SIZE);

  let startIndex = 0;
  const response = await axios.get("/upload/checkMD5?md5=" + md5);
  let res = response.data;
  if (res.code === 200) {
    //之前上传过该文件，直接返回
    if (res.data.count == totalChunks) {
      percentage.value = 100;

      chouti.value.content +=
        `<video src="` +
        res.data.path +
        `" controls="controls" width="500"  height="300"></video>`;
      gbdhk();
      return;
    }
    startIndex = res.data.count;
    percentage.value = Math.ceil((startIndex / totalChunks) * 100);
  } else {
    ElMessage({
      grouping: true,
      message: "校验文件md5值出错，请重试！",
      type: "error",
    });
    gbdhk();
    return;
  }

  uploadStatus.value = "success";
  for (let i = startIndex; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, fileValue.size);
    const chunk = fileValue.slice(start, end);
    const formData = new FormData();
    formData.append("file", chunk);
    formData.append("fileName", fileValue.name);
    formData.append("md5", md5);
    formData.append("index", i);
    try {
      // 分片上传
      const res = await axios.post("/upload/bigFileUpload", formData);
      if (res.data.code === 200) {
        percentage.value = Math.ceil(((i + 1) / totalChunks) * 100);
        chunkNo.value = i + 1;
      } else {
        ElMessage({
          grouping: true,
          message: "上传失败",
          type: "error",
        });
        uploadStatus.value = "exception";

        gbdhk();
        return;
      }
    } catch (err) {
      ElMessage({
        grouping: true,
        message: "上传失败",
        type: "error",
      });
      uploadStatus.value = "exception";

      gbdhk();
      return;
    }
  }

  //   开始合并文件
  await axios
    .get("/upload/merge?fileName=" + fileValue.name + "&md5=" + md5)
    .then((response) => {
      if (response.data.code == 200) {
        ElMessage({
          grouping: true,
          message: "文件上传成功！",
          type: "success",
        });

        chouti.value.content +=
          `<video src="` +
          response.data.data +
          `" controls="controls" width="500"  height="300"></video>`;

        gbdhk();
      } else {
        ElMessage({
          grouping: true,
          message: response.data.msg,
          type: "error",
        });
        gbdhk();
      }
    })
    .catch();
};

function handleChange(file, fileL) {
  fileList.value = fileL;
}

//当超出文件上传数量限制时，执行的钩子函数
function onExceed() {
  ElMessage({
    grouping: true,
    message: "单次只能上传一个文件，请先移除已选择的文件",
    type: "warning",
  });
}

//关闭对话框
function gbdhk() {
  loadingState.value = false;
  uploadFileState.value = false;
}
</script>
  
<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>