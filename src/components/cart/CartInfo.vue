<template>

  <div class="cartInfo">
    <div
      class="shop1"
      v-if="show"
      v-for=" (item, index) in user()"
      :key="index"
    >
      <h3 v-cloak>{{item.shopName }}</h3>
      <div
        v-for="(item1, index1) in item.productList "
        :key="index1"
      >
        <van-card
          :num="item1.purchaseQuantity"
          tag="优惠券"
          :price="item1.actualPrice"
          :title="item1.productName"
          :origin-price="item1.originPrice"
        >
          <img
            slot="thumb"
            :src="item1.imgUrl"
            alt=""
          />
          <div
            slot="desc"
            v-cloak
          >
            {{item1.productTitle}}
          </div>
          <div
            class="cBtn"
            slot="footer"
          >
            <van-button
              size="small"
              @click.stop="getGoodsCoupone(item.shopId, item1.skuId, item1.skuCategoryName)"
            >使用优惠券</van-button>
          </div>
        </van-card>
      </div>
    </div>

    <div
      class="bottom"
      v-show="user().length"
    >
      <button
        class="cancelBtn"
        @click="cancelCart"
      >删除购物车</button>

      <van-submit-bar
        :price="totalPrice*100"
        button-text="提交订单"
        @submit="onSubmit"
      />
    </div>
  </div>

</template>
<script>
import { Toast } from "vant";
export default {
  data: () => ({
    show: true,
    checked0: false,
    user1: null,
    tprice: 0.0,
    cutList: [],
    couponeCut: 0.0,
    totalPriceList: []
  }),
  created() {
    this.user1 = JSON.parse(localStorage.getItem("user1")) || null;
    this.tPriceList();
    this.totalNum();
    // console.log(this.tprice);
    // console.log(this.couponeCut)
    // console.log(this.totalPrice)
  },
  methods: {
    // 判断是否有商品添加了购物车
    user() {
      if (!this.user1) {
        return [];
      } else {
        return this.user1.cartList;
      }
    },
    // 计算购物总商品价格
    totalNum() {
      // this.couponeCut = JSON.parse(localStorage.getItem("couponeCut")) || 0;
      if (!this.user1) {
        Toast({
          duration: 800,
          message: "你没有添加任何商品"
        });
        return;
      } else {
        let { userId, cartList } = this.user1;
        let count = [];
        count.length = cartList.length;

        for (var i = 0; i < cartList.length; i++) {
          let { productList: arr } = cartList[i];
          count[i] = arr.reduce((t, i) => {
            return t + i.actualPrice * i.purchaseQuantity;
          }, 0);
        }
        this.tprice = count.reduce((t0, i0) => {
          return t0 + i0;
        });
        this.$store.state.allVD = count;

        this.tprice = this.tprice.toFixed(2) - 0;
      }

      // 获取商品对应优惠券减的数据
      this.cutList = JSON.parse(localStorage.getItem("goodsCutList")) || [];
      let _obj = {};
      _obj.skuId = this.$route.query.skuId;
      _obj.goodsCut = this.$route.query.couponReducedAmount;

      if (_obj.skuId) {
        if (this.cutList.length === 0) {
          this.cutList.push(_obj);
        } else if (this.cutList.length > 0) {
          let fg = true;
          this.cutList.forEach(item => {
            if (item.skuId == _obj.skuId) {
              item.goodsCut = _obj.goodsCut;
              fg = false;
            }
          });
          if (fg) {
            this.cutList.push(_obj);
          }
        }
      }
      var sum = 0;
      if (this.cutList.length > 0) {
        this.cutList.forEach(item => {
          if (item.skuId) {
            sum += parseFloat(item.goodsCut)
          }
        });
      }
      this.couponeCut = sum.toFixed(2)
      // console.log(sum)

      localStorage.setItem("couponeCut", this.couponeCut);
      localStorage.setItem("goodsCutList", JSON.stringify(this.cutList))

      // this.user1
      // 获取优惠券减扣金额
    },
    tPriceList() {
      let cartList = JSON.parse(localStorage.getItem("cartList"));
      // let totalPriceList = [];
      if(cartList) {
        cartList.forEach(item => {
          let obj = {};
          obj.skuId = item.skuId;
          obj.totalOrderAmount =
            item.actualPrice * item.purchaseQuantity.toFixed(2);
          this.totalPriceList.push(obj);
        })
      }
      // this.$store.state.container = this.totalPriceList
      // console.log(this.totalPriceList);
    },
    // 结算函数
    onSubmit() {

      // 获取中间虚拟数累加
      let totalPriceList = JSON.parse(localStorage.getItem("totalPriceList")) || this.totalPriceList
      console.log(totalPriceList)
      // let totalOrderAmount = totalPriceList.reduce((t, p) => {
      //   return t.totalOrderAmount + p.totalOrderAmount;
      // });
      let totalOrderAmount = 0
      if(totalPriceList.length > 0) {
        totalPriceList.forEach(item => {
          totalOrderAmount += item.totalOrderAmount
        })
      }

     totalOrderAmount = totalOrderAmount.toFixed(2)
      console.log(totalOrderAmount)
      // let calcVD = localStorage.getItem("calcVD")
      //   ? (localStorage.getItem("calcVD") - 0).toFixed(2)
      //   : 0;
      let OrderDto = {
        orderId: Math.random()
          .toString()
          .substr(3, 2),
        orderNo: parseInt(Math.random() * 10000) + new Date().valueOf() + "",
        totalOrderAmount: totalOrderAmount,
        originOrderAmount: this.tprice,
        payOrderAmount: this.totalPrice,
        orderDate: new Date(),
        revserveTime: new Date() + 7,
        orderItemList: [],
        useCoupons: []
      };
      localStorage.setItem("OrderDto", JSON.stringify(OrderDto));
      // localStorage.setItem("allTp", this.tprice)

      // 清空所有选择标识列表
      // this.$store.state.selectSKUId = [];
      // console.log(this.$store.state.selectSKUId);
      console.log(this.tprice);
      this.$router.push({
        path: "/personal/accountant",
        query: {
          totalMarks: JSON.stringify(this.user()),
          totalPrice: this.tprice
        }
      })

      this.$store.state.first = true
    },

    // 获取可使用优惠券
    getGoodsCoupone(shopId, skuId, category) {
      console.log(this.$store.state.first)
      // 缓存商品总价列表
      if(this.$store.state.first){
        localStorage.setItem("totalPriceList", JSON.stringify(this.totalPriceList))
      }
      // this.$store.state.container = this.totalPriceList


      let userid = this.user1.userId;
      let memberBo = JSON.parse(localStorage.getItem("MemberBo"));
      let cartList = JSON.parse(localStorage.getItem("cartList"));
      let memberDto = null;
      let goods = null;
      let shopName = "";
      // console.log(memberBo);
      // console.log(this.user1.userId);
      memberBo.forEach(item => {
        if (item.userId == userid) {
          memberDto = item;
        }
      });
      // console.log(memberDto.userId);
      cartList.forEach(item => {
        if (item.skuId == skuId) {
          goods = item;
        }
      });
      this.user1.cartList.forEach(item => {
        if (item.shopId == shopId) {
          shopName = item.shopName;
        }
      });
      // console.log(goods);
      let queryItemMatchedCouponReqDto = {
        memberDto: {
          userId: memberDto.userId,
          userName: memberDto.userName,
          userCode: memberDto.userCode,
          level: memberDto.level,
          age: memberDto.age,
          gender: memberDto.gender
        },
        orderItemDto: {
          skuId: skuId,
          shopId: shopId,
          shopName: shopName,
          skuCategory: category,
          goodsQuantity: goods.purchaseQuantity,
          goodsSalePrice: goods.actualPrice,
          goodsQuantity: goods.purchaseQuantity,
          totalGoodsAmount: goods.actualPrice * goods.purchaseQuantity
        }
      };

      sessionStorage.setItem(
        "queryItemMatchedCouponReqDto",
        JSON.stringify(queryItemMatchedCouponReqDto)
      );

      let flg = true;
      let flg1 = false;
      const toast = Toast.loading({
        duration: 0,
        forbidClick: true,
        mask: false,
        message: "加载中..."
      });
      console.log(`商品优惠券列表请求对象：`);
      console.log(queryItemMatchedCouponReqDto);
      // 发送Ajax请求
      this.$axios({
        method: "post",
        url: "/couponConsume/item/available/query",
        data: queryItemMatchedCouponReqDto
      })
        .then(res => {
          flg = false;
          let data = res.data;
          console.log(`获取商品优惠券列表结果：`);
          console.log(res);
          if (data.success && data.data.selectCouponUseList) {
            this.$router.push({
              path: "/cart/goodscoupone",
              query: { couponelist: data }
            });
          } else if (data.data.selectCouponUseList === null) {
            flg1 = true;
          }
        })
        .catch(err => {
          // console.log(err);
          // Toast({
          //   message: "请求失败，请重试！"
          // });
        });

      const timer = setInterval(() => {
        if (flg) {
          toast.message = "加载中...";
        } else if (flg1) {
          console.log("ok");
          Toast({
            duration: 1000,
            message: "没有可使用优惠券！"
          });
          clearInterval(timer);
          // Toast.clear()
        } else {
          clearInterval(timer);
          Toast.clear();
        }
      }, 0);
    },
    // 删除购物车
    cancelCart() {
      this.show = !this.show;
      localStorage.removeItem("user1");
      localStorage.removeItem("cartList");
      localStorage.removeItem("totalPrice");
      localStorage.removeItem("couponeCut");
      localStorage.removeItem("orderCouponAmount");
      localStorage.removeItem("goodsCutList");
      localStorage.removeItem("SelectCouponUseBoList");
      localStorage.removeItem("OrderDto");
      localStorage.removeItem("loglevel:webpack-dev-server");
      sessionStorage.clear();
      location.reload();
    }
  },
  computed: {
    totalPrice() {
      return this.tprice - this.couponeCut;
    },

  },
  watch: {
    totalPrice(newValue, oldValue) {
      if (newValue !== oldValue) {
        localStorage.setItem("totalPrice", this.totalPrice);
      }
    }
  }

};
</script>
<style scoped>
.cartInfo {
  padding: 46px 0 50px 0;
  min-height: calc(100vh - 96px);
}
.cancelBtn {
  position: fixed;
  left: 5px;
  bottom: 5px;
  width: 95px;
  height: 40px;
  border: none;
  border-radius: 40px;
  font-size: 16px;
  color: #3b3737;
  background-color: rgb(235, 199, 151);
  z-index: 999999;
}
.cBtn .van-button {
  background-color: rgb(235, 209, 184);
  border-radius: 20px;
  color: red;
}
.bottom {
  height: 100%;
  overflow: hidden;
}
</style>



