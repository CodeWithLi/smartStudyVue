import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from '@/stores/index'
import '@/assets/main.scss'

import VueLazyload from 'vue3-lazyload'

import { ElMessage } from 'element-plus'

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(VueLazyload, {
  loading: '/path/image.png', // 占位符图片路径
  attempt: 3
})

app.mount('#app')

export default app
