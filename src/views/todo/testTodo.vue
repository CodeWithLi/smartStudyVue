<script setup>
import { Edit, Delete, Search, Back } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import {
  allTask,
  queryOneTask,
  addTask,
  editTask,
  deleteTask,
  editStatus
} from '@/api/task.js'
import { useUserStore } from '@/stores'
import moment from 'moment'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const userInfo = userStore.user

//任务对象
const taskFrom = ref({
  taskId: '',
  content: '',
  name: userStore.user.name,
  endTime: '',
  status: '',
  task: '',
  createTime: ''
})

const rules = {
  content: [
    { required: true, message: '请输入待办事项', trigger: 'blur' },
    { min: 1, max: 50, message: '待办事项为1-50个字符', trigger: 'blur' }
  ],
  createTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }]
}

//所有任务
const tableData = ref([])

const authorities = ref([])

//是否进行认证
const isDialogue = ref(false)

//封装路由，用于跳转可以访问的页面
const router = useRouter()

onMounted(async () => {
  authorities.value = userStore.authorities
  console.log(authorities)
  if (!authorities.value.includes('use_gpt')) {
    console.log(authorities)
    ElMessageBox.confirm('没有权限访问该页面，请前往认证', '错误', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'danger'
    })
      .then(() => {
        isDialogue.value = true
      })
      .catch(() => {
        router.push('/xfChat')
      })
  }
  const ref = await allTask(userInfo.name)
  tableData.value = ref.data.data
})

//查询某条内容
//未查询
const searchStatus = ref(0)
const queryOneBut = async () => {
  const ref = await queryOneTask(taskFrom.value.content, taskFrom.value.name)
  tableData.value = [ref.data.data]
  //查询成功
  searchStatus.value = 1
}

//已查询
const backAllTaskBut = async () => {
  taskFrom.value = {
    taskId: '',
    content: '',
    name: userStore.user.name,
    endTime: '',
    status: '',
    task: '',
    createTime: ''
  }
  const ref = await allTask(userInfo.name)
  tableData.value = ref.data.data
  //返回
  searchStatus.value = 0
}

//添加弹窗
const centerDialog = ref(false)
const addTaskBut = () => {
  centerDialog.value = true
}
//取消弹窗
const CancelTask = () => {
  centerDialog.value = false
  editDialog.value = false
  taskFrom.value = {
    taskId: '',
    content: '',
    name: userStore.user.name,
    endTime: '',
    status: '',
    task: '',
    createTime: ''
  }
}

//添加任务
const ConfirmTask = async () => {
  taskFrom.value.endTime = moment(taskFrom.value.createTime).format(
    'YYYY-MM-DD hh-mm'
  )
  const ref = await addTask(taskFrom.value)
  ElMessage({
    message: '添加成功',
    type: 'success'
  })
  if (ref.data.code === 1) {
    const ref = await allTask(userInfo.name)
    tableData.value = ref.data.data
  }
  centerDialog.value = false
  taskFrom.value = {
    taskId: '',
    content: '',
    name: userStore.user.name,
    endTime: '',
    status: '',
    task: '',
    createTime: ''
  }
}

//修改任务
const editDialog = ref(false)
//开启弹窗
const editTaskBut = (index) => {
  editDialog.value = true
  const ref = tableData.value[index]
  taskFrom.value.taskId = ref.taskId
  taskFrom.value.content = ref.content
  taskFrom.value.createTime = ref.endTime
}
//修改待办
const ConfirmEditTask = async () => {
  taskFrom.value.endTime = moment(taskFrom.value.createTime).format(
    'YYYY-MM-DD hh-mm'
  )
  const ref = await editTask(taskFrom.value)
  if (ref.data.code === 1) {
    const ref = await allTask(userInfo.name)
    tableData.value = ref.data.data
  } else {
    throw new Error('修改失败')
  }
  ElMessage({
    message: '修改成功',
    type: 'success'
  })
  taskFrom.value = {
    taskId: '',
    content: '',
    name: userStore.user.name,
    endTime: '',
    status: '',
    task: '',
    createTime: ''
  }
  editDialog.value = false
}

//删除任务
const deleteTaskBut = async (taskId) => {
  await ElMessageBox.confirm('确认删除吗？', '删除待办', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'error'
  })
  const ref = await deleteTask(taskId)
  if (ref.data.code === 1) {
    const ref = await allTask(userInfo.name)
    tableData.value = ref.data.data
  }
  ElMessage({
    message: '删除成功',
    type: 'success'
  })
}

//完成 - 未完成
const successBut = async (index, status, taskId) => {
  console.log(index)
  if (status === 1) {
    taskFrom.value.status = 0
  } else if (status === 0) {
    taskFrom.value.status = 1
  }
  taskFrom.value.taskId = taskId
  taskFrom.value.taskId = await editStatus(taskFrom.value)
  tableData.value[index].status = taskFrom.value.status
  ElMessage({
    message: '修改任务状态成功',
    type: 'success'
  })
}
</script>

<template>
  <div class="todoHeader">
    <div>待办事项</div>
    <div class="todoQuery">
      <el-button type="primary" @click="addTaskBut" style="margin-right: 6px"
        >添加</el-button
      >
      <el-input
        prop="content"
        type="text"
        v-model="taskFrom.content"
        placeholder="请输入查询内容"
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
  </div>

  <div class="todoMain">
    <el-table :data="tableData" height="78vh" style="width: 100%">
      <el-table-column prop="content" label="任务内容" width="180" />
      <el-table-column prop="endTime" label="结束时间" width="180" />
      <el-table-column label="完成状态" width="150" prop="status">
        <template v-slot="scope">
          <el-button
            v-if="scope.row.status === 1"
            @click="
              successBut(scope.$index, scope.row.status, scope.row.taskId)
            "
            type="success"
            >已完成</el-button
          >
          <el-button
            v-else
            @click="
              successBut(scope.$index, scope.row.status, scope.row.taskId)
            "
            >未完成</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button
            type="primary"
            round
            :icon="Edit"
            @click="editTaskBut(scope.$index)"
          />
          <el-button
            type="danger"
            round
            :icon="Delete"
            @click="deleteTaskBut(scope.row.taskId)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-dialog
    v-model="centerDialog"
    title="添加待办"
    width="500"
    show-close="false"
    align-center
  >
    <el-form :model="taskFrom" :rules="rules">
      <el-form-item prop="content">
        <el-input
          v-model="taskFrom.content"
          type="text"
          placeholder="请输入待办事项"
        ></el-input>
      </el-form-item>
    </el-form>
    <el-form-item prop="createTime">
      <el-date-picker
        v-model="taskFrom.createTime"
        type="datetime"
        placeholder="请选择结束时间"
        format="YYYY/MM/DD hh:mm"
        value-format="YYYY-MM-DD h:m"
      />
    </el-form-item>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="CancelTask">取消</el-button>
        <el-button type="primary" @click="ConfirmTask">提交</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
    v-model="editDialog"
    title="修改待办"
    width="500"
    show-close="false"
    align-center
  >
    <el-form :model="taskFrom" :rules="rules">
      <el-form-item prop="content">
        <el-input
          v-model="taskFrom.content"
          type="text"
          placeholder="请输入待办事项"
        ></el-input>
      </el-form-item>
    </el-form>
    <el-form-item prop="createTime">
      <el-date-picker
        v-model="taskFrom.createTime"
        type="datetime"
        placeholder="请选择结束时间"
        format="YYYY/MM/DD hh:mm"
        value-format="YYYY-MM-DD h:m"
      />
    </el-form-item>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="CancelTask">取消</el-button>
        <el-button type="primary" @click="ConfirmEditTask">提交</el-button>
      </div>
    </template>
  </el-dialog>
  <userAuthentication :isOpenDialog="isDialogue"></userAuthentication>
</template>

<style scope>
.todoHeader {
  height: 5vh;
  font-size: 20px;
  text-align: center;
  color: #000000;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.todoMain {
  height: 75.5vh;
  border-top: 1px black solid;
}
.todoQuery {
  display: flex;
}
</style>
