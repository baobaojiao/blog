<template>
  <div id="main">
    <h1>树洞</h1>
    <br />

    <div
      style="display: flex; justify-content: center; width: 100%; z-index: 2"
    >
      <div class="input-container">
        <input
          v-model="content"
          autocomplete="off"
          class="input"
          name="text"
          type="text"
          placeholder="在这留下你的足迹吧..."
        />
      </div>

      <button class="cta" @click="addTreeHole">
        <span class="span">发送</span>
        <span class="second">
          <svg
            width="50px"
            height="20px"
            viewBox="0 0 66 43"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <g
              id="arrow"
              stroke="none"
              stroke-width="1"
              fill="none"
              fill-rule="evenodd"
            >
              <path
                class="one"
                d="M40.1543933,3.89485454 L43.9763149,0.139296592 C44.1708311,-0.0518420739 44.4826329,-0.0518571125 44.6771675,0.139262789 L65.6916134,20.7848311 C66.0855801,21.1718824 66.0911863,21.8050225 65.704135,22.1989893 C65.7000188,22.2031791 65.6958657,22.2073326 65.6916762,22.2114492 L44.677098,42.8607841 C44.4825957,43.0519059 44.1708242,43.0519358 43.9762853,42.8608513 L40.1545186,39.1069479 C39.9575152,38.9134427 39.9546793,38.5968729 40.1481845,38.3998695 C40.1502893,38.3977268 40.1524132,38.395603 40.1545562,38.3934985 L56.9937789,21.8567812 C57.1908028,21.6632968 57.193672,21.3467273 57.0001876,21.1497035 C56.9980647,21.1475418 56.9959223,21.1453995 56.9937605,21.1432767 L40.1545208,4.60825197 C39.9574869,4.41477773 39.9546013,4.09820839 40.1480756,3.90117456 C40.1501626,3.89904911 40.1522686,3.89694235 40.1543933,3.89485454 Z"
                fill="#FFFFFF"
              ></path>
              <path
                class="two"
                d="M20.1543933,3.89485454 L23.9763149,0.139296592 C24.1708311,-0.0518420739 24.4826329,-0.0518571125 24.6771675,0.139262789 L45.6916134,20.7848311 C46.0855801,21.1718824 46.0911863,21.8050225 45.704135,22.1989893 C45.7000188,22.2031791 45.6958657,22.2073326 45.6916762,22.2114492 L24.677098,42.8607841 C24.4825957,43.0519059 24.1708242,43.0519358 23.9762853,42.8608513 L20.1545186,39.1069479 C19.9575152,38.9134427 19.9546793,38.5968729 20.1481845,38.3998695 C20.1502893,38.3977268 20.1524132,38.395603 20.1545562,38.3934985 L36.9937789,21.8567812 C37.1908028,21.6632968 37.193672,21.3467273 37.0001876,21.1497035 C36.9980647,21.1475418 36.9959223,21.1453995 36.9937605,21.1432767 L20.1545208,4.60825197 C19.9574869,4.41477773 19.9546013,4.09820839 20.1480756,3.90117456 C20.1501626,3.89904911 20.1522686,3.89694235 20.1543933,3.89485454 Z"
                fill="#FFFFFF"
              ></path>
              <path
                class="three"
                d="M0.154393339,3.89485454 L3.97631488,0.139296592 C4.17083111,-0.0518420739 4.48263286,-0.0518571125 4.67716753,0.139262789 L25.6916134,20.7848311 C26.0855801,21.1718824 26.0911863,21.8050225 25.704135,22.1989893 C25.7000188,22.2031791 25.6958657,22.2073326 25.6916762,22.2114492 L4.67709797,42.8607841 C4.48259567,43.0519059 4.17082418,43.0519358 3.97628526,42.8608513 L0.154518591,39.1069479 C-0.0424848215,38.9134427 -0.0453206733,38.5968729 0.148184538,38.3998695 C0.150289256,38.3977268 0.152413239,38.395603 0.154556228,38.3934985 L16.9937789,21.8567812 C17.1908028,21.6632968 17.193672,21.3467273 17.0001876,21.1497035 C16.9980647,21.1475418 16.9959223,21.1453995 16.9937605,21.1432767 L0.15452076,4.60825197 C-0.0425130651,4.41477773 -0.0453986756,4.09820839 0.148075568,3.90117456 C0.150162624,3.89904911 0.152268631,3.89694235 0.154393339,3.89485454 Z"
                fill="#FFFFFF"
              ></path>
            </g>
          </svg>
        </span>
      </button>
    </div>

    <!-- 弹幕 -->
    <vue-danmaku
      ref="danmakuRef"
      v-model:danmus="danmus"
      class="barrage"
      :speeds="100"
      :debounce="500"
      :randomChannel="true"
      :isSuspend="true"
      useSlot
      @play-end="playEnd"
    >
      <template v-slot:dm="{ danmu }">
        <div class="dmDiv" :class="{ dmYs: danmu.dmYs }">
          <span>{{ danmu.content }}</span>
          <p>{{ danmu.creationTime }}</p>
        </div>
      </template>
    </vue-danmaku>
  </div>
</template>
<script setup>
import { Notice } from "view-ui-plus";
import vueDanmaku from "vue3-danmaku";
const axios = inject("axios");

const danmakuRef = ref(null);
const danmus = ref([]); //弹幕数据

onMounted(() => {
  getTreeHole();
});

const getTreeHole = () => {
  axios
    .post("treeHole/getTreeHole", { pageSize: 100 })
    .then((response) => {
      //一系列操作，就是为了重新循环前清除上一次的数据，防止数据过大
      danmus.value = [];
      danmakuRef.value.stop();
      danmakuRef.value.reset();
      setTimeout(() => {
        response.data.data.records.forEach((item) => {
          danmakuRef.value.add(item);
        });
      }, 100);
    })
    .catch();
};

//树洞框数据
const content = ref(null);

//添加树洞
const addTreeHole = () => {
  var now = new Date();
  var year = now.getFullYear();
  var month = (now.getMonth() + 1).toString().padStart(2, "0");
  var day = now.getDate().toString().padStart(2, "0");
  var hours = now.getHours().toString().padStart(2, "0");
  var minutes = now.getMinutes().toString().padStart(2, "0");
  var seconds = now.getSeconds().toString().padStart(2, "0");
  var time = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  axios
    .post("treeHole/addTreeHole", { content: content.value })
    .then((response) => {
      if (response.data.code == 200) {
        Notice.success({
          title: "发送成功！",
        });

        danmakuRef.value.add({
          content: content.value,
          creationTime: time,
          dmYs: true,
        });

        content.value = null;
      }
    })
    .catch();
};

//播放结束，重新查询
const playEnd = () => {
  getTreeHole();
};
</script>
<style scoped>
#main {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.dmYs {
  color: rgb(75, 223, 61);
}

h1 {
  color: #fff;
  letter-spacing: 5px;
  text-shadow: 0 0 10px #000;
}

.barrage {
  width: 100%;
  height: 80%;
  position: absolute;
  top: 100px;
  left: 0;
  overflow: hidden;
  white-space: nowrap;
  font-size: 20px;
  color: #ffffff;
  z-index: 1;
}

.dmDiv {
  user-select: none;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
}

.dmDiv p {
  font-size: 14px;
  opacity: 0;
}

.dmDiv:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.dmDiv:hover p {
  opacity: 1;
}

/* -------------input--------------- */
.input {
  width: 100%;
  max-width: 270px;
  height: 60px;
  padding: 12px;
  font-size: 18px;
  font-family: "Courier New", monospace;
  color: #000;
  background-color: #fff;
  border: 4px solid #000;
  border-radius: 0;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: 8px 8px 0 #000;
}

.input::placeholder {
  color: #888;
}

.input:hover {
  transform: translate(-4px, -4px);
  box-shadow: 12px 12px 0 #000;
}

.input:focus {
  background-color: #000;
  color: #fff;
  border-color: #ffffff;
}

.input:focus::placeholder {
  color: #fff;
}

@keyframes typing {
  from {
    width: 0;
  }

  to {
    width: 100%;
  }
}

@keyframes blink {
  50% {
    border-color: transparent;
  }
}

.input:focus::after {
  content: "|";
  position: absolute;
  right: 10px;
  animation: blink 0.7s step-end infinite;
}

.input:valid {
  animation: typing 2s steps(30, end);
}

.input-container {
  position: relative;
  width: 100%;
  max-width: 270px;
}

.input {
  width: 100%;
  height: 60px;
  padding: 12px;
  font-size: 18px;
  font-family: "Courier New", monospace;
  color: #000;
  background-color: #fff;
  border: 4px solid #000;
  border-radius: 0;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: 8px 8px 0 #000;
}

.input::placeholder {
  color: #888;
}

.input:hover {
  transform: translate(-4px, -4px);
  box-shadow: 12px 12px 0 #000;
}

.input:focus {
  background-color: #010101;
  color: #fff;
  border-color: #d6d9dd;
}

.input:focus::placeholder {
  color: #fff;
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-5px) rotate(-5deg);
  }

  50% {
    transform: translateX(5px) rotate(5deg);
  }

  75% {
    transform: translateX(-5px) rotate(-5deg);
  }

  100% {
    transform: translateX(0);
  }
}

.input:focus {
  animation: shake 0.5s ease-in-out;
}

@keyframes glitch {
  0% {
    transform: none;
    opacity: 1;
  }

  7% {
    transform: skew(-0.5deg, -0.9deg);
    opacity: 0.75;
  }

  10% {
    transform: none;
    opacity: 1;
  }

  27% {
    transform: none;
    opacity: 1;
  }

  30% {
    transform: skew(0.8deg, -0.1deg);
    opacity: 0.75;
  }

  35% {
    transform: none;
    opacity: 1;
  }

  52% {
    transform: none;
    opacity: 1;
  }

  55% {
    transform: skew(-1deg, 0.2deg);
    opacity: 0.75;
  }

  50% {
    transform: none;
    opacity: 1;
  }

  72% {
    transform: none;
    opacity: 1;
  }

  75% {
    transform: skew(0.4deg, 1deg);
    opacity: 0.75;
  }

  80% {
    transform: none;
    opacity: 1;
  }

  100% {
    transform: none;
    opacity: 1;
  }
}

.input:not(:placeholder-shown) {
  animation: glitch 1s linear infinite;
}

.input:focus + .input-container::after {
  color: #fff;
}

.input:not(:placeholder-shown) {
  font-weight: bold;
  letter-spacing: 1px;
  text-shadow: 0px 0px 0 #000;
}

/* ###############按钮 */
.cta {
  cursor: pointer;
  display: flex;
  padding: 11px 33px;
  text-decoration: none;
  font-family: "Poppins", sans-serif;
  font-size: 25px;
  color: white;
  background: #6225e6;
  transition: 1s;
  box-shadow: 6px 6px 0 black;
  transform: skewX(-15deg);
  border: none;
}

.cta:focus {
  outline: none;
}

.cta:hover {
  transition: 0.5s;
  box-shadow: 10px 10px 0 #fbc638;
}

.cta .second {
  transition: 0.5s;
  margin-right: 0px;
}

.cta:hover .second {
  transition: 0.5s;
  margin-right: 45px;
}

.span {
  transform: skewX(15deg);
}

.second {
  width: 20px;
  margin-left: 30px;
  position: relative;
  top: 12%;
}

.one {
  transition: 0.4s;
  transform: translateX(-60%);
}

.two {
  transition: 0.5s;
  transform: translateX(-30%);
}

.cta:hover .three {
  animation: color_anim 1s infinite 0.2s;
}

.cta:hover .one {
  transform: translateX(0%);
  animation: color_anim 1s infinite 0.6s;
}

.cta:hover .two {
  transform: translateX(0%);
  animation: color_anim 1s infinite 0.4s;
}

@keyframes color_anim {
  0% {
    fill: white;
  }

  50% {
    fill: #fbc638;
  }

  100% {
    fill: white;
  }
}
</style>