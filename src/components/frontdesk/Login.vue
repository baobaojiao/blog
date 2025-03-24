<template>
  <Modal
    v-model="variable.loginState.value"
    :mask-closable="false"
    :width="584"
    :footer-hide="true"
  >
    <template #close>
      <Icon type="md-close-circle" :size="25" />
    </template>
    <div class="login_main">
      <div class="img">
        <img :src="variable.pz_all.value.logo" alt="" />
      </div>
      <div class="nav" v-if="navFontState != null">
        <div @click="loginNavClick('login')" :class="{ navFont: navFontState }">
          登录
        </div>
        <div
          @click="loginNavClick('register')"
          :class="{ navFont: !navFontState }"
        >
          注册
        </div>
        <div class="bk" :style="{ transform: transformZ }"></div>
      </div>

      <!-- 登录 -->
      <div v-show="divState.loginDivState">
          <Login @on-submit="logonSubmit">
              <UserName name="username" maxlength="50" />
              <Password name="password" maxlength="20" :enter-to-submit="true" />
              <div class="demo-auto-login">
                  <div style="display: flex; align-items: center">
                      <p style="font-size: 12px; color: #777777">快速登录：</p>
                      <svg class="iconQQ" aria-hidden="true" @click="qqLogin">
                          <use xlink:href="#icon-QQ"></use>
                      </svg>
                  </div>
                  <a @click="loginNavClick('forget')">忘记密码</a>
              </div>
              <Submit />
          </Login>
      </div>

      <!-- 注册 -->
      <div v-show="divState.registerDivState">
        <Login @on-submit="registerSubmit">
          <div style="margin-bottom: 20px">
            <Input
              v-model="registerAccount"
              size="large"
              placeholder="请设置一个账号用于登录"
              prefix="md-ionitron"
              :rules="accountRule"
              @on-blur="accountBlue"
            />
            <span style="color: #ed4014" v-show="registerAccountState"
              >请输入不低于3位数的字符</span
            >
          </div>

          <UserName name="username" />
          <Email name="mail" @on-change="onChangeEmail" maxlength="20" />
          <div class="captchaDiv">
            <Input
              prefix="md-key"
              placeholder="验证码"
              style="width: 75%"
              size="large"
              v-model="code"
              maxlength="4"
              :show-word-limit="true"
            />
            <div v-if="yzmState != null">
              <Button size="large" @click="sendCaptcha" v-show="yzmState"
                >获取验证码</Button
              >
              <div class="countDownDiv" v-show="!yzmState">
                <CountDown :target="djsTime" @on-end="handleEnd" v-font="20" />
              </div>
            </div>
          </div>
          <Password
            name="password"
            placeholder="至少6位密码"
            :password="true"
            maxlength="18"
            :rules="passwordRule"
            @on-change="onChangePassword"
          />
          <Password
            name="passwordConfirm"
            placeholder="确认密码"
            :password="true"
            maxlength="18"
            :rules="passwordConfirmRule"
          />
          <Submit>注册</Submit>
        </Login>
      </div>

      <!-- 忘记密码 -->
      <div v-show="divState.forgetDivState" style="margin-top: 20px">
        <Login @on-submit="forgetSubmit">
          <Email name="mail" @on-change="forgetonChangeEmail" maxlength="20" />
          <div class="captchaDiv">
            <Input
              prefix="md-key"
              placeholder="验证码"
              style="width: 75%"
              size="large"
              v-model="forgetonCode"
              maxlength="4"
              :show-word-limit="true"
            />
            <div v-if="forgetonyzmState != null">
              <Button
                size="large"
                @click="sendForgetonCaptcha"
                v-show="forgetonyzmState"
                >获取验证码</Button
              >
              <div class="countDownDiv" v-show="!forgetonyzmState">
                <CountDown
                  :target="djsTime"
                  @on-end="forgetonHandleEnd"
                  v-font="20"
                />
              </div>
            </div>
          </div>
          <Password
            name="password"
            placeholder="新的至少6位密码"
            :password="true"
            maxlength="18"
            :rules="passwordRule"
            @on-change="forgetonChangePassword"
          />
          <Password
            name="passwordConfirm"
            placeholder="确认密码"
            :password="true"
            maxlength="18"
            :rules="passwordConfirmRule2"
          />
          <div class="demo-auto-login">
            <a @click="loginNavClick('login')">想起来了？去登陆</a>
          </div>
          <Submit>修改</Submit>
        </Login>
      </div>
    </div>
  </Modal>
</template>
<script setup>
import { Notice, Modal } from "view-ui-plus";
const axios = inject("axios");

import variable from "../../js/variable";

const divState = ref({
  //卡片状态
  loginDivState: true,
  registerDivState: false,
  forgetDivState: false,
});

const navFontState = ref(true); //选项
const transformZ = ref("translateX(0)");
function loginNavClick(type) {
  if (type == "login") {
    navFontState.value = true;
    transformZ.value = "translateX(0)";
    divState.value.loginDivState = true;
    divState.value.registerDivState = false;
    divState.value.forgetDivState = false;
  } else if (type == "register") {
    navFontState.value = false;
    transformZ.value = "translateX(240px)";
    divState.value.loginDivState = false;
    divState.value.registerDivState = true;
    divState.value.forgetDivState = false;
  } else if (type == "forget") {
    navFontState.value = null;
    divState.value.loginDivState = false;
    divState.value.registerDivState = false;
    divState.value.forgetDivState = true;
  }
}

// -----------------------------登录开始--------------------------------
//账号密码登录
function logonSubmit(valid, { username, password }) {
    if (valid) {
        axios
            .post(
                "user/login",
                {
                    account: username,
                    password: password,
                },
                { loading: true }
            )
            .then((response) => {
                let res = response.data;
                if (res.msg == "成功") {
                    ElMessage({
                        message: "登录成功！",
                        type: "success",
                    });
                    variable.loginState.value = false;
                    localStorage.setItem("aduBlogToken", res.data.accessToken);
                    localStorage.setItem("refreshToken", res.data.refreshToken);
                    variable.aduBlogToken.value = res.data.accessToken;
                } else {
                    ElMessage({
                        message: res.msg,
                        type: "error",
                    });
                }
            })
            .catch();
    }
}

//qq登录
function qqLogin() {
    axios
        .get("qq/getQQCode", { loading: true })
        .then((response) => {
            let res = response.data;
            if (res.code == 200) {
                window.location.href = res.data;
            }
        })
        .catch();
}
// -----------------------------登录结束--------------------------------

// -----------------------------注册开始--------------------------------

const registerAccount = ref(null); //注册时账号
const registerPassword = ref(null); //注册时密码
const registerMail = ref(null); //注册时QQ邮箱
const djsTime = ref(0); //倒计时时间
const yzmState = ref(true);
const code = ref(null); //验证码

//注册密码校验规则
const validatePassCheck = (rule, value, callback) => {
  if (value !== registerPassword.value) {
    callback(new Error("两次输入的密码不匹配！"));
  } else {
    callback();
  }
};
const passwordRule = [
  {
    required: true,
    message: "密码不能为空！",
    trigger: "change",
  },
  {
    min: 6,
    message: "密码不能少于6位！",
    trigger: "change",
  },
];
const passwordConfirmRule = [
  {
    required: true,
    message: "确认密码不能为空！",
    trigger: "change",
  },
  { validator: validatePassCheck, trigger: "change" },
];

const accountRule = [
  {
    required: true,
    message: "账号不能为空！",
    trigger: "change",
  },
  {
    min: 3,
    message: "账号不能少于3位！",
    trigger: "change",
  },
];

//注册的账号校验
const registerAccountState = ref(false);
function accountBlue() {
  if (registerAccount.value == null) {
    registerAccountState.value = true;
  } else if (registerAccount.value.length < 3) {
    registerAccountState.value = true;
  } else {
    registerAccountState.value = false;
  }
}

//注册邮箱框数据发生改变时触发
function onChangeEmail(mail) {
  registerMail.value = mail;
}
//注册密码框数据发生改变时触发
function onChangePassword(password) {
  registerPassword.value = password;
}

//发送验证码
function sendCaptcha() {
  if (registerMail.value == null) {
    Notice.warning({
      title: "邮箱不能为空",
    });
    return;
  }

  axios
    .post("user/sendCode", { email: registerMail.value, type: 1 })
    .then((response) => {
      let res = response.data;
      if (res.msg == "成功") {
        Notice.success({
          title: "发送成功，请查看您的邮件",
        });
        djsTime.value = new Date().getTime() + 60000;
        yzmState.value = false;
      } else if (res.code == 9 || res.code == 8 || res.code == 10) {
        Notice.warning({
          title: res.msg,
        });
      } else {
        Notice.error({
          title: "发送失败，请稍后重试",
        });
      }
    })
    .catch();
}

//倒计时结束
function handleEnd() {
  yzmState.value = true;
}

//注册
function registerSubmit(valid, { username, mail, password }) {
  if (registerAccount.value == null) {
    registerAccountState.value = true;
    return;
  } else if (registerAccount.value.length < 3) {
    registerAccountState.value = true;
    return;
  }

  if (valid) {
    if (code.value == null) {
      Notice.warning({
        title: "验证码不能为空",
      });
      return;
    }

    axios
      .post("user/registered", {
        account: registerAccount.value,
        nickname: username,
        password: password,
        email: mail,
        code: code.value,
      })
      .then((response) => {
        let res = response.data;
        if (res.msg == "成功") {
          Notice.success({
            title: "恭喜，注册成功！",
          });
          navFontState.value = true;
          transformZ.value = "translateX(0)";
          divState.value.loginDivState = true;
          divState.value.registerDivState = false;
          divState.value.forgetDivState = false;
        } else {
          Notice.error({
            title: res.msg,
          });
        }
      })
      .catch();
  }
}
// -----------------------------注册结束--------------------------------

// -----------------------------忘记密码开始--------------------------------
const forgetonMail = ref(null); //忘记密码时QQ邮箱
const forgetonCode = ref(null); //code
const forgetonPassword = ref(null); //忘记密码时密码
const forgetonyzmState = ref(true);

//注册密码校验规则
const validatePassCheck2 = (rule, value, callback) => {
  if (value !== forgetonPassword.value) {
    callback(new Error("两次输入的密码不匹配！"));
  } else {
    callback();
  }
};
const passwordConfirmRule2 = [
  {
    required: true,
    message: "确认密码不能为空！",
    trigger: "change",
  },
  { validator: validatePassCheck2, trigger: "change" },
];

//忘记密码邮箱框数据发生改变时触发
function forgetonChangeEmail(mail) {
  forgetonMail.value = mail;
}
//注册密码框数据发生改变时触发
function forgetonChangePassword(password) {
  forgetonPassword.value = password;
}
//倒计时结束
function forgetonHandleEnd() {
  forgetonyzmState.value = true;
}
//发送验证码
function sendForgetonCaptcha() {
  if (forgetonMail.value == null) {
    Notice.warning({
      title: "邮箱不能为空",
    });
    return;
  }

  axios
    .post("user/sendCode", { email: forgetonMail.value, type: 2 })
    .then((response) => {
      let res = response.data;
      if (res.msg == "成功") {
        Notice.success({
          title: "发送成功，请查看您的邮件",
        });
        djsTime.value = new Date().getTime() + 60000;
        forgetonyzmState.value = false;
      } else if (res.code == 9 || res.code == 8 || res.code == 10) {
        Notice.warning({
          title: res.msg,
        });
      } else {
        Notice.error({
          title: "发送失败，请确认邮箱填写正确",
        });
      }
    })
    .catch();
}
//重置密码
function forgetSubmit(valid, { mail, password }) {
  if (valid) {
    if (forgetonCode.value == null) {
      Notice.warning({
        title: "验证码不能为空",
      });
      return;
    }
    axios
      .post("user/forgetPassword", {
        password: password,
        email: mail,
        code: forgetonCode.value,
      })
      .then((response) => {
        let res = response.data;
        if (res.msg == "成功") {
          Notice.success({
            title: "密码修改成功！",
          });
          navFontState.value = true;
          transformZ.value = "translateX(0)";
          divState.value.loginDivState = true;
          divState.value.registerDivState = false;
          divState.value.forgetDivState = false;
        } else {
          Notice.error({
            title: res.msg,
          });
        }
      })
      .catch();
  }
}

// -----------------------------忘记密码结束--------------------------------
</script>
<style  scoped>
.login_main {
  margin-top: 20px;
  padding: 0 30px 10px;
}

.img {
  text-align: center;
}

.img img {
  width: 70px;
}

.nav {
  display: flex;
  text-align: center;
  user-select: none;
  position: relative;
  margin: 20px 0 40px;
}

.login_main > .nav > div {
  flex: 1;
  letter-spacing: 2px;
  font-size: 18px;
  cursor: pointer;
}

.navFont {
  color: #000;
}

.bk {
  margin: 0 25px;
  border: 1px solid #2d8cf0;
  width: 40%;
  position: absolute;
  bottom: -5px;
  transition: 0.5s;
}

.demo-auto-login {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.iconQQ {
    cursor: pointer;
    width: 25px;
    height: 25px;
}

.captchaDiv {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
}

.countDownDiv {
  border-radius: 3px;
  border: 1px solid rgb(224, 224, 224);
  display: flex;
  align-items: center;
  padding: 4px 12px;
  cursor: pointer;
}
</style>
