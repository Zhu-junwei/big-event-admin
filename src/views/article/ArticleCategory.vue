<script setup>
import {Edit, Delete} from '@element-plus/icons-vue'
import {ref} from 'vue'
import {
  articleCategoryListService,
  articleCategoryAddService,
  articleCategoryUpdateService,
  articleCategoryDeleteService
} from '@/api/article.js'
import {ElMessage, ElMessageBox} from "element-plus";

// 所有文章分类数据
const categories = ref()
// 控制添加/修改文章分类弹窗
const dialogVisible = ref(false)
// 弹框标题
const dialogTitle = ref('')
// 添加/修改分类数据模型
const categoryModel = ref({
  categoryName: '',
  categoryAlias: ''
})

//添加分类表单校验
const rules = {
  categoryName: [
    {required: true, message: '请输入分类名称', trigger: 'blur'},
  ],
  categoryAlias: [
    {required: true, message: '请输入分类别名', trigger: 'blur'},
  ]
}

//获取所有文章分类数据
const getAllCategory = async () => {
  let result = await articleCategoryListService();
  categories.value = result.data;
}
getAllCategory();

// 在添加/修改文件分类弹框中点 取消
const hiddeDialog = () => {
  dialogVisible.value = false
  categoryModel.value = {
    categoryName: '',
    categoryAlias: ''
  }
}

//点击添加分类或者修改分类后弹框
const showDialog = (titleValue, row) => {
  dialogTitle.value = titleValue
  dialogVisible.value = true
  if (row) {
    categoryModel.value = {
      id: row.id,
      categoryName: row.categoryName,
      categoryAlias: row.categoryAlias
    }
  }
}

// 在添加文章分类后 点确认
const addCategory = async () => {
  let result = await articleCategoryAddService(categoryModel.value);
  ElMessage.success(result.message ? result.message : '添加成功')
  //隐藏弹窗
  hiddeDialog();
  //再次访问后台接口，查询所有分类
  await getAllCategory();
}

// 在修改文章分类后 点确认
const updateCategory = async () => {
  let result = await articleCategoryUpdateService(categoryModel.value)
  ElMessage.success(result.message ? result.message : '修改成功')
  //隐藏弹窗
  hiddeDialog();
  //再次访问后台接口，查询所有分类
  await getAllCategory()
}

// 删除文章分类
const deleteCategory = async (row) => {
  ElMessageBox.confirm(
      '确认要删除【' + row.categoryName + '】文章分类吗 ?',
      '提醒',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(async () => {
    await articleCategoryDeleteService(row.id)
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    await getAllCategory()
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '取消删除',
    })
  })
}

</script>
<template>
  <el-card class="page-container">

    <!--  头部信息  -->
    <template #header>
      <div class="header">
        <span>文章分类</span>
        <div class="extra">
          <el-button type="primary" @click="showDialog('添加分类',null)">添加分类</el-button>
        </div>
      </div>
    </template>

    <!--  数据展示  -->
    <el-table :data="categories" style="width: 100%">
      <el-table-column label="序号" width="100" type="index"></el-table-column>
      <el-table-column label="分类名称" prop="categoryName"></el-table-column>
      <el-table-column label="分类别名" prop="categoryAlias"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="showDialog('修改分类', row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="deleteCategory(row)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"/>
      </template>
    </el-table>

    <!-- 添加分类弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%">
      <el-form :model="categoryModel" :rules="rules" label-width="100px" style="padding-right: 30px">
        <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model="categoryModel.categoryName" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="categoryAlias">
          <el-input v-model="categoryModel.categoryAlias" minlength="1" maxlength="15"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
            <el-button @click="hiddeDialog()">取消</el-button>
            <el-button type="primary" @click="dialogTitle ==='添加分类' ? addCategory():updateCategory()"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>