import { createRouter, createWebHistory } from 'vue-router'
// import { useUserStore } from '@/stores'

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/login/loginService.vue')
    },
    {
      path: '/toDoPage',
      component: () => import('@/views/layout/layoutContainer.vue'),
      redirect: '/xfChat',
      children: [
        {
          path: '/student/info',
          component: () => import('@/views/student/adminStudent.vue')
        },
        {
          path: '/student/volunteer',
          component: () => import('@/views/student/adminVolunteer.vue')
        },
        {
          path: '/xfChat',
          component: () => import('@/views/chat/xfGptChatLayout.vue')
        },
        {
          path: '/itemOne',
          component: () => import('@/views/todo/testTodo.vue')
        },
        {
          path: '/volunteer',
          component: () => import('@/views/volunteer/volunteerActivity.vue')
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue')
        }
      ]
    }
  ]
})

// const userStore = useUserStore()
// router.beforeEach((to, from, next) => {
//   const token = userStore.token.value
//   if (to.path !== '/login' && !token) {
//     // 如果用户未登录且不是访问登录页面，则重定向到登录页面
//     next('/login')
//   } else {
//     // 如果用户已登录或者正在访问登录页面，则继续导航
//     next()
//   }
// })

export default router
