import './assets/main.scss'
import {createApp} from 'vue'
import router from '@/router'   //路由
import {createPinia} from 'pinia'   //变量共享
import {createPersistedState} from 'pinia-persistedstate-plugin' //变量本地存储
import ElementPlus from 'element-plus'  //基于vue3的组件库
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'   //设置语言
import 'element-plus/dist/index.css'
import App from './App.vue'

const app = createApp(App)

app.use(router)
    .use(ElementPlus, {locale: zhCn})
    .use(createPinia().use(createPersistedState()))
    .mount('#app')