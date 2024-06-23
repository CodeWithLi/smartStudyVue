<script setup>
import { useRouter } from 'vue-router'
import { getInfo, logout, getAuthorities } from '@/api/user.js'
// import { idcard } from '@/api/xf.js'
import {
  ChatLineSquare,
  Calendar,
  UserFilled,
  User,
  Crop,
  EditPen,
  CaretBottom
  // Upload,
  // Plus
} from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores'

const router = useRouter()

const userInfo = ref('')

const userStore = useUserStore()

//获取为哪个用户登录
const loginType = ref('')

//获取用户权限
const authorities = ref([])

// const normalUser = ref('volunteer_review')

const normalUserBut = ref(false)

//判断是否已认证用户
const normalUser = ref('no_authentication')

onMounted(async () => {
  const loginResponse = await userStore.loginResponse
  //获取用户权限
  const response = await getAuthorities()
  userStore.setAuthorities()

  if (loginResponse === '') {
    ElMessage.error('未登录,请先进行登录')
    router.push('/')
    return
  }
  //封装权限
  console.log(loginResponse)
  authorities.value = response.data.data
  console.log(authorities.value)
  if (authorities.value.includes(normalUser.value)) {
    normalUserBut.value = true
  }
  try {
    const res = await getInfo() //获取个人信息
    userInfo.value = res.data.data
    userStore.setUser(userInfo.value)
    loginType.value = loginResponse.status
  } catch (error) {
    ElMessage.error('获取用户信息失败')
  }
})

const handleCommand = async (key) => {
  if (key === 'logout') {
    // 退出操作
    await ElMessageBox.confirm('你确认要进行退出么', '温馨提示', {
      type: 'warning',
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    })
    const ref = await logout()
    if (ref.data.code === 1) {
      ElMessage.success(ref.data.data)
    }

    userStore.removeLoginResponse()
    router.push('/')
  } else {
    // 跳转操作
    router.push(`/user/${key}`)
  }
}

const isDialogue = ref(false)
const normalBut = () => {
  // openDialog.value = true
  isDialogue.value = true
}
//子传父
const getIsDialogue = (msg) => {
  isDialogue.value = msg
  //重新获取信息
  //封装权限
  authorities.value = userStore.authorities
  userInfo.value = userStore.user
  normalUserBut.value = false
  if (!authorities.value.includes(normalUser.value)) {
    normalUserBut.value = false
  }
}

// const getNewAvatar = (msg) => {
//   userInfo.value = userStore.user
//   console.log('userinfo')
//   console.log(userInfo)
//   console.log(msg)
// }
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside class="aside">
        <div class="imgDiv"></div>
        <div>
          <el-menu
            @select="handleSelect"
            active-text-color="block"
            background-color="rgb(142, 196, 243,0.8)"
            :default-active="$route.path"
            text-color="#fff"
            router
          >
            <el-sub-menu v-if="loginType === 'admin'" index="/student">
              <!-- 多级菜单的标题 - 具名插槽 title -->
              <template #title>
                <el-icon><UserFilled /></el-icon>
                <span>学生中心</span>
              </template>

              <!-- 展开的内容 - 默认插槽 -->
              <el-menu-item index="/student/info">
                <el-icon><User /></el-icon>
                <span>学生管理</span>
              </el-menu-item>
              <el-menu-item index="/student/volunteer">
                <el-icon><User /></el-icon>
                <span>志愿审核</span>
              </el-menu-item>
            </el-sub-menu>
            <el-menu-item index="/xfChat">
              <el-icon><ChatLineSquare /></el-icon>
              <span>讯飞大模型</span>
            </el-menu-item>
            <el-menu-item index="/itemOne">
              <el-icon><Calendar /></el-icon>
              <span>任务清单</span>
            </el-menu-item>
            <el-menu-item index="/volunteer">
              <el-icon><Calendar /></el-icon>
              <span>志愿活动</span>
            </el-menu-item>
            <el-sub-menu index="/user">
              <!-- 多级菜单的标题 - 具名插槽 title -->
              <template #title>
                <el-icon><UserFilled /></el-icon>
                <span>个人中心</span>
              </template>

              <!-- 展开的内容 - 默认插槽 -->
              <el-menu-item index="/user/profile">
                <el-icon><User /></el-icon>
                <span>基本资料</span>
              </el-menu-item>
              <el-menu-item index="/user/avatar">
                <el-icon><Crop /></el-icon>
                <span>更换头像</span>
              </el-menu-item>
              <el-menu-item index="/user/password">
                <el-icon><EditPen /></el-icon>
                <span>重置密码</span>
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </div>
      </el-aside>
      <el-container>
        <el-header class="header">
          <div v-if="normalUserBut">
            <el-button @click="normalBut" type="warning" plain
              >进行认证</el-button
            >
          </div>
          <div v-else>
            {{ userInfo.name }}
          </div>
          <el-dropdown placement="bottom-end" @command="handleCommand">
            <!-- 展示给用户，默认看到的 -->
            <span class="el-dropdown__box">
              <el-avatar :src="userInfo.image || UserFilled" />
              <el-icon><CaretBottom /></el-icon>
            </span>

            <!-- 折叠的下拉部分 -->
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile" :icon="User"
                  >基本资料</el-dropdown-item
                >
                <el-dropdown-item command="avatar" :icon="Crop"
                  >更换头像</el-dropdown-item
                >
                <el-dropdown-item command="password" :icon="EditPen"
                  >重置密码</el-dropdown-item
                >
                <el-dropdown-item command="logout" :icon="SwitchButton"
                  >退出登录</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-header>
        <el-main class="main">
          <router-view></router-view>
        </el-main>
        <el-footer class="footer">
          <span>智学通</span>
        </el-footer>
      </el-container>
    </el-container>
  </div>
  <userAuthentication
    @get-isDialogue="getIsDialogue"
    :isOpenDialog="isDialogue"
  ></userAuthentication>
  <!-- <UserAvatar @get-newAvatar="getNewAvatar"></UserAvatar> -->
</template>

<style scope lang="scss">
.common-layout {
  background-color: rgba(202, 191, 191, 0.3);
}
.header {
  opacity: 0.9;
  height: 6.5vh;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .el-dropdown__box {
    display: flex;
    align-items: center;
    .el-icon {
      color: #999;
    }
  }
}
.imgDiv {
  background: url('@/assets/image.png') no-repeat 0% center / 17vw auto;
  margin-bottom: 20px;
  height: 19vh;
}
.aside {
  background-color: rgb(142, 196, 243);
  width: 17vw;
  height: 100vh;
}
.main {
  height: 78vh;
  border-radius: 5px;
  /* border: 2px black solid; */
}
/* 菜单 --el-menu-bg-color:  */
.el-menu-demo {
  --el-menu-bg-color: background-color: rgb(142, 196, 243);
  --el-menu-text-color: rgb(5, 5, 5);
  --el-menu-hover-bg-color: rgba(76, 61, 61, 0.5);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 600;
}
.footer {
  border-top: 1px black solid;
  height: 5vh;
}
element.style {
  object-fit: contain;
}
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
