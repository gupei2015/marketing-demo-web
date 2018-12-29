<template>
  <div class="accountant">
    <!-- 联系人卡片 -->
    <van-contact-card
      :type="cardType"
      :name="currentContact.name"
      :tel="currentContact.tel"
      @click="showList = true"
    />

    <!-- 联系人列表 -->
    <van-popup
      v-model="showList"
      position="bottom"
    >
      <van-contact-list
        v-model="chosenContactId"
        :list="list"
        @add="onAdd"
        @edit="onEdit"
        @select="onSelect"
      />
    </van-popup>

    <!-- 联系人编辑 -->
    <van-popup
      v-model="showEdit"
      position="bottom"
    >
      <van-contact-edit
        :contact-info="editingContact"
        :is-edit="isEdit"
        @save="onSave"
        @delete="onDelete"
      />
    </van-popup>

    <!-- 购买商品的详细信息 -->
    <div class="content">
      <div
        class="brand"
        v-for="(item, index) in totalData"
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

      <!-- 顾客购买填写信息 -->
      <van-cell-group>
        <van-cell
          title="配送方式"
          is-link
          value="快递 免邮"
        />
        <van-cell
          class="couponeCard"
          title="优惠券"
          is-link
          value="点击选择订单优惠券"
          @click="getCouponeCards"
        />
        <van-cell
          title="运费险"
          is-link
          value="卖家送，确认收获前退货可陪"
        />
        <van-cell
          title="发票"
          is-link
          value="本次不开具发票"
        />
      </van-cell-group>

      <div
        class="couponeDetail"
        v-show="this.$store.state.getcount"
      >
        <van-cell-group class="orderCut">
          <van-cell
            class="tip"
            title="商品总价"
            :value="`￥${totalP}`"
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
            :value="`￥${totalP}`"
            :border="false"
          />
        </van-cell-group>
        <van-cell-group class="orderCoupone">
          <van-cell
            value="支付明细"
            :border="false"
          />
          <!-- <van-cell
            title="订单优惠券折扣"
            :value="`-￥${couponePrice}`"
            :border="false"
          />
          <van-cell
            title="商品优惠券折扣"
            :value="`-￥${couponeCut}`"
            :border="false"
          /> -->
          <van-cell
            v-if="orderDataObj ? orderDataObj.subTotalFullConditionReduceAmount: 0"
            title="优惠劵满减扣减金额"
            :value="`-￥${orderDataObj.subTotalFullConditionReduceAmount}`"
            :border="false"
          />
          <van-cell
            v-if="orderDataObj ? orderDataObj.subTotalDiscountReduceAmount: 0"
            title="优惠劵折扣扣减金额"
            :value="`-￥${orderDataObj.subTotalDiscountReduceAmount}`"
            :border="false"
          />
          <van-cell
            v-if="orderDataObj ? orderDataObj.subTotalCreditExchangeReduceAmount: 0"
            title="优惠劵积分兑换金额"
            :value="`-￥${orderDataObj.subTotalCreditExchangeReduceAmount}`"
            :border="false"
          />
          <van-cell
            v-if="orderDataObj ? orderDataObj.subTotalOnceReduceAmount: 0"
            title="优惠劵一次性扣减(一口价单价商品)金额"
            :value="`-￥${orderDataObj.subTotalOnceReduceAmount}`"
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
      </div>

      <!-- 优惠券弹出框 -->
      <van-popup
        v-model="show0"
        position="bottom"
        :overlay="show0"
      >
        <h4>店铺可使用优惠券</h4>
        <van-radio-group v-model="radio">
          <van-cell-group>
            <van-cell
              title="省5元优惠券"
              clickable
              @click="radio = '1'"
            >
              <van-radio name="1" />
            </van-cell>
            <van-cell
              title="省30元优惠券"
              clickable
              @click="radio = '2'"
            >
              <van-radio name="2" />
            </van-cell>
            <van-cell
              title="省50元优惠券"
              clickable
              @click="radio = '3'"
            >
              <van-radio name="3" />
            </van-cell>
            <van-cell
              title="不适用优惠券"
              clickable
              @click="radio = '4'"
            >
              <van-radio name="4" />
            </van-cell>
          </van-cell-group>
        </van-radio-group>
        <van-button
          class="couponeBtn"
          type="default"
          size="large"
          @click="show0=!show0"
        >关闭</van-button>
      </van-popup>

      <!-- 底部提交订单 -->
      <van-submit-bar
        :price="CutAllPrice*100"
        button-text="去支付"
        @submit="onSubmit"
      >
        <slot>
          <span v-cloak>优惠减：{{allCut}}</span>
        </slot>
      </van-submit-bar>

      <!-- 去支付弹出框 -->
      <van-popup
        v-model="show"
        position="bottom"
        :overlay="show"
      >
        <div class="pay">
          <div class="header">
            <van-icon
              @click="onSubmit"
              name="close"
            />确认支付</div>
          <van-cell-group>
            <van-cell value="内容">
              <slot>
                <div class="amount">
                  <strong>￥{{CutAllPrice}}</strong>
                </div>
              </slot>
            </van-cell>
            <van-cell
              title="订单金额"
              :value="`￥${CutAllPrice}`"
            />
            <van-cell
              title="支付账号"
              value="137******98"
            />
            <van-cell
              class="payStyle"
              title="支付方式"
              value="建设银行卡"
              is-link
            />
            <van-cell title="查看服务协议" />
          </van-cell-group>

          <button @click.self="callback">确认支付</button>

        </div>
      </van-popup>
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
export default {
  data: () => ({
    radio: "1",
    show0: false,
    show: false,
    value: 1,
    chosenContactId: null,
    editingContact: {},
    showList: false,
    showEdit: false,
    isEdit: false,
    list: [
      {
        name: "张三",
        tel: "13000000000",
        adress: "广东省广州市荔湾区中南街道五里村",
        id: 0
      }
    ],
    couponePrice: 0.0,
    couponeCut: 0.0,
    orderDataObj: null
  }),
  created() {
    this.couponePrice =
      (localStorage.getItem("orderCouponAmount") - 0).toFixed(2) || 0.0;
    this.couponeCut = (localStorage.getItem("couponeCut") - 0).toFixed(2);
    this.orderDataObj = JSON.parse(localStorage.getItem("orderDataObj"));
    this.getOrignOrder();
  },
  updated() {
    this.couponePrice =
      (localStorage.getItem("orderCouponAmount") - 0).toFixed(2) || 0.0;
  },
  computed: {
    cardType() {
      return this.chosenContactId !== null ? "edit" : "add";
    },

    currentContact() {
      const id = this.chosenContactId;
      return id !== null ? this.list.filter(item => item.id === id)[0] : {};
    },
    totalData() {
      return JSON.parse(this.$route.query.totalMarks);
    },
    CutAllPrice() {
      if(this.orderDataObj) {
        let payOrderAmount =localStorage.getItem("orderDataObj") ?  JSON.parse(localStorage.getItem("orderDataObj")).payOrderAmount : 0
        console.log(localStorage.getItem("orderDataObj"))
        return payOrderAmount.toFixed(2)
      }
       
      return 0
      // // now为true 处理数据方式不同
      // let now = this.$store.state.now;
      // if (now) {
      //   return (
      //     this.$route.query.totalPrice -
      //     this.couponePrice -
      //     this.couponeCut
      //   ).toFixed(2);
      // }
      // return (
      //   this.$route.query.totalPrice -
      //   this.couponePrice -
      //   this.couponeCut
      // ).toFixed(2);
    },
    totalP() {
      // if(this.orderDataObj) {
      //   let t = localStorage.getItem("orderDataObj") ? JSON.parse(localStorage.getItem("orderDataObj")).totalOrderAmount : 0
      //   console.log(t)
      //   return t.toFixed(2)
      // }
      // return 0

      // now为true 处理数据方式不同
      let now = this.$store.state.now;
      if (now) {
        return this.$route.query.totalPrice.toFixed(2);
      }
      let t = this.$route.query.totalPrice - 0;
      return t.toFixed(2);
    },
    // 优惠券抵扣
    actualPrice() {
      if(this.orderDataObj){
        let t = localStorage.getItem("orderDataObj") ? JSON.parse(localStorage.getItem("orderDataObj")).payOrderAmount : 0
       return t.toFixed(2)

      }
      return 0
      // now为true 处理数据方式不同
      // let now = this.$store.state.now;
      // if (now) {
      //   return (
      //     this.$route.query.totalPrice -
      //     this.couponePrice -
      //     this.couponeCut
      //   ).toFixed(2);
      // }
      // return (
      //   this.$route.query.totalPrice -
      //   this.couponePrice -
      //   this.couponeCut
      // ).toFixed(2);
    },
    allCut() {
      if( this.orderDataObj) {
        let all = localStorage.getItem("orderDataObj") ? JSON.parse(localStorage.getItem("orderDataObj")).subTotalCreditExchangeReduceAmount + 
                  JSON.parse(localStorage.getItem("orderDataObj")).subTotalDiscountReduceAmount +
                  JSON.parse(localStorage.getItem("orderDataObj")).subTotalFullConditionReduceAmount +
                  JSON.parse(localStorage.getItem("orderDataObj")).subTotalOnceReduceAmount  : 0
        return all.toFixed(2)

      }
      return 0
      // let all = this.couponePrice - 0 + (this.couponeCut - 0);
      // return all.toFixed(2);
    }
  },

  methods: {
    // 添加联系人
    onAdd() {
      this.editingContact = { id: this.list.length };
      this.isEdit = false;
      this.showEdit = true;
    },

    // 编辑联系人
    onEdit(item) {
      this.isEdit = true;
      this.showEdit = true;
      this.editingContact = item;
    },

    // 选中联系人
    onSelect() {
      this.showList = false;
    },

    // 保存联系人
    onSave(info) {
      this.showEdit = false;
      this.showList = false;

      if (this.isEdit) {
        this.list = this.list.map(item => (item.id === info.id ? info : item));
      } else {
        this.list.push(info);
      }
      this.chosenContactId = info.id;
    },

    // 删除联系人
    onDelete(info) {
      this.showEdit = false;
      this.list = this.list.filter(item => item.id !== info.id);
      if (this.chosenContactId === info.id) {
        this.chosenContactId = null;
      }
    },
    // 订单确认支付函数
    getOrderD() {
      let goodsCutList = JSON.parse(localStorage.getItem("goodsCutList")) || [];
      let orderDto1 = JSON.parse(localStorage.getItem("OrderDto")) || {};

      let SelectCouponUseBoList =
        JSON.parse(localStorage.getItem("SelectCouponUseBoList")) || [];
      let user1 = JSON.parse(localStorage.getItem("user1"));
      let userId = user1.userId;
      // 获取商品优惠券使用列表
      let goodsUseCouponsList = [];
      // console.log(SelectCouponUseBoList)
      if (SelectCouponUseBoList.length) {
        SelectCouponUseBoList.forEach(item => {
          // let guobj = {};
          let skuId = item.skuId;
          // let goodsSalePrice = item.goodsSalePrice
          for (let s = 0; s < item.SelectCouponUseBo.length; s++) {
            if (
              item.SelectCouponUseBo[s].couponSelectQuantity &&
              item.SelectCouponUseBo[s].status !== 2
            ) {
              let guobj = {};
              guobj.skuId = skuId;
              // guobj.goodsSalePrice = goodsSalePrice;
              guobj.couponSelectQuantity =
                item.SelectCouponUseBo[s].couponSelectQuantity;
              guobj.couponId = item.SelectCouponUseBo[s].couponId;
              goodsUseCouponsList.push(guobj);
            }
          }
        });
      }

      // 获取用户信息对象
      let memberBo = JSON.parse(localStorage.getItem("MemberBo"));

      let memberDto = {};
      memberBo.forEach(item => {
        if (item.userId == userId) {
          memberDto = item;
        }
      });
      delete memberDto.passWord;

      // 获取商品信息列表

      let cartList = user1.cartList;
      let pList = [];
      let orderItemList = [];
      cartList.forEach(item => {
        let { shopId, shopName, productList } = item;
        productList.forEach(i => {
          i.shopId = shopId;
          i.shopName = shopName;
          pList.push(i);
        });
      });
      // console.log("pList");
      // console.log(pList);
      // console.log(goodsCutList);
      // 给商品信息列表添加优惠券模板信息
      pList.forEach(item => {
        //  获取相应skuId
        let paygoods = 0;
        if (goodsCutList.length) {
          goodsCutList.forEach(i => {
            if (item.skuId === i.skuId) {
              paygoods = i.goodsCut;
            }
          });
        }
        // 创建orderItemList单个对象
        let _obj = {};
        _obj.goodsQuantity = item.purchaseQuantity;
        _obj.orderItemId = parseInt(Math.random() * 1000);
        _obj.payGoodsAmount = (
          item.actualPrice * item.purchaseQuantity -
          paygoods
        ).toFixed(2);
        _obj.shopId = item.shopId;
        _obj.shopName = item.shopName;
        _obj.skuId = item.skuId;
        _obj.goodsSalePrice = item.actualPrice;
        _obj.totalGoodsAmount = (
          item.actualPrice * item.purchaseQuantity
        ).toFixed(2);
        _obj.useCoupons = [];

        // console.log(goodsUseCouponsList);
        // 遍历循环商品使用优惠券列表 将商品使用优惠券信息push进去
        if (goodsUseCouponsList.length) {
          goodsUseCouponsList.forEach(k => {
            if (item.skuId === k.skuId) {
              let { couponId, couponSelectQuantity } = k;
              let goodCouponObj = {
                couponId,
                couponQuantity: couponSelectQuantity
              };
              _obj.useCoupons.push(goodCouponObj);
            }
          });
        }

        //  push 进入orderItemList列表
        orderItemList.push(_obj);
      });
      // console.log(orderItemList);

      orderDto1.orderItemList = orderItemList;
      // 如果用户使用了商品优惠券
      // let 

      let data0 = {
        memberDto,
        orderDto: orderDto1
      };
      return data0;
    },
    // Onloard渲染函数
    getOrignOrder() {
      let rend = this.$store.state.rend;
      if (rend) {
        let user1 = JSON.parse(localStorage.getItem("user1"));
        let memberBo = JSON.parse(localStorage.getItem("MemberBo"));

        let OrderBo = JSON.parse(localStorage.getItem("OrderDto"));
        let memberD = null;

        let userid = user1.userId;
        memberBo.forEach(item => {
          if (item.userId == userid) memberD = item;
        });

        let data = {
          memberDto: {
            userId: memberD.userId,
            userCode: memberD.userCode,
            userName: memberD.userName,
            level: memberD.level,
            age: memberD.age,
            gender: memberD.gender
          },
          orderDto: {
            orderId: OrderBo.orderId,
            orderNo: OrderBo.orderNo,
            totalOrderAmount: OrderBo.payOrderAmount,
            orderItemList: OrderBo.orderItemList
          }
        };

        let flg = true;
        let flg1 = false;
        let len = 0;
        const toast = Toast.loading({
          duration: 0,
          forbidClick: true,
          mask: true,
          message: "加载中..."
        });

        this.$axios({
          method: "post",
          url: "/couponConsume/order/available/query",
          data: data
        }).then(res => {
          flg = false;
          // let data = res.data;
          // console.log("获取订单优惠列表请求对象：");
          // console.log(res);
          if (res.data.success) {
            let data = this.getOrderD();
            console.log("订单结算请求对象：");
            console.log(data);
            localStorage.setItem("userOrderDto", JSON.stringify(data));
            this.$axios({
              method: "post",
              url: "/couponSettle/order/settlement",
              data: data
            }).then(res => {
              console.log("请求结果：");
              console.log(res);
              if (res.data.success) {
                flg1 = true;
                let result = res.data.data;
                // console.log(result)
                this.orderDataObj = result;
                localStorage.setItem("orderDataObj", JSON.stringify(result));
                this.$store.state.getcount = true;
                // localStorage.setItem("orderCouponAmount", this.couponReducedAmount);
                return;
              } else {
                Toast({
                  duration: 1000,
                  message: res.data.message
                });
              }
            });
            console.log(res.data.data.selectCouponUseList)
            len = res.data.data.selectCouponUseList ? res.data.data.selectCouponUseList.length : 0;

            return;
          } else {
            //  Toast({
            //    duration: 1000,
            //    message: `可使用优惠券列表数量：${len}`
            //  })
          }
        });
        const timer = setInterval(() => {
          // console.log(flg1);
          if (flg) {
            toast.message = "加载中...";
          } else if (flg1) {
            // console.log("ok");
            Toast({
              duration: 1000,
              message: `可使用优惠券列表数量：${len}`
            });
            clearInterval(timer);
          } else {
            clearInterval(timer);
            Toast.clear();
          }
        }, 1800);
      }
    },
    //获取优惠券
    getCouponeCards() {
      let user1 = JSON.parse(localStorage.getItem("user1"));
      let memberBo = JSON.parse(localStorage.getItem("MemberBo"));

      let OrderBo = JSON.parse(localStorage.getItem("OrderDto"));
      let memberD = null;

      let userid = user1.userId;
      memberBo.forEach(item => {
        if (item.userId == userid) memberD = item;
      });

      let data = {
        memberDto: {
          userId: memberD.userId,
          userCode: memberD.userCode,
          userName: memberD.userName,
          level: memberD.level,
          age: memberD.age,
          gender: memberD.gender
        },
        orderDto: {
          orderId: OrderBo.orderId,
          orderNo: OrderBo.orderNo,
          totalOrderAmount: OrderBo.payOrderAmount,
          orderItemList: OrderBo.orderItemList
        }
      };

      let flg = true;
      const toast = Toast.loading({
        duration: 0,
        forbidClick: true,
        mask: true,
        message: "加载中..."
      });

      this.$axios({
        method: "post",
        url: "/couponConsume/order/available/query",
        data: data
      })
        .then(res => {
          flg = false;
          let data = res.data;
          console.log("获取订单优惠列表请求对象：");
          console.log(data);

          if (data.data.selectCouponUseList === null) {
            let data = this.getOrderD();
            console.log("订单结算请求对象：");
            console.log(data);
            localStorage.setItem("userOrderDto", JSON.stringify(data));
            this.$axios({
              method: "post",
              url: "/couponSettle/order/settlement",
              data: data
            }).then(res => {
              console.log("请求结果：");
              console.log(res);
              if (res.data.success) {
                let result = res.data.data;
                // console.log(result)
                this.orderDataObj = result;
                localStorage.setItem("orderDataObj", JSON.stringify(result));
                this.$store.state.getcount = true;
                // localStorage.setItem("orderCouponAmount", this.couponReducedAmount);
                return;
              } else {
                Toast({
                  duration: 1000,
                  message: res.data.message
                });
              }
            });
            return;
          } else {
            this.$router.push({ path: "/cart/shopcoupone", query: data });
          }
        })
        .catch(err => {
          // console.log(err);
        });
      const timer = setInterval(() => {
        if (flg) {
          toast.message = "加载中...";
        } else {
          clearInterval(timer);
          Toast.clear();
        }
      }, 0);
    },
    // 结算按钮
    onSubmit() {
      this.show = !this.show;
      // console.log(this.show);
    },
    // 支付按钮
    callback() {
      let userOrderDto =
        JSON.parse(localStorage.getItem("userOrderDto")) || null;
      if (userOrderDto === null) {
        userOrderDto = this.getOrderD();
      }
      console.log(userOrderDto);

      this.$axios({
        method: "post",
        url: "/couponConsume/consume",
        data: userOrderDto
      }).then(res => {
        // console.log(res);
        let { data } = res;
        if (data.success === false) {
          Toast({
            duration: 1000,
            message: data.message
          });
        } else if (data.success) {
          Toast({
            duration: 1000,
            message: "支付和用券成功！"
          })
          location.href = "#/personal/myorder";
        }
      });
    }
  }
};
</script>
<style scoped>
.accountant {
  margin-top: 46px;
  margin-bottom: 50px;
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
.pay .header .van-icon {
  float: right;
  margin-right: 12px;
  font-size: 22px;
}
.pay .header {
  padding: 12px 0;
  font-weight: 400;
  text-align: center;
  border-bottom: 0.1px solid #d6d6d6;
}
.pay .amount {
  text-align: center;
}
.pay .amount strong {
  font-weight: normal;
  font-size: 30px;
}
.pay button {
  display: block;
  margin: 10px auto;
  width: 90%;
  height: 40px;
  border: none;
  border-radius: 6px;
  background-color: rgb(50, 34, 197);
  color: #fff;
}
.couponeBtn {
  color: rgb(233, 158, 47);
}

.couponeCard {
  background-color: #ff976a63;
  color: #f44;
}
/* 优惠详情的样式 */
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
</style>


