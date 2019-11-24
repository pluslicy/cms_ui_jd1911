<template>
  <div>
    <el-button type="primary" size="small" @click="toPublishArticle">发布资讯</el-button>
    <el-table :data="tableData" style="width: 100%" size="mini">
      <el-table-column prop="id" label="编号" width="180" />
      <el-table-column prop="title" label="标题" width="180" />
      <el-table-column prop="authorId" label="作者" />
      <el-table-column prop="category.name" label="所属栏目" />
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <a type="text" size="small">查看</a>
          <a type="text" size="small" @click.prevent="toEditArticle(scope.row)">编辑</a>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  // 模板中要用到的变量
  data() {
    return {
      tableData: []
    }
  },
  // 声明周期钩子函数
  created() {
    // 查询所有资讯信息
    request.get('/article/cascadeFindAll')
      .then(response => {
        this.tableData = response.data
      })
  },
  // 方法，模块中要用到的方法，
  methods: {
    toPublishArticle() {
      // 跳转页面
      this.$router.push({ path: '/info/article/Editor' })
    },
    toEditArticle(row) {
      this.$router.push({
        path: '/info/article/Editor',
        query: row
      })
    }
  }
}
</script>

<style scoped>

</style>
