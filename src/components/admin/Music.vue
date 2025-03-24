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
          @click="yyDrawerStzte = true"
          v-if="pathData.includes('Music:add')"
          >添加</Button
        >
      </div>

      <div>
        <Input
          search
          enter-button
          v-model="yyName"
          placeholder="输入音乐名称关键字..."
          @on-search="findMusic(1)"
        />
      </div>
    </div>

    <el-table
      :data="yyData.records"
      :style="{ maxWidth: tableWidth }"
      style="margin-bottom: 20px"
      row-key="id"
      border
      default-expand-all
    >
      <el-table-column prop="id" label="ID" width="100" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="singer" label="歌手" width="200" />
      <el-table-column prop="sorting" label="排序" width="200" />
      <el-table-column
        fixed="right"
        label="操作"
        width="200"
        v-if="pathData.includes('Music:edit') || pathData.includes('Music:del')"
      >
        <template #default="scope">
          <Button
            class="mRight-10"
            size="small"
            type="info"
            @click="yyEdit(scope.row.id)"
            v-if="pathData.includes('Music:edit')"
            >编辑</Button
          >

          <Poptip
            :transfer="true"
            confirm
            title="确认删除吗?"
            @on-ok="yyRemove(scope.row.id)"
            placement="bottom"
          >
            <Button
              type="error"
              size="small"
              v-if="pathData.includes('Music:del')"
              >删除</Button
            >
          </Poptip>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @current-change="ymChange(yyData.current)"
      v-model:current-page="yyData.current"
      background
      layout="prev, pager, next"
      :total="parseInt(yyData.total)"
    />
  </div>

  <!-- 抽屉 -->
  <Drawer
    v-if="yyData"
    title="编辑音乐"
    :mask-closable="false"
    v-model="yyDrawerStzte"
    :width="60"
    @on-close="clearChouti"
    :closable="false"
  >
    <span
      >使用酷我音乐下载音乐歌词：<a
        href="https://wwql.lanzout.com/io7vI29qizta"
        target="_blank"
        >下载</a
      ></span
    >
    <div style="display: flex; justify-content: space-between; margin: 20px 0">
      <div
        style="
          border: 1px dashed rgb(190, 190, 190);
          display: flex;
          align-items: center;
          justify-content: space-around;
          min-width: 300px;
        "
      >
        <div @click="play">
          <Icon :type="gqIco" size="40" />
          <video :src="chouti.url" ref="video" style="display: none"></video>
        </div>
        <Upload
          :action="urlPrefix + '/uploadMusic'"
          :show-upload-list="false"
          :on-success="uploadGqSuccess"
          :on-error="uploadError"
          :before-upload="gqscq"
        >
          <Button icon="ios-cloud-upload-outline">上传歌曲</Button>
        </Upload>
      </div>
      <div
        style="
          border: 1px dashed rgb(190, 190, 190);
          display: flex;
          align-items: center;
          justify-content: space-around;
          min-width: 400px;
        "
      >
        <Image width="100px" height="100px" :src="chouti.album">
          <template #error>
            <Icon type="ios-image-outline" size="24" color="#ccc" />
          </template>
        </Image>
        <Upload
          :action="variable.pz_all.value.upload_url + '/uploadImg'"
          :show-upload-list="false"
          :on-success="uploadZjSuccess"
          :on-error="uploadError"
          :before-upload="zjBeforeUpload"
        >
          <Button icon="ios-cloud-upload-outline">上传专辑图</Button>
        </Upload>
      </div>
      <div
        style="
          border: 1px dashed rgb(190, 190, 190);
          display: flex;
          align-items: center;
          justify-content: space-around;
          min-width: 200px;
        "
      >
        <Upload
          :action="urlPrefix + '/uploadLyric'"
          :show-upload-list="false"
          :on-success="uploadGcSuccess"
          :on-error="uploadError"
        >
          <Button icon="ios-cloud-upload-outline">上传歌词</Button>
        </Upload>
      </div>
    </div>
    <Input v-model="chouti.name" size="large" placeholder="歌曲名称" />
    <Input
      v-model="chouti.singer"
      size="large"
      placeholder="歌手名称"
      style="margin: 20px 0"
    />
    <div>
      <span style="padding-right: 30px">排序：</span>
      <InputNumber v-model="chouti.sorting" controls-outside :min="0" />
    </div>
    <div
      class="gcdiv"
      v-if="chouti.lyric"
      v-html="formatLyric(chouti.lyric)"
    ></div>
    <div style="position: absolute; bottom: 30px; right: 50px">
      <Button type="primary" style="width: 100px" size="large" @click="yyTj"
        >提交</Button
      >
      <Button style="margin-left: 20px" size="large" @click="gbct">取消</Button>
    </div>
  </Drawer>
</template>
<script setup>
const axios = inject("axios");
const urlPrefix = inject("prefix") + "/upload"; //地址前缀
import variable from "../../js/variable";
import { Notice, Spin } from "view-ui-plus";
import { eventBus } from "../../js/eventBus.js";

const tableWidth = inject("tableWidth"); //表格宽度
const pathData = inject("pathData"); //拥有的按钮

//歌曲上传前
function gqscq() {
  Spin.show();
}

//刷新
const refresh = () => {
  //先重置搜索框数据
  yyName.value = "";
  //调用查询
  findMusic(1);
};

//页码改变
function ymChange(pageNum) {
  findMusic(pageNum);
}

const yyDrawerStzte = ref(false); //抽屉状态
const yyName = ref(""); //搜索框音乐名称
const yyData = ref({
  //音乐列表数据
  records: [],
  total: 0,
  current: 1,
  pages: 0,
});
const chouti = ref({
  //抽屉内数据
  id: 0,
  name: "",
  singer: "",
  sorting: 0,
  album: "",
  url: "",
  lyric: "",
});

// 监听 歌曲是否上传
const gqIco = ref("ios-headset-outline");
watchEffect(() => {
  const url = chouti.value.url;
  if (url.length > 1) {
    gqIco.value = "md-arrow-dropright-circle";
  } else {
    gqIco.value = "ios-headset-outline";
  }
});

onMounted(() => {
  // 调用查询音乐列表
  findMusic(1);
  //调用查询图片上传前缀，确保地址没问题
  eventBus.emit("getImgUploadPrefix");
});

//音乐播放、暂停
const video = ref(null);
function play() {
  if (gqIco.value == "md-arrow-dropright-circle") {
    gqIco.value = "ios-pause";
    video.value.play(); //播放
  } else if (gqIco.value == "ios-pause") {
    gqIco.value = "md-arrow-dropright-circle";
    video.value.pause(); //暂停
  }
}

// 查询音乐列表函数
function findMusic(pageNum) {
  axios
    .post("music/findMusic", { pageNum: pageNum, name: yyName.value })
    .then((response) => {
      let res = response.data;
      if (res.msg == "成功") {
        yyData.value.records = res.data.records;
        yyData.value.total = res.data.total;
        yyData.value.current = res.data.current;
        yyData.value.pages = res.data.pages;
      }
    })
    .catch();
}

//专辑上传前
function zjBeforeUpload() {
  if (chouti.value.album) {
    let arr = [chouti.value.album];
    axios
      .post("oss/delFiles", arr)
      .then((response) => {})
      .catch();
  }
}

//歌曲上传成功函数
function uploadGqSuccess(response, file) {
  if (response.code == 200) {
    chouti.value.url = response.data;
    Notice.success({
      title: "上传成功，可点击试听",
      desc: response.msg,
    });

    const regex = /^([^-]+)-([^\.]+)\..+$/;
    const match = file.name.match(regex);
    if (match && match.length >= 3) {
      chouti.value.name = match[2];
      chouti.value.singer = match[1];
    } else if (match && match.length >= 2) {
      chouti.value.singer = match[1];
    }
  } else {
    Notice.warning({
      title: "上传失败",
      desc: response.msg,
    });
  }
  Spin.hide();
}

//专辑上传成功函数
function uploadZjSuccess(response) {
  if (response.code == 200) {
    chouti.value.album = response.data;
  } else {
    Notice.warning({
      title: "上传失败",
      desc: response.msg,
    });
  }
}

//歌词上传成功函数
function uploadGcSuccess(response) {
  if (response.code == 200) {
    chouti.value.lyric = response.data;
    Notice.success({
      title: "上传成功",
      desc: response.msg,
    });
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
  Spin.hide();
}

//编辑音乐按钮
function yyEdit(id) {
  axios
    .post("music/findMusic", { id: id })
    .then((response) => {
      let res = response.data;
      if (res.msg == "成功") {
        yyDrawerStzte.value = true; //打开抽屉
        chouti.value = res.data.records[0];
      } else {
        Notice.error({
          title: res.msg,
        });
      }
    })
    .catch();
}

//删除音乐
function yyRemove(id) {
  axios
    .post("music/delMusic", { id: id })
    .then((response) => {
      let res = response.data;
      if (res.msg == "成功") {
        findMusic(yyData.value.current);
        Notice.success({
          title: "删除成功",
        });
      }
    })
    .catch();
}

//编辑音乐中提交按钮
function yyTj() {
  if (chouti.value.id == 0) {
    //新增
    axios
      .post("music/addMusic", chouti.value)
      .then((response) => {
        let res = response.data;
        if (res.msg == "成功") {
          Notice.success({
            title: "新增成功！",
          });
          yyDrawerStzte.value = false; //关闭抽屉
          findMusic(yyData.value.current); // 调用查询文章列表
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
      .post("music/updMusic", chouti.value)
      .then((response) => {
        let res = response.data;
        if (res.msg == "成功") {
          Notice.success({
            title: "修改成功！",
          });
          yyDrawerStzte.value = false; //关闭抽屉
          findMusic(yyData.value.current); // 调用查询文章列表
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
  yyDrawerStzte.value = false; //关闭抽屉

  //如果是新增状态取消，删除已上传的文件
  if (chouti.value.id == 0) {
    gqBeforeUpload();
    zjBeforeUpload();
  }

  clearChouti();
}

//清空抽屉内数据
function clearChouti() {
  chouti.value.id = 0;
  chouti.value.name = "";
  chouti.value.singer = "";
  chouti.value.sorting = 0;
  chouti.value.album = "";
  chouti.value.url = "";
  chouti.value.lyric = "";
}

//拖动修改排序
function ondragdrop(index1, index2) {
  // 根据索引找到对应的数据
  const id1 = yyData.value.records[index1].id;
  const sort1 = yyData.value.records[index1].sorting;

  const id2 = yyData.value.records[index2].id;
  const sort2 = yyData.value.records[index2].sorting;

  const song1 = id1 + "-" + sort1;
  const song2 = id2 + "-" + sort2;

  axios
    .post("music/updMusicSort", { song1: song1, song2: song2 })
    .then((response) => {
      let res = response.data;
      if (res.msg == "成功") {
        findMusic(yyData.value.current); // 调用查询列表
      } else {
        Notice.error({
          title: res.msg,
        });
      }
    })
    .catch();
}

//分割歌词
function formatLyric(lyric) {
  // 使用 split 方法将字符串以 "-" 分割为数组
  const lyricArray = lyric.split("♡");
  // 使用 join 方法将数组转换回字符串，用换行符分隔
  return lyricArray.join("<br/>");
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

.gcdiv {
  margin-top: 30px;
  padding: 0 30px;
  height: 400px;
  overflow: hidden;
  overflow: auto;
  background-color: #eeeeee;
}
</style>