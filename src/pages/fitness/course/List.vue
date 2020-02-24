<template>
  <div class="course">
    <!-- 按钮 -->
    <div v-if="roleIds.includes(1)" class="btns">
      <el-button type="primary" size="small" @click="toAddHandler">新增</el-button>
    </div>
    <!-- /按钮 -->
    <!-- 表格 -->
    <!-- {{param}} -->
    <el-table :data="courses.list" size="small">
      <el-table-column label="编号" prop="id" width="50px" />
      <el-table-column label="课程名称" prop="name" />
      <el-table-column label="介绍" prop="description" />
      <el-table-column label="课程日期" prop="courseDay" />
      <el-table-column label="课程时间段" prop="courseTime" />
      <el-table-column label="教练" prop="teacher.realname" />
      <el-table-column label="操作" width="100px" align="center">
        <template slot-scope="scope">
          <a href="" @click.prevent="deleteHandler(scope.row)">删除</a>
          <a href="" @click.prevent="toEditHandler(scope.row)">修改</a>
          <a href="" @click.prevent="toDetailsHandler(scope.row)">详情</a>
        </template>
      </el-table-column>
    </el-table>
    <!-- /表格 -->
    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="courses.total"
      :page-size="courses.pageSize"
      :current-page="courses.page"
      @current-change="pageChangeHandler"
    />
    <!-- /分页 -->
    <!-- 模态框 -->
    <el-dialog :title="title" :visible.sync="visible" @close="modalCloseHandler">
      <!-- {{form}} -->
      <el-form ref="courseForm" :model="form" :rules="rules">
        <el-form-item label="课程名称" label-width="80px" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="课程介绍" label-width="80px" prop="description">
          <el-input v-model="form.description" type="textarea" autocomplete="off" />
        </el-form-item>
        <el-form-item label="上课日期" label-width="80px" prop="courseDay">
          <el-select v-model="form.courseDay" placeholder="请选择">
            <el-option label="周一" value="周一" />
            <el-option label="周二" value="周二" />
            <el-option label="周三" value="周三" />
            <el-option label="周四" value="周四" />
            <el-option label="周五" value="周五" />
            <el-option label="周六" value="周六" />
            <el-option label="周日" value="周日" />
          </el-select>
        </el-form-item>
        <el-form-item label="上课时间" label-width="80px" prop="courseTime">
          <el-select v-model="form.courseTime" placeholder="请选择">
            <el-option label="08:00-09:00" value="08:00-09:00" />
            <el-option label="10:00-11:00" value="10:00-11:00" />
            <el-option label="14:00-15:00" value="14:00-15:00" />
            <el-option label="16:00-17:00" value="16:00-17:00" />
            <el-option label="19:00-20:00" value="19:00-20:00" />
          </el-select>
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
import { mapState } from 'vuex'
import { get, post } from '@/utils/request'
export default {
  data() {
    return {
      courses: {
        list: []
      },
      title: '新增课程',
      visible: false,
      param: {
        page: 1,
        pageSize: 10
      },
      form: {},
      rules: {
        name: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
        courseDay: [{ required: true, message: '请输入课程日期', trigger: 'blur' }],
        courseTime: [{ required: true, message: '请输入课程时间', trigger: 'blur' }],
        description: [{ required: true, message: '请输入课程描述信息', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState('user', ['userId', 'roles', 'roleIds'])
  },
  created() {
    // 控制如果是经理可以管理所有课程，如果是教练只能管理自己的课程
    if (this.roles.includes('教练') && !this.roles.includes('经理')) {
      this.param.teacherId = this.userId
    }
    // 加载课程信息
    this.loadCourses()
  },
  methods: {
    // 删除课程信息
    deleteHandler(row) {
      this.$confirm('该操作将永久删除这条数据，你确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const url = '/course/deleteById'
        get(url, { id: row.id }).then(response => {
          this.$message({ type: 'success', message: response.message })
          this.loadCourses()
        })
      })
    },
    // 更新课程信息
    toEditHandler(row) {
      this.form = row
      this.visible = true
    },
    // 查看详情
    toDetailsHandler(row) {

    },
    // 查询课程
    loadCourses() {
      const url = '/course/pageQuery'
      get(url, this.param).then(result => {
        this.courses = result.data
      })
    },
    // 提交
    submitHandler() {
      this.$refs['courseForm'].validate(valid => {
        if (valid) {
          const url = '/course/saveOrUpdate'
          post(url, this.form).then(result => {
            this.$message({ type: 'success', message: result.message })
            this.visible = false
            this.loadCourses()
          })
        } else {
          return false
        }
      })
    },
    // 打开新增模态框
    toAddHandler() {
      this.form = {}
      // 设置教练
      this.form.teacherId = this.userId
      this.visible = true
    },
    // 分页
    pageChangeHandler(page) {
      this.param.page = page
      this.loadCourses()
    },
    // 模态框关闭的回调
    modalCloseHandler() {
      this.$refs['courseForm'].clearValidate()
    }
  }
}
</script>
