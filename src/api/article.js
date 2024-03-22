//导入请求工具类
import request from '@/utils/request.js'

//文章分类列表查询
export const articleCategoryListService = () => {
    return request.get('/category')
}

//添加文章分类方法
export const articleCategoryAddService = (categoryModel) => {
    return request.post('/category', categoryModel)
}

//修改分类
export const articleCategoryUpdateService = (categoryModel) => {
    return request.put('/category', categoryModel)
}

//删除文章分类
export const articleCategoryDeleteService = (id) => {
    return request.delete('/category/' + id)
}

//文章列表查询
export const articleListService = (params) => {
    return request.get('/article', {params: params})
}

//添加文章
export const articleAddService = (articleModel) => {
    return request.post('/article', articleModel)
}

//修改文章
export const articleUpdateService = (articleModel) => {
    return request.put('/article', {
        id: articleModel.id,
        title: articleModel.title,
        content: articleModel.content,
        coverImg: articleModel.coverImg,
        state: articleModel.state,
        categoryId: articleModel.categoryId,
    })
}

//删除文章分类
export const articleDeleteService = (id) => {
    return request.delete('/article/' + id)
}