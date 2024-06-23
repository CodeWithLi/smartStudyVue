<script setup>
// //发送信息
// const enterPress = async () => {
//   // pageText.value.answer = ''
//   pageStart.value = ''
//   // 取消 Enter 键的默认行为（文本域换行）
//   sendContentButStatus.value = true
//   // 清除之前的计时器
//   intervalId = null
//   //重置索引，否则index 变量的值已经大于0了
//   index = 0
//   if (textarea.value === '') {
//     ElMessage({
//       showClose: true,
//       message: '请先输入内容',
//       type: 'warning',
//       plain: true,
//       duration: 2000
//     })
//     sendContentButStatus.value = false
//     return
//   }
//   pageText.value.question = textarea.value

//   sendQuestionFrom.value.question = textarea.value
//   //调用后端接口得到回答
//   if (sendQuestionFrom.value.uid != '') {
//     sendQuestionFrom.value.newRequest = false
//   }

//   //调用接口
//   const ref = await sendQuestion(sendQuestionFrom.value)

//   // 创建一个新的对象，避免直接使用引用
//   const newDialogue = {
//     question: pageText.value.question,
//     answer: ref.data.data.answer
//   }

//   // 添加新记录到对话历史中
//   await historyDialogue.value.push(newDialogue)

//   pageText.value.answer = ref.data.data.answer
//   textarea.value = ''
//   sendContentButStatus.value = false
//   //打印机效果
//   startTypewriter(ref.data.data.answer)
// }

// const text = ref('')
// let index = 0
// let intervalId = null

// const pageStart = ref('')

// const startTypewriter = (result) => {
//   intervalId = setInterval(() => {
//     if (index <= result.length) {
//       text.value = result.slice(0, index)
//       pageStart.value = text.value
//       index++
//     } else {
//       //清除定时器
//       clearInterval(intervalId)
//       textarea.value = ''
//       sendContentButStatus.value = false
//     }
//   }, 100) // 设置每个字符的显示间隔
// }

// onBeforeUnmount(() => {
//   clearInterval(intervalId)
// })

// // 判断是否应该渲染当前项
// const shouldRender = (index) => {
//   if (
//     // 判断是否为最后一项
//     index === historyDialogue.value.length - 1 &&
//     pageText.value.answer !== ''
//   ) {
//     console.log('我是最后一项')
//     console.log(index)
//     return false
//   }

//   return true
// }
import { ref, watch, onBeforeUnmount, defineProps, defineEmits } from 'vue'
import { Upload, User, ChatDotRound } from '@element-plus/icons-vue'
import { sendQuestion } from '@/api/xf.js'
// import cloneDeep from 'lodash/cloneDeep' // 使用 lodash 的深拷贝函数

const isFocused = ref(false)
const handleFocus = () => {
  isFocused.value = true
}

//父组件传来的chat
const props = defineProps({
  chat: Object
})

const chatHistory = ref(props.chat)

const historyDialogue = ref([])

watch(
  () => props.chat.oneHistoryDialogue,
  (newOneHistoryDialogue) => {
    chatHistory.value.oneHistoryDialogue = newOneHistoryDialogue
    historyDialogue.value = chatHistory.value.oneHistoryDialogue
  },
  { deep: true }
)

// 处理点击事件
const handleWindowClick = (event) => {
  // 如果点击的目标不是在 .divTextarea 中，则取消焦点状态
  if (!event.target.closest('.divTextarea')) {
    isFocused.value = false
  }
}

// 处理按下键盘的事件
const handleEnterPress = (event) => {
  console.log('键盘按下')
  // 如果按下的是 Enter 键（keyCode 为 13）且没有按下 Shift 键
  if (!event.shiftKey && event.keyCode === 13) {
    // 取消默认行为
    event.preventDefault()
    const elButElement = document.querySelector('.elBut')
    console.log(elButElement)
    // 通过程序触发按钮点击事件
    document.querySelector('.elBut').click()
  } else if (event.shiftKey) {
    // 如果同时按下了 Shift 键
    // 插入换行符
    textarea.value += '\n'
  }
}

//用户新聊天记录
const pageText = ref({ question: '', answer: '' })

const sendContentButStatus = ref(false)

//发送到后端对应的question为
const textarea = ref()

const sendQuestionFrom = ref({
  uid: '',
  question: '',
  newRequest: true
})

//传输结果到父组件
// const emit = defineEmits(['getNewDialogueName'])
// 传输结果到父组件
const emit = defineEmits(['getNewDialogueName'])

sendQuestionFrom.value.uid = chatHistory.value.uuid
const enterPress = async () => {
  sendContentButStatus.value = true
  if (!textarea.value.trim()) {
    ElMessage({
      showClose: true,
      message: '请先输入内容',
      type: 'warning',
      plain: true,
      duration: 2000
    })
    sendContentButStatus.value = false
    return
  }

  pageText.value.question = textarea.value.trim()
  sendQuestionFrom.value.question = textarea.value.trim()

  if (sendQuestionFrom.value.uid) {
    sendQuestionFrom.value.newRequest = false
  }

  // 添加新问题到对话历史，但答案为空
  historyDialogue.value.push({
    question: pageText.value.question,
    answer: ''
  })

  // 清空 pageStart
  pageStart.value = ''
  textarea.value = ''

  // 调用后端接口获取回答
  try {
    const response = await sendQuestion(sendQuestionFrom.value)
    // 触发自定义事件
    emit('getNewDialogueName', response.data.data)

    const answer = response.data.data.answer

    // 更新最后一条对话的答案
    historyDialogue.value[historyDialogue.value.length - 1].answer = answer

    // 开始打字机效果
    startTypewriter(answer)
  } catch (error) {
    ElMessage({
      showClose: true,
      message: '获取回答失败，请重试',
      type: 'error',
      plain: true,
      duration: 2000
    })
    sendContentButStatus.value = false
  }
}

const text = ref('')
let index = 0
let intervalId = null

const pageStart = ref('')

const startTypewriter = (result) => {
  // 先清空 text 和 pageStart
  text.value = ''
  pageStart.value = ''
  index = 0
  pageStart.value = ''
  intervalId = setInterval(() => {
    if (index <= result.length) {
      text.value = result.slice(0, index)
      pageStart.value = text.value
      index += 2
    } else {
      clearInterval(intervalId)
      sendContentButStatus.value = false
    }
  }, 100)
}

onBeforeUnmount(() => {
  clearInterval(intervalId)
})

const shouldRender = (index) => {
  return !(
    index === historyDialogue.value.length - 1 && sendContentButStatus.value
  )
}
</script>

<template>
  <div class="divHome">
    <div>
      <div class="SparkDiv">SparkDesk</div>
      <el-scrollbar class="pageTextScroll" max-height="600px">
        <div
          v-for="(item, index) in historyDialogue"
          :key="index"
          style="width: 60vw"
        >
          <pre
            v-if="shouldRender(index)"
            style="font-size: 16px; color: #333"
          ><div class="map map1"><span class="centered">
         <i class="icon"> <el-button  type="primary"  :dark="isDark"  disabled size="small" class="elIc" :icon="User" circle /></i>{{item.question}}</span></div
          > <div class="map map2"><span class="centered"><i class="icon"> <el-button  type="primary"  :dark="isDark"  disabled size="small" class="elIc Image" color="green" :icon="ChatDotRound" circle /></i>{{item.answer}}</span>
          </div></pre>
          <pre
            v-else
            style="font-size: 16px; color: #333"
          ><div class="map map1"><span class="centered">
         <i class="icon"> <el-button  type="primary"  :dark="isDark"  disabled size="small" class="elIc" :icon="User" circle /></i>{{pageText.question}}</span></div
          > <div class="map map2"><span class="centered"><i class="icon"> <el-button  type="primary"  :dark="isDark"  disabled size="small" class="elIc Image" :icon="ChatDotRound" circle /></i>{{pageStart}}</span>
          </div></pre>
        </div>
      </el-scrollbar>
    </div>
    <div
      class="divTextarea"
      :class="{ focused: isFocused }"
      @click="handleFocus"
      @keydown.enter="handleEnterPress"
      tabindex="0"
    >
      <el-input
        class="textarea"
        type="textarea"
        resize="none"
        :border="false"
        :autosize="{ minRows: 1.5, maxRows: 3 }"
        placeholder="请输入想提问的问题: ......"
        v-model="textarea"
        :disabled="sendContentButStatus"
      >
      </el-input>
      <div>
        <el-button
          class="elBut"
          type="info"
          :disabled="sendContentButStatus"
          :icon="Upload"
          circle
          @click="enterPress"
        />
      </div>
    </div>
  </div>
</template>

<style scope>
.divHome {
  width: 66vw;
  height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.divTextarea {
  margin: 10px 2.5vw;
  padding: 0 10px 0 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 60vw;
  border: 1px solid transparent;
  border-radius: 10px;
  transition: border-color 0.2s ease; /* 添加过渡效果 */
}
.divTextarea.focused {
  border-color: blue;
}
.textarea {
  width: 55vw;
  white-space: pre;
  word-wrap: break-word;
}
.textarea ::-webkit-scrollbar {
  overflow: hidden;
}
/* 设置文本域没有边框和颜色 */
.el-textarea__inner {
  border: 0;
  box-shadow: none;
  --el-input-focus-border-color: none;
  --el-input-hover-border-color: none;
}
.elBut {
  opacity: 0.8;
}
.SparkDiv {
  color: rgb(69, 130, 252);
  font-size: 20px;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
    'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  font-weight: 500;
}
.pageTextScroll {
  margin-right: 30px;
  height: 60vh;
}
.map {
  width: 66vw;
  margin-top: 0px;
  display: flex;
  word-wrap: break-word; /* 确保长单词能够换行 */
  white-space: pre-wrap; /* 保持文本中的空白字符并允许换行 */
}
.elIc {
  margin-right: 10px;
}
.centered {
  width: 60vw;
  display: flex;
  align-items: center;
  justify-content: flex-start; /* 垂直居中对齐 */
  white-space: pre-wrap; /* 保持文本的空白字符和换行符，同时允许换行 */
  word-wrap: break-word;
}
.el-button.is-circle {
  border-radius: 0px;
}
.icon {
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
}
</style>
