<script setup>
import { getInfo, getAuthorities } from '@/api/user.js'
import { idcard } from '@/api/xf.js'
import { Upload, Plus } from '@element-plus/icons-vue'
import { ref, defineProps, onMounted, watch, defineEmits } from 'vue'
import { useUserStore } from '@/stores'

//父组件传来的chat
const props = defineProps({
  isOpenDialog: Boolean
})

onMounted(() => {
  openDialog.value = props.isOpenDialog
})

watch(
  () => props.isOpenDialog,
  (value) => {
    openDialog.value = value
  },
  { deep: true }
)

const userStore = useUserStore()
//打开对话框
const openDialog = ref(false)

//子传父
const emit = defineEmits(['get-isDialogue'])

//判断是否已认证用户
// const normalUser = ref('volunteer_review')
const normalUser = ref('no_authentication')
const user = ref('review_info')
// const user = ref('no_authentication')

const imgUrl = ref('')
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
const userInfo = ref([])
const onUpdateAvatar = async () => {
  // 发送请求更新头像
  const formData = new FormData()
  formData.append('file', file.value)
  const ref = await idcard(formData)
  if (ref.data.code === 1) {
    ElMessage.success('认证成功')
    openDialog.value = false
    // imgUrl.value = ''
    normalUser.value = user.value
    //重新获取个人信息
    const res = await getInfo()
    userInfo.value = res.data.data
    userStore.setUser(userInfo.value)
    //重新获取用户权限
    const res1 = await getAuthorities()
    userStore.newAuthorities(res1.data.data)
    //认证成功
    emit('get-isDialogue', false)
  }
}

const disableDialog = async () => {
  await ElMessageBox.confirm('确定取消认证吗？', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'danger'
  })
  // emit('get-isDialogue', false)
  openDialog.value = false
  imgUrl.value = ''
}
</script>
<template>
  <el-dialog
    v-model="openDialog"
    :close-on-click-modal="false"
    :modal="true"
    title="身份证认证"
    width="500"
    align-center
    :show-close="false"
  >
    <div v-if="imgUrl == ''">
      <span>您将进行认证获取权限</span><br /><br />
      <!-- <span>请选择身份证正面照进行上传</span> -->
      <el-text style="font-size: 20px" type="warning"
        >请选择身份证正面照进行上传</el-text
      >
    </div>
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
      <!-- <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon> -->
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
      >上传身份证</el-button
    >
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="disableDialog">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scope lang="scss">
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
