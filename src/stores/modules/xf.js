import { defineStore } from 'pinia'
import { ref } from 'vue'
import { allDialogueNames } from '../../api/xf'

// 用户模块 token setToken removeToken
export const useGptStore = defineStore(
  'big-gpt',
  () => {
    //获取全部的聊天对话
    const dialogueNames = ref([])
    const setDialogueNames = async () => {
      //调用接口获取全部对话名称及其uid和顺序
      const ref = await allDialogueNames()
      dialogueNames.value = ref.data.data
    }

    const newDialogue = ref(true)

    const setDialogue = (dialogueStatus) => {
      newDialogue.value = dialogueStatus
    }

    return { dialogueNames, setDialogueNames, newDialogue, setDialogue }
  },
  {
    persist: true
  }
)
