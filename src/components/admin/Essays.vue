<template>
    <div class="main">
        <div class="mBottom-20 main_top">
            <div>
                <Button style="width: 45px; background-color: #40485b; color: #fff" class="mRight-10" @click="refresh"
                    icon="md-refresh">
                </Button>

                <Button type="primary" @click="wzDrawerStzte = true" v-if="pathData.includes('User:add')">添加</Button>
            </div>

            <div>
                <Input search enter-button v-model="wzTitle" placeholder="输入标题关键字" @on-search="findArticle(1)" />
            </div>
        </div>

        <el-table :data="articleData.records" :style="{ maxWidth: tableWidth }" style="margin-bottom: 20px" row-key="id"
            border default-expand-all>
            <el-table-column prop="id" label="ID" width="100" />
            <el-table-column prop="title" label="标题" />

            <el-table-column label="是否置顶" width="150">
                <template #default="scope">
                    <Switch v-if="scope.row.stick == true" :model-value="true" @on-change="zdkgOnchange(scope.row)" />
                    <Switch v-else :model-value="false" @on-change="zdkgOnchange(scope.row)" />
                </template>
            </el-table-column>

            <el-table-column label="是否加密" width="150">
                <template #default="scope">
                    <Switch v-if="scope.row.encryption == true" :model-value="true"
                        @on-change="jmkgOnchange(scope.row)" />
                    <Switch v-else :model-value="false" @on-change="jmkgOnchange(scope.row)" />
                </template>
            </el-table-column>

            <el-table-column prop="creationTime" label="创建时间" width="200" />
            <el-table-column prop="updateTime" label="更新时间" width="200" />
            <el-table-column label="排序" width="80">
                <template #default="scope">
                    <Input v-model="scope.row.sort" :border="false" @on-enter="setSort(scope.row)"
                        @on-blur="setSort(scope.row)" />
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="300"
                v-if="pathData.includes('User:edit') || pathData.includes('User:del')">
                <template #default="scope">
                    <Button class="mRight-10" size="small" type="info" @click="wzEdit(scope.row.id)"
                        v-if="pathData.includes('User:edit')">编辑</Button>

                    <Button class="mRight-10" size="small" type="warning" @click="openPwd(scope.row.id)"
                        v-if="pathData.includes('User:edit')">设置访问密码</Button>

                    <Poptip :transfer="true" confirm title="确认删除吗?" @on-ok="wzRemove(scope.row.id)" placement="bottom">
                        <Button type="error" size="small" v-if="pathData.includes('User:del')">删除</Button>
                    </Poptip>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination @current-change="ymChange(articleData.current)" v-model:current-page="articleData.current"
            background layout="prev, pager, next" :total="parseInt(articleData.total)" />
    </div>

    <!-- 抽屉 -->
    <Drawer title="编写文章" :mask-closable="false" v-model="wzDrawerStzte" :width="100" @on-close="clearChouti"
        :closable="false">
        <Input v-model="chouti.title" size="large" placeholder="文章标题" />

        <div style="margin: 20px 0; z-index: 99; border: 1px solid #ccc">
            <MdEditor v-model="chouti.content" :toolbars="toolbars" @onUploadImg="onUploadImg"
                previewTheme="smart-blue">
                <template #defToolbars>
                    <Emoji />
                    <NormalToolbar title="上传视频">
                        <template #trigger>
                            <div style="height: 20px" @click="uploadFileState = true">
                                <Icon type="logo-youtube" size="20" />
                            </div>
                        </template>
                    </NormalToolbar>
                    <NormalToolbar title="插入图片标签">
                        <template #trigger>
                            <div style="height: 20px" @click="insertImg">
                                <Icon type="md-image" size="20" />
                            </div>
                        </template>
                    </NormalToolbar>
                    <NormalToolbar title="插入超链接">
                        <template #trigger>
                            <div style="height: 20px" @click="insertUrl">
                                <Icon type="ios-link" size="20" />
                            </div>
                        </template>
                    </NormalToolbar>
                </template>
            </MdEditor>
        </div>

        <div style="display: flex">
            <div class="xsimg" :style="{ display: xsimgDisplay }">
                <Image :src="chouti.img" fit="cover" width="100%" height="100%" />
                <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click="handleView()"></Icon>
                    <Icon type="ios-trash-outline" @click="handleRemove()"></Icon>
                </div>
                <ImagePreview v-model="visible" :preview-list="[chouti.img]" />
            </div>
            <div style="flex: 4; margin-left: 10px">

                <Upload type="drag" :show-upload-list="false" :action="variable.pz_all.value.upload_url + '/uploadImg'"
                    :on-success="uploadFmSuccess" :on-error="uploadFmError" :before-upload="beforeUpload">
                    <div style="padding: 20px 0">
                        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                        <p>上传封面图 <a @click.stop="suijiFm"> 随即一张</a></p>
                    </div>
                </Upload>
                
            </div>
        </div>

        <div class="wzxzDiv">
            <div>
                <label>文章类型：</label>
                <Select v-model="chouti.type" style="width: 200px" filterable allow-create @on-create="wzLxOnCsreate">
                    <Option v-for="item in ArticleTypes" :value="item">{{ item }}</Option>
                </Select>
            </div>

            <div>
                <label>是否可以转发：</label>
                <Switch size="large" v-model="chouti.retransmission">
                    <template #open>
                        <span>允许</span>
                    </template>
                    <template #close>
                        <span>禁止</span>
                    </template>
                </Switch>
            </div>

            <div>
                <label>是否置顶：</label>
                <Switch size="large" v-model="chouti.stick">
                    <template #open>
                        <span>是</span>
                    </template>
                    <template #close>
                        <span>不</span>
                    </template>
                </Switch>
            </div>

            <div>
                <label>是否加密：</label>
                <Switch size="large" v-model="chouti.encryption">
                    <template #open>
                        <span>是</span>
                    </template>
                    <template #close>
                        <span>不</span>
                    </template>
                </Switch>
            </div>
        </div>

        <div style="display: flex; justify-content: flex-end">
            <Button type="primary" style="width: 100px" size="large" @click="wzTj">提交</Button>
            <Button style="margin-left: 20px" size="large" @click="gbct">取消</Button>
        </div>
    </Drawer>

    <!-- 修改密码对话框 -->
    <Modal v-model="wzPwd.wzPwdState" title="修改文章访问密码" @on-ok="setPwdQr">
        <Input v-model="wzPwd.pwd" placeholder="请输入文章访问密码" />
    </Modal>

    <!-- 上传视频对话框 -->
    <Modal v-model="uploadFileState" title="上传视频" footer-hide>
        <uploadFp />
    </Modal>
</template>
<script setup>
import uploadFp from "./UploadFp.vue";
const uploadFileState = inject("uploadFileState"); //上传视频对话框状态

const axios = inject("axios");
import variable from "../../js/variable";
import { MdEditor, NormalToolbar } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { toolbars } from "../../js/toolbars";
import { Emoji } from "@vavt/v3-extension";
import "@vavt/v3-extension/lib/asset/style.css";
import { eventBus } from "../../js/eventBus.js";

const tableWidth = inject("tableWidth"); //表格宽度
const pathData = inject("pathData"); //拥有的按钮

const wzDrawerStzte = ref(false); //抽屉状态
//抽屉内数据
const chouti = ref({
    id: 0,
    title: "",
    img: "",
    type: "",
    content: "",
    retransmission: false,
    stick: false,
    encryption: false,
});
provide("chouti", chouti);

const imageList1 = ref([]); //已上传的所有文件

//插入图片标签
const insertImg = () => {
    chouti.value.content += `<img src="" width="300" >`;
};

//插入超链接
const insertUrl = () => {
    chouti.value.content += `<a href="" target="_blank"></a>;`;
};

//修改文章访问密码数据
const wzPwd = ref({
    id: null,
    pwd: null,
    wzPwdState: false,
});
//打开文章密码修改对话框
function openPwd(id) {
    wzPwd.value.wzPwdState = true;
    wzPwd.value.id = id;
}

//修改文章访问密码确认按钮
function setPwdQr() {
    axios
        .post("article/setPwd", wzPwd.value)
        .then((response) => {
            let res = response.data;
            if (res.msg == "成功") {
                ElMessage({
                    grouping: true,
                    message: "设置成功！",
                    type: "success",
                });
            } else {
                ElMessage({
                    grouping: true,
                    message: res.msg,
                    type: "error",
                });
            }
        })
        .catch();

    wzPwd.value.id = null;
    wzPwd.value.pwd = null;
}

//修改文章加密状态
function jmkgOnchange(data) {
    chouti.value.id = data.id;
    chouti.value.title = data.title;
    chouti.value.img = data.img;
    chouti.value.type = data.type;
    chouti.value.content = data.content;
    chouti.value.retransmission = data.retransmission;
    chouti.value.stick = data.stick;
    chouti.value.encryption = !data.encryption;

    axios
        .post("article/updArticle", chouti.value)
        .then((response) => {
            let res = response.data;
            if (res.msg == "成功") {
                ElMessage({
                    grouping: true,
                    message: "修改成功！",
                    type: "success",
                });
                clearChouti(); //清空抽屉数据
                findArticle(articleData.value.current); // 调用查询文章列表
            } else {
                ElMessage({
                    grouping: true,
                    message: res.msg,
                    type: "error",
                });
            }
        })
        .catch();
}

//修改文章置顶
function zdkgOnchange(data) {
    chouti.value.id = data.id;
    chouti.value.title = data.title;
    chouti.value.img = data.img;
    chouti.value.type = data.type;
    chouti.value.content = data.content;
    chouti.value.retransmission = data.retransmission;
    chouti.value.stick = !data.stick;
    chouti.value.encryption = data.encryption;

    axios
        .post("article/updArticle", chouti.value)
        .then((response) => {
            let res = response.data;
            if (res.msg == "成功") {
                ElMessage({
                    grouping: true,
                    message: "修改成功！",
                    type: "success",
                });
                clearChouti(); //清空抽屉数据
                findArticle(articleData.value.current); // 调用查询文章列表
            } else {
                ElMessage({
                    grouping: true,
                    message: res.msg,
                    type: "error",
                });
            }
        })
        .catch();
}



//修改文章排序
function setSort(data) {
    data.sort = Number(data.sort);

    axios
        .post("article/updArticle", data)
        .then((response) => {
            let res = response.data;
            if (res.msg == "成功") {
                ElMessage({
                    grouping: true,
                    message: "修改成功！",
                    type: "success",
                });
                findArticle(articleData.value.current); // 调用查询文章列表
            } else {
                ElMessage({
                    grouping: true,
                    message: res.msg,
                    type: "error",
                });
            }
        })
        .catch();
}

//清空抽屉内数据
function clearChouti() {
    chouti.value.id = 0;
    chouti.value.title = "";
    chouti.value.img = "";
    chouti.value.type = "";
    chouti.value.content = "";
    chouti.value.retransmission = false;
    chouti.value.stick = false;
    chouti.value.encryption = false;

    imageList1.value = [];
}

//随机一张封面图
const suijiFm = () => {
    axios
        .get("other/sjImg")
        .then((response) => {
            const data = response.data;
            if (data.code == 200) {
                chouti.value.img = response.data.imgurl;
            } else {
                ElMessage({
                    grouping: true,
                    message: "获取失败",
                    type: "warning",
                });
            }
        })
        .catch();
};

const xsimgDisplay = ref("flex");
// 监听 封面图 的变化
watchEffect(() => {
    const img = chouti.value.img;
    if (img.length > 1) {
        xsimgDisplay.value = "flex";
    } else {
        xsimgDisplay.value = "none";
    }
});

//封面图上传前
function beforeUpload() {
    let arr = [chouti.value.img];
    axios
        .post("oss/delFiles", arr)
        .then((response) => { })
        .catch();
}

//封面图上传成功函数
function uploadFmSuccess(response, file, fileList) {
    if (response.code == 200) {
        chouti.value.img = response.data;
    } else {
        ElMessage({
            grouping: true,
            message: "上传失败：" + response.msg,
            type: "warning",
        });
    }
}

//封面图上传失败函数
function uploadFmError(error, file, fileList) {
    ElMessage({
        grouping: true,
        message: "上传失败：" + error,
        type: "error",
    });
}

const visible = ref(false);
//封面预览
function handleView() {
    visible.value = true;
}

//删除封面图
function handleRemove() {
    let arr = [chouti.value.img];
    axios
        .post("oss/delFiles", arr)
        .then((response) => { })
        .catch();

    chouti.value.img = "";
}

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
                            ElMessage({
                                grouping: true,
                                message: "上传失败：" + error,
                                type: "error",
                            });
                        }
                    })
                    .catch((error) => rej(error));
            });
        })
    );

    callback(res);
};

//查询所有文章分类
const ArticleTypes = ref(null);
function findArticleType() {
    axios
        .get("article/findArticleType")
        .then((response) => {
            let res = response.data;
            if (res.msg == "成功") {
                ArticleTypes.value = res.data;
            }
        })
        .catch();
}

//列表数据
const articleData = ref({
    records: [],
    total: 0,
    current: 1,
    pages: 0,
});

//页码改变
function ymChange(pageNum) {
    findArticle(pageNum);
}

onMounted(() => {
    // 调用查询文章列表
    findArticle(1);

    findArticleType();
    //调用查询图片上传前缀，确保地址没问题
    eventBus.emit("getImgUploadPrefix");
});

const wzTitle = ref(null); //搜索框文章标题
// 查询文章列表函数
function findArticle(pageNum) {
    axios
        .post("article/findArticle", {
            pageNum: pageNum,
            title: wzTitle.value,
        })
        .then((response) => {
            let res = response.data;
            if (res.msg == "成功") {
                articleData.value.records = res.data.records;
                articleData.value.total = res.data.total;
                articleData.value.current = res.data.current;
                articleData.value.pages = res.data.pages;
            }
        })
        .catch();
}

const refresh = () => {
    //先重置搜索框数据
    wzTitle.value = "";
    //调用查询
    findArticle(1);
};

//编辑文章按钮
function wzEdit(id) {
    axios
        .post("article/findArticle", { id: id })
        .then((response) => {
            let res = response.data;
            if (res.msg == "成功") {
                wzDrawerStzte.value = true; //打开抽屉
                chouti.value = res.data.records[0];
            } else {
                ElMessage({
                    grouping: true,
                    message: res.msg,
                    type: "error",
                });
            }
        })
        .catch();
}

//删除文章
function wzRemove(id) {
    axios
        .post("article/delArticle", { id: id })
        .then((response) => {
            let res = response.data;
            if (res.msg == "成功") {
                findArticle(articleData.value.current);
                ElMessage({
                    grouping: true,
                    message: "删除成功",
                    type: "success",
                });
                return;
            }
        })
        .catch();
}

//文章分类选择框回车事件
function wzLxOnCsreate(val) {
    ArticleTypes.value.push(val);
}

//抽屉中提交按钮
function wzTj() {
    if (chouti.value.id == 0) {
        //新增
        axios
            .post("article/addArticle", chouti.value)
            .then((response) => {
                let res = response.data;
                if (res.msg == "成功") {
                    ElMessage({
                        grouping: true,
                        message: "新增成功！",
                        type: "success",
                    });
                    wzDrawerStzte.value = false; //关闭抽屉
                    findArticle(articleData.value.current); // 调用查询文章列表
                    clearChouti(); //清空抽屉数据
                } else {
                    ElMessage({
                        grouping: true,
                        message: res.msg,
                        type: "error",
                    });
                }
            })
            .catch();
    } else {
        //修改
        axios
            .post("article/updArticle", chouti.value)
            .then((response) => {
                let res = response.data;
                if (res.msg == "成功") {
                    ElMessage({
                        grouping: true,
                        message: "修改成功！",
                        type: "success",
                    });
                    wzDrawerStzte.value = false; //关闭抽屉
                    findArticle(articleData.value.current); // 调用查询文章列表
                    clearChouti(); //清空抽屉数据
                } else {
                    ElMessage({
                        grouping: true,
                        message: res.msg,
                        type: "error",
                    });
                }
            })
            .catch();
    }
}

//抽屉取消按钮
function gbct() {
    wzDrawerStzte.value = false; //关闭抽屉
    //删除已上传的文件
    if (chouti.value.id == 0) {
        axios
            .post("oss/delFiles", imageList1.value)
            .then((response) => { })
            .catch();
    }
    clearChouti();
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

.wzxzDiv {
    margin: 20px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 50%;
}

.xsimg {
    flex: 1;
    border: 1px dashed rgb(214, 214, 214);
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 113px;
    border-radius: 5px;
    position: relative;
}

.xsimg:hover {
    border: rgb(207, 141, 41) 1px dashed;
}

.demo-upload-list-cover {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
}

.xsimg:hover .demo-upload-list-cover {
    opacity: 1;
}

.demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
}
</style>
