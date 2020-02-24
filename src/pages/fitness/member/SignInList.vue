<template>
  <!-- 选课 -->
  <div class="sign_in_list">
    <!-- /按钮 -->
    <!-- 表格 -->
    <el-calendar v-model="value">
      <template
        slot="dateCell"
        slot-scope="{date}"
      >
        <p>{{ moment(date).format("DD") }}</p>
        <div v-for="sign in signs" :key="sign.id" style="font-size:10px">
          <el-popover
            v-if="moment(date).format('YYYY-MM-DD') == moment(sign.signTime).format('YYYY-MM-DD')"
            placement="top-start"
            :title="sign.courseName"
            width="300"
            trigger="hover"
          >
            <div>
              <el-row>
                <el-col :span="6">状态：</el-col>
                <el-col :span="18">{{ sign.status }}</el-col>
              </el-row>
              <el-row>
                <el-col :span="6">时间：</el-col>
                <el-col :span="18">{{ moment(sign.signTime).format('YYYY-MM-DD HH:mm') }}</el-col>
              </el-row>
              <el-row>
                <el-col :span="6">地点：</el-col>
                <el-col :span="18">{{ sign.address }}</el-col>
              </el-row>
              <!-- {{sign.status+' '+moment(sign.signTime).format('YYYY-MM-DD hh:mm')+' '+sign.address}} -->
            </div>
            <span slot="reference">{{ sign.courseName }}</span>
          </el-popover>
        </div>
      </template>
    </el-calendar>
    <!-- <el-table size="small" :data="signs">
      <el-table-column type="index" :index="1" label="序号"></el-table-column>
      <el-table-column label="课程名称" prop="courseName" width="150px"></el-table-column>
      <el-table-column label="状态" prop="status" width="150px"></el-table-column>
      <el-table-column label="时间"  width="150px">
        <template slot-scope="scope">
          {{moment(scope.row.signTime).format("YYYY-MM-DD HH:mm")}}
        </template>
      </el-table-column>
      <el-table-column label="位置" prop="address"> </el-table-column>
    </el-table> -->
    <!-- /表格 -->
  </div>
</template>

<script>
import { get, post } from '@/utils/request'
import { mapState } from 'vuex'
import moment from 'moment'

export default {
  data() {
    return {
      signs: [],
      form: {

      },
      value: new Date()
    }
  },
  created() {
    this.loadUserCourses()
  },
  mounted() {

  },
  computed: {
    ...mapState('user', ['userId', 'roles', 'name'])
  },
  methods: {
    moment,
    loadUserCourses() {
      const url = '/sign/query'
      get(url, { userId: this.userId }).then(response => {
        this.signs = response.data
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
