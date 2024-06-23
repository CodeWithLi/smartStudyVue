<script setup>
import { Avatar, User, Iphone, Star } from '@element-plus/icons-vue'

import { getInfo } from '@/api/user.js'
import { ref, onMounted } from 'vue'

const userInfo = ref('')
// "birthday": "2004-06-19",
const checkedRadio = ref('')
onMounted(async () => {
  //获取个人信息
  const res = await getInfo() // 请求获取数据
  userInfo.value = res.data.data
  checkedRadio.value = res.data.data.sex
})
</script>

<template>
  <el-row :span="24" class="login-page">
    <el-col :span="12" class="form">
      <el-form size="large" label-width="auto">
        <el-form-item>
          <h1>个人中心 - 基本资料</h1>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input
            :value="userInfo.name"
            :prefix-icon="Avatar"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input :value="userInfo.username" :prefix-icon="User"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="checkedRadio">
            <el-radio disabled value="男" :prefix-icon="User">男</el-radio>
            <el-radio disabled value="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="生日">
          <el-input
            disabled
            :value="userInfo.birthday"
            :prefix-icon="Star"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input
            disabled
            :value="userInfo.phone"
            :prefix-icon="Iphone"
          ></el-input>
        </el-form-item>
        <el-form-item></el-form-item>
        <el-form-item></el-form-item>
        <el-form-item></el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style></style>
