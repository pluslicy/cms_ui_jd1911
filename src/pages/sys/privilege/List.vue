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
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}" >
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
    <el-dialog :title="title" :visible.sync="visible" >
      <!-- {{form}} -->
      <el-form :model="form" :rules="rules" ref="privilege_form">
        <el-form-item label="名称" label-width="80px" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="路径" label-width="80px" prop="route">
          <el-input v-model="form.route" autocomplete="off" />
        </el-form-item>
        <el-form-item label="类型" label-width="80px" prop="type">
          <el-select v-model="form.type" clearable placeholder="请选择">
            <el-option label="菜单" value="menu" />
            <el-option label="方法" value="method" />
          </el-select>
          <el-popover
            placement="top-start"
            title="提示"
            width="300"
            trigger="hover"
            content="菜单控制着用户登录后可以动态显示的菜单树；方法为具体的权限，控制着是否可以调用某些接口">
            <el-button type="text" slot="reference"><i class="el-icon-location-information"></i></el-button>
          </el-popover>
        </el-form-item>
        <el-form-item label="父权限" label-width="80px">
          <el-cascader
            v-model="form.parentId"
            clearable
            :options="privileges"
            :props="{ expandTrigger: 'hover', value: 'id', label: 'name' ,checkStrictly:true}"
            ></el-cascader>
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
import {get,del,post} from '@/utils/request'
import qs from 'querystring'
export default {
  data() {
    return {
      form: {},
      visible: false,
      title: '添加权限',
      privileges: [],
      rules:{
        name: [
          { required: true, message: '请输入权限名称', trigger: 'change' }
        ],
        route: [
          { required: true, message: '请输入权限路径', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择权限类型', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.loadprivileges()
  },
  methods: {
    submitHandler() {
      this.$refs['privilege_form'].validate((valid) => {
        if (valid) {
          let url = "/privilege/saveOrUpdate";
          post(url,this.form)
          .then(response => {
            this.visible = false
            this.$message({ message: response.message, type: 'success' })
            this.loadprivileges()
          })
        } else {
          return false;
        }
      });
    },
    loadprivileges() {
      let url = '/privilege/findPrivilegeTree';
      get(url)
      .then(response => {
        this.foo(response.data)
        this.privileges = response.data
      })
    },
    foo(privileges) {
      for (const p of privileges) {
        if (p.children && p.children.length === 0) {
          delete p.children
        } else {
          this.foo(p.children)
        }
      }
    },
    toAdd() {
      this.form = {}
      this.visible = true
    },
    deleteHandler(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let url = "/privilege/deleteById?id="+id
        del(url).then(response => {
          this.$message({ type: 'success', message: response.message })
          this.loadprivileges();
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
