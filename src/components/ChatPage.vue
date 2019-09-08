<template>
  <div class="page">
    <h1 class="title">Home page</h1>
    <div>
      Welcome, {{ username }}
      <button class="logout-btn" @click="logOut">(Log out)</button>
    </div>
    <ChatPopup class="chat-window" />
  </div>
</template>

<script>
import ChatPopup from "./ChatPopup";

export default {
  name: "ChatPage",
  components: { ChatPopup },
  data: () => ({
    username: ""
  }),
  created() {
    this.username = localStorage.getItem("username") || "User";
  },
  methods: {
    logOut() {
      localStorage.removeItem("username");
      localStorage.removeItem("token");
      this.$router.push({ name: "loginPage" });
    }
  }
};
</script>

<style lang="scss" scoped>
.title {
  margin: 0 auto 20px;
}
.chat-window {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
.logout-btn {
  border: none;
  background-color: transparent;
  padding: 0;
  color: #0082c3;
  text-decoration: underline;
  cursor: pointer;
}
</style>
