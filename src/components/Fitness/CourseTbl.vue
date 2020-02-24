<template>
  <div class="course_tbl">
    <div class='class-table'>
        <div class='table-wrapper'>
          <div class='tabel-container'>
            <table>
              <thead>
                <tr>
                  <th v-for="d in days" :key="d">{{d}}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="t in times" :key="t">
                  <td v-for="d in days" :key="d">
                    <!-- 左侧日期 -->
                    <span v-if="d=='时间/日期'">
                      {{t}}
                    </span>
                    <div class="course_item" v-for="c in courses.list" :key="c.id"  @click="clickNode(c)">
                      <el-row  v-if="c.courseDay === d && c.courseTime === t">
                        <el-col :span="12">
                          <strong>{{c.name}}</strong>
                        </el-col>
                        <el-col :span="12">
                          <em>{{c.teacher?c.teacher.realname:""}}</em>
                        </el-col>
                      </el-row>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
import {get, post} from '@/utils/request'
export default {
  data(){
    return {
      days:["时间/日期","周一","周二","周三","周四","周五","周六","周日"],
      times:["08:00-09:00","10:00-11:00","14:00-15:00","16:00-17:00","19:00-20:00"],
      courses:{
       list:[]
      },
      param:{          
        page:1,
        pageSize:10000
      },
    }
  },
  created(){
     // 加载所有课程信息
    this.loadCourses();
  },
  methods:{
    loadCourses(){
      let url = '/course/pageQuery';
      get(url,this.param).then(result =>{
        this.courses = result.data;
      })
    },
    clickNode(course){
      this.$emit('clickNode',course)
    }
  }
}
</script>
<style lang="scss" scoped>
.class-table {
    .table-wrapper {
        width: 100%;
        height: 100%;
        overflow: auto;
    }
    .tabel-container {
        table {
            table-layout: fixed;
            width: 100%;
            thead {
                background-color: #67a1ff;
                th {
                    color: #fff;
                    line-height: 17px;
                    font-weight: normal;
                }
            }
            tbody {
                background-color: #eaf2ff;
                td {
                    color: #677998;
                    line-height: 12px;
                }
            }
            th,
            td {
                width: 60px;
                padding: 12px 2px;
                font-size: 12px;
                text-align: center;

                div {
                  line-height: 2em;
                  cursor: pointer;
                  em {
                    font-size: .8em;
                  }
                }
            }

            tr td:first-child {
                color: #333;
                .period {
                    font-size: 8px;
                }
            }
        }
    }
}
</style>