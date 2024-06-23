<script setup>
import {
  allVolunteer,
  oneVolunteer,
  application,
  addVolunteer,
  upload,
  deleteVolunteer
} from '@/api/volunteer.js'
import { Search, Back } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores'
import moment from 'moment'
import { v4 } from 'uuid'

//渲染页面的基本信息，即志愿活动基本信息
const baseInfo = ref([])

//获取用户登录情况
const userStore = useUserStore()
const loginType = ref('')

//志愿活动信息
const volunteerInfo = ref({
  volunteerActivityId: '',
  activityPlace: '',
  activitySummary: '',
  activityContent: '',
  activityTitle: '',
  activityTime: '',
  activityMethod: '',
  activityDemand: 0,
  activityImage: '',
  activityNumber: 0
})

const rules = {
  activityPlace: [
    { required: true, message: '请输入地址', trigger: 'blur' },
    { min: 1, max: 10, message: '地址为1-10位字符', trigger: 'blur' }
  ],
  activitySummary: [
    { required: true, message: '请输入概述', trigger: 'blur' },
    { min: 1, max: 10, message: '概述为1-50位字符', trigger: 'blur' }
  ],
  activityTime: [
    { required: true, message: '请选择开始时间', trigger: 'blur' }
  ],
  activityContent: [{ required: true, message: '请输入内容', trigger: 'blur' }],
  activityTitle: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 1, max: 10, message: '标题为1-10位字符', trigger: 'blur' }
  ],
  activityMethod: [
    { required: true, message: '请输入参与方式', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        // 判断 value 和 当前 password 是否一致
        if (value != '手机号' && value != '身份证号') {
          callback(new Error('参与方式错误'))
        } else {
          callback() // 就算校验成功，也需要callback
        }
      },
      trigger: 'blur'
    }
  ],
  activityDemand: [
    { required: true, message: '请输入参与量', trigger: 'blur' },
    {
      pattern: /^\d+$/,
      message: '请输入正确的数字',
      trigger: 'blur'
    }
  ]
}

//进页面时渲染
onMounted(async () => {
  //获取用户信息
  const loginResponse = await userStore.loginResponse
  loginType.value = loginResponse.status

  const result = await allVolunteer()
  baseInfo.value = result.data.data
})

//打开详细信息
const dialogOpen = ref(false)
const detailInfo = ref()
const volunteerDetail = async (volunteerId) => {
  const ref = await oneVolunteer(volunteerId)
  detailInfo.value = ref.data.data
  console.log(detailInfo.value.activityBaseInfo)
  dialogOpen.value = true
}

const getButtonType = (item) => {
  return item.activityNumber === item.activityDemand ? 'danger' : 'primary'
}

const editBut = ref(false)

const editClick = () => {
  editBut.value = !editBut.value
}

//报名表单
const applicationFrom = ref({
  volunteerActivityId: ''
})
//报名
const applicationClick = (volunteerActivityId) => {
  applicationFrom.value.volunteerActivityId = volunteerActivityId
  application(applicationFrom.value)
}

//添加按钮点击事件
const addDialogOpen = ref(false)
const addVolunteerBut = () => {
  addDialogOpen.value = true
}

//校验添加表单
const form = ref()
const addDialogDisabled = ref(false)

//添加定时器
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

//确认添加
const confirmAddDialog = async () => {
  await form.value.validate()
  addDialogDisabled.value = true
  volunteerInfo.value.volunteerActivityId = v4()
  volunteerInfo.value.activityTime = moment(
    volunteerInfo.value.activityTime
  ).format('YYYY-MM-DD hh-mm')
  const response = await addVolunteer(volunteerInfo.value)
  if (response.data.code === 1) {
    ElMessage.success('添加成功')
  }
  if (volunteerInfo.value.volunteerActivityId == null) {
    Element.error('参数错误,上传失败')
    return
  }
  await delay(1000)
  // 发送请求更新图片
  const formData = new FormData()
  formData.append('file', file.value)
  const ref = await upload(formData, volunteerInfo.value.volunteerActivityId)
  if (ref.data.code === 1) {
    // 提示用户
    ElMessage.success('图片更新成功')
  }
  volunteerInfo.value.activityImage = ref.data.data

  baseInfo.value.push(volunteerInfo.value)
  console.log(baseInfo.value)
  addDialogDisabled.value = false
  addDialogOpen.value = false
  volunteerInfo.value = {
    activityPlace: '',
    activitySummary: '',
    activityContent: '',
    activityTitle: '',
    activityTime: '',
    activityMethod: '',
    activityImage: '',
    activityNumber: 0,
    activityDemand: 0
  }
}

//取消添加
const cancelAddDialog = () => {
  addDialogOpen.value = false
  volunteerInfo.value = {
    activityPlace: '',
    activitySummary: '',
    activityContent: '',
    activityTitle: '',
    activityTime: '',
    activityMethod: '',
    activityDemand: 0
  }
}

//上传头像
const file = ref('')
const uploadRef = ref()
const onSelectFile = (uploadFile) => {
  file.value = uploadFile.raw
  console.log(uploadFile.raw)
}

//删除活动
const deleteClick = async (activityId) => {
  await ElMessageBox.confirm('确认删除吗', '删除活动', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'danger'
  })
  // htmlLoading.value = true
  const response = await deleteVolunteer(activityId)
  //重新渲染
  if (response.data.code === 1) {
    baseInfo.value = baseInfo.value.filter(
      (item) => item.volunteerActivityId !== activityId
    )
    ElMessage.success('删除成功')
  }
}
</script>

<template>
  <div class="volunteerHeader">
    <el-button
      v-if="loginType === 'admin'"
      @click="addVolunteerBut"
      type="primary"
      style="margin-right: 6px; height: 4vh"
      >添加</el-button
    >
    <el-input
      prop="content"
      type="text"
      placeholder="请输入查询内容"
      style="width: 30vw,height: 4vh"
    >
      <template #append>
        <el-button
          v-if="searchStatus === 0"
          :icon="Search"
          @click="queryOneBut"
        />
        <el-button v-else :icon="Back" @click="backAllTaskBut" /> </template
    ></el-input>
  </div>
  <el-scrollbar
    style="border-top: 1px rgba(0, 0, 0, 0.411) solid"
    height="78vh"
  >
    <el-space wrap size="large">
      <el-card
        v-for="(item, index) in baseInfo"
        :key="index"
        class="box-card"
        style="width: 38.39vw; height: 37vh"
      >
        <el-space>
          <el-image
            style="width: 13.39vw; height: 25vh"
            :src="item.activityImage"
            :fit="cover"
            alt="Loaded Image"
            ref="image"
          />
          <el-card class="elCard" style="width: 22vw">
            <template #header>
              <div style="font-size: 18px; font-weight: bold">
                {{ item.activityTitle }}
              </div>
            </template>
            <div class="div1">
              {{ item.activitySummary }}
            </div>
            <div class="div2">
              <span>{{ item.activityPlace }}</span>
            </div>
            <div class="div2">
              <span>{{ item.activityTime }}</span>
            </div>
            <div class="div3">
              <spam style="margin-right: 15px"
                >{{ item.activityNumber }}/{{ item.activityDemand }}</spam
              >
              <el-button-group size="small">
                <el-button
                  type="primary"
                  round
                  @click="volunteerDetail(item.volunteerActivityId)"
                  >查看详情</el-button
                >
                <el-button
                  v-if="loginType === 'admin'"
                  type="warning"
                  @click="editClick"
                  round
                  >修改</el-button
                >
                <el-button
                  v-if="loginType === 'admin'"
                  type="danger"
                  @click="deleteClick(item.volunteerActivityId)"
                  round
                  >删除</el-button
                >
                <el-button
                  v-else
                  :type="getButtonType(item)"
                  @click="applicationClick(item.volunteerActivityId)"
                  :disabled="item.activityNumber === item.activityDemand"
                  round
                  >报名</el-button
                >
              </el-button-group>
            </div>
          </el-card>
        </el-space>
      </el-card>
    </el-space>
  </el-scrollbar>
  <el-dialog
    v-model="addDialogOpen"
    show-close="false"
    class="custom-dialog"
    title="添加活动"
    width="500"
  >
    <el-form ref="form" :model="volunteerInfo" :rules="rules">
      <el-form-item label="活动标题" prop="activityTitle">
        <el-input
          v-model="volunteerInfo.activityTitle"
          type="text"
          placeholder="请输入标题"
        ></el-input>
      </el-form-item>
      <el-form-item label="活动地址" prop="activityPlace">
        <el-input
          v-model="volunteerInfo.activityPlace"
          type="text"
          placeholder="请输入地址"
        ></el-input>
      </el-form-item>
      <el-form-item label="活动概述" prop="activitySummary">
        <el-input
          v-model="volunteerInfo.activitySummary"
          type="text"
          placeholder="请输入概述"
        ></el-input>
      </el-form-item>
      <el-form-item label="活动内容" prop="activityContent">
        <el-input
          v-model="volunteerInfo.activityContent"
          type="text"
          placeholder="请输入内容"
        ></el-input>
      </el-form-item>
      <el-form-item label="请选择文件">
        <el-upload
          ref="uploadRef"
          class="upload-demo"
          :auto-upload="false"
          :on-change="onSelectFile"
        >
          <template #trigger>
            <el-button type="primary">选择图片</el-button>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item label="参与方式" prop="activityMethod">
        <el-input
          v-model="volunteerInfo.activityMethod"
          type="text"
          placeholder="请输入参与方式"
        ></el-input>
      </el-form-item>
      <el-form-item prop="activityTime">
        <el-date-picker
          v-model="volunteerInfo.activityTime"
          type="datetime"
          placeholder="请选择结束时间"
          format="YYYY/MM/DD hh:mm"
          value-format="YYYY-MM-DD h:m"
        />
      </el-form-item>
      <el-form-item label="需求量" prop="activityDemand">
        <el-input
          v-model="volunteerInfo.activityDemand"
          type="text"
          placeholder="请输入需求量"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelAddDialog">取消</el-button>
        <el-button
          type="primary"
          :disabled="addDialogDisabled"
          @click="confirmAddDialog"
        >
          提交
        </el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog v-model="dialogOpen" title="详细信息" width="500">
    <el-form :disabled="true">
      <el-form-item label="活动标题">
        <el-input :value="detailInfo.activityBaseInfo.activityTitle"></el-input>
      </el-form-item>
      <el-form-item label="活动地址">
        <el-input :value="detailInfo.activityBaseInfo.activityPlace"></el-input>
      </el-form-item>
      <el-form-item label="活动概述">
        <el-input
          :value="detailInfo.activityBaseInfo.activitySummary"
        ></el-input>
      </el-form-item>
      <el-form-item label="活动内容">
        <el-input :value="detailInfo.activityContent"></el-input>
      </el-form-item>
      <el-form-item label="参与方式">
        <el-input :value="detailInfo.activityMethod"></el-input>
      </el-form-item>
      <el-form-item label="联系方式">
        <el-input :value="detailInfo.activityAdminConnection"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style>
.volunteerHeader {
  width: 50%;
  height: 4vh;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 5px;
}

.el-card {
  --el-card-border-color: transparent;
}
.el-card.is-always-shadow {
  box-shadow: var(--el-box-shadow-light);
  --el-box-shadow-light: 0px 0px 0px rgba(0, 0, 0, 0);
}
.elCard .el-card__header {
  margin: 5px;
  margin-bottom: 10px;
  margin-left: 10px;
  padding: 0;
  border-bottom: 1px rgba(183, 183, 163, 0.5) solid;
}
.elCard .el-card__body {
  margin: 5px;
  padding: 0px;
}
.elCard div {
  margin-left: 10px;
  margin-bottom: 5px;
}
.elCard .div2 span {
  margin-right: 10px;
  text-align: right;
}
.elCard .div2 {
  text-align: right;
}
.elCard .div3 {
  text-align: right;
}
.custom-dialog .el-dialog__headerbtn {
  display: none;
}
</style>
