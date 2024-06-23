<script setup>
import { ref, onMounted, defineEmits } from 'vue'
import { getInfo, userUpdateAvatarService } from '@/api/user.js'
import { Plus, Upload } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'

const userStore = useUserStore()

const imgUrl = ref('')
onMounted(async () => {
  //获取个人信息
  const res = await getInfo()
  imgUrl.value = res.data.data.image
})

//上传头像
const file = ref('')
const uploadRef = ref()
const onSelectFile = (uploadFile) => {
  // 基于 FileReader 读取图片做预览
  const reader = new FileReader()
  reader.readAsDataURL(uploadFile.raw)
  reader.onload = () => {
    imgUrl.value = reader.result
  }
  file.value = uploadFile.raw
  // console.log(uploadFile.raw)
}

//子传父
const emit = defineEmits(['get-newAvatar'])

const onUpdateAvatar = async () => {
  // 发送请求更新头像
  const formData = new FormData()
  formData.append('file', file.value)
  const ref = await userUpdateAvatarService(formData)
  imgUrl.value = ref.data.data
  //重新获取个人信息
  const res = await getInfo()
  userStore.setUser(res.data.data)
  // 提示用户
  ElMessage.success('头像更新成功')
  emit('get-newAvatar', '')
}
</script>

<template>
  <h1>个人中心 - 更换头像</h1>
  <page-container title="更换头像">
    <el-upload
      ref="uploadRef"
      :auto-upload="false"
      class="avatar-uploader"
      :show-file-list="false"
      :on-change="onSelectFile"
      disabled
    >
      <el-image
        v-if="imgUrl"
        class="avatar"
        :src="imgUrl"
        :preview-src-list="imgUrl"
      />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>

    <br />

    <el-button
      @click="uploadRef.$el.querySelector('input').click()"
      type="primary"
      :icon="Plus"
      size="large"
      >选择图片</el-button
    >
    <el-button
      @click="onUpdateAvatar"
      type="success"
      :icon="Upload"
      size="large"
      >上传头像</el-button
    >
  </page-container>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
</style>
