import request from '@/utils/request'

//查询所有志愿活动
export const allVolunteer = () => {
  return request.get('/volunteer/all')
}

//查询某项活动的具体信息
export const oneVolunteer = (activityId) => {
  return request.get('/volunteer/', {
    params: { activityId }
  })
}

//添加活动
export const upload = (file, activityId) => {
  return request.put('/volunteer/upload', file, {
    params: { activityId }
  })
}

//删除活动
export const deleteVolunteer = (activityId) => {
  return request.delete('/volunteer/', {
    params: { activityId }
  })
}
//上传图片
export const addVolunteer = (volunteerActivity) => {
  return request.post('/volunteer/', volunteerActivity)
}

//报名
export const application = ({ volunteerActivityId }) => {
  request.post('/volunteer/application', { volunteerActivityId })
}

//管理员查询待审核的活动
export const allVolunteerReview = () => {
  return request.get('/volunteer/allReview')
}

//管理员查询待审核的活动
export const reviewVolunteer = ({ userId, volunteerActivityId, purpose }) => {
  request.put('/volunteer/success', {
    userId,
    volunteerActivityId,
    purpose
  })
}
