import request from '@/utils/request'

//查询多条内容
export const allTask = (name) => {
  return request.get('/task/', {
    params: { name }
  })
}
//查询单条内容
export const queryOneTask = (content, name) => {
  return request.get('task/one', {
    params: { content, name }
  })
}

//添加任务
export const addTask = ({ content, name, endTime }) => {
  return request.post('/task/', { content, name, endTime })
}

//编辑任务
export const editTask = ({ taskId, content, endTime }) => {
  return request.put('/task/', { taskId, content, endTime })
}

//删除任务
export const deleteTask = (taskId) => {
  return request.delete('/task/', { params: { taskId } })
}

//修改任务状态
export const editStatus = ({ taskId, status }) => {
  request.put('/task/status', { taskId, status })
}
