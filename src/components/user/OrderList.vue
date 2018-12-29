<template>
  <div class="orderlist">
    <div
      class="laybel"
      @click="goBack"
    >
      <div class="item-top">
        <div class="left">
          <span>订单号{{orderNo}}</span>
          <van-icon name="arrow"></van-icon>
        </div>
        <div class="right">交易成功</div>
      </div>
      <div class="item-content">
        <div class="cover">
          <van-card
            :num="couponePrice"
            :price="couponeCut"
            desc="订单优惠减"
            title="商品优惠减"
            thumb="/static/20181113150125_01.png"
          />
        </div>

        <div class="cell">
          <div class="cell-left">
            运费险 <span>确认收货前退货可理赔</span>
          </div>
          <div class="cell-right">
            有效
          </div>
        </div>
        <div class="cell">
          共{{goodsCount}}件商品 合计： ￥<span>{{actualPrice}}</span>
        </div>
      </div>
      <div class="item-bottom">
        <span>更多</span>
        <van-button> 查看物流</van-button>
        <van-button>卖了换钱</van-button>
        <van-button class="evaluate">评价</van-button>

      </div>
    </div>
  </div>

</template>

<script>
export default {
  data: () => ({
    couponePrice: 0.0,
    couponeCut: 0.0,
    goodsCount: 0,
    actualPrice: 0.0,
    orderNo: "00000000000"
  }),
  created() {
    this.getCouponPrice();
    this.getOrderPrice();
    this.getGC();
    this.getAP();
    // this.goodsCount = localStorage.getItem('cartList') ? JSON.parse(localStorage.getItem('cartList')).length : localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).cartList.length : 0
    // this.actualPrice = localStorage.getItem('actualPrice') ? localStorage.getItem('actualPrice') : JSON.parse( localStorage.getItem('user')) ? JSON.parse( localStorage.getItem('user')).actualPrice : 0.00

    this.getOrderNo();
  },
  methods: {
    getGC() {
      let cl = localStorage.getItem("cartList");
      let u = JSON.parse(localStorage.getItem("user"));
      if (cl) {
        this.goodsCount = JSON.parse(localStorage.getItem("cartList")).length;
      } else if (u.length) {
        u.forEach(item => {
          if (item.isLogin.toString() === this.$store.state.isLogin) {
            this.goodsCount = item.cartList.length;
          }
        });
      } else {
        this.goodsCount = 0;
      }
    },
    getAP() {
      let al = localStorage.getItem("actualPrice");
      let u = JSON.parse(localStorage.getItem("user"));
      if (al) {
        this.actualPrice = localStorage.getItem("actualPrice");
      } else if (u.length) {
        u.forEach(item => {
          if (item.isLogin.toString() === this.$store.state.isLogin) {
            this.actualPrice = item.actualPrice;
          }
        });
      } else {
        this.actualPrice = 0.0;
      }
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
    goBack() {
      location.href = "#/personal/myorder";
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
              this.orderNo = this.orderNo;
            }
          });
        }
      }
    }
  }
};
</script>

<style scoped>
.orderlist {
  overflow: hidden;
  background-color: #e8e8e8;
}
.laybel {
  margin: 20px auto;
  padding: 10px;
  width: 88%;
  /* height: 150px; */
  border-radius: 12px;
  background-color: #fff;
  font-size: 14px;
}
.laybel .item-top {
  overflow: hidden;
  width: 100%;
  height: 36px;
}
.laybel .item-top .left {
  float: left;
  height: 24px;
  line-height: 24px;
  vertical-align: bottom;
}
.laybel .item-top .left span {
  margin-right: 10px;
}
.laybel .item-top .left .van-icon {
  vertical-align: middle;
  font-size: 12px;
  color: #999;
}
.laybel .item-top .right {
  /* margin-right: 10px; */
  height: 24px;
  line-height: 24px;
  float: right;
  color: red;
}

.item-content .cover {
  overflow: hidden;
}
.item-content .van-card {
  float: right;
  width: 108%;
  background-color: #fff;
  padding-right: 0;
}
.item-content .van-card .van-card__thumb {
  left: 0px;
}

.cell {
  overflow: hidden;
  padding: 6px 0;
  text-align: right;
  font-size: 12px;
}
.cell .cell-left {
  width: 70%;
  float: left;
}
.cell .cell-right {
  width: 30%;
  float: right;
}
.item-bottom {
  font-size: 12px;
  margin-top: 6px;
  display: flex;
  justify-content: space-between;
}
.item-bottom .van-button {
  height: 30px;
  line-height: 24px;
  padding: 0 20px;
  border-radius: 50px;
  font-size: 12px;
}
.item-bottom span {
  padding-right: 20px;
  height: 30px;
  line-height: 30px;
}
.item-bottom .evaluate {
  background-color: #ffc1072e;
}
</style>


