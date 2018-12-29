<template>
  <div class="app">

    <!-- 头部标题栏navbar -->
    <van-nav-bar title="优惠商城" left-arrow fixed @click-left="onClickLeft" @click-right="onClickRight">
      <van-icon name="wap-nav" slot="right" />
    </van-nav-bar>
    <mylist :class="{active: true}" v-show="this.$store.state.flag">
    </mylist>

    <!-- 底部Tab栏切换 -->
    <van-tabbar v-model="active">
      <!-- <van-tabbar-item info="3">
        <span>主会场</span>
        <img slot="icon" slot-scope="props" :src="props.active ? icon.active : icon.normal">
      </van-tabbar-item> -->
      <van-tabbar-item icon="wap-home" to="/main">主会场</van-tabbar-item>
      <!-- <van-tabbar-item icon="shop" to="/shop">全部会场</van-tabbar-item> -->
      <van-tabbar-item icon="pending-orders" to="/goods">领券栏</van-tabbar-item>
      <van-tabbar-item icon="cart" to="/cart">购物车</van-tabbar-item>
      <van-tabbar-item icon="contact" :to="userId ? '/personal':'/personal/login'" >个人中心</van-tabbar-item>
    </van-tabbar>

    <!-- <transition enter-active-class="animated slideInRight" leave-active-class="animated slideOutLeft" mode="out-in"> -->
    <transition name="show">
      <router-view />
    </transition>
  </div>
</template>

<script>
import Mylist from "./components/Popover/Mylist";

export default {
  data() {
    return {
      active: 0,
      icon: {
        normal: "//img.yzcdn.cn/icon-normal.png",
        active: "//img.yzcdn.cn/icon-active.png"
      },
      URL: "",
      userId: false
    };
  },
  created(){
    this.userId = JSON.parse(localStorage.getItem("isLogin")) || 0
  },
  updated(){
    this.userId = JSON.parse(localStorage.getItem("isLogin")) || 0
  },
  methods: {
    get(e){
      console.log(e.target)
    },
    onClickLeft() {
      this.$router.go(-1);
    },
    // 点击弹出我的个人详情
    onClickRight() {
      this.$store.state.flag = !this.$store.state.flag;
    },

    // 缓存最终订单对象数据 清除多余数据
    toPersonal(){

      let user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem("user")) : []
      let user1 = JSON.parse(localStorage.getItem("user1"))
      let totalPrice = JSON.parse(localStorage.getItem("totalPrice"))
      let isLogin = JSON.parse(localStorage.getItem("isLogin"))
      let orderCouponAmount = JSON.parse(localStorage.getItem("orderCouponAmount"))
      let couponeCut = JSON.parse(localStorage.getItem("couponeCut"))
      let ProductDto = JSON.parse(localStorage.getItem("ProductDto"))
      let OrderDto = JSON.parse(localStorage.getItem("OrderDto"))
      let MemberBo = JSON.parse(localStorage.getItem("MemberBo"))
      let cartList = JSON.parse(localStorage.getItem("cartList"))
      let actualPrice = JSON.parse(localStorage.getItem("actualPrice"))
      let userAll = {
        user1,
        totalPrice,
        isLogin,
        orderCouponAmount,
        couponeCut,
        OrderDto,
        cartList,
        actualPrice
      } 
        let uflag = true
      if(user.length){
        user.forEach(item => {
          if(item.isLogin.toString() === isLogin) {
            item = userAll
            uflag = false
          }
        })
      }

      if(uflag){

        user.push(userAll)
      }
      let p = userAll.cartList 
      if(p) {
        localStorage.setItem('user', JSON.stringify(user))
      }
      location.href = '#/personal'
      localStorage.removeItem('couponeCut')
      localStorage.removeItem('totalPrice')
      localStorage.removeItem('cartList')
      localStorage.removeItem('user1')
      localStorage.removeItem('orderCouponAmount')
      localStorage.removeItem('orderCouponAmount')
      localStorage.removeItem('OrderDto')
      localStorage.removeItem('SelectCouponUseBoList')
      localStorage.removeItem('actualPrice')
      localStorage.removeItem('goodsCutList')
      localStorage.removeItem('orderDataObj')
      localStorage.removeItem('userOrderDto')
      localStorage.removeItem('totalPriceList')

      sessionStorage.removeItem('couponReducedAmount')
      sessionStorage.removeItem('dynamicList')
      sessionStorage.removeItem('orderDynamicList')
      sessionStorage.removeItem('queryItemMatchedCouponReqDto')

    }
  },
  components: {
    Mylist
  },
  computed: {
    // userId() {
    //   return JSON.parse(localStorage.getItem("isLogin")) || false 
    // }
  },
  watch: {
    $route(to, from) {
      let rt = to.path.split("/");
      let page = rt[1];
      switch (page) {
        case "main":
          this.active = 0;
          break;
        // case "shop":
        //   this.active = 1;
        //   break;
        case "goods":
          this.active = 1;
          break;
        case "cart":
          this.active = 2;
          break;
        case "personal":
          this.active = 3;
          break;
        default:
          return;
      }
      // 设置固定页面跳转 获取缓存user中的状态数据
      let leave = from.path
      if(leave === "/personal/myorder") {
        this.toPersonal()
      }
      // 设置固定页面跳转false状态 以便获取不同优惠价缓存
      if(to.path === "/personal/myorder" && leave === "/personal/accountant" ) {
        this.$store.state.getPriceCut = false
      } else {
        this.$store.state.getPriceCut = true
      }
     
      let first = leave.split("/")[1]
      // 用户点击立即购买直接跳转结算页面 状态参数为true
      if( first === 'goodsInfo' && to.path === '/personal/accountant' ) {
        // this.$store.state.rend = true
        this.$store.state.now = true
        // console.log(this.$store.state.now)
      } else {
        this.$store.state.now = false
      }
      // 购物车跳转到结算页面的渲染
      // console.log(from.path)
      if( (leave === "/cart" || first === 'goodsInfo') && to.path === "/personal/accountant" ) {
        this.$store.state.rend = true
      } else {
        this.$store.state.rend = false
      }
      if( from.path === "/personal/accountant" && to.path === "/cart") {
        localStorage.removeItem("OrderDto")
        localStorage.removeItem("userOrderDto")
        localStorage.removeItem("orderDataObj")
      }
      if( from.path === "/personal/accountant" && to.path === "/personal/myorder") {
        this.$store.state.isLogin = localStorage.getItem('isLogin')
      }
      // console.log(from.path)
      // console.log(to.path)
    }
  }
};
</script>

<style >
/* 头部标题栏 */
.van-nav-bar {
  color: #fff;
  background-color: rgb(168, 9, 9);
  z-index: 9999 !important;
}
/* 底部tab切换栏 */
.van-tabbar {
  background-color: rgb(241, 228, 200);
  z-index: 9999;
}
/* 页面切换动画 */
.app {
  /* 横向自动宽度 */
  /* 隐藏动画的时候出现滚动条 */
  position: relative;
  overflow-x: hidden;
}
.show-enter {
  opacity: 0;
  transform: translateX(100%);
}
.show-leave-to {
  transform: translateX(-100%);
  position: absolute;
}
.show-leave-active {
   position: absolute;
}
.show-enter-active,
.show-leave-active {
  transition: all 0.5s ease;

}
</style>
