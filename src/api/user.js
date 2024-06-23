import request from '@/utils/request'

//获取个人信息
export const getInfo = () => {
  return request.get('/info/')
}

//修改密码
export const editPass = ({ newPass, oldPass }) => {
  request.put('/info/editPass', { newPass, oldPass })
}

// 更新用户头像
export const userUpdateAvatarService = (file) => {
  return request.put('/info/image', file)
}

//发送验证码
export const userSendCode = ({ phone, purpose }) =>
  request.post('/user/sendSms', { phone, purpose })

//登录
export const userLogin = ({
  phone,
  idNumber,
  userName,
  password,
  loginType
}) => {
  return request.post('/user/loginSecurity', {
    phone,
    idNumber,
    userName,
    password,
    loginType
  })
}

//修改密码
export const userEditPass = ({ phone, password, code, purpose }) => {
  return request.put('/user/editSecurity', { phone, password, code, purpose })
}

//注册
export const registerUser = (signupForm) => {
  return request.post('/user/registerSecurity', signupForm)
}

//登出操作
export const logout = () => {
  return request.delete('/info/logoutSecurity')
}

//获取个人头像
export const imagePreview = () => {
  return request.get('/information/preview')
}

//获取个人信息
// export const getInfo = () => {
//   return request.get('/information')
// }

//修改个人信息
export const editInfo = (info) => {
  request.put('/information/perfect', info)
}

//获取权限
export const getAuthorities = () => {
  return request.get('/info/authorities')
}

// //重置密码
// export const editPass = ({ email, password }) =>
//   request.put('/information/editPass', { email, password })

//查询所有任务
export const allTask = () => {
  return request.get('/task')
}

//添加任务
export const addTask = (form) => {
  request.post('/task', form)
}

//删除任务
export const deleTask = (ids) => {
  request.delete(`/task/${ids}`)
}

//编辑任务
export const editTask = ({ id, content }) => {
  request.put('/task', { id, content })
}

//修改任务的完成状态
export const taskStatus = ({ id, status }) => {
  request.put('/status', { id, status })
}

//注册
export const artGetDetailService = (id) =>
  request.get('/my/article/info', {
    params: { id }
  })

// 注册接口
export const userRegisterService = ({ username, password, repassword }) =>
  request.post('/api/reg', { username, password, repassword })

// 登录接口
export const userLoginService = ({ username, password }) =>
  request.post('/api/login', { username, password })

// 获取用户基本信息
export const userGetInfoService = () => request.get('/my/userinfo')

// 更新用户基本信息
export const userUpdateInfoService = ({ id, nickname, email }) =>
  request.put('/my/userinfo', { id, nickname, email })

// 更新用户密码
export const userUpdatePasswordService = ({ old_pwd, new_pwd, re_pwd }) =>
  request.patch('/my/updatepwd', { old_pwd, new_pwd, re_pwd })
