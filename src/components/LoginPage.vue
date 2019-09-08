<template>
  <div class="login">
    <h1 class="title">Login page</h1>
    <p class="description">Please enter your username and password</p>
    <form @submit="handleSubmit">
      <label class="input-label" for="username">Username</label>
      <div>
        <input
          class="login-input"
          id="username"
          type="text"
          v-model="username"
          required
          autofocus
        />
      </div>
      <div>
        <label class="input-label" for="password">Password</label>
        <div>
          <input
            class="login-input"
            id="password"
            type="password"
            v-model="password"
            required
          />
        </div>
      </div>
      <div>
        <button type="submit" class="login-btn">
          Login
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { login } from "@/api/auth";

export default {
  name: "LoginPage",
  data: () => ({
    username: "",
    password: ""
  }),
  methods: {
    async handleSubmit() {
      if (this.password.length > 0) {
        try {
          const loginData = await login({
            username: this.username,
            password: this.password
          });
          localStorage.setItem("token", loginData.token);
          localStorage.setItem("username", loginData.username);
          this.$router.push({ name: "chatPage" });
        } catch (error) {
          console.error(error);
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.title {
  margin: 40px 0 10px;
}
.description {
  margin-bottom: 40px;
}
.input-label {
  margin-bottom: 10px;
}
.login-input {
  height: 42px;
  padding: 0 10px;
  font-size: 21px;
  margin-bottom: 30px;
}
.login-btn {
  background-color: transparent;
  border: 1px solid #000;
  padding: 10px;
  font-size: 34px;
  cursor: pointer;
}
</style>
