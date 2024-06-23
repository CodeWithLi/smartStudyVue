<script lang="ts" setup>
  import { onMounted, ref } from "vue";
  import { ChatSession } from "../../../typings";
  import {
    findChatSessionById,
    queryChatSession,
    saveChatSession,
  } from "@/api/chat-session";
  import SessionItem from "@/components/xfGptCardItem.vue";
  import { CirclePlus } from "@element-plus/icons-vue";

  const isEdit = ref(false);
  const activeSession = ref({ messages: [] } as ChatSession);
  const sessionList = ref([] as ChatSession[]);
  onMounted(() => {
    // 查询自己的聊天会话
    queryChatSession({ pageSize: 1000, pageNum: 1, query: {} }).then((res) => {
      // 讲会话添加到列表中
      sessionList.value.push(...res.result.list);
      // 默认选中的聊天会话是第一个
      if (sessionList.value.length > 0) {
        activeSession.value = sessionList.value[0];
      }
    });
  });
  // 切换会话
  const handleSessionSwitch = (session: ChatSession) => {
    activeSession.value = session;
  };
  // 从会话列表中删除会话
  const handleDeleteSession = (session: ChatSession) => {
    const index = sessionList.value.findIndex((value) => {
      return value.id === session.id;
    });
    sessionList.value.splice(index, 1);
  };
  // 新增会话
  const handleCreateSession = async () => {
    const res = await saveChatSession({ topic: "新的聊天" });
    sessionList.value.unshift((await findChatSessionById(res.result)).result);
  };
</script>
<template>
  <div class="home-view">
    <div class="chat-panel">
      <div class="session-panel">
        <!-- 省略... -->

        <!-- 会话列表 -->
        <div class="session-list">
          <!-- for循环遍历会话列表用会话组件显示，并监听点击事件和删除事件。点击时切换到被点击的会话，删除时从会话列表中提出被删除的会话。 -->
          <!--  -->
          <SessionItem></SessionItem>
          <SessionItem
            v-for="(session, index) in sessionList"
            :key="session.id"
            :active="session.id === activeSession.id"
            :session="sessionList[index]"
            class="session"
            @click="handleSessionSwitch(session)"
            @delete="handleDeleteSession"
          ></SessionItem>
        </div>
        <div class="button-wrapper">
          <div class="new-session">
            <el-button @click="handleCreateSession">
              <el-icon :size="15" class="el-icon--left">
                <CirclePlus />
              </el-icon>
              新的聊天
            </el-button>
          </div>
        </div>
      </div>
      <!-- 省略... -->
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .home-view {
    /* 省略... */
    .chat-panel {
      /* 省略... */
      .session-panel {
        /* 省略... */
        .session-list {
          .session {
            /* 每个会话之间留一些间距 */
            margin-top: 20px;
          }
        }

        .button-wrapper {
          /* session-panel是相对布局，这边的button-wrapper是相对它绝对布局 */
          position: absolute;
          bottom: 20px;
          left: 0;
          display: flex;
          /* 让内部的按钮显示在右侧 */
          justify-content: flex-end;
          /* 宽度和session-panel一样宽*/
          width: 100%;

          /* 按钮于右侧边界留一些距离 */
          .new-session {
            margin-right: 20px;
          }
        }
      }
    }
    /* 省略... */
  }
</style>
