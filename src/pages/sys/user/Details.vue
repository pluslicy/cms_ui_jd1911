<template>
  <div class="user_details">
    <div style="float:right"> <el-button type="text" @click.prevent="$router.go(-1)">返回</el-button> </div>
    <div>
      <pan-thumb v-if="user.userFace" :image="user.userFace" />
    </div>
    <table>
      <tbody>
        <tr>
          <td width="100"><strong>姓名:</strong></td>
          <td>{{ user.realname }}</td>
        </tr>
        <tr>
          <td width="100"><strong>手机号:</strong></td>
          <td>{{ user.telephone }}</td>
        </tr>
        <tr>
          <td width="100"><strong>注册时间:</strong></td>
          <td>{{ moment(user.registerTime).format('YYYY-MM-DD') }}</td>
        </tr>
        <tr>
          <td width="100"><strong>姓名:</strong></td>
          <td>{{ user.realname }}</td>
        </tr>
        <tr>
          <td width="100"><strong>状态:</strong></td>
          <td>{{ user.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import PanThumb from '@/components/PanThumb'
import moment from 'moment'
export default {
  components: { PanThumb },
  data() {
    return {
      user: {}
    }
  },
  mounted() {
    this.user = this.$route.query
  },
  methods: {
    moment
  }
}
</script>
<style scoped>
.photo {
  width: 100px;
  height: 100px;
  border: 1px solid #ccc;
  border-radius: 50%;
}
.photo img {
  width: 100%;
}
.user_details td {
  line-height: 1.5em;
}

</style>
