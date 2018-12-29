<template>
  <div class="myOrder">
    <van-cell
      class="header"
      :title="`订单详情:${orderNo}`"
    />
    <van-contact-card
      type="edit"
      name="张三"
      tel="13000000000"
      :editable="false"
    />

    <!-- 购买商品的详细信息 -->
    <div class="content">
      <div
        class="brand"
        v-for="(item, index) in totalData.cartList"
        :key="index"
      >
        <div class="goodsInfo">
          <h4>{{ item.shopName }}</h4>
          <van-card
            v-for="(item1, index1) in item.productList"
            :key="index1"
            :num="item1.purchaseQuantity"
            :price="item1.actualPrice"
            :title="item1.productName"
            :thumb="item1.imgUrl"
            :origin-price="item1.originPrice"
          >
            <div
              class="desc"
              slot="desc"
            >
              <p>{{ item1.productTitle }}</p>
            </div>
          </van-card>
        </div>
      </div>

      <!-- 订单信息 -->
      <van-cell-group class="orderCut">
        <van-cell
          class="tip"
          title="商品总价"
          :value="`￥${totalPrice}`"
          :border="false"
        />
        <van-cell
          class="tip"
          title="运费"
          value="￥0.00"
          :border="false"
        />
        <van-cell
          title="订单总价"
          :value="`￥${totalOrderPrice}`"
          :border="false"
        />
      </van-cell-group>
      <van-cell-group class="orderCoupone">
        <van-cell
          value="支付明细"
          :border="false"
        />
        <van-cell
          title="订单优惠券抵扣"
          :value="`-￥${couponePrice}`"
          :border="false"
        />
        <van-cell
          title="商品优惠券减扣"
          :value="`-￥${couponeCut}`"
          :border="false"
        />
        <van-cell
          title="实付款"
          :border="false"
        >
          <slot>
            <span> ￥{{actualPrice}}</span>
          </slot>
        </van-cell>
      </van-cell-group>

      <!-- <van-button type="primary" size="small" @click="toPersonal" >返回</van-button> -->

    </div>
  </div>
</template>
<script>
export default {
  data: () => ({
    couponePrice: 0.0,
    couponeCut: 0.0,
    orderNo: "000000000",
    flag: false
  }),
  created() {
    this.getCouponPrice();
    this.getOrderPrice();
    // this.couponePrice = localStorage.getItem('orderCouponAmount') >= 0 ? (localStorage.getItem('orderCouponAmount')-0).toFixed(2) : (JSON.parse(localStorage.getItem('user')).orderCouponAmount -0).toFixed(2)
    // this.couponeCut = localStorage.getItem('couponeCut') >= 0 ? (localStorage.getItem('couponeCut')-0).toFixed(2) : (JSON.parse(localStorage.getItem('user')).couponeCut - 0).toFixed(2)
    this.getOrderNo();
    this.toFlag();
  },
  computed: {
    // 获取用户订单数据
    totalData() {
      let ttD = localStorage.getItem("user1");
      // console.log(ttD)
      let u = JSON.parse(localStorage.getItem("user"));
      // console.log(u)
      if (ttD) {
        return JSON.parse(localStorage.getItem("user1"));
      } else if (u.length) {
        let td = null;
        u.forEach(item => {
          if (item.isLogin.toString() === this.$store.state.isLogin) {
            let user1 = JSON.parse(JSON.stringify(item.user1));
            // console.log(user1)
            td = user1;
            // return user1
          }
        });
        return td;
      } else {
        return {};
      }
    },
    // 获取商品总价
    totalPrice() {
      let oDt = localStorage.getItem("OrderDto");
      let u = localStorage.getItem("user");

      if (oDt) {
        let tPrice = JSON.parse(localStorage.getItem("OrderDto"))
          .originOrderAmount;
        return (tPrice - 0).toFixed(2);
      } else if (u) {
        let user = JSON.parse(localStorage.getItem("user"));
        let tPrice = 0.0;
        user.forEach(item => {
          if (item.isLogin.toString() === this.$store.state.isLogin) {
            tPrice = item.OrderDto.originOrderAmount;
          }
        });
        return (tPrice - 0).toFixed(2);
      } else {
        let tPrice = 0.0;
        return (tPrice - 0).toFixed(2);
      }
      // let tPrice = localStorage.getItem("OrderDto") ? JSON.parse(localStorage.getItem("OrderDto")).totalOrderAmount : localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).OrderDto.totalOrderAmount : 0.00
    },
    // 计算订单总结
    totalOrderPrice() {
      let oDt = localStorage.getItem("OrderDto");
      let u = JSON.parse(localStorage.getItem("user"));
      // let tPrice = 0.00
      if (oDt) {
        let tPrice = JSON.parse(localStorage.getItem("OrderDto"))
          .originOrderAmount;
        return (tPrice - 0).toFixed(2);
      } else if (u) {
        let tPrice = 0.0;
        u.forEach(item => {
          if (item.isLogin.toString() === this.$store.state.isLogin) {
            tPrice = item.OrderDto.originOrderAmount;
          }
        });
        return (tPrice - 0).toFixed(2);
      } else {
        let tPrice = 0.0;
        return (tPrice - 0).toFixed(2);
      }
    },

    // 优惠券抵扣
    actualPrice() {
      let actualP = (
        this.totalPrice -
        this.couponePrice -
        this.couponeCut
      ).toFixed(2);
      localStorage.setItem("actualPrice", actualP);
      return actualP;
    }
  },

  methods: {
    toFlag() {
      if (this.orderNo !== "00000000000") {
        this.$store.state.orderFlag = true;
      }
      // console.log(this.$store.state.orderFlag);
    },

    getOrderPrice() {
      let op = localStorage.getItem("orderCouponAmount");
      let fl = this.$store.state.getPriceCut;
      if (op) {
        this.couponePrice = (op - 0).toFixed(2);
      } else if (fl) {
        let u = JSON.parse(localStorage.getItem("user"));

        u.forEach(item => {
          if (item.isLogin.toString() === this.$store.state.isLogin) {
            this.couponePrice = (item.orderCouponAmount - 0).toFixed(2);
          }
        });
      } else {
        this.couponePrice = 0.0;
      }
    },
    getCouponPrice() {
      let op = localStorage.getItem("couponeCut");
      let fg = this.$store.state.getPriceCut;
      if (op) {
        this.couponeCut = (op - 0).toFixed(2);
      } else if (fg) {
        let u = JSON.parse(localStorage.getItem("user"));

        u.forEach(item => {
          if (item.isLogin.toString() === this.$store.state.isLogin) {
            this.couponeCut = (item.couponeCut - 0).toFixed(2);
          }
        });
      } else {
        this.couponeCut = 0.0;
      }
    },
    getOrderNo() {
      let orderObjFlag = localStorage.getItem("OrderDto");
      if (orderObjFlag) {
        this.orderNo = JSON.parse(localStorage.getItem("OrderDto")).orderNo;
      } else {
        let user = JSON.parse(localStorage.getItem("user"));
        if (user.length) {
          user.forEach(item => {
            if (item.isLogin.toString() === this.$store.state.isLogin) {
              this.orderNo = item.OrderDto.orderNo;
            } else {
              this.orderNo = "000000000";
            }
          });
        }
      }
    }
  }
};
</script>
<style scoped>
.myOrder {
  margin-top: 92px;
  margin-bottom: 100px;
}
.header {
  position: fixed;
  top: 46px;
  left: 0;
  font-size: 16px;
  font-weight: 500;
  z-index: 9999;
}
.van-contact-card {
  margin-bottom: 30px;
}
.content .desc p {
  margin-block-start: 0.5em;
}
.content h4 {
  padding-left: 15px;
  font-weight: 400;
}
.van-card {
  background-color: #e0e0e0;
}
.content .van-cell-group .right {
  text-align: right;
}
.content .van-cell-group .right ins,
.content .van-cell-group .right span {
  color: red;
  text-decoration: none;
}

.orderCut .van-cell,
.orderCoupone .van-cell {
  padding: 3px;
  height: 25px;
}
.orderCut .tip {
  color: #999;
}
.orderCoupone .van-cell span {
  color: red;
}
/* 返回按钮 */
.van-button {
  float: right;
  border-radius: 10px;
}
</style>


