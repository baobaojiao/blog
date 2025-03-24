import axios from "axios";
import router from "../router/index.js";

let prefix = "http://localhost:8080";

// 从localStorage获取token
const token = localStorage.getItem("aduBlogToken");
// 设置token
if (token) {
  axios.defaults.headers.common["Authorization"] = token;
}

//使用axios下面的create([config])方法创建axios实例，其中config参数为axios最基本的配置信息。
const API = axios.create({
  baseURL: prefix, //请求后端数据的基本地址
  // timeout: 5000    //请求超时设置，单位ms
});

// 请求拦截器
let loadingInstance;
API.interceptors.request.use(
  (config) => {
    //只在需要加载动画的请求设置
    if (config.loading) {
      loadingInstance = ElLoading.service({
        fullscreen: true,
        text: "Loading...",
      });
    }

    //当在后台管理页面时且未登录，禁止访问，跳转到首页
    if (
      window.location.pathname.match(/Admin/) &&
      localStorage.getItem("aduBlogToken") == null
    ) {
      router.push("/");
      ElMessage({
          grouping: true,
        message: "非法进入",
        type: "warning",
      });
      return Promise.reject("未登录，请求被阻止");
    }

    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器
API.interceptors.response.use(
  (response) => {
    // 在请求完成后关闭加载动画
    if (response.config.loading) {
      loadingInstance.close();
    }

    const res = response.data;
    if (res.code === 10) {
        localStorage.removeItem("aduBlogToken");
        //只有后台管理才会跳转到首页
        if (window.location.pathname.match(/Admin/)) {
            router.push("/");
            ElMessage({
                grouping: true,
                message: "登录过期，请重新登录",
                type: "warning",
            });
        }
    }

    if (res.code === 11) {
      ElMessage({
          grouping: true,
        message: res.msg,
        type: "warning",
      });
    }

    if (res.code === -2) {
      router.push("/Inhibit");
    }

    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//导出建立的axios实例模块
export { API, prefix };
