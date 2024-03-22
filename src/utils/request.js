/**
 * 配置并创建一个axios实例
 * 主要用于设置基础URL和添加响应拦截器
 *
 * @export
 * @returns 返回一个配置好的axios实例
 */
import axios from "axios";
import {ElMessage} from 'element-plus'
import { useTokenStore } from '@/stores/token.js';
import router from '@/router';

const baseURL = '/api'; // 设置基础URL
let instance = axios.create({baseURL}); // 创建axios实例


//添加请求拦截器
instance.interceptors.request.use(
    (config)=>{
        //在发送请求之前做什么
        let token = useTokenStore().token;
        //如果token中有值，在携带
        if(token){
            config.headers.Authorization=token
        }
        return config
    },
    (err)=>{
        //如果请求错误做什么
        return Promise.reject(err)
    }
)

// 添加响应拦截器，用于统一处理响应结果或错误
instance.interceptors.response.use(
    result => {
        if (result.data.code === 0) {
            return result.data; // 成功响应时，返回响应数据
        }
        ElMessage.error(result.data.msg ? result.data.msg : '服务异常');
    },
    error => {
        //如果响应状态码时401，代表未登录，给出对应的提示，并跳转到登录页
        if (error.response.status === 401){
            ElMessage.error('请先登录！')
            router.push("/login")
        } else {
            ElMessage.error('服务异常！')
        }
        return Promise.reject(error); // 将错误状态转化为Promise拒绝状态
    }
)

export default instance;
