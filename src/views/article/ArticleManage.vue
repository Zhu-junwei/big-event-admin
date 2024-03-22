<script setup>
import {
  Edit,
  Delete,
  Plus,
} from '@element-plus/icons-vue';
import {
  articleAddService,
  articleCategoryListService, articleDeleteService,
  articleListService, articleUpdateService,
} from '@/api/article.js'
import {ref} from 'vue'
import {QuillEditor} from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import {useTokenStore} from '@/stores/token.js'
import {ElMessage, ElMessageBox} from "element-plus";

//文章分类数据
const categories = ref([])
//文章列表数据
const articles = ref([])

//用户搜索时选中的分类id
const categoryId = ref('')
//用户搜索时选中的发布状态
const state = ref('')

//控制抽屉状态（是否显示，标题，添加/修改）
const drawerState = ref({
  articleHandle: '',
  drawerTitle: '',
  visibleDrawer: false,
})

const articleDrawerHandle = (articleHandle, row) => {
  drawerState.value.articleHandle = articleHandle;
  if (articleHandle === 'add') {
    drawerState.value.drawerTitle = '添加文章'
  } else if (articleHandle === 'update') {
    drawerState.value.drawerTitle = '修改文章'
    articleModel.value = row;
  }
  drawerState.value.visibleDrawer = true;
};

//添加表单数据模型
const articleModel = ref({
  id: '',
  title: '',
  categoryId: '',
  coverImg: '',
  content: '',
  state: ''
})

//分页条数据
const pageNum = ref(1)//当前页
const total = ref()//总条数
const pageSizes = ref([10, 20, 30, 40, 50])//可选的每页数量
const pageSize = ref(20)//每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
  pageSize.value = size
  getArticles()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
  pageNum.value = num
  getArticles()
}

// 获取文章分类信息
const articleCategoryList = async () => {
  await articleCategoryListService().then(result => {
    categories.value = result.data;
  })
}

// 获取文章列表查询
const getArticles = async () => {
  let params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    categoryId: categoryId.value ?? null,
    state: state.value ?? null
  }
  let result = await articleListService(params);
  //渲染列表数据
  articles.value = result.data.items
  //为列表中添加categoryName属性
  for (let i = 0; i < articles.value.length; i++) {
    let article = articles.value[i];
    for (let j = 0; j < categories.value.length; j++) {
      if (article.categoryId === categories.value[j].id) {
        article.categoryName = categories.value[j].categoryName
      }
    }
  }
  //渲染总条数
  total.value = result.data.total
}

// 清空搜索表单
const clearSearchForm = () => {
  categoryId.value = ''
  state.value = ''
}

// 清空文章表单并隐藏抽屉
const clearArticleModel = () => {
  articleModel.value = {
    id: '',
    title: '',
    categoryId: '',
    coverImg: '',
    content: '<p></p>',
    state: ''
  }
  drawerState.value = {
    articleHandle: '',
    drawerTitle: '',
    visibleDrawer: false,
  }
}

// 文章图片上传前调用，判断文件大小
const beforeImgUpload = (rawFile) => {
  if ((rawFile.size / 1024 / 1024) > 5) {
    ElMessage.error('不能上传大于5MB!')
    return false
  }
  return true
}
// 文章图片上传成功成功回调
const uploadSuccess = (result) => {
  //将图片地址赋值给文章表单的coverImg属性
  articleModel.value.coverImg = result.data;
}

//添加/修改文章
const commitArticle = async (state) => {
  let articleHandle = drawerState.value.articleHandle;
  articleModel.value.state = state;
  let result;
  if (articleHandle === 'add') {
    result = await articleAddService(articleModel.value);
  } else {
    result = await articleUpdateService(articleModel.value);
  }
  ElMessage.success(result.msg ? result.msg : drawerState.value.drawerTitle + '成功')
  //再次调用getArticles,获取文章
  await getArticles()
  //隐藏抽屉
  clearArticleModel();
}

// 删除文章
const articleDelete = async (row) => {
  ElMessageBox.confirm(
      '确认要删除【' + row.title + '】文章吗 ?',
      '提醒',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(async () => {
    await articleDeleteService(row.id)
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    await getArticles()
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '取消删除',
    })
  })
}

articleCategoryList();
getArticles();

</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>文章管理</span>
        <div class="extra">
          <el-button @click="articleDrawerHandle('add')">添加文章</el-button>
        </div>
      </div>
    </template>
    <!-- 搜索表单 -->
    <el-form inline class="article-search-form">
      <el-form-item label="文章分类：">
        <el-select placeholder="请选择" v-model="categoryId">
          <el-option
              v-for="c in categories"
              :key="c.id"
              :label="c.categoryName"
              :value="c.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="发布状态：">
        <el-select placeholder="请选择" v-model="state">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getArticles()">搜索</el-button>
        <el-button @click="clearSearchForm()">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 文章列表 -->
    <el-table :data="articles" style="width: 100%">
      <el-table-column label="文章标题" width="400" prop="title"></el-table-column>
      <el-table-column label="分类" prop="categoryName"></el-table-column>
      <el-table-column label="发表时间" prop="createTime"></el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="articleDrawerHandle('update',row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="articleDelete(row)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"/>
      </template>
    </el-table>
    <!-- 分页条 -->
    <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="pageSizes"
                   layout="jumper, total, sizes, prev, pager, next" background :total="total"
                   @size-change="onSizeChange"
                   @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end"/>

    <!-- 抽屉 -->
    <el-drawer v-model="drawerState.visibleDrawer" :title="drawerState.drawerTitle" direction="rtl" size="50%">
      <!-- 添加文章表单 -->
      <el-form :model="articleModel" label-width="100px">
        <el-form-item label="文章标题">
          <el-input v-model="articleModel.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="文章分类">
          <el-select placeholder="请选择" v-model="articleModel.categoryId">
            <el-option v-for="c in categories" :key="c.id" :label="c.categoryName" :value="c.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="文章封面">
          <!--
               auto-upload:设置是否自动上传
               action:设置服务器接口路径
               name:设置上传的文件字段名
               headers:设置上传的请求头
               on-success:设置上传成功的回调函数
           -->
          <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false"
                     action="/api/upload"
                     name="file"
                     :headers="{'Authorization':useTokenStore().token}"
                     :on-success="uploadSuccess"
                     :before-upload="beforeImgUpload"
          >
            <img v-if="articleModel.coverImg" :src="articleModel.coverImg" class="avatar" alt=""/>
            <el-icon v-else class="avatar-uploader-icon">
              <Plus/>
            </el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item label="文章内容">
          <div class="editor">
            <QuillEditor
                theme="snow"
                v-model:content="articleModel.content"
                contentType="html"
            >
            </QuillEditor>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="commitArticle('已发布')">发布</el-button>
          <el-button type="info" @click="commitArticle('草稿')">草稿</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </el-card>
</template>

<style lang="scss">

/* 搜索表单 */
.article-search-form .el-select {
  --el-select-width: 220px;
}

.page-container {
  min-height: 100%;
  box-sizing: border-box;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

/* 抽屉样式 */
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 2px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 30px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.editor {
  width: 100%;

  :deep(QuillEditor) {
    min-height: 200px;
  }
}
</style>