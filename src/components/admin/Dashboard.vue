<template>
    <div id="main">
        <div id="main_div1">
            <div style="padding: 10px"><b>总览</b></div>
            <div id="zl" v-if="zlData">
                <div style="background: linear-gradient(#f2f9fe, #e6f4fe)">
                    <span class="zl_span1">文章</span>
                    <span class="zl_span2">{{ zlData.articlesCount }}</span>
                </div>
                <div style="background: linear-gradient(#f5fef2, #e6feee)">
                    <span class="zl_span1">说说</span>
                    <span class="zl_span2">{{ zlData.momentsCount }}</span>
                </div>
                <div style="background: linear-gradient(#f7f7ff, #ececff)">
                    <span class="zl_span1">评论</span>
                    <span class="zl_span2">{{ zlData.commentCount }}</span>
                </div>
                <div
                        style="background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
                >
                    <span class="zl_span1">友联</span>
                    <span class="zl_span2">{{ zlData.linksCount }}</span>
                </div>
                <div
                        style="background: linear-gradient(to top, #a8edea 0%, #fed6e3 100%)"
                >
                    <span class="zl_span1">音乐</span>
                    <span class="zl_span2">{{ zlData.musicCount }}</span>
                </div>
                <div
                        style="background: linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%)"
                >
                    <span class="zl_span1">打赏</span>
                    <span class="zl_span2">{{ zlData.begCount }}</span>
                </div>
                <div
                        style="background: linear-gradient(-20deg, #e9defa 0%, #fbfcdb 100%)"
                >
                    <span class="zl_span1">树洞</span>
                    <span class="zl_span2">{{ zlData.treeHoleCount }}</span>
                </div>
                <div
                        style="background: linear-gradient(to top, #fff1eb 0%, #ace0f9 100%)"
                >
                    <span class="zl_span1">总访客</span>
                    <span class="zl_span2">{{ zlData.totalCount }}</span>
                </div>
            </div>
        </div>
        <div id="main_div2">
            <div id="fkl"></div>
            <div id="wzDiv">
                <div id="wzDiv_1"></div>
                <div id="wzDiv_2">
                    <p class="rmwzTitle">热门文章</p>
                    <el-table :data="rmData">
                        <el-table-column type="index" label="排序" width="60" />
                        <el-table-column prop="title" label="文章标题" width="350" />
                        <el-table-column
                                prop="see"
                                fixed="right"
                                label="查看量"
                                min-width="120"
                        >
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import * as echarts from "echarts";
const axios = inject("axios");

const zlData = ref(null);

//本周访客折线图数据
var bzfkOption = {
    title: {
        text: "本周访客",
    },
    tooltip: {
        trigger: "axis",
        axisPointer: {
            type: "cross",
            label: {
                backgroundColor: "#6a7985",
            },
        },
    },
    xAxis: {
        type: "category",
        data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    },
    yAxis: {
        type: "value",
    },
    series: [
        {
            data: [],
            type: "line",
            smooth: true,
            areaStyle: {},
        },
    ],
};

//文章占比
var wzOption = {
    title: {
        text: "栏目文章占比",
    },
    tooltip: {
        trigger: "item",
    },
    series: [
        {
            type: "pie",
            radius: "50%",
            data: [],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)",
                },
            },
        },
    ],
};

//热门文章表格数据
const rmData = ref(null);

onMounted(() => {
    dashboardZl();
    bzfk();
    wzzb();
    rmwz();
});

//查询总览
function dashboardZl() {
    axios
        .get("/other/dashboardZl")
        .then((response) => {
            let res = response.data;
            if (res.code == 200) {
                zlData.value = res.data;
            }
        })
        .catch();
}

//查询本周访客数据
function bzfk() {
    axios
        .get("/other/bzfk")
        .then((response) => {
            let res = response.data;

            if (res.code == 200) {
                bzfkOption.series[0].data = response.data.data;

                var chartDom = document.getElementById("fkl");
                var myChart = echarts.init(chartDom);
                bzfkOption && myChart.setOption(bzfkOption);
            }
        })
        .catch();
}

//查询文章占比
function wzzb() {
    axios
        .get("/other/wzzb")
        .then((response) => {
            let res = response.data;
            if (res.code == 200) {
                wzOption.series[0].data = response.data.data;
                var chartDom = document.getElementById("wzDiv_1");
                var myChart = echarts.init(chartDom);
                wzOption && myChart.setOption(wzOption);
            }
        })
        .catch();
}

//查询热门文章
function rmwz() {
    axios
        .get("/other/rmwz")
        .then((response) => {
            let res = response.data;
            console.log(res);

            if (res.code == 200) {
                rmData.value = res.data;
            }
        })
        .catch();
}
</script>
<style  scoped>
#main {
    display: flex;
    color: #000;
}

#main_div1 {
    flex: 1;
    background-color: #fff;
    box-shadow: 8.3px 9.6px 37.4px rgba(0, 0, 0, 0.01),
    66px 77px 299px rgba(0, 0, 0, 0.02);
}

#zl {
    /* height: 80vh; */
    display: flex;
    flex-wrap: wrap;
}

#zl div {
    width: 40%;
    height: 100px;
    margin: 10px;
    box-shadow: 8.3px 9.6px 37.4px rgba(0, 0, 0, 0.01),
    66px 77px 299px rgba(0, 0, 0, 0.02);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 20px;
}

.zl_span1 {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.6);
}

.zl_span2 {
    font-size: 30px;
}

#main_div2 {
    flex: 2;
    height: 100%;
    margin-left: 20px;
    box-shadow: 8.3px 9.6px 37.4px rgba(0, 0, 0, 0.01),
    66px 77px 299px rgba(0, 0, 0, 0.02);
}

#fkl {
    height: 300px;
    background-color: #fff;
    padding: 10px 0 0 10px;
}

#wzDiv {
    margin-top: 20px;
    height: 310px;
    display: flex;
    justify-content: space-between;
}

#wzDiv_1 {
    padding: 10px 0 0 10px;
    background-color: #fff;
    width: 49%;
}

#wzDiv_2 {
    background-color: #fff;
    width: 49%;
    padding: 10px;
}

.rmwzTitle {
    font-size: 18px;
    font-weight: 700;
}
</style>
