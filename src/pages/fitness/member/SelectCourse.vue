<template>
  <!-- 选课 -->
  <div class="member_select_course">
    <!-- 按钮 -->
    <div class="btns">
      <el-row>
        <el-col :span="12">
          <van-button size="mini" @click="toSelectCourseHandler">选课</van-button>
        </el-col>
        <el-col :span="12" style="text-align:right">
          <el-link type="primary" >{{view.title}}</el-link>
          <el-switch v-model="view.type" @change="switchChangeHandler"> </el-switch>
        </el-col>
      </el-row>
      
    </div>
    <!-- /按钮 -->
    <!-- 表格 -->
    <div v-if="view.type">
      <van-card
        v-for="c in courses" :key="c.id"
        :desc="c.description"
        :title="c.name"
      >
        <div slot="tags">
          <van-tag plain type="danger">{{c.courseDay}}</van-tag>
          <van-tag plain type="danger">{{c.courseTime}}</van-tag>
        </div>
        <div slot="footer">
          <van-button size="mini" type="danger" @click.prevent="deleteHandler(c)">删除</van-button>
        </div>
      </van-card>
    </div>
    
    <!-- <el-table size="small" :data="courses" v-if="view.type">
      <el-table-column type="index" :index="1" label="序号"></el-table-column>
      <el-table-column label="课程名称" prop="name"></el-table-column>
      <el-table-column label="介绍" prop="description"></el-table-column>
      <el-table-column label="课程日期" prop="courseDay"></el-table-column>
      <el-table-column label="课程时间段" prop="courseTime"></el-table-column>
      <el-table-column label="操作" width="100px" align="center">
        <template slot-scope="scope">
          <a href="" @click.prevent="deleteHandler(scope.row)">删除</a>
        </template>
      </el-table-column>
    </el-table> -->
    <!-- /表格 -->
    <!-- 课表 -->
    <BaseCourseTbl :data="courses" v-else></BaseCourseTbl>
    <!-- /课表 -->
    <!-- 模态框 -->
    <el-dialog :title="title" :visible.sync="visible" width="80%" >
      <CourseTbl @clickNode="clickNodeHandler"></CourseTbl>
      
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="visible = false" size="small">完成</el-button>
      </div>
    </el-dialog>
    <!-- /模态框 -->
  </div>
</template>

<script>
import {get,post} from '@/utils/request'
import CourseTbl from '@/components/Fitness/CourseTbl'
import BaseCourseTbl from '@/components/Fitness/BaseCourseTbl'
import { mapState } from 'vuex'
export default {
  data(){
    return {
      title:'课表选课',
      visible:false,
      courses:[],
      view:{
        type:true,
        title:'表格视图'
      }
    }
  },
  created(){
    this.loadUserCourses();
  },
  components:{
    CourseTbl,BaseCourseTbl
  },
  computed:{
     ...mapState('user',['userId','roles'])
  },
  methods:{
    loadUserCourses(){
      let url = "/course/selectUserCourses"
      get(url,{userId:this.userId}).then(response =>{
        this.courses = response.data;
      })
    },
    deleteHandler(row){
      this.$confirm('该操作将永久删除这条数据，你确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let url = '/course/deleteUserCourse';
        get(url,{userId:this.userId,courseId:row.id}).then(response =>{
          this.$message({type:"success",message:response.message});
          this.loadUserCourses();
        })
      })
    },
    // 点击课表中的课程
    async clickNodeHandler(course){
      let url = "/course/selectUserCourses"
      let response = await get(url,{userId:this.userId,courseId:course.id});

      if(response.data.length>0){
        this.$message({type:"warning",message:"这门课程你已经选择了"})
      } else {
        this.$alert('课程名称:'+course.name+' 上课时间:'+course.courseDay+","+course.courseTime, '课程信息', {
          confirmButtonText: '确定选课',
          callback: action => {
            // 选课
            let url_select = "/course/selectCourse";
            post(url_select,{userId:this.userId,courseId:course.id}).then(response => {
              this.$message({type:"success",message:response.message})
              this.loadUserCourses();
            })
          }
        });
      }
    },
    toSelectCourseHandler(){
      this.visible = true;
    },
    switchChangeHandler(now){
      if(now){
        this.view.title = "表格视图";
      } else {
        this.view.title = "课表视图";
      }
    }
  }
}
</script>
<style scoped>
.btns {
  margin-bottom: .5em;
}
</style>