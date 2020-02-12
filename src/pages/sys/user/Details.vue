<template>
  <div class="user_details">
    用户详情
    <div>
      <el-button type="text" @click.prevent="$router.go(-1)">返回</el-button>
    </div>
    <div>
      <div class="photo"><img :src="$route.query.userFace" alt=""></div>
      {{ $route.query }}
    </div>
  </div>
</template>

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
</style>
