import request from '@/utils/request'

//查询多条内容
export const allDialogueNames = () => {
  return request.get('/smart/allDialogues')
}

//获取某次聊天记录的全部对话
export const oneDialogue = (uid) => {
  return request.get('/smart/oneDialogue', {
    params: { uid }
  })
}

//发送问题
export const sendQuestion = ({ uid, question, newRequest }) => {
  return request.post('/smart/sendQuestion', { uid, question, newRequest })
}

//发送问题
export const idcard = (file) => {
  return request.post('/smart/idcard/authentication', file)
}
