<template>
    <div class="map-wrapper">
        <div id="echartsMap"></div>
    </div>
</template>
<script setup>
const axios = inject("axios");
import * as echarts from "echarts";
import world from "../../../public/map/world.json";

onMounted(() => {
    axios
        .get("visit/findOnlyVisit")
        .then((response) => {
            if (response.data.code == 200) {
                series[0].data = response.data.data;
            }
            setTimeout(() => {
                // 初始化echarts实例，绑定到id为'echartsMap'的DOM元素上
                let chart = echarts.init(document.getElementById("echartsMap"));
                echarts.registerMap("world", world);
                chart.setOption(mapOption);
            }, 0);
        })
        .catch();
});

// 定义echarts的系列（series）数据，这里是一个散点图（scatter）系列
let series = [
    {
        // 系列类型为散点图
        type: "scatter",
        // 指定坐标系为地理坐标系
        coordinateSystem: "geo",
        // 标签的配置项，用于显示每个散点的名称
        label: {
            normal: {
                show: false, // 显示标签
            },
            emphasis: {
                show: true, // 鼠标悬停时显示标签
                position: "right", // 标签的位置在散点的右侧
                formatter: "{b}", // 标签的内容，这里是散点的名称
                color: "#ffffff", // 鼠标悬停时标签的文字颜色，这里设置为白色
            },
        },
        // 散点的样式配置
        itemStyle: {
            normal: {
                color: "#5daee4", // 散点的颜色
            },
        },
        // 散点图的数据，将geoCoordMap中的坐标转换为echarts需要的格式
        data: [],
    },
];

// 设置echarts的配置项和数据
let mapOption = {
    backgroundColor: "#101724", // 背景颜色
    geo: {
        map: "world", // 地图类型，这里是世界地图
        roam: true, // 是否允许缩放和平移
        itemStyle: {
            // 地图区域的样式
            normal: {
                areaColor: "#7d7d7d", // 普通状态下的区域颜色
            },
            emphasis: {
                areaColor: "#6d6d6d", // 高亮状态下的区域颜色
            },
        },

        // 地图区域的标签样式
        label: {
            normal: {
                show: false, // 普通状态下不显示标签
            },
            emphasis: {
                show: true, // 高亮状态下显示标签
                textStyle: {
                    color: "#ffffff", // 高亮状态下的标签文字颜色
                },
            },
        },
    },
    series: series, // 将定义好的系列数据传递给echarts
    textStyle: {
        fontSize: 12, // 默认文本字体大小
    },
};
</script>
<style  scoped>
#echartsMap {
    width: 100%;
    height: 100%;
}

.map-wrapper {
    background-color: #101724;
    display: flex;
    width: 100%;
    /* height: 100vh; */
    height: 500px;
    align-items: center;
    justify-content: center;
}
</style>
