<template>
  <div class="login">
    <form action="">
      <div class="userImg">
        <img
          src="#"
          alt=""
        >
        个人头像
      </div>
      <label>
        账号：
        <input
          type="text"
          placeholder="请输入账号"
          v-model="user"
        >
      </label><br>
      <label>
        密码：
        <input
          class="pwd"
          type="password"
          placeholder="请输入密码"
          v-model="password"
        >
      </label>
      <input
        class="btn"
        type="button"
        value="登录"
        @click="login"
      ><br>
      <a
        href="javascript:;"
        @click="register"
      > 立即注册 </a>

    </form>
  </div>
</template>

<script>
import { Dialog } from "vant";
export default {
  data: () => ({
    user: "",
    password: ""
  }),
  methods: {
    login() {
      let isLogin = JSON.parse(localStorage.getItem("isLogin"));
      if (isLogin) {
        location.href = "#/personal";
        return;
      } else if (!this.user) {
        Dialog.alert({
          message: "请输入用户名"
        });
        return;
      } else if (!this.password) {
        Dialog.alert({
          message: "请输入密码"
        });
        return;
      } else if (this.trim(this.user) && this.trim(this.password)) {
        let arr = JSON.parse(localStorage.getItem("MemberBo"));
        console.log(arr);
        for (var i in arr) {
          if (
            this.user === arr[i].userName &&
            this.password === arr[i].passWord
          ) {
            // 保存登录状态
            let userId = arr[i].userId.toString();
            localStorage.setItem("isLogin", userId);
            location.href = "#/personal";
            this.$store.state.userCode = arr[i].userCode.substr(3);
            this.$store.state.userName = this.user;
            return;
          }
        }
        Dialog.alert({
          message: "你输入的账号或密码有误，请重新输入！"
        });
      }
    },
    register() {
      location.href = "#/personal/register";
    },
    trim(str) {
      return str.replace(/(^\s*)|(\s*$)/g, "");
    }
  }
};
</script>

<style scoped>
.login {
  margin-top: 46px;
  text-align: center;
  vertical-align: middle;
  font-size: 18px;
}
.login input {
  margin: 5px 0;
  padding: 2px 0 0 0;
  width: 70%;
  height: 40px;
  border: none;
  border-bottom: 2px solid #ccc;
  vertical-align: baseline;
}
.userImg {
  margin: 20px auto;
  padding: 2rem 0;
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  background-color: rgb(50, 198, 224);
  text-align: center;
  box-sizing: border-box;
  color: #ddd;
}
.login .btn {
  margin-top: 30px;
  background-color: rgb(168, 9, 9);
  color: #fff;
  border-radius: 25px;
}
.login a {
  font-size: 14px;
  color: rgb(4, 159, 248);
}
</style>

