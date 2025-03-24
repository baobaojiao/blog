import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";
import variable from "../js/variable";

const title = "baobaojiaoBlog";

//路由配置
const routes = [
  {
    meta: { title: title },
    path: "/",
    component: () => import("../components/frontdesk/index.vue"),
    children: [
      {
        name: "Zhongxin",
        path: "",
        component: () => import("../components/frontdesk/Zhongxin.vue"),
      },
      {
        name: "Article",
        path: "Article/:id",
        component: () => import("../components/frontdesk/Articles.vue"),
      },

      {
        meta: { title: "归档 | " + title + "📚" },
        name: "Archives",
        path: "Archives",
        component: () => import("../components/frontdesk/Archives.vue"),
      },
      {
        meta: { title: "关于 | " + title + "❤" },
        name: "About",
        path: "About",
        component: () => import("../components/frontdesk/About.vue"),
      },
      {
        meta: { title: "闲言碎语 | " + title + "📝" },
        name: "Moments",
        path: "Moments",
        component: () => import("../components/frontdesk/Moments.vue"),
      },
      {
        meta: { title: "友联 | " + title + "🔗" },
        name: "Links",
        path: "Links",
        component: () => import("../components/frontdesk/Links.vue"),
      },
      {
        meta: { title: "视频解析 | " + title + "📽" },
        name: "VideoJx",
        path: "VideoJx",
        component: () => import("../components/frontdesk/VideoJx.vue"),
      },
      {
        meta: { title: "树洞 | " + title + "📢" },
        name: "TreeHole",
        path: "TreeHole",
        component: () => import("../components/frontdesk/TreeHole.vue"),
      },
      {
        name: "Message",
        path: "Message",
        component: () => import("../components/frontdesk/Message/Message.vue"),
      },
      {
        name: "LoginQQ",
        path: "LoginQQ",
        component: () => import("../components/frontdesk/LoginQQ.vue"),
      },
    ],
  },
  {
    name: "Admin",
    path: "/Admin",
    redirect: "/Admin/Dashboard",
    component: () => import("../components/admin/Home.vue"),
    meta: {
      title: "后台管理",
    },
    children: [
      {
        meta: { title: "控制台 - " + title },
        name: "Dashboard",
        path: "Dashboard",
        component: () => import("../components/admin/Dashboard.vue"),
      },
      {
        meta: { title: "角色管理 - " + title },
        name: "Role",
        path: "Role",
        component: () => import("../components/admin/Role.vue"),
      },
      {
        meta: { title: "菜单管理 - " + title },
        name: "Menu",
        path: "Menu",
        component: () => import("../components/admin/Menu.vue"),
      },
      {
        meta: { title: "用户管理 - " + title },
        name: "User",
        path: "User",
        component: () => import("../components/admin/User.vue"),
      },
      {
        meta: { title: "文章管理 - " + title },
        name: "Essay",
        path: "Essay",
        component: () => import("../components/admin/Essays.vue"),
      },
      {
        meta: { title: "说说管理 - " + title },
        name: "Cross",
        path: "Cross",
        component: () => import("../components/admin/Cross.vue"),
      },
      {
        meta: { title: "音乐管理 - " + title },
        name: "Music",
        path: "Music",
        component: () => import("../components/admin/Music.vue"),
      },
      {
        meta: { title: "友联管理 - " + title },
        name: "LinksGl",
        path: "Links",
        component: () => import("../components/admin/Links.vue"),
      },
      {
        meta: { title: "打赏管理 - " + title },
        name: "Beg",
        path: "Beg",
        component: () => import("../components/admin/Beg.vue"),
      },

      {
        meta: { title: "评论管理 - " + title },
        name: "Comment",
        path: "Comment",
        component: () => import("../components/admin/Comment.vue"),
      },
      {
        meta: { title: "树洞管理 - " + title },
        name: "TreeHoleGl",
        path: "TreeHoleGl",
        component: () => import("../components/admin/TreeHole.vue"),
      },
      {
        meta: { title: "表情管理 - " + title },
        name: "BQ",
        path: "BQ",
        component: () => import("../components/admin/BQ.vue"),
      },
      {
        meta: { title: "访问管理 - " + title },
        name: "Access",
        path: "Access",
        component: () => import("../components/admin/Access.vue"),
      },
      {
        meta: { title: "文件管理 - " + title },
        name: "Files",
        path: "Files",
        component: () => import("../components/admin/Files.vue"),
      },
      {
        meta: { title: "系统配置 - " + title },
        name: "Sys",
        path: "Sys",
        component: () => import("../components/admin/Sys.vue"),
      },
    ],
  },
  {
    path: "/404",
    component: () => import("../components/Exception.vue"),
  },
  {
    path: "/Inhibit",
    component: () => import("../components/Inhibit.vue"),
  },
  {
    path: "/:pathMatch(.*)",
    redirect: "/404",
  },
];

const router = createRouter({
  routes, // 你的路由配置
  history: createWebHistory()
  // history: (() => {
  //   if (
  //     typeof window !== "undefined" &&
  //     window.history &&
  //     window.history.pushState
  //   ) {
  //     // 检查浏览器是否支持 HTML5 History API
  //     return createWebHistory();
  //   } else {
  //     // 如果不支持，使用 createWebHashHistory
  //     return createWebHashHistory();
  //   }
  // })(),

});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || title; // 设置页面标题，如果未设置则使用默认标题
  if (to.name != "Article") {
    variable.lyjzdh.value = true; //过度动画
  }
  next(); // 继续导航
});

router.afterEach((to, from) => {
  variable.lyjzdh.value = false; //过度动画
});

export default router;
