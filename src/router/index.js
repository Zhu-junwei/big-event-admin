// 导入vue-router
import {createRouter, createWebHistory} from 'vue-router'

//导入组件
import LoginVue from '@/views/Login.vue'
import Layout from '@/views/Layout.vue'
import ArticleCategory from '@/views/article/ArticleCategory.vue'
import ArticleManage from '@/views/article/ArticleManage.vue'
import UserAvatar from '@/views/user/UserAvatar.vue'
import UserInfo from '@/views/user/UserInfo.vue'
import UserResetPassword from '@/views/user/UserResetPassword.vue'

//定义路由关系
const routes = [

    {
        path: '/login',
        component: LoginVue,
    },
    {
        path: '/',
        component: Layout,
        redirect: '/article/manage',
        children: [
            { path: '/article/category', component: ArticleCategory},
            { path: '/article/manage', component: ArticleManage},
            { path: '/user/info', component: UserInfo},
            { path: '/user/avatar', component: UserAvatar},
            { path: '/user/resetPassword', component: UserResetPassword},
        ]
    },
]

//创建路由器
const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router