<template>
  <!-- 用户管理 -->
  <div class="user_list">
    <div class="btns">
      <el-button type="primary" size="small" @click="toAdd">添加</el-button>
    </div>

    <el-table :data="users" size="small">
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="realname" label="姓名" />
      <el-table-column prop="gender" label="性别" />
      <el-table-column prop="telephone" label="手机号" />
      <el-table-column prop="status" label="状态" />
      <el-table-column label="操作" align="center" width="100">
        <template slot-scope="scope">
          <a type="text" size="small" @click.prevent="toSetRole(scope.row)">设置</a>
          <el-dropdown size="mini">
            <span class="el-dropdown-link" style="font-size:12px">
              更多<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>移除</el-dropdown-item>
              <el-dropdown-item>详情</el-dropdown-item>
              <el-dropdown-item>修改</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <el-button type="text" size="small" @click="deleteHandler(scope.row.id)">移除</el-button>
          <el-button type="text" size="small" @click="toDetails(scope.row.id)">详情</el-button>
          <el-button type="text" size="small" @click="toEdit(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="toSetRole(scope.row)">设置</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 模态框 -->
    <el-dialog :title="title" :visible.sync="visible">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="80px">
          <el-input v-model="form.username" autocomplete="off" />
        </el-form-item>
        <el-form-item label="姓名" label-width="80px">
          <el-input v-model="form.realname" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" label-width="80px">
          <el-input v-model="form.password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="性别" label-width="80px">
          <el-radio-group v-model="form.gender">
            <el-radio label="male">男</el-radio>
            <el-radio label="female">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号" label-width="80px">
          <el-input v-model="form.telephone" autocomplete="off" />
        </el-form-item>
        <el-form-item label="出生日期" label-width="80px">
          <el-date-picker v-model="form.birth" value-format="timestamp" type="date" placeholder="选择日期" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="visible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="saveUserHandler">确 定</el-button>
      </div>
    </el-dialog>
    <!-- /模态框 -->
    <!-- 角色模态框 -->
    <el-dialog title="设置角色" :visible.sync="role_visible">
      <el-form :model="user">
        <el-form-item label="用户名" label-width="80px">
          {{ user.realname }}
        </el-form-item>
        <el-form-item label="角色" label-width="80px">
          <el-cascader v-model="user.roles" :options="roles" :props="props" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="role_visible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="setRolesHandler">确 定</el-button>
      </div>
    </el-dialog>
    <!-- /模态框 -->
  </div>
</template>
<script>
import request from '@/utils/request'
import qs from 'querystring'
export default {
  data() {
    return {
      form: {},
      visible: false,
      role_visible: false,
      title: '添加用户',
      user: {},
      users: [],
      roles: [],
      props: { multiple: true, value: 'id', label: 'name', emitPath: false }
    }
  },
  created() {
    this.loadUsers()
    this.loadRoles()
  },
  methods: {
    loadRoles() {
      request.get('/role/findAll')
        .then(response => {
          this.roles = response.data
        })
    },
    saveUserHandler() {
      request.request({
        url: '/baseUser/saveOrUpdate',
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(this.form)
      })
        .then(response => {
          this.visible = false
          this.$message({ message: response.message, type: 'success' })
          this.loadUsers()
        })
    },
    toAdd() {
      this.form = {}
      this.visible = true
    },
    loadUsers() {
      request.get('/baseUser/cascadeRoleFindAll')
        .then(response => {
          response.data.forEach(item => {
            item.roles = item.roles.map(r => r.id)
          })
          this.users = response.data
        })
    },
    deleteHandler(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: id
        })
      })
    },
    toEdit(record) {
      this.form = record
      this.visible = true
    },
    toSetRole(record) {
      // 初始化角色
      // record.roles = [];
      this.user = record
      this.role_visible = true
    },
    toDetails() {

    },
    setRolesHandler() {
      request.request({
        url: '/baseUser/setRoles',
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify({
          id: this.user.id,
          roles: this.user.roles
        })
      })
        .then(response => {
          this.role_visible = false
          this.$message({ message: response.message, type: 'success' })
          this.loadUsers()
        })
    }
  }
}
</script>
