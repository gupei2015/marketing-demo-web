<template>
  <div class="my-list" @click.self="hidden" >
    <div class="cover">
    <!-- <div @click="detail1">我的优惠券</div> -->
    <!-- <div @click="detail">个人中心</div> -->
    <div @click="unLogin">
     <span v-if="userState">退出</span>
     <span v-else >登录</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant';
export default {
  data:()=>({

  }),
  methods: {
    detail() {
      Toast.loading({
        mask: true,
        message: "加载中..."
      })
    },
    detail1() {
      location.href = '#/personal/coupone'
    },
    unLogin(){
      localStorage.setItem('isLogin', false)
      location.href = '#/personal/login'

    },
    hidden(){
      //  console.log(this.$store.state.flag)
      this.$store.state.flag = !this.$store.state.flag
    },
    userState(){
      let isLogin =  localStorage.getItem('isLogin')
      return isLogin
    }
  }
  
}
</script>

<style scoped>
.my-list {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
  z-index: 10000;
  
}
.my-list .cover {
  position: absolute;
  top: 20px;
  right: 30px;
  width: 60px;
  height: 28px;
  background-color: #fff;
  
}
.my-list .cover div:hover {
  background-color: yellow;
  color: rgb(243, 85, 85)
}

</style>


