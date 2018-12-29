<template>
  <div class="register">
    <h3>快速注册</h3>
    <form class="userInfo">
      <label>
        手机 号：
        <input
          type="phone"
          placeholder="请输入手机号码"
          v-model="phone"
        ><br>
      </label>
      <label>
        用户名称：
        <input
          type="text"
          placeholder="请输入用户名"
          v-model="userName"
        ><br>
      </label>
      <label>
        设置密码：
        <input
          type="password"
          placeholder="请输入密码"
          v-model="passWord"
        ><br>
      </label>
      <label>
        确认密码：
        <input
          type="password"
          placeholder="请重新输入"
          v-model="pwd"
        ><br>
      </label>
      <label>
        会员等级：
        <select
          class="userLevel"
          type="text"
          @change="selectedValue"
          v-model="value"
        >
          <option value="1">普通会员</option>
          <option value="2">白金会员</option>
          <option value="3">黄金会员</option>
        </select><br>
      </label>
      <button @click.prevent="regiSuc">注册</button>
    </form>
  </div>
</template>

<script>
import { Dialog } from "vant";
import { Toast } from "vant";

export default {
  data: () => ({
    phone: "",
    userName: "",
    passWord: "",
    pwd: "",
    value: 1,
    id: 0
  }),
  methods: {
    // 生成随机数
    genID(length) {
      return Number(Math.random().toString() + Date.now())
        .toString()
        .substr(3, length);
    },

    selectedValue() {
      console.log(this.value);
    },
    regiSuc() {
      if (!/^1\d{10}$/.test(this.phone)) {
        Dialog.alert({
          message: "你输入的电话号码有误，请重新输入"
        });
      } else if (!this.trim(this.userName)) {
        Dialog.alert({
          message: "请输入用户名"
        });
      } else if (!this.trim(this.passWord)) {
        Dialog.alert({
          message: "请设置密码"
        });
      } else if (this.passWord !== this.pwd) {
        Dialog.alert({
          message: "你输入的密码不一致，请重新输入"
        });
      } else {
        let id = this.genID(5)
        let lgfo = JSON.parse(localStorage.getItem("MemberBo"));
        console.log(lgfo);
        let uersInfo = null;
        if (!lgfo) {
          uersInfo = {
            userId: (1+id),
            userCode: `LK-User${1+id}`,
            phoneNumber: this.phone,
            userName: this.userName,
            passWord: this.passWord,
            level: this.value - 0,
            expValue: parseInt(Math.random() * 1000000000),
            age: parseInt(Math.random() * 6),
            gender: parseInt(Math.random() * 20) > 10 ? 0 : 1
          };
          lgfo = [];
          lgfo.push(uersInfo);
          let arrString = JSON.stringify(lgfo);
          localStorage.setItem("MemberBo", arrString);
        } else if (lgfo) {
          // let id = lgfo.length + 1;

          uersInfo = {
            userId: (1+id),
            userCode: `LK-User${1+id}`, // null,
            phoneNumber: this.phone,
            userName: this.userName,
            passWord: this.passWord,
            level: this.value - 0, // parseInt(Math.random()*10),
            expValue: parseInt(Math.random() * 1000000000),
            age: parseInt(Math.random() * 6),
            gender: parseInt(Math.random() * 20) > 10 ? 0 : 1
          };
          lgfo.push(uersInfo);
          let arrString = JSON.stringify(lgfo);
          localStorage.setItem("MemberBo", arrString);
        }

        let data = {
          couponReceiveReqDto: {
            couponId: 27,
            activityId: 39,
            userId: uersInfo.userId,
            requestQuantity: 100,
            sceneDesc: "新用户注册",
            orderDto: {},
            orderItemDto: {}
          },
          memberDto: {
            userId: uersInfo.userId,
            userCode: uersInfo.userCode,
            userName: this.userName,
            level: this.value,
            age: uersInfo.age,
            gender: uersInfo.gender
          }
        };
        console.log(data);

        let flg = true;
        let flg1 = false;
        const toast = Toast.loading({
          duration: 0,
          forbidClick: true,
          mask: false,
          message: "加载中..."
        });

        // 调用领取接口
        this.$axios({
          method: "post",
          url: "/couponReceive/produceCoupon",
          data: data
        }).then(res => {
          console.log(res);
          let { data } = res;
          if (data.data !== null) {
            flg = false;
          } else if (data.success === false) {
            flg1 = true;
          }
        });

        const timer = setInterval(() => {
          if (flg) {
            toast.message = "加载中...";
          } else if (flg1) {
            clearInterval(timer);
            Toast.clear();
            Dialog.alert({
              title: "系统异常",
              message: "请重新"
            });
          } else {
            clearInterval(timer);
            Toast.clear();
            Dialog.alert({
              title: "注册成功",
              message: "已领取了100会员积分"
            }).then(() => {
              location.href = "#/personal/login";
            });
          }
        }, 10);
      }
    },
    trim(str) {
      return str.replace(/(^\s*)|(\s*$)/g, "");
    }
  }
};
</script>

<style scoped>
.register {
  margin-top: 46px;
}
h3 {
  text-align: center;
  color: #666;
}
.userInfo {
  margin: 30px auto;
  width: 80%;
}
.userInfo input {
  margin: 5px 0;
}
.userInfo input {
  border: none;
  border-bottom: 1px solid #ccc;
}
.userInfo .btn {
  border: none;
  margin-left: 24px;
  color: #888;
}
.userInfo button {
  display: block;
  margin: 50px auto;
  color: #fff;
  border: none;
  border-radius: 50px;
  width: 60%;
  height: 30px;
  background-color: rgb(168, 9, 9);
}
.userLevel {
  border: none;
  margin-left: 24px;
  color: #888;
  width: 120px;
  height: 30px;
  line-height: 30px;
  font-size: 16px;
}
.userLevel option {
  /* height: 30px;
  line-height: 30px; */
  font-size: 12px;
  width: 100%;
}
</style>

