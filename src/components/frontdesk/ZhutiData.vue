<template>
  <div class="blog_main_two">
    <div>
      <ul v-if="itemWidths">
        <li
          :style="{ width: itemWidths[0] + '%' }"
          v-bind:class="{ active: activeIndex === 0 }"
          @mouseover="increaseWidth(0)"
          @mouseout="resetWidth(0)"
        >
          <div class="blog_main_two_div">
            <div
              class="blog_main_two_title"
              :class="{
                blog_main_two_div_width_gq: blog_main_two_div_width,
                blog_main_two_div_width_gh: !blog_main_two_div_width,
              }"
            >
              <p>文章数量</p>
              <p :class="{ wz_num_gq: wz_num, wz_num_gh: !wz_num }">
                {{ variable.syArticleData.value.total }}
              </p>
            </div>
            <div class="blog_main_two_hr"></div>
          </div>
          <div
            :class="{
              blog_main_two_ico_gq: blog_main_two_ico1,
              blog_main_two_ico_gh: !blog_main_two_ico1,
            }"
          >
            <Icon
              type="ios-paper"
              :class="{ wz_ico_gq: wz_ico, wz_ico_gh: !wz_ico }"
            />
          </div>
        </li>
        <li
          :style="{ width: itemWidths[1] + '%' }"
          v-bind:class="{ active: activeIndex === 1 }"
          @mouseover="increaseWidth(1)"
          @mouseout="resetWidth(1)"
        >
          <div class="blog_main_two_div">
            <div
              class="blog_main_two_title"
              :class="{
                blog_main_two_div_width_gq: blog_main_two_div_width,
                blog_main_two_div_width_gh: !blog_main_two_div_width,
              }"
            >
              <p>运行天数</p>
              <p
                :class="{ yx_num_gq: yx_num, yx_num_gh: !yx_num }"
                v-if="variable.pz_all.value.pzsz"
              >
                {{ variable.pz_all.value.pzsz.yxtime }}
              </p>
            </div>
            <div class="blog_main_two_hr"></div>
          </div>
          <div
            :class="{
              blog_main_two_ico_gq: blog_main_two_ico2,
              blog_main_two_ico_gh: !blog_main_two_ico2,
            }"
          >
            <Icon
              type="logo-freebsd-devil"
              :class="{ yx_ico_gq: yx_ico, yx_ico_gh: !yx_ico }"
            />
          </div>
        </li>
        <li
          :style="{ width: itemWidths[2] + '%' }"
          v-bind:class="{ active: activeIndex === 2 }"
          @mouseover="increaseWidth(2)"
          @mouseout="resetWidth(2)"
        >
          <div class="blog_main_two_div">
            <div
              class="blog_main_two_title"
              :class="{
                blog_main_two_div_width_gq: blog_main_two_div_width,
                blog_main_two_div_width_gh: !blog_main_two_div_width,
              }"
            >
              <p>访客数量</p>
              <p
                :class="{ fw_num_gq: fw_num, fw_num_gh: !fw_num }"
                v-if="variable.pz_all.value.pzsz"
              >
                {{ variable.pz_all.value.pzsz.fwsl }}
              </p>
            </div>
            <div class="blog_main_two_hr"></div>
          </div>
          <div
            :class="{
              blog_main_two_ico_gq: blog_main_two_ico3,
              blog_main_two_ico_gh: !blog_main_two_ico3,
            }"
          >
            <Icon
              type="ios-paw"
              :class="{ fw_ico_gq: fw_ico, fw_ico_gh: !fw_ico }"
            />
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup>
import variable from "../../js/variable";

// ---------------数据START-------------------
const blog_main_two_ico1 = ref(true);
const blog_main_two_ico2 = ref(true);
const blog_main_two_ico3 = ref(true);
const wz_ico = ref(true);
const yx_ico = ref(true);
const fw_ico = ref(true);
const wz_num = ref(true);
const yx_num = ref(true);
const fw_num = ref(true);
const blog_main_two_div_width = ref(true);
const itemWidths = ref([32, 32, 32]);
const activeIndex = ref(null);

const increaseWidth = (index) => {
  const newWidth = itemWidths.value[index] * 1.4;
  const decreaseWidth = (newWidth - itemWidths.value[index]) / 2;
  itemWidths.value[index] = newWidth;
  for (let i = 0; i < itemWidths.value.length; i++) {
    if (i !== index) {
      itemWidths.value[i] -= decreaseWidth;
    }
  }
  activeIndex.value = index;
  if (index == 0) {
    blog_main_two_ico1.value = false;
    wz_ico.value = false;
    wz_num.value = false;
  } else if (index == 1) {
    blog_main_two_ico2.value = false;
    yx_ico.value = false;
    yx_num.value = false;
  } else if (index == 2) {
    blog_main_two_ico3.value = false;
    fw_ico.value = false;
    fw_num.value = false;
  }
  blog_main_two_div_width.value = false;
};

const resetWidth = (index) => {
  itemWidths.value = [32, 32, 32];
  activeIndex.value = null;
  //修改图标
  if (index == 0) {
    blog_main_two_ico1.value = true;
    wz_ico.value = true;
    wz_num.value = true;

    yx_num.value = true;
  } else if (index == 1) {
    blog_main_two_ico2.value = true;
    yx_ico.value = true;
    yx_num.value = true;
  } else if (index == 2) {
    blog_main_two_ico3.value = true;
    fw_ico.value = true;
    fw_num.value = true;
  }

  blog_main_two_div_width.value = true;
};
// ---------------数据END-------------------
</script>
<style  scoped>
.blog_main_two {
  user-select: none;
  height: 100px;
  width: 80%;
  margin: 0 auto;
}

.blog_main_two > div {
  width: 49%;
  height: 100%;
}

.blog_main_two > div > ul {
  display: flex;
  justify-content: space-between;
  height: 90px;
}

.blog_main_two > div > ul > li:nth-child(1) {
  background-image: linear-gradient(to right, #358cff, #25a8ff);
  transition: width 0.5s;
}

.blog_main_two > div > ul > li:nth-child(2) {
  background-image: linear-gradient(to right, #ff6755, #ff9146);
  transition: width 0.5s;
}

.blog_main_two > div > ul > li:nth-child(3) {
  background-image: linear-gradient(to right, #07f0c5, #1be9cb);
  transition: width 0.5s;
}

.blog_main_two > div > ul > li {
  font-size: 18px;
  color: #fff;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  position: relative;
}

.blog_main_two_div {
  padding: 25px 0 25px 30px;
  z-index: 1;
}

.blog_main_two_title {
    display: flex;
    justify-content: space-between;
    white-space: nowrap;
}

.blog_main_two_hr {
  width: 20px;
  border-top: 2px solid #fff;
}

.blog_main_two_ico_gq {
  transition: transform 0.8s;
  transform: rotate(20deg);
  position: absolute;
  right: -10px;
  top: -10px;
}

.blog_main_two_ico_gh {
  transition: transform 0.8s;
  transform: rotate(0);
  position: absolute;
  right: 10px;
  animation: icoMove 0.5s infinite alternate;
}

@keyframes icoMove {
    from {
        top: 20px;
    }

    to {
        top: 30px;
    }
}

.wz_ico_gq {
  color: #55b2ff;
  font-size: 120px;
}

.wz_ico_gh {
  animation: wz_ico_Move 0.8s forwards;
}

@keyframes wz_ico_Move {
  from {
    color: #55b2ff;
    font-size: 120px;
  }

  to {
    color: #ffffff;
    font-size: 50px;
  }
}

.yx_ico_gq {
  color: #ffa26d;
  font-size: 120px;
}

.yx_ico_gh {
  animation: yx_ico_Move 0.8s forwards;
}

@keyframes yx_ico_Move {
  from {
    color: #ffa26d;
    font-size: 120px;
  }

  to {
    color: #ffffff;
    font-size: 50px;
  }
}

.fw_ico_gq {
  color: #2cf5d0;
  font-size: 120px;
}

.fw_ico_gh {
  animation: fw_ico_Move 0.8s forwards;
}

@keyframes fw_ico_Move {
  from {
    color: #2cf5d0;
    font-size: 120px;
  }

  to {
    color: #ffffff;
    font-size: 50px;
  }
}

.wz_num_gq {
  opacity: 0;
}

.wz_num_gh {
  animation: wz_num_Move 0.8s forwards;
}

@keyframes wz_num_Move {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.yx_num_gq {
  opacity: 0;
}

.yx_num_gh {
  animation: yx_num_Move 0.8s forwards;
}

@keyframes yx_num_Move {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.fw_num_gq {
  opacity: 0;
}

.fw_num_gh {
  animation: fw_num_Move 0.8s forwards;
}

@keyframes fw_num_Move {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.blog_main_two_div_width_gq {
  width: 110px;
}

.blog_main_two_div_width_gh {
  animation: blog_main_two_div_width_Move 0.8s forwards;
}

@keyframes blog_main_two_div_width_Move {
  from {
    width: 110px;
  }

  to {
    width: 180px;
  }
}

@media (max-width: 1200px) {
  .blog_main_two {
    display: none !important;
  }
}
</style>
