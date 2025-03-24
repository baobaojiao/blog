<template>
  <div class="main">
    <div class="title">
      <h1 v-if="article">{{ article.title }}</h1>
      <h1 v-else>Loading...</h1>
      <div>
        <div class="hdoa">
          <Icon v-if="article" type="ios-time-outline" />
          <span v-if="article">{{ article.creationTime }}</span>

          <Icon v-if="article" type="md-flame" />
          <span v-if="article">{{ article.see }}</span>

          <Icon v-if="variable.commentData.value" type="md-chatboxes" />
          <span v-if="variable.commentData.value">{{
            variable.commentData.value.spare
          }}</span>

          <span v-if="article">
            <Tooltip
              v-if="article.retransmission"
              content="转载请保留本文转载地址 著作权归作者所有"
              theme="light"
              max-width="180"
              placement="right"
              >© 允许规范转载</Tooltip
            >
            <Tooltip
              v-else
              content="著作权归作者所有"
              theme="light"
              max-width="150"
              placement="right"
            >
              © 禁止转载</Tooltip
            >
          </span>
        </div>
      </div>
    </div>

    <!-- 波浪START -->
    <Wave />

    <!-- 文章/评论 -->
    <div class="essay_main">
      <div>
        <div class="essay" id="essayId">
          <MdPreview
            class="essay_content"
            style="margin-bottom: 150px"
            editorId="MdPreview_id1"
            :modelValue="article.content"
            previewTheme="smart-blue"
            @onGetCatalog="onGetCatalog"
          />

          <div class="wzdbkp">
            <div class="tx"><img :src="variable.pz_all.value.bz_tx" /></div>
            <h1>{{ variable.pz_all.value.blog_name }}</h1>
            <div class="tb">
              <Button type="info" @click="geArticle(false)">
                <Icon type="ios-arrow-back" size="16" /> 上一篇
              </Button>
              <div class="beg">
                <Beg />
              </div>
              <Button type="success" @click="geArticle(true)">
                下一篇
                <Icon type="ios-arrow-forward" size="16" />
              </Button>
            </div>
          </div>

          <!-- 评论 -->
          <div id="pl">
            <CommentAll>评论</CommentAll>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 火焰 -->
  <canvas id="fire-overlay" ref="canvasEl"></canvas>

  <!-- 右侧栏 -->
  <Affix :offset-top="80" class="rightDiv">
    <el-tabs style="padding: 10px; background-color: #fff; margin-bottom: 50px">
      <el-tab-pane label="📄 文章目录" v-if="wzml">
        <MdCatalog editorId="MdPreview_id1" :scrollElement="scrollElement" />
      </el-tab-pane>

      <el-tab-pane label="⭐ 功能"><ArticlesTool /> </el-tab-pane>
    </el-tabs>
    <UserMap :width="160" />
  </Affix>

  <!-- 阅读模式抽屉 -->
  <Drawer
    v-model="variable.ydmsModel.value"
    width="100"
    height="100"
    :styles="{ 'background-color': '#E0D8C8' }"
    placement="top"
  >
    <template #close>
      <Button
        shape="circle"
        icon="md-close"
        size="large"
        style="
          font-size: 32px;
          width: 50px;
          height: 50px;
          background-color: rgba(97, 97, 97, 0.5);
          color: #fff;
          margin-right: 50px;
        "
        @click="variable.ydmsModel.value = !variable.ydmsModel.value"
      ></Button>
    </template>

    <MdPreview
      id="wzCtid"
      style="margin-bottom: 150px"
      :modelValue="article.content"
      previewTheme="smart-blue"
    />
  </Drawer>
  <!-- 阅读模式抽屉end -->

  <!-- 密码抽屉 -->
  <ArticleDrawer />

  <!-- 分享对话框 -->
  <div id="participationModal" v-if="variable.participationModal.value">
    <div
      style="
        margin-top: 10%;
        width: 400px;
        border-radius: 5px;
        overflow: hidden;
      "
    >
      <div style="position: relative; height: 200px">
        <div style="position: absolute; width: 100%">
          <Image
            :src="article.img"
            width="100%"
            height="200px"
            style="filter: brightness(93%)"
          />
        </div>
        <div style="color: #fff; position: absolute; bottom: 30px; left: 30px">
          <h1 style="font-size: 60px; border-bottom: 3px solid #fff">29</h1>
          <h2 style="font-size: 20px">2024/08</h2>
        </div>
      </div>

      <div
        style="
          background-color: #fff;
          padding: 20px;
          color: #000;
          border-bottom: 5px dotted #e0e0e0;
        "
      >
        <p style="font-size: 20px; text-align: center">{{ article.title }}</p>
      </div>

      <div
        style="
          height: 130px;
          background-color: #fff;
          display: flex;
          justify-content: space-around;
          align-items: center;
        "
      >
        <Image src="/other/zw.png" width="90px" height="90px" />

        <div style="font-size: 20px; width: 140px; color: #9e9e9e">
          长按识别/手机扫码查看详情
        </div>

        <img :src="variable.fxUrl.value" width="80px" height="80px" />
      </div>

      <div style="margin-top: 30px; display: flex; justify-content: center">
        <div
          id="participationModal_close"
          @click="variable.participationModal.value = false"
        >
          <Icon type="md-close" size="20" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import CommentAll from "./comment/CommentAll.vue";
import { MdPreview, MdCatalog } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
const scrollElement = document.documentElement;
import { Notice } from "view-ui-plus";
import variable from "../../js/variable";
const Wave = defineAsyncComponent(() => import("./Wave.vue"));
const UserMap = defineAsyncComponent(() => import("./UserMap.vue"));
const Beg = defineAsyncComponent(() => import("./Beg.vue"));
const ArticleDrawer = defineAsyncComponent(() => import("./ArticleDrawer.vue"));

const axios = inject("axios");
const router = useRouter();
const route = useRoute();

const article = ref("");
let interval = null; // 定义定时器变量

onMounted(() => {
  findArticle();
});

// 在组件销毁时清除定时器
onBeforeUnmount(() => {
  clearInterval(interval);
});

// 查询文章详情
function findArticle() {
  axios
    .post("article/findArticle", {
      id: route.params.id,
      pwd: variable.chouTiArticle.value.pwd,
    })
    .then((response) => {
      let res = response.data;

      if (res.msg == "成功" && res.data.total > 0) {
        article.value = res.data.records[0];

        //修改页面标题
          document.title =
              res.data.records[0].title + " - " + variable.pz_all.value.blog_name;

          //打开密码抽屉
        if (res.data.records[0].content == "私密文章，需要密码访问") {
          router.push("/");
          variable.wzDrawerStzte.value = true;
          variable.chouTiArticle.value.id = route.params.id;
        }

        //文章查看+1
        updSee();
      } else {
        router.push({ path: "/404" });
      }
    })
    .catch();
}

let wzml = ref(false); //文章目录是否显示
//获取文章目录
const onGetCatalog = (list) => {
  if (list.length > 0) {
    wzml.value = true;
  } else {
    wzml.value = false;
  }
};

//文章查看+1
async function updSee() {
  try {
    const response = await axios.post("article/updArticleSee", {
      id: route.params.id,
    });
  } catch (error) {
    console.error(error);
  }
}

//查询上一篇或下一篇文章
function geArticle(next) {
  axios
    .post("article/findArticleByNext", { id: route.params.id, next: next })
    .then((response) => {
      let res = response.data;
      if (res.msg == "成功") {
        if (res.data) {
          router.push({ name: "Article", params: { id: res.data } });
          setTimeout(() => {
            location.reload();
          }, 0);
        } else {
          Notice.warning({
            title: "没有啦~",
          });
        }
      }
    })
    .catch();
}


// ---------------------------------火焰------------------------------
import gsap from "gsap";

// 设备像素比率，用于在高分辨率屏幕上保持清晰度
const devicePixelRatio = Math.min(window.devicePixelRatio, 2);
const canvasEl = ref(null);
let st, uniforms, gl, animationFrameId, vertexBuffer;
const params = {
    fireTime: 0.35,
    fireTimeAddition: 0,
};

onMounted(() => {
    gl = initShader();
    st = gsap
        .timeline({
            defaults: { ease: "none" },
        })
        .to(params, {
            fireTimeAddition: 1,
            duration: 3, // 动画执行时间
            repeat: 0, // 重复次数
            yoyo: false, // 关闭来回播放
            onComplete: () => {
                // 动画完成后，确保参数保持在最终状态
                params.fireTimeAddition = 1;

                //执行完清除火焰
                xhHy();
            },
        });
    // 初始化画布大小
    resizeCanvas();

    //因为火焰有层青色层，导致页面颜色受影响，所以动画结束及时隐藏画布
    setTimeout(() => {
        canvasEl.value.style.display = "none";
    }, 1200);
});

// 初始化WebGL着色器程序
function initShader() {
    // 顶点着色器源码
    const vsSource = `precision mediump float;

    varying vec2 vUv;
    attribute vec2 a_position;

    void main() {
        vUv = a_position;
        gl_Position = vec4(a_position, 0.0, 1.0);
    }`;
    // 片段着色器源码，包含火焰效果的计算
    const fsSource = `precision mediump float;

    varying vec2 vUv;
    uniform vec2 u_resolution;
    uniform float u_progress;
    uniform float u_time;

    float rand(vec2 n) {
        return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
    }
    float noise(vec2 n) {
        const vec2 d = vec2(0., 1.);
        vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
        return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
    }
    float fbm(vec2 n) {
        float total = 0.0, amplitude = .4;
        for (int i = 0; i < 4; i++) {
            total += noise(n) * amplitude;
            n += n;
            amplitude *= 0.6;
        }
        return total;
    }

    void main() {
        vec2 uv = vUv;
        uv.x *= min(1., u_resolution.x / u_resolution.y);
        uv.y *= min(1., u_resolution.y / u_resolution.x);

        float t = u_progress;
        vec3 color = vec3(1., 1., .95);

        float main_noise = 1. - fbm(.75 * uv + 10. - vec2(.3, .9 * t));

        float paper_darkness = smoothstep(main_noise - .1, main_noise, t);
        color -= vec3(.99, .95, .99) * paper_darkness;

        vec3 fire_color = fbm(6. * uv - vec2(0., .005 * u_time)) * vec3(6., 1.4, .0);
        float show_fire = smoothstep(.4, .9, fbm(10. * uv + 2. - vec2(0., .005 * u_time)));
        show_fire += smoothstep(.7, .8, fbm(.5 * uv + 5. - vec2(0., .001 * u_time)));

        float fire_border = .02 * show_fire;
        float fire_edge = smoothstep(main_noise - fire_border, main_noise - .5 * fire_border, t);
        fire_edge *= (1. - smoothstep(main_noise - .5 * fire_border, main_noise, t));
        color += fire_color * fire_edge;

        float opacity = 1. - smoothstep(main_noise - .0005, main_noise, t);

        gl_FragColor = vec4(color, opacity);
    }`;

    // 获取WebGL上下文
    const gl =
        canvasEl.value.getContext("webgl") ||
        canvasEl.value.getContext("experimental-webgl");

    if (!gl) {
        console.error("您的浏览器不支持WebGL");
    }

    // 创建着色器函数
    function createShader(gl, sourceCode, type) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, sourceCode);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(
                "编写着色器时发生了一个错误: " + gl.getShaderInfoLog(shader)
            );
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    // 创建顶点着色器和片段着色器
    const vertexShader = createShader(gl, vsSource, gl.VERTEX_SHADER);
    const fragmentShader = createShader(gl, fsSource, gl.FRAGMENT_SHADER);

    // 创建着色器程序函数
    function createShaderProgram(gl, vertexShader, fragmentShader) {
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error("无法初始化着色器程序: " + gl.getProgramInfoLog(program));
            return null;
        }

        return program;
    }

    // 创建着色器程序
    const shaderProgram = createShaderProgram(gl, vertexShader, fragmentShader);
    uniforms = getUniforms(shaderProgram);

    // 获取Uniform变量
    function getUniforms(program) {
        let uniforms = [];
        let uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformCount; i++) {
            let uniformName = gl.getActiveUniform(program, i).name;
            uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
        }
        return uniforms;
    }

    // 设置顶点数据
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.useProgram(shaderProgram);

    // 获取顶点着色器中的属性位置
    const positionLocation = gl.getAttribLocation(shaderProgram, "a_position");
    gl.enableVertexAttribArray(positionLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    return gl;
}

// 渲染函数，用于每一帧的绘制
function render() {
    // 获取当前时间，用于动画计算
    const currentTime = performance.now();
    // 更新uniform变量
    gl.uniform1f(uniforms.u_time, currentTime);
    gl.uniform1f(uniforms.u_progress, params.fireTime + params.fireTimeAddition);
    // 绘制场景
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    // 请求下一帧的渲染
    animationFrameId = requestAnimationFrame(render);
}

// 调整画布大小函数
function resizeCanvas() {
    // 设置画布的实际大小，考虑设备像素比率
    canvasEl.value.width = window.innerWidth * devicePixelRatio;
    canvasEl.value.height = window.innerHeight * devicePixelRatio;
    // 更新WebGL的视口和分辨率
    gl.viewport(0, 0, canvasEl.value.width, canvasEl.value.height);
    gl.uniform2f(
        uniforms.u_resolution,
        canvasEl.value.width,
        canvasEl.value.height
    );
    // 重新渲染场景
    render();
}


//清除火焰
function xhHy() {
    // 停止 GSAP 动画
    st.kill();
    // 释放 WebGL 资源
    gl.deleteBuffer(vertexBuffer);
    // 如果有纹理或其他资源，也需要在这里释放

    // 移除 resize 事件监听器
    window.removeEventListener("resize", resizeCanvas);

    // 取消 requestAnimationFrame
    cancelAnimationFrame(render);
    cancelAnimationFrame(animationFrameId);
}
// ---------------------------------火焰end------------------------------
</script>

<style scoped>
.main {
    /* backdrop-filter: blur(80px); */
}

/* 火焰 */
canvas#fire-overlay {
    position: fixed;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    pointer-events: none;
    z-index: 9999;
}
/* 火焰end */

.defaultFont {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

.zqy {
  position: absolute;
  top: 550px;
  left: 200px;
  display: flex;
  flex-direction: column;
}

#wzCtid {
  width: 70%;
  margin: 50px auto;
  padding: 50px;
  background-color: #f8f1e2;
  box-shadow: 0 6px 12px 3px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
}

/* ----按钮样式--- */
.yxandt {
  z-index: 1;
  color: #000;
  padding: 20px 26px;
  outline: none;
  border: none;
  background-color: #fff;
  border-radius: 50%;
  border: 1px solid rgb(218, 218, 218);
  box-shadow: 0 2px 4px #3232320a;
  cursor: pointer;
  font-size: 16px;
  /* margin-bottom: 10px; */
}

.yxandt:hover {
  cursor: pointer;
  animation: jelly 0.5s;
}

@keyframes jelly {
  0%,
  100% {
    transform: scale(1, 1);
  }

  25% {
    transform: scale(0.9, 1.1);
  }

  50% {
    transform: scale(1.1, 0.9);
  }

  75% {
    transform: scale(0.95, 1.05);
  }
}

/* ----按钮样式end--- */

.title {
  padding-top: 70px;
  height: 400px;
  padding-left: 20%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}

.title > h1 {
  color: #f5f5f5;
  font-size: 50px;
}

.hdoa {
  color: #d6d6d6;
  user-select: none;
  font-size: 15px;
}

.hdoa > span {
  padding: 0 20px 0 4px;
}

.essay_main {
  background-color: #f7f9fe;
  display: flex;
  justify-content: center;
}

.essay_main > div {
  width: 70%;
  margin-top: 50px;
  display: flex;
  justify-content: space-between;
}

article {
  margin-bottom: 200px;
}

.essay {
  width: 74%;
  box-shadow: 0 8px 16px -4px #2c2d300c;
  background-color: #fff;
  border-radius: 10px;
  padding: 40px;
}

.wzdbkp {
  border: 1px solid rgb(230, 230, 230);
  background-color: #f7f7f9;
  border-radius: 10px;
  box-shadow: 0 8px 16px -4px #2c2d300c;
  width: 100%;
  height: 180px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  user-select: none;
}

.tx {
  border: 1px solid rgb(230, 230, 230);
  width: 70px;
  height: 70px;
  border-radius: 50%;
  position: absolute;
  top: -40px;
  overflow: hidden;
}

.tx img {
  width: 70px;
  border-radius: 50%;
  height: 70px;
  transition: 0.3s;
}

.tx:hover img {
  transform: scale(0.8);
}

.tx:before {
  animation: searchLights-1e3e0c73 2s ease-in 2s infinite;
  background-image: linear-gradient(
    180deg,
    transparent,
    hsla(0, 0%, 100%, 0.5),
    transparent
  );
  content: "";
  height: 20px;
  position: absolute;
  transform: rotate(-45deg);
  width: 1000px;
}

@keyframes searchLights-1e3e0c73 {
  0% {
    left: -200px;
    top: -300px;
  }

  to {
    left: -160px;
    top: 800px;
  }
}

.wzdbkp h1 {
  padding: 30px 0 0;
  letter-spacing: 1px;
}

.tb {
  width: 90%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tb div {
  padding: 5px 10px;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
}

.option1 {
  opacity: 1;
}

.option0 {
  opacity: 0;
}

.rightDiv {
  width: 300px;
  border-radius: 10px;
  position: absolute;
  right: 300px;
  top: 550px;
}

.catalogue_title {
  font-size: 20px;
}

/* ----------------------------分享对话框-------------------------------- */
#participationModal {
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  box-shadow: 0px 1px 13px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
}

#participationModal_close {
  cursor: pointer;
  width: 40px;
  height: 40px;
  background-color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

#participationModal_close:hover {
  background-color: #ececec;
}

/* ----------------------------分享对话框end-------------------------------- */

@media (max-width: 1800px) {
  .rightDiv {
    display: none !important;
  }

  .essay {
    width: 95%;
    margin: 0 auto;
  }

  .beg {
    display: none;
  }

  .zqy {
    display: none;
  }

  .title > h1 {
    font-size: 30px;
  }
}

@media (max-width: 800px) {
  .barrage {
    opacity: 0;
  }

  .title > h1 {
    font-size: 20px;
  }

  .essay {
    width: 100%;
    margin: 0 auto;
    padding: 0;
  }

  .essay_main > div {
    width: 100%;
  }
}
</style>
