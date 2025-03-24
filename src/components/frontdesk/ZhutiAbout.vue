<template>
  <div class="blog_main_one_item">
    <h1 class="blog_main_one_title">关于</h1>
    <div class="tags-group-all">
      <div class="tags-group-container">
        <div class="tags-group-wrapper" v-for="index in 2" :key="index">
          <div class="a_c">
            <div class="blog_main_one_item_icon">
              <Image src="/toolIco/Vue.png" width="75px" hidden="75px" lazy>
                <template #placeholder>
                  <div class="imgLoading"></div>
                </template>
              </Image>
            </div>
            <div class="blog_main_one_item_icon">
              <Image src="/toolIco/java.png" width="75px" hidden="75px" lazy>
                <template #placeholder>
                  <div class="imgLoading"></div>
                </template>
              </Image>
            </div>
          </div>
          <div class="a_c">
            <div class="blog_main_one_item_icon">
              <Image src="/toolIco/maven.png" width="75px" hidden="75px" lazy>
                <template #placeholder>
                  <div class="imgLoading"></div>
                </template>
              </Image>
            </div>
            <div class="blog_main_one_item_icon">
              <Image src="/toolIco/mysql.png" width="75px" hidden="75px" lazy>
                <template #placeholder>
                  <div class="imgLoading"></div>
                </template>
              </Image>
            </div>
          </div>
          <div class="a_c">
            <div class="blog_main_one_item_icon">
              <Image src="/toolIco/redis.png" width="75px" hidden="75px" lazy>
                <template #placeholder>
                  <div class="imgLoading"></div>
                </template>
              </Image>
            </div>
            <div class="blog_main_one_item_icon">
              <Image src="/toolIco/Vue.png" width="75px" hidden="75px" lazy>
                <template #placeholder>
                  <div class="imgLoading"></div>
                </template>
              </Image>
            </div>
          </div>
          <div class="a_c">
            <div class="blog_main_one_item_icon">
              <Image src="/toolIco/mysql.png" width="75px" hidden="75px" lazy>
                <template #placeholder>
                  <div class="imgLoading"></div>
                </template>
              </Image>
            </div>
            <div class="blog_main_one_item_icon">
              <Image src="/toolIco/spring.png" width="75px" hidden="75px" lazy>
                <template #placeholder>
                  <div class="imgLoading"></div>
                </template>
              </Image>
            </div>
          </div>
        </div>
      </div>
    </div>

    <transition name="slide-left">
      <div class="mask" v-show="maskState">
        <h1>去看看</h1>
        <div>
          <Icon type="md-arrow-round-forward" size="80" color="#fff" />
        </div>
      </div>
    </transition>
  </div>
  <div
    class="overlay"
    @mouseover="a_cMouseOver"
    @mouseout="a_cMouseOut"
    @click="router.push({ name: 'About' })"
  ></div>
</template>
<script setup>
const router = useRouter();

//鼠标悬浮
let maskState = ref(false);
function a_cMouseOver() {
  maskState.value = true;
}
function a_cMouseOut() {
  maskState.value = false;
}
</script>
<style  scoped>
.blog_main_one_item {
  height: 100%;
  width: 49%;
  position: relative;
  overflow: hidden;
  background-color: #fff;
  border-radius: 10px;
}

/* 关于和留言start */
.mask {
  /*background-color: rgba(66, 90, 239, 0.9);*/
  background: linear-gradient(
          90deg,
          rgba(66, 90, 239, 0.9) 35%,
          #3e92df 55%,
          transparent
  );
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  color: #fff;
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  padding: 10px 0 0 35px;
}

.mask h1 {
  font-size: 65px;
  letter-spacing: 3px;
  font-weight: 300;
}

.overlay {
  width: 39.2%;
  height: 250px;
  position: absolute;
}

.tags-group-all {
  cursor: pointer;
}

.blog_main_one_item div {
  display: flex;
}

.blog_main_one_title {
  color: #363636;
  font-size: 40px;
  margin: 30px;
}

.blog_main_one_item_icon {
  background-color: #fff;
  width: 110px;
  height: 110px;
  box-shadow: 0 2px 16px -3px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
  border-radius: 20px;
}

.blog_main_one_item_icon img {
  width: 75px;
  height: 75px;
}

.a_c {
  display: flex;
  flex-direction: column;
}

@keyframes rowup {
  from {
    transform: translateX(0%);
  }

  to {
    transform: translateX(-50%);
  }
}

.tags-group-all {
  transform: rotate(-30deg);
}

.tags-group-wrapper {
  margin-top: -20px;
  display: flex;
  flex-wrap: nowrap;
  animation: rowup 10s linear infinite;
}

/* 关于和留言end */
</style>
