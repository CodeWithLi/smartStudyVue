<script setup>
import { allVolunteerReview, reviewVolunteer } from '@/api/volunteer.js'
import { onMounted, ref } from 'vue'

const reviewInfo = ref([])

onMounted(async () => {
  const response = await allVolunteerReview()
  reviewInfo.value = response.data.data
})

const reviewResult = ref({
  purpose: '',
  userId: '',
  volunteerActivityId: ''
})
const passBut = async (userId, volunteerActivityId, row) => {
  reviewResult.value.userId = userId
  reviewResult.value.volunteerActivityId = volunteerActivityId
  reviewResult.value.purpose = 'success'
  await reviewVolunteer(reviewResult.value)
  await ElMessage.success('审核成功')
  row.reviewStatus = 1
}
const failBut = async (userId, volunteerActivityId, row) => {
  reviewResult.value.userId = userId
  reviewResult.value.volunteerActivityId = volunteerActivityId
  reviewResult.value.purpose = 'fail'
  await reviewVolunteer(reviewResult.value)
  await ElMessage.success('审核成功')
  row.reviewStatus = -1
}
</script>

<template>
  <el-table :data="reviewInfo" height="250" style="width: 100%; height: 100%">
    <el-table-column label="封面" width="130">
      <template v-slot="scope">
        <el-image
          style="width: 100px; height: 100px"
          :src="scope.row.activityImage"
          fit="cover"
        />
      </template>
    </el-table-column>
    <el-table-column prop="activityTitle" label="标题" width="180" />
    <el-table-column prop="userName" label="姓名" width="80" />
    <el-table-column prop="userPhone" label="联系方式" width="120" />
    <el-table-column prop="userIdNumber" label="身份证号" width="180" />
    <el-table-column label="报名状态">
      <template v-slot="scope">
        <el-button v-if="scope.row.reviewStatus === 1" type="success" disabled
          >已报名</el-button
        >
        <el-button v-if="scope.row.reviewStatus === 0" type="warning" disabled
          >未审核</el-button
        >
        <el-button v-if="scope.row.reviewStatus === -1" type="danger" disabled
          >报名失败</el-button
        >
      </template>
    </el-table-column>
    <el-table-column width="170">
      <template v-slot="scope">
        <el-button-group size="default">
          <el-button
            @click="
              passBut(
                scope.row.userId,
                scope.row.volunteerActivityId,
                scope.row
              )
            "
            type="primary"
            >通过</el-button
          >
          <el-button
            @click="
              failBut(
                scope.row.userId,
                scope.row.volunteerActivityId,
                scope.row
              )
            "
            type="danger"
            >反对</el-button
          >
        </el-button-group>
      </template>
    </el-table-column>
  </el-table>
</template>

<style></style>
