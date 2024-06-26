<script setup>
import {User, Lock} from '@element-plus/icons-vue'
import {ElMessage} from 'element-plus'
import {userRegisterService, userLoginService} from '@/api/user.js'
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import { useTokenStore } from '@/stores/token.js'

//路由器
const router = useRouter();

//调用useTokenStore得到状态
const tokenStore = useTokenStore();

//控制注册与登录表单的显示， 默认显示注册
const isRegister = ref(false)
//定义数据模型
const registerData = ref({
  username: '',
  password: '',
  rePassword: ''
})

// 校验确认密码
const checkRePassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次确认密码'))
  } else if (value !== registerData.value.password) {
    callback(new Error('请确保两次输入的密码一样'))
  } else {
    callback()
  }
}

// 定义表单校验规则
const rules = ({
  username: [
    {required: true, message: '请输入用户名', trigger: ['change', 'blur']},
    {min: 5, max: 16, message: '长度为5到16位非空字符', trigger: ['blur', 'change']},
  ],
  password: [
    {required: true, message: '请输入密码', trigger: ['change', 'blur']},
    {min: 5, max: 16, message: '长度为5到16位非空字符', trigger: ['change', 'blur']},
  ],
  rePassword: [
    {validator: checkRePassword, trigger: ['change', 'blur']},
  ],
})

// 调用后台接口，完成注册
const register = async () => {
  let result = await userRegisterService(registerData.value);
  ElMessage.success(result.msg ?? "注册成功")
  isRegister.value = false
  clearRegisterDate()
}

// 调用后台登录接口
const login = async () => {
  let result = await userLoginService(registerData.value);
  ElMessage.success(result.msg ?? "登录成功")
  //保存token
  tokenStore.setToken(result.data)
  await router.push('/')
}

// 点击切换登录与注册表单，清空用户名和密码
const clearRegisterDate = () => {
  registerData.value = {
    username: '',
    password: '',
    rePassword: ''
  }
}

</script>

<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <!-- 注册表单 -->
      <el-form ref="form" size="large" autocomplete="off" v-if="isRegister" :model="registerData" :rules="rules">
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input :prefix-icon="Lock" type="password" v-model="registerData.password"
                    placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="rePassword">
          <el-input :prefix-icon="Lock" type="password" v-model="registerData.rePassword"
                    placeholder="请输入再次密码"></el-input>
        </el-form-item>
        <!-- 注册按钮 -->
        <el-form-item>
          <el-button class="button" type="primary" auto-insert-space @click="register">
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false;clearRegisterDate()">
            ← 返回
          </el-link>
        </el-form-item>
      </el-form>
      <!-- 登录表单 -->
      <el-form ref="form" size="large" autocomplete="off" v-else :model="registerData" :rules="rules">
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码"
                    v-model="registerData.password"></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <!-- 登录按钮 -->
        <el-form-item>
          <el-button class="button" type="primary" auto-insert-space @click="login">登录</el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true;clearRegisterDate()">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
/* 样式 */
.login-page {
  height: 100vh;
  background-color: #fff;

  .bg {
    background: url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
    url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }

  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;

    .title {
      margin: 0 auto;
    }

    .button {
      width: 100%;
    }

    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>