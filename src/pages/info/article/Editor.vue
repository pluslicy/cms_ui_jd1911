<template>
  <div>
    <el-button type="text" @click="back">返回</el-button>
    <el-form ref="article_form" :model="form" label-width="80px" :rules="rules">
      <el-form-item label="所属栏目" prop="categoryId">
        <el-select v-model="form.categoryId" placeholder="请选择活动区域">
          <el-option label="IT" value="3" />
          <el-option label="娱乐" value="4" />
        </el-select>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" />
      </el-form-item>

      <el-form-item label="正文" prop="content">
        <el-input v-model="form.content" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">发布</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import request from '@/utils/request'
import qs from 'querystring'
export default {
  data() {
    return {
      form: {},
      rules: {
        categoryId: [
          { required: true, message: '请选择栏目', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请输入文章标题', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.form = this.$route.query
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    onSubmit() {
      this.$refs['article_form'].validate((valid) => {
        if (valid) {
          // 交互
          request.request({
            url: '/article/saveOrUpdate',
            method: 'post',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: qs.stringify(this.form)
          })
            .then(response => {
              // 提示成功
              this.$message({
                message: response.message,
                type: 'success'
              })
              // 返回列表页
              this.back()
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style scoped>

</style>
