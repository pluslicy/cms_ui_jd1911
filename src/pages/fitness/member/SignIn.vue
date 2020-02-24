<template>
  <!-- 选课 -->
  <div class="sign_id">
    <!-- /按钮 -->
    <!-- 表格 -->
    <el-table size="small" :data="courses">
      <el-table-column type="index" :index="1" label="序号" />
      <!-- <el-table-column label="编号" prop="id" width="50px"></el-table-column> -->
      <el-table-column label="课程名称" prop="name" width="150px" />
      <el-table-column label="课程日期" prop="courseDay">
        <template slot-scope="scope">
          {{ scope.row.courseDay }} , {{ scope.row.courseTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100px" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            :disabled="scope.row.courseDay !=getWeekDay() "
            @click="toSignIn(scope.row)"
          >签到</el-button>
          <!-- <el-button type="text" size="mini"
            :disabled="scope.row.courseDay !=getWeekDay() "
            @click="toSignOut(scope.row)">签退</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- /表格 -->
    <!-- 模态框 -->
    <el-dialog :title="title" :visible.sync="visible" width="90%">
      <!-- {{form}} -->
      <div>
        <el-row>
          <el-col :span="6"><strong>课程名称：</strong></el-col>
          <el-col :span="18">{{ form.courseName }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6"><strong>课程时间：</strong></el-col>
          <el-col :span="18">{{ form.courseDay }}, {{ form.courseTime }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6"><strong>经度：</strong></el-col>
          <el-col :span="18">{{ form.longitude }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6"><strong>维度：</strong></el-col>
          <el-col :span="18">{{ form.latitude }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6"><strong>地址：</strong></el-col>
          <el-col :span="18">{{ form.address }}</el-col>
        </el-row>
        <!-- 地图 -->
        <Location @loaded="loadedHandler" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="submitHandler">签到</el-button>
      </div>
    </el-dialog>
    <!-- /模态框 -->
  </div>
</template>

<script>
import Location from '@/components/Fitness/Map/Location'
import { get, post } from '@/utils/request'
import { mapState } from 'vuex'
import moment from 'moment'
import { getWeekDay } from '@/utils/week'
import _ from 'lodash'

export default {
  data() {
    return {
      title: '',
      visible: false,
      courses: [],
      form: {

      }
    }
  },
  created() {
    this.loadUserCourses()
  },
  mounted() {

  },
  computed: {
    ...mapState('user', ['userId', 'roles', 'name']),
    test() {
      // moment("2020-01-01 10:00").diff(moment("2020-01-01 10:39"),'minutes' )
      const day = moment().format('YYYY-MM-DD')
      return moment(day + ' 10:00').diff(moment(day + ' 10:39'), 'minutes')
    }
  },
  components: {
    Location
  },
  methods: {
    moment,
    // 签到
    submitHandler() {
      const url = '/sign/in'
      post(url, this.form).then(response => {
        this.$message({ type: 'success', message: response.message })
        this.visible = false
      })
    },
    // 加载地图回调函数
    loadedHandler(location) {
      this.form.longitude = location.longitude
      this.form.latitude = location.latitude
      this.form.address = location.address
      this.form = _.clone(this.form)
    },
    // 签到
    toSignIn(record) {
      const day = moment().format('YYYY-MM-DD')
      const course_start_time = record.courseTime.split('-')[0]
      const course_end_time = record.courseTime.split('-')[1]
      // 判断是否在签到时间范围内
      // if((10 > moment(day+" "+course_start_time).diff(moment().format("YYYY-MM-DD hh:mm"),'minutes')) && (0 < moment(day+" "+course_end_time).diff(moment().format("YYYY-MM-DD hh:mm"),'minutes'))){
      this.title = '签到'
      this.form.type = '签到'
      this.form.userId = this.userId
      this.form.userName = this.name
      this.form.courseId = record.id
      this.form.courseName = record.courseName
      this.form.courseName = record.name
      this.form.courseDay = record.courseDay
      this.form.courseTime = record.courseTime
      this.visible = true
      // } else {
      //   this.$message({type:"warning",message:"不在签到时间范围内"})
      // }
    },
    // // 签退
    // toSignOut(record){
    //   this.title = "签退";
    //   this.visible = true;

    // },
    getWeekDay,
    loadUserCourses() {
      const url = '/course/selectUserCourses'
      get(url, { userId: this.userId }).then(response => {
        this.courses = response.data
      })
    }
  }
}
</script>
<style scoped>
.el-col{
  line-height: 1.5em
}
</style>
