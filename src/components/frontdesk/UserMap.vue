<template>
  <div class="usermap" :style="{ width: width + '%' }">
    <div class="map_main" id="map">
      <div class="userMapaa" id="container" ref="userMap"></div>
    </div>
  </div>
</template>
<script setup>
const axios = inject("axios");
import * as echarts from "echarts";
import china from "../../../public/map/china.json"; // 中国地图json数据

//接收组件传过来的宽度，给class="usermap"设置宽度
const props = defineProps({
  width: {
    type: Number,
    default: 100, // 默认宽度
  },
});

let mapOption = {
  legend: {
    data: ["博客访客来源"],
  },
  tooltip: {
    show: false,
  },
  geo: {
    map: "china",
    roam: false, // 一定要关闭拖拽
    zoom: 1.7, // 调整缩放比例
    center: [105, 36], // 调整地图位置
    showLegendSymbol: false, // 存在legend时显示
    label: {
      show: false,
    },
    itemStyle: {
      areaColor: "white",
      borderColor: "#aeaeae",
      borderWidth: 0.5,
    },
    emphasis: {
      itemStyle: {
        areaColor: "#f6f6f6",
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowBlur: 5,
        borderWidth: 0,
      },
    },
  },
  series: [
    {
      name: "博客访客来源",
      type: "scatter",
      data: [], // 数据请按照实例返回的格式制造 { name: "北京", value: [116.41995, 40.18994] }
      itemStyle: {
        shadowBlur: 0,
        shadowColor: "#333",
        color: "#01aaed",
        lineStyle: { color: "#01aaed" },
      },
      coordinateSystem: "geo",
      symbolSize: 5, // 调大数据点大小
      label: {
        formatter: "{b}",
        position: "right",
        show: true,
      },
    },
  ],
};

const userMap = ref();

onMounted(() => {
  axios
    .get("visit/findOnlyVisit")
    .then((response) => {
      if (response.data.code == 200) {
        mapOption.series[0].data = response.data.data;
      }
      setTimeout(() => {
        let map = echarts.init(userMap.value);
        echarts.registerMap("china", china);
        map.setOption(mapOption);
      }, 0);
    })
    .catch();
});
</script>
<style  scoped>
.userMapaa {
  width: 100%;
  min-height: 350px;
}

/* --------userMap---- */
.usermap {
  border-radius: 5px;
  /* width: 115%; */
  padding: 10px;
  /* background-color: #fff; */
  /* box-shadow: 0 8px 16px -4px #2c2d300c; */
}

.catalogue_title_b {
  font-size: 20px;
  margin-bottom: 10px;
}

.map_main {
  /* border: 1px solid rgb(240, 240, 240); */
}

/* --------userMap---- */
</style>