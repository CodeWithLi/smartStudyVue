<script setup>
import testGpt from '@/components/testGpt.vue'
import { onMounted, ref } from 'vue'
import { Plus, Delete } from '@element-plus/icons-vue'
import { useGptStore, useUserStore } from '@/stores'

import { oneDialogue } from '@/api/xf.js'

//定义store
const gptStore = useGptStore()

//定义用户store
const userStore = useUserStore()
//用于添加对话表单
const addDialogueFrom = ref({
  userId: userStore.user.userId,
  uid: '',
  dialogueName: ''
})

//对话名称对象
const historyNames = ref([])
onMounted(async () => {
  //获取对话历史名称
  await gptStore.setDialogueNames()
  // 对数据按照 dialoguePlace 进行排序
  historyNames.value = gptStore.dialogueNames.sort((a, b) => {
    return parseInt(b.dialoguePlace) - parseInt(a.dialoguePlace)
  })

  console.log(userStore.user.userId)
})

const message = ref(true)

const historyBut = async () => {
  console.log('addDialogueFrom' + addDialogueFrom.value.userId)
  addDialogueFrom.value.dialogueName = ''
  historyNames.value.unshift(addDialogueFrom.value)
  historyNames.value = [...historyNames.value]
  console.log(
    'historyNames.value' +
      historyNames.value[historyNames.value.length - 1].userId
  )
}
// 全部聊天对话
const oneHistoryDialogue = ref([])
//该对话uid
const uuid = ref('')
//组装对象传到后端
const dialogueSon = ref({
  oneHistoryDialogue,
  uuid
})
//点击某个按钮获取全部聊天对话
const getOneDialogue = async (uid) => {
  if (uid == '') {
    message.value = false
    return
  }
  const ref = await oneDialogue(uid)
  oneHistoryDialogue.value = ref.data.data
  console.log('oneHistoryDialogue.value')
  console.log(oneHistoryDialogue.value)
  uuid.value = uid
  message.value = false
}

//当该聊天记录对话名称为新建时，应从子类获取对话名称赋值给该对话
const getNewDialogueName = (msg) => {
  if (historyNames.value.length > 0) {
    historyNames.value[0].uid = msg.uid // 因为新添加的是在数组的最前面
    historyNames.value[0].dialogueName = msg.dialogueName
    historyNames.value = [...historyNames.value] // 触发 Vue 的响应式
  }
}

// 假设历史记录为以下数组
const historyRecords = ref([{ history: '', chat: [] }])

const highlightedRecord = ref(null)

//记录当前数组值
const contentRecord = ref({ chat: [{ MyMess: '', XfMess: '' }], index: null })

const showChatBox = (index) => {
  highlightedRecord.value = index
  // 更新 contentRecord 的聊天记录值
  contentRecord.value.chat = historyRecords.value[index].chat
  // 更新 contentRecord 的索引值
  contentRecord.value.index = index
}

// 修改 updateChatHistory 方法，接收索引参数
const updateChatHistory = (newMessage, index) => {
  // 使用传递过来的索引更新相应的历史记录
  historyRecords.value[index].chat.push(newMessage)
}

const deleteBut = () => {
  // historyRecords.value = ref([])
}
</script>

<template>
  <!-- 最外层页面于窗口同宽，使聊天面板居中 -->
  <div class="home-view">
    <!-- 整个聊天面板 -->
    <div class="chat-panel">
      <!-- 左侧的会话列表 -->
      <div class="session-panel">
        <div class="title">讯飞星火助手</div>
        <el-button-group class="elHisToryButs">
          <el-button size="small" @click="historyBut" class="historyBut"
            ><el-icon><Plus /></el-icon>新建对话</el-button
          >
          <el-button size="small" @click="deleteBut" class="historyBut"
            ><el-icon><Delete /></el-icon>删除全部</el-button
          >
        </el-button-group>
        <div class="divHistory">历史对话</div>
        <el-scrollbar height="350px"
          ><div
            v-for="(item, index) in historyNames"
            :key="index"
            @click="showChatBox(index)"
            :class="{ active: highlightedRecord === index }"
            class="forBut"
          >
            <!-- <span v-if="item.dialogueName === ''"> <wu></wu> </span> -->
            <!--    v-else -->
            <el-button
              class="dialogueButWidth"
              @click="getOneDialogue(item.uid)"
            >
              <span style="text-align: left">{{ item.dialogueName }}</span>
            </el-button>
          </div>
        </el-scrollbar>
      </div>
      <!-- 右侧的消息记录 -->
      <div class="message-panel">
        <div v-if="message" class="message">
          <el-empty :image-size="300">
            <el-text class="mx-1" size="large">请问我能帮助你什么？</el-text>
          </el-empty>
        </div>
        <!-- 子组件，传递历史记录并监听新消息事件 -->
        <div v-else>
          <testGpt
            :chat="dialogueSon"
            @getNewDialogueName="getNewDialogueName"
          ></testGpt>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.home-view {
  background-color: rgba(234, 234, 234, 0.5);
  // background-color: rgba(0, 2, 2, 0.5);
  display: flex;
  /* 与窗口同宽 */
  // width: 78vw;
  // height: 67.8vh;
  width: 78vw;
  height: 78vh;
  margin-bottom: 1px;
  padding-bottom: 1px;
  border-bottom: 1px;
  /* 水平方向上剧中 */
  justify-content: center;

  .chat-panel {
    /* 聊天面板flex布局，让会话列表和聊天记录左右展示 */
    display: flex;
    width: 100vw;
    height: 78vh;
    /* 让聊天面板圆润一些 */
    border-radius: 20px;
    // background-color: rgb(232, 50, 50);
    /* 左侧聊天会话面板*/
    .session-panel {
      background-color: rgba(26, 26, 34, 0.8);
      color: rgba(255, 255, 255, 0.9);
      font-weight: bold;
      font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
      width: 11vw;
      border-top-right-radius: 20px;
      border-bottom-right-radius: 20px;
      padding: 20px;
      position: relative;
      // border-right: 1px solid rgba(black, 0.07);
      /* 标题*/
      .title {
        margin-top: 20px;
        font-size: 20px;
        margin-bottom: 10px;
      }
      // /* 描述*/
      .description {
        // color: rgba(black, 0.7);
        font-size: 10px;
        margin-top: 10px;
      }
      .dialogueButWidth {
        width: 10vw;
        height: 30px;
      }
    }
    /* 右侧消息记录面板*/
    .message-panel {
      width: 66vw;
      height: 60vh;
      margin-top: 10px;
      margin-left: 10px;
    }
  }
}
.el-empty {
  --el-empty-padding: 20px 0;
}
.divHistory {
  font-size: 12px;
  width: 4.5vw;
  margin-bottom: 10px;
  border-bottom: 1px solid white;
}
.scrollbar-demo-item {
  display: flex;
  align-items: center;
  // justify-content: space-evenly;
  height: 50px;
  margin: 10px;
  text-align: center;
}
.butScroll {
  --el-button-bg-color: rgba(255, 255, 255, 0);
  width: 10vw;
  // --el-button-border-color:
  border: 0 solid transparent;
  display: flex;
  justify-content: space-evenly;
}
.historyContent {
  margin-right: 2vw;
}
.forBut {
  margin-bottom: 5px;
  margin-left: 1px;
}
.historyBut {
  font-size: 10px;
  background-color: rgb(255, 255, 255);
  opacity: 0.8;
  margin-bottom: 10px;
}
.elHisToryButs {
  margin-right: 10px;
  padding: 0px;
  width: 5vw;
  display: flex;
  justify-content: flex-start;
}
</style>
