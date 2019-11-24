<template>
  <!-- 权限管理 -->
  <div class="privilege_list">
    <div class="btns">
      <el-button type="primary" size="small" @click="toAdd">添加</el-button>
    </div>
    <el-table
      :data="privileges"
      size="small"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="route" label="路径" />
      <el-table-column prop="type" label="类型" />
      <el-table-column label="操作" align="center" width="180">
        <template slot-scope="scope">
          <a @click.prevent="deleteHandler(scope.row.id)">移除</a>
          <a @click.prevent="toEdit(scope.row)">修改</a>
        </template>
      </el-table-column>
    </el-table>
    <!-- 模态框 -->
    <el-dialog :title="title" :visible.sync="visible">
      <!-- {{form}} -->
      <el-form :model="form">
        <el-form-item label="名称" label-width="80px">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="路径" label-width="80px">
          <el-input v-model="form.route" autocomplete="off" />
        </el-form-item>
        <el-form-item label="类型" label-width="80px">
          <el-select v-model="form.type" clearable placeholder="请选择">
            <el-option label="菜单" value="menu" />
            <el-option label="方法" value="method" />
          </el-select>
        </el-form-item>
        <el-form-item label="父权限" label-width="80px">
          <el-select v-model="form.parentId" clearable placeholder="请选择">
            <el-option v-for="p in privileges" :key="p.id" :label="p.name" :value="p.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" label-width="80px">
          <el-input v-model="form.description" type="textarea" autocomplete="off" />
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
import request from '@/utils/request'
import qs from 'querystring'
export default {
  data() {
    return {
      form: {},
      visible: false,
      title: '添加权限',
      privileges: []
    }
  },
  created() {
    this.loadprivileges()
  },
  methods: {
    submitHandler() {
      request.request({
        url: '/privilege/saveOrUpdate',
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(this.form)
      })
        .then(response => {
          this.visible = false
          this.$message({ message: response.message, type: 'success' })
          this.loadprivileges()
        })
    },
    loadprivileges() {
      request.get('/privilege/findPrivilegeTree')
        .then(response => {
          this.privileges = response.data
        })
    },
    // lazyLoadPrivilege(row, treeNode, resolve){
    //   request.get("/privilege/findByParentId?id="+row.id)
    //   .then(response => {
    //     response.data.forEach(item=>{item.hasChildren= !Boolean(item.parentId)})
    //     resolve(response.data);
    //   })
    // },
    toAdd() {
      this.form = {}
      this.visible = true
    },
    // loadprivileges(){
    //   request.get("/privilege/findByParentId")
    //   .then(response => {
    //     response.data.forEach(item=>{item.hasChildren= !Boolean(item.parentId)})
    //     this.privileges = response.data;
    //   })
    // },
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
    }
  }
}
</script>
