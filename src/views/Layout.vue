<script setup>
import {
  Management,
  Promotion,
  UserFilled,
  User,
  Crop,
  EditPen,
  SwitchButton,
  CaretBottom
} from '@element-plus/icons-vue'
import {ref} from 'vue'
import {userInfoGetService} from '@/api/user.js'
import {useUserInfoStore} from '@/stores/user.js';
import {useTokenStore} from '@/stores/token.js';
import {useRouter} from 'vue-router'
import {ElMessage, ElMessageBox} from "element-plus";

const userInfoStore = useUserInfoStore();
const tokenStore = useTokenStore();
const router = useRouter();

//获取个人信息
const getUserInf = async () => {
  let result = await userInfoGetService();
  //存储pinia
  userInfoStore.info = result.data;
}
getUserInf()

const handleCommand = (command) => {
  if (command === '/logout') {
    ElMessageBox.confirm(
        '确认要退出登录吗 ?',
        '提醒',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
    ).then(() => {
      // await articleDeleteService(row.id)
      ElMessage({
        type: 'success',
        message: '退出成功',
      })
      // 清空pinia
      userInfoStore.removeInfo();
      tokenStore.removeToken();
      // 跳转到登录页
      router.push('/login');
    }).catch(() => {
      ElMessage({
        type: 'info',
        message: '取消退出',
      })
    })
  } else {
    router.push(command);
  }

}
</script>

<template>
  <el-container class="layout-container">
    <!-- 左侧菜单 -->
    <el-aside width="200px">
      <div class="el-aside__logo"></div>
      <el-menu active-text-color="#ffd04b" background-color="#232323" text-color="#fff"
               router>
        <el-menu-item index="/article/category">
          <el-icon>
            <Management/>
          </el-icon>
          <span>文章分类</span>
        </el-menu-item>
        <el-menu-item index="/article/manage">
          <el-icon>
            <Promotion/>
          </el-icon>
          <span>文章管理</span>
        </el-menu-item>
        <el-sub-menu index="">
          <template #title>
            <el-icon>
              <UserFilled/>
            </el-icon>
            <span>个人中心</span>
          </template>
          <el-menu-item index="/user/info">
            <el-icon>
              <User/>
            </el-icon>
            <span>基本资料</span>
          </el-menu-item>
          <el-menu-item index="/user/avatar">
            <el-icon>
              <Crop/>
            </el-icon>
            <span>更换头像</span>
          </el-menu-item>
          <el-menu-item index="/user/resetPassword">
            <el-icon>
              <EditPen/>
            </el-icon>
            <span>重置密码</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <!-- 右侧主区域 -->
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <div><strong>{{ userInfoStore.info.nickname }}</strong></div>
        <el-dropdown placement="bottom-end" @command="handleCommand">
                    <span class="el-dropdown__box">
                        <el-avatar :src="userInfoStore.info.userPic" alt="avatar"/>
                        <el-icon>
                            <CaretBottom/>
                        </el-icon>
                    </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="/user/info" :icon="User">基本资料</el-dropdown-item>
              <el-dropdown-item command="/user/avatar" :icon="Crop">更换头像</el-dropdown-item>
              <el-dropdown-item command="/user/resetPassword" :icon="EditPen">重置密码</el-dropdown-item>
              <el-dropdown-item command="/logout" :icon="SwitchButton">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <!-- 中间区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
      <!-- 底部区域 -->
      <el-footer>大事件 ©2023 Created by 黑马程序员</el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;

  .el-aside {
    background-color: #232323;

    &__logo {
      height: 120px;
      background: url('@/assets/logo.png') no-repeat center / 120px auto;
    }

    .el-menu {
      border-right: none;
    }
  }

  .el-header {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .el-dropdown__box {
      display: flex;
      align-items: center;

      .el-icon {
        color: #999;
        margin-left: 10px;
      }

      &:active,
      &:focus {
        outline: none;
      }
    }
  }

  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}
</style>