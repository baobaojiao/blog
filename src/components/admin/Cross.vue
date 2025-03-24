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
                        v-if="pathData.includes('Cross:add')"
                >添加</Button
                >
            </div>

            <div>
                <!-- <Input
                  search
                  enter-button
                  v-model="wzTitle"
                  placeholder="输入标题关键字"
                  @on-search="findArticle(1)"
                /> -->
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
            <el-table-column
                    prop="content"
                    label="内容"
                    :show-overflow-tooltip="true"
            />
            <el-table-column label="是否加密" width="150">
                <template #default="scope">
                    <Switch
                            v-if="scope.row.state == true"
                            :model-value="true"
                            @on-change="jmkgOnchange(scope.row)"
                    />
                    <Switch
                            v-else
                            :model-value="false"
                            @on-change="jmkgOnchange(scope.row)"
                    />
                </template>
            </el-table-column>
            <el-table-column prop="stick" label="点赞" width="100" />
            <el-table-column prop="createTime" label="创建时间" width="200" />
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="200"
                    v-if="pathData.includes('Cross:edit') || pathData.includes('Cross:del')"
            >
                <template #default="scope">
                    <Button
                            class="mRight-10"
                            size="small"
                            type="info"
                            @click="editAn(scope.row.id)"
                            v-if="pathData.includes('Cross:edit')"
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
                                v-if="pathData.includes('Cross:del')"
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
            title="编辑说说"
            :mask-closable="false"
            v-model="DrawerStzte"
            :width="100"
            @on-close="clearChouti"
            :closable="false"
    >
        <div style="border: 1px solid #ccc; margin: 20px 0; z-index: 99">
            <MdEditor
                    v-model="chouti.content"
                    :toolbars="toolbars"
                    @onUploadImg="onUploadImg"
            >
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
                                <Icon type="ios-link" size="18" />
                            </div>
                        </template>
                    </NormalToolbar>
                </template>
            </MdEditor>
        </div>

        <div>
            <label>是否私密说说：</label>
            <Switch size="large" v-model="chouti.state">
                <template #open>
                    <span>是的</span>
                </template>
                <template #close>
                    <span>不是</span>
                </template>
            </Switch>
        </div>
        <div style="display: flex; justify-content: flex-end">
            <Button type="primary" style="width: 100px" size="large" @click="TiJiao"
            >提交</Button
            >
            <Button style="margin-left: 20px" size="large" @click="gbct">取消</Button>
        </div>
    </Drawer>

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
import { Emoji } from "@vavt/v3-extension";
import "md-editor-v3/lib/style.css";
import { toolbars } from "../../js/toolbars";
import { eventBus } from "../../js/eventBus.js";

const tableWidth = inject("tableWidth"); //表格宽度
const pathData = inject("pathData"); //拥有的按钮

const imageList1 = ref([]); //已上传的所有文件

//刷新
const refresh = () => {
    //调用查询
    findMoments(1);
};

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

//插入图片标签
const insertImg = () => {
    chouti.value.content += `<img src="" width="300" >`;
};

//插入超链接
const insertUrl = () => {
    chouti.value.content += `<a href="" target="_blank"></a>;`;
};

const DrawerStzte = ref(false); //抽屉状态

//列表数据
const tableData = ref({
    records: [],
    total: 0,
    current: 1,
    pages: 0,
});

//抽屉内数据
const chouti = ref({
    id: 0,
    content: "",
    state: false,
});
provide("chouti", chouti);

//修改说说加密
function jmkgOnchange(data) {
    chouti.value.id = data.id;
    chouti.value.content = data.content;
    chouti.value.state = !data.state;

    axios
        .post("moments/updMoments", chouti.value)
        .then((response) => {
            let res = response.data;
            if (res.msg == "成功") {
                ElMessage({
                    grouping: true,
                    message: "修改成功！",
                    type: "success",
                });
                clearChouti(); //清空抽屉数据
                findMoments(tableData.value.current); // 调用查询文章列表
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
    chouti.value.content = "";

    imageList1.value = [];
}

onMounted(() => {
    // 调用查询列表
    findMoments(1);

    //调用查询图片上传前缀，确保地址没问题
    eventBus.emit("getImgUploadPrefix");
});

//查询所有说说
const findMoments = (pageNum) => {
    axios
        .post("moments/findMoments", { pageNum: pageNum })
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
};

//页码改变
function ymChange(pageNum) {
    findMoments(pageNum);
}

//编辑按钮
function editAn(id) {
    axios
        .post("moments/findMoments", { id: id })
        .then((response) => {
            let res = response.data;
            if (res.msg == "成功") {
                DrawerStzte.value = true; //打开抽屉
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

//删除按钮
function removeAn(id) {
    axios
        .post("moments/delMoments", { id: id })
        .then((response) => {
            let res = response.data;
            if (res.msg == "成功") {
                findMoments(tableData.value.current);

                ElMessage({
                    grouping: true,
                    message: "删除成功",
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
}

//编辑中提交按钮
function TiJiao() {
    if (chouti.value.id == 0) {
        //新增
        axios
            .post("moments/addMoments", chouti.value)
            .then((response) => {
                let res = response.data;
                if (res.msg == "成功") {
                    ElMessage({
                        grouping: true,
                        message: "新增成功！",
                        type: "success",
                    });
                    DrawerStzte.value = false; //关闭抽屉
                    findMoments(tableData.value.current); // 调用查询文章列表
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
            .post("moments/updMoments", chouti.value)
            .then((response) => {
                let res = response.data;
                if (res.msg == "成功") {
                    ElMessage({
                        grouping: true,
                        message: "修改成功！",
                        type: "success",
                    });
                    DrawerStzte.value = false; //关闭抽屉
                    findMoments(tableData.value.current); // 调用查询文章列表
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

//取消
function gbct() {
    DrawerStzte.value = false; //关闭抽屉

    //删除已上传的文件
    axios
        .post("oss/delFiles", imageList1.value)
        .then((response) => {})
        .catch();

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
