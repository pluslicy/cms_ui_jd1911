<template>
  <div class="course">
    <!-- 按钮 -->
    <div class="btns">
      <el-button type="primary" size="small" @click="toAddHandler">新增</el-button>
    </div>
    <!-- /按钮 -->
    <!-- 表格 -->
    <el-table :data="courses.list" size="small">
      <el-table-column label="编号" />
      <el-table-column label="课程名称" />
      <el-table-column label="介绍" />
      <el-table-column label="课程时间段" />
      <el-table-column label="教练" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <a href="" @click.prevent="deleteHandler(scope.row.id)">删除</a>
          <a href="" @click.prevent="toEditHandler(scope.row)">修改</a>
        </template>
      </el-table-column>
    </el-table>
    <!-- /表格 -->
    <!-- 分页 -->
    <el-pagination
      v-show="courses.pages !==1 "
      background
      layout="prev, pager, next"
      :total="courses.total"
      :page-size="courses.pageSize"
      :current-page="courses.pageNum"
      @current-change="pageNumChangeHandler"
    />
    <!-- /分页 -->
    <!-- 模态框 -->
    <el-dialog :title="title" :visible.sync="visible">
      <el-form ref="courseForm" :model="form" :rules="rules">
        <el-form-item label="课程名称" label-width="80px" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="visible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="submitHandler">确 定</el-button>
      </div>
    </el-dialog>
    <!-- /模态框 -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      courses: {
        list: []
      },
      title: '新增课程',
      visible: false,
      param: {
        pageNum: 1,
        pageSize: 10
      },
      form: {},
      rules: {
        name: [{ required: true, message: '请输入课程名称', trigger: 'blur' }]
      }
    }
  },
  methods: {
    submitHandler() {
      this.$refs['courseForm'].validate(valid => {
        if (valid) {
          this.visible = false
        } else {
          return false
        }
      })
    },
    toAddHandler() {
      this.visible = true
    },
    pageNumChangeHandler(pageNum) {
      this.param.pageNum = pageNum
    }
  }
}
</script>
