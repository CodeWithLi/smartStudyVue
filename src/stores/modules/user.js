import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getInfo, getAuthorities } from '../../api/user'

// 用户模块 token setToken removeToken
export const useUserStore = defineStore(
  'big-user',
  () => {
    const token = ref('')
    const setToken = (newToken) => {
      token.value = newToken
    }
    const removeToken = () => {
      token.value = ''
    }

    const loginResponse = ref('')
    const setLoginResponse = (response) => {
      loginResponse.value = response
    }
    const removeLoginResponse = () => {
      loginResponse.value = ''
    }

    const user = ref({})
    const getUser = async () => {
      //获取个人信息
      const res = await getInfo() // 请求获取数据
      user.value = res.data.data
    }
    const setUser = (obj) => {
      user.value = obj
    }
    const removeUser = () => {
      user.value = ''
    }

    const authorities = ref([])

    const newAuthorities = async (obj) => {
      authorities.value = obj
    }

    const setAuthorities = async () => {
      const ref = await getAuthorities()
      authorities.value = ref.data.data
    }
    return {
      token,
      setToken,
      removeToken,
      loginResponse,
      setLoginResponse,
      user,
      getUser,
      setUser,
      removeUser,
      removeLoginResponse,
      authorities,
      newAuthorities,
      setAuthorities
    }
  },
  {
    persist: true
  }
)
