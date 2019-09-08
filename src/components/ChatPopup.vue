<template>
  <section class="chat-popup" v-if="isExpanded">
    <header class="chat-header">
      <button
        type="button"
        class="close-btn"
        aria-label="Close"
        @click="collapseChat"
      >
        x
      </button>
      <h2 class="title-name">Chat Bot</h2>
      <span class="reply-speed">Typically replies instantly</span>
    </header>
    <main class="chat-main" ref="scrollableEl">
      <div
        v-for="(message, index) in messages"
        class="message"
        :class="{ mine: message.author === username }"
        :key="index"
      >
        <div class="msg-wrapper">
          <span class="msg-author">{{ message.author }}:</span
          ><span class="msg-text">{{ message.message }}</span>
        </div>
        <time
          v-if="message.datetime"
          class="msg-time"
          :datetime="format(message.datetime, 'y-MM-dd HH:mm:ss')"
          :title="format(message.datetime, 'y-MM-dd HH:mm:ss')"
          >{{ format(message.datetime, "HH:mm") }}</time
        >
      </div>
      <div class="notification" v-if="isCompleted">
        <span>The conversation has been finished.</span>
        <button class="notification-btn" @click="reinitConversation">
          Start the new one
        </button>
      </div>
    </main>
    <footer class="chat-footer" :class="{ completed: isCompleted }">
      <div class="commands">
        <button
          v-if="!command.type"
          @click="sendCommandRequest"
          class="command-btn"
          :disabled="isCompleted"
        >
          Request random command
        </button>
        <DateWidget
          v-else-if="command.type === 'date'"
          :date="command.data"
          @send="sendCommand('date', $event)"
          class="command"
        />
        <MapWidget
          v-else-if="command.type === 'map'"
          :lat="command.data.lat"
          :lng="command.data.lng"
          @close="clearCommand()"
          class="command"
        />
        <RateWidget
          v-else-if="command.type === 'rate'"
          :fromRate="command.data[0]"
          :toRate="command.data[1]"
          @send="sendCommand('rate', $event)"
          class="command"
        />
        <CompleteWidget
          v-else-if="command.type === 'complete'"
          :options="command.data"
          @send="sendCommand('complete', $event)"
          class="command"
        />
      </div>
      <form class="footer-form" @submit.prevent.stop="sendMessage">
        <input
          class="msg-input"
          type="text"
          name="message"
          autofocus
          :disabled="isCompleted"
        />
        <button class="send-btn" type="submit" :disabled="isCompleted">
          Send
        </button>
      </form>
    </footer>
  </section>
  <button v-else class="chat-collapsed" @click="expandChat">Chat</button>
</template>

<script>
import RateWidget from "./widgets/RateWidget";
import DateWidget from "./widgets/DateWidget";
import MapWidget from "./widgets/MapWidget";
import CompleteWidget from "./widgets/CompleteWidget";
import { format } from "date-fns";

export default {
  name: "ChatPopup",
  components: { RateWidget, DateWidget, MapWidget, CompleteWidget },
  data: () => ({
    isExpanded: false,
    isCompleted: false,
    username: "",
    messages: [],
    command: {
      type: null,
      data: null
    }
  }),
  created() {
    this.username = localStorage.getItem("username") || "User";
    this.sockets.subscribe("message", data => this.onSocketMessage(data));
    this.sockets.subscribe("command", data => this.onSocketCommand(data));
  },
  beforeDestroy() {
    this.sockets.unsubscribe("message");
    this.sockets.unsubscribe("command");
  },
  computed: {
    format() {
      // Making date-fns "format" function accessible at <template> section
      return format;
    }
  },
  methods: {
    onSocketMessage(data) {
      this.messages.push({ ...data, datetime: +Date.now() });
      // Waiting for the received message being rendered
      this.$nextTick(() => this.scrollToBottom());
    },
    onSocketCommand(data) {
      this.command = data.command;
    },
    expandChat() {
      this.isExpanded = true;
    },
    collapseChat() {
      this.isExpanded = false;
    },
    clearCommand() {
      this.command.type = null;
      this.command.data = null;
    },
    reinitConversation() {
      this.messages = [];
      this.isCompleted = false;
    },
    sendMessage(event) {
      this.$socket.emit("message", {
        author: this.username,
        message: event.target.elements.message.value
      });
      this.messages.push({
        author: this.username,
        message: event.target.elements.message.value,
        datetime: +Date.now()
      });
      event.target.elements.message.value = "";
      this.scrollToBottom();
    },
    sendCommandRequest() {
      this.$socket.emit("command");
    },
    sendCommand(type, value) {
      this.$socket.emit("message", {
        author: this.username,
        message: value
      });
      this.messages.push({
        author: this.username,
        message: value,
        datetime: +Date.now()
      });
      if (type === "complete" && value === "Yes") {
        this.isCompleted = true;
      }
      this.clearCommand();
    },
    scrollToBottom() {
      this.$refs.scrollableEl &&
        this.$refs.scrollableEl.scrollTo &&
        this.$refs.scrollableEl.scrollTo(
          0,
          this.$refs.scrollableEl.scrollHeight
        );
    }
  }
};
</script>

<style lang="scss" scoped>
.chat-collapsed {
  border-radius: 50%;
  width: 100px;
  height: 100px;
  line-height: 100px;
  font-size: 21px;
  font-weight: bold;
  color: #fff;
  background-color: #0082c3;
  border: none;
  padding: 0;
  cursor: pointer;
}
.chat-popup {
  width: 400px;
  height: 540px;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 7px 40px 2px;
  display: flex;
  flex-direction: column;
  position: relative;
}
.chat-header {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  position: relative;
  border-bottom: 1px solid #ccc;
  padding: 10px;
  background-color: #0082c3;
  color: #fff;
}
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  width: 32px;
  height: 32px;
  line-height: 32px;
  padding: 0;
  font-size: 21px;
  color: #fff;
  background-color: transparent;
  cursor: pointer;
}
.title-name {
  margin: 0;
}
.reply-speed {
  display: block;
}
.chat-main {
  overflow-y: auto;
  padding: 10px;
  flex: 1 1 auto;
  scroll-behavior: smooth;
}
.message {
  margin-bottom: 20px;
  display: flex;
  .msg-wrapper {
    display: inline-flex;
    padding: 6px 10px;
    background-color: #f1f0f0;
    border-radius: 20px;
  }
  .msg-author {
    font-weight: bold;
    margin-right: 10px;
    white-space: nowrap;
  }
  .msg-text {
    text-align: left;
  }
  .msg-time {
    padding: 6px;
  }
  &.mine {
    justify-content: flex-end;
    .msg-wrapper {
      background-color: #3578e5;
      color: #fff;
    }
  }
}
.chat-footer {
  border-top: 1px solid #ccc;
  padding: 10px;
  &.completed {
    opacity: 0.5;
  }
}
.footer-form {
  display: flex;
}
.msg-input {
  margin-right: 10px;
  flex: 1 0 auto;
  height: 42px;
  padding: 0 10px;
  font-size: 21px;
}
.send-btn {
  background-image: linear-gradient(to bottom, #3093c7, #1c5a85);
  border: none;
  padding: 10px;
  color: #fff;
  font-size: 21px;
  cursor: pointer;
  &:disabled {
    background: #ccc;
    cursor: auto;
  }
}
.notification-btn {
  background-image: linear-gradient(to bottom, #3093c7, #1c5a85);
  border: none;
  padding: 10px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  border-radius: 16px;
  margin-top: 10px;
}
/deep/ .command-btn {
  margin: 0 10px 10px;
  background-image: linear-gradient(to bottom, #3093c7, #1c5a85);
  border: none;
  padding: 10px;
  color: #fff;
  border-radius: 22px;
  font-size: 21px;
  cursor: pointer;
  min-width: 44px;
  &:disabled {
    background: #ccc;
    cursor: auto;
  }
}
</style>
