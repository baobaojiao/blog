import { createApp   } from 'vue'
import './css/style.css'
import App from './App.vue'
import router from './router/index.js'
import {API,prefix} from './js/axios'

//引入阿里矢量图
import '../public/ali/iconfont';
import '../public/ali/iconfont.css';


const app = createApp(App)

import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
app.use(ElementPlus, {
  locale: zhCn,
})

//引入View UI Plus  
import ViewUIPlus from 'view-ui-plus'
import 'view-ui-plus/dist/styles/viewuiplus.css'
import { Notice } from 'view-ui-plus';
// 全局配置
Notice.config({
  top: 100,
});


app.provide('axios', API)
  .provide('prefix',prefix)
  .use(router)
  .use(ViewUIPlus)
.mount('#app');


