<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import {
  userSendCode,
  userLogin,
  registerUser,
  userEditPass
} from '@/api/user.js'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
import { v4 } from 'uuid'

//进行表单校验
const form = ref()
const formModel = ref({
  userId: '',
  username: '',
  account: '',
  password: '',
  code: '',
  rePassword: '',
  purpose: '',
  phone: '',
  idNumber: '',
  userName: '',
  loginType: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 1, max: 10, message: '用户名为1-10位字符', trigger: 'blur' }
  ],
  account: [
    { required: true, message: '请输入手机号或身份证', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (/^1[3-9]\d{9}$/.test(value)) {
          callback()
        } else if (/^\d{18}$/.test(value)) {
          callback()
        } else if ('admin' === value) {
          callback()
        } else {
          callback(new Error('请正确输入手机号或身份证号'))
        }
      },
      trigger: 'blur'
    }
  ],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号码',
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码为6-15位且非空',
      trigger: 'blur'
    }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 4, max: 6, message: '验证码为4-6位字符', trigger: 'blur' }
  ],
  rePassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码为6-15位且非空',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        // 判断 value 和 当前 password 是否一致
        if (value != formModel.value.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback() // 就算校验成功，也需要callback
        }
      },
      trigger: 'blur'
    }
  ]
}

//进行验证码校验
const formPhone = ref()

const time = ref({
  isSend: false, //禁用
  codeName: '发送验证码',
  totalTime: 60, //一般是60
  timer: '' //定时器
})

//发送手机验证码
const sendCode = async () => {
  //校验phone是否填
  if (time.value.isSend) return
  await formPhone.value.validate()
  formModel.value.purpose = 'register'
  time.value.isSend = true
  await userSendCode(formModel.value)
  console.log(formModel.value)
  ElMessage.success('发送验证码成功')
  time.value.codeName = time.value.totalTime + 's后重新发送'
  time.value.timer = setInterval(() => {
    time.value.totalTime--
    time.value.codeName = time.value.totalTime + 's后重新发送'
    if (time.value.totalTime < 0) {
      clearInterval(time.value.timer)
      time.value.codeName = '重新发送验证码'
      time.value.totalTime = 10
      time.value.isSend = false
    }
  }, 1000)
}

//判断是哪个页面,后续0为注册,1为登录,-1为修改密码
const isStatus = ref(1)
const isPurpose = ref('login')
// formModel.value.purpose = 'login'
const login = () => {
  isStatus.value = 1
  isPurpose.value = 'login'
}
const sign = () => {
  isStatus.value = 0
  isPurpose.value = 'register'
}
const forget = () => {
  isStatus.value = -1
  isPurpose.value = 'edit'
}

//监视页面，切换则重置表单
watch(
  isStatus,
  () => {
    formModel.value = {
      username: '',
      account: '',
      phone: '',
      password: '',
      code: '',
      rePassword: '',
      purpose: isPurpose.value
    }
  },
  { deep: true }
)

//判断是哪个登录方式
const loginWay = ref('password')
//给按钮加样式
const typeSmsPrimary = ref()
const typePassPrimary = ref('primary')
const passWay = () => {
  loginWay.value = 'password'
  typePassPrimary.value = 'primary'
  typeSmsPrimary.value = ''
}
const smsWay = () => {
  loginWay.value = 'sms'
  typePassPrimary.value = ''
  typeSmsPrimary.value = 'primary'
}

const useStore = useUserStore()
const disabled = ref(false)
//封装路由，用于登陆成功后跳转
const router = useRouter()
//封装登录接口，发送请求
const loginCl = async () => {
  await form.value.validate()
  if (formModel.value.account === 'admin') {
    formModel.value.loginType = 'admin'
    formModel.value.userName = formModel.value.account
  } else if (/^1[3-9]\d{9}$/.test(formModel.value.account)) {
    formModel.value.loginType = 'phone'
    formModel.value.phone = formModel.value.account
  } else if (/^\d{18}$/.test(formModel.value.account)) {
    formModel.value.loginType = 'idNumber'
    formModel.value.idNumber = formModel.value.account
  }
  const result = await userLogin(formModel.value)
  if (result.data.code === 1) {
    disabled.value = true
  }
  // formModel.value.purpose = 'login'
  console.log(formModel.value)
  // 存储token
  // useStore.setToken(result.data.token)
  // 存储返回结果
  useStore.setLoginResponse(result.data.data)
  console.log('loginResponse')
  console.log(useStore.loginResponse)
  console.log(useStore.loginResponse.token)
  ElMessage.success('登录成功')
  // router.push('/toDoPage')
  // disabled.value = false
  router.push('/toDoPage')
}

watch(
  loginWay,
  () => {
    formModel.value = {
      username: '',
      account: '',
      phone: '',
      password: '',
      code: '',
      rePassword: '',
      purpose: 'login'
    }
  },
  { deep: true }
)

//封装修改密码接口
const editCl = async () => {
  await form.value.validate()
  disabled.value = true
  console.log(formModel.value)
  await userEditPass(formModel.value)
  ElMessage.success('修改成功')
  disabled.value = false

  isStatus.value = 1
}

//注册
//校验注册表单
const signForm = ref()
const signDis = ref(false)

const singCl = async () => {
  await signForm.value.validate()
  signDis.value = true
  formModel.value.userId = v4()
  const result = await registerUser(formModel.value)
  if (result.data.code === 1) {
    ElMessage.success('注册成功')
  }
  signDis.value = false
  isStatus.value = 1
}
</script>

<template>
  <el-row :span="24" class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <el-form
        ref="signForm"
        :model="formModel"
        :rules="rules"
        size="large"
        autocomplete="off"
        v-if="isStatus === 0"
      >
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            type="text"
            placeholder="请输入用户名"
            :prefix-icon="User"
          ></el-input>
        </el-form-item>
        <el-form-item prop="phone" ref="formPhone">
          <el-input
            v-model="formModel.phone"
            :prefix-icon="User"
            type="text"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            v-model="formModel.code"
            :prefix-icon="Lock"
            type="text"
            placeholder="请输入验证码"
          >
            <template #append>
              <el-button
                class="but"
                type="primary"
                :disabled="time.isSend"
                @click="sendCode"
              >
                {{ time.codeName }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="singCl"
            class="button"
            :disabled="signDis"
            type="primary"
            >注册</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button-group round size="small" class="editBut">
            <el-button class="loginBut" @click="login" type="info" plain>
              &lt; 登录
            </el-button>
            <el-button class="forgetBut" @click="forget" type="info" plain>
              忘记密码 &gt;
            </el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
      <!-- 登录页面 -->
      <el-form
        autocomplete="off"
        size="large"
        :model="formModel"
        :rules="rules"
        ref="form"
        v-else-if="isStatus === 1"
      >
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-button-group class="loginWay" size="default">
          <el-button :type="typePassPrimary" @click="passWay"
            >密码登录</el-button
          >
          <el-button :type="typeSmsPrimary" @click="smsWay">
            短信登录
          </el-button>
        </el-button-group>
        <div v-if="loginWay === 'password'">
          <el-form-item prop="account">
            <el-input
              v-model="formModel.account"
              :prefix-icon="User"
              type="text"
              placeholder="请输入手机号或身份证号"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="formModel.password"
              :prefix-icon="Lock"
              type="password"
              show-password
              placeholder="请输入密码"
            >
            </el-input>
          </el-form-item>
          <el-form-item prop="rePassword">
            <el-input
              v-model="formModel.rePassword"
              :prefix-icon="Lock"
              type="password"
              show-password
              placeholder="请再次输入密码"
            >
            </el-input>
          </el-form-item>
        </div>
        <div v-else-if="loginWay === 'sms'">
          <el-form-item prop="phone" ref="formPhone">
            <el-input
              v-model="formModel.phone"
              :prefix-icon="User"
              type="text"
              placeholder="请输入手机号码"
            ></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-input
              v-model="formModel.code"
              :prefix-icon="Lock"
              type="text"
              placeholder="请输入验证码"
            >
              <template #append>
                <el-button
                  class="but"
                  type="primary"
                  :disabled="time.isSend"
                  @click="sendCode"
                >
                  {{ time.codeName }}
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button
            :disabled="disabled"
            @click="loginCl"
            class="button"
            type="primary"
            >登录</el-button
          >
        </el-form-item>
        <el-form-item>
          <div class="editBut">
            <el-button-group round size="small">
              <el-button class="loginBut" @click="sign" type="info" plain>
                &lt; 注册
              </el-button>
              <el-button class="forgetBut" @click="forget" type="info" plain>
                忘记密码 &gt;
              </el-button>
            </el-button-group>
          </div>
        </el-form-item>
      </el-form>
      <!-- 忘记密码相关页面 -->
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-else-if="isStatus === -1"
      >
        <el-form-item>
          <h1>修改密码</h1>
        </el-form-item>
        <el-form-item prop="phone" ref="formPhone">
          <el-input
            v-model="formModel.phone"
            :prefix-icon="User"
            type="text"
            placeholder="请输入手机号码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入修改之后的密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            v-model="formModel.code"
            :prefix-icon="Lock"
            type="text"
            placeholder="请输入验证码"
          >
            <template #append>
              <el-button
                class="but"
                type="primary"
                :disabled="time.isSend"
                @click="sendCode"
              >
                {{ time.codeName }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            :disabled="disabled"
            @click="editCl"
            class="button"
            type="primary"
            >修改密码</el-button
          >
        </el-form-item>
        <el-form-item>
          <div class="editBut">
            <el-button-group round size="small">
              <el-button class="loginBut" @click="login" type="info" plain>
                &lt; 登录
              </el-button>
              <el-button class="forgetBut" @click="sign" type="info" plain>
                注册 &gt;
              </el-button>
            </el-button-group>
          </div>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style scope>
.login-page {
  height: 100vh;
  background-color: #fff;
}
.bg {
  background:
    url('@/assets/logo2.png') no-repeat 60% center / 350px auto,
    url('@/assets/login_bg.jpg') no-repeat center / cover;
}
.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  user-select: none;
}
.loginWay {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}
.editBut {
  cursor: pointer;
  display: flex;
  justify-content: flex-end;
  width: 100%;
  /* border: 1px red solid; */
  /* margin-left: 25%; */
}
.button {
  width: 100%;
}
</style>
