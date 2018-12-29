 <template>
  <div
    class="shopCoupone"
    @click.self.stop="hidden"
  >
    <h4 class="coupH4">订单可使用券</h4>
    <div
      class="ticket"
      v-for="(item, index) in SelectCouponUseBo "
      :key="item.couponId"
      :class="{ 'ticket-active': item.status === 2 }"
    >
      <div class="left">
        <b>{{item.couponName}}</b><br>
        {{item.couponDesc}}<br>
        <div class="laybel">
          <label>
            使用数量：
            <input
              class="num"
              type="number"
              placeholder="0"
              v-model="vList[index]"
              min="0"
              @focus="onFocus(index)"
              @blur="onBlur(index)"
            >
          </label>
          <button
            class="numBtn"
            v-show="(!(item.status|| item.couponTotalRemainQuantity == 0)) || selectNumFocus.length === (index +1)"
            :data-tip="item.couponTotalRemainQuantity ? item.couponTotalRemainQuantity: 0"
            @click="checkedCoupone(index , couponTotalQuantity[index] ? couponTotalQuantity[index]: 0 )"
          >确认</button>
        </div>
      </div>
      <div class="right">
        <a
          href="javascript:;"
          @click="getCouponeView(item.SelectCouponReceiveInfo )"
        >可使用<b>{{item.couponAvailableQuantity ?item.couponAvailableQuantity : item.couponTotalRemainQuantity ? item.couponTotalRemainQuantity: 0 }}</b>张</a>
      </div>
    </div>

    <van-button
      class="couponeBtn"
      type="default"
      size="large"
      @click="goBack"
    >返回</van-button>
    <!-- 使用优惠券 -->
    <van-popup
      v-model="show"
      position="bottom"
      :overlay="show"
    >
      <h4>店铺可使用优惠券</h4>
      <van-cell-group>
        <van-cell
          v-for=" (item, index) in selectCouponeList "
          :key="index"
          title="大促凌晨3元"
          :value="`共${item.couponReceiveRemainQuantity}张`"
          :label="`使用期限：${item.couponEndDate}`"
        >
        </van-cell>
      </van-cell-group>
      <van-button
        class="couponeBtn"
        type="default"
        size="large"
        @click="show=!show"
      >关闭</van-button>
    </van-popup>

  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data: () => ({
    SelectCouponUseBo: [],
    selectCouponeList: [],
    vList: [],
    value: 1,
    radio: "1",
    show: false,
    // addCouponeReduceAmount: [],
    couponReducedAmount: 0.0,
    couponTotalQuantity: [],
    selectNumFocus: []
  }),
  created() {
    this.SelectCouponUseBo = this.$route.query.data.selectCouponUseList;
    this.getTatolQuantity();
  },
  updated() {
    console.log(this.couponReducedAmount);
  },
  methods: {
    onFocus(index) {
      this.selectNumFocus.length = index + 1;
  
    },
    onBlur(index) {
      // console.log(index);
      this.selectNumFocus.length = 0;
    },
    //获取优惠券总数列表函数
    getTatolQuantity() {
      
      if(this.SelectCouponUseBo && this.SelectCouponUseBo.length){
        
        this.SelectCouponUseBo.forEach(item => {
          this.couponTotalQuantity.push(item.couponTotalRemainQuantity);
        })
      }
    },
    getCouponeView(couponeBo) {
      
      this.selectCouponeList = couponeBo;
      this.show = !this.show;
    },
    checkedCoupone(index, maxNum) {
      let num = this.vList[index] === undefined ? undefined : this.vList[index] === "" ? 0 :parseInt(this.vList[index])
      if (num == undefined) {
        Toast({
          duration: 1000,
          message: "请输入数量"
        });
        return;
      }
      if (num > maxNum || num < 0) {
        Toast({
          duration: 1000,
          message: `数量必须在0~${maxNum}之间`
        });
        return;
      }
      if (num == 0) {
        // this.SelectCouponUseBo.forEach((item, index) => {
        //   item.status = 0;
        //   item.couponSelectQuantity = 0;
        //   item.couponTotalRemainQuantity = this.couponTotalQuantity[index];
        //   item.couponReducedAmount = 0;
        //   let oLi = JSON.parse(sessionStorage.getItem("orderDynamicList"));
        //   // console.log(oLi);
        //   if (oLi) {
        //     oLi.forEach(item => {
        //       item.couponSelectQuantity = 0;
        //     });
        //     sessionStorage.setItem("orderDynamicList", JSON.stringify(oLi));
        //   }
        // });
        // // console.log(this.SelectCouponUseBo);
        // // 获取缓存数据，减去相应的优惠减金额
        // // let cou = JSON.parse(sessionStorage.getItem("couponReducedAmount"));
        // // console.log(cou);
        // this.couponReducedAmount = 0;
        // return;
      }
      // 获取订单总金额
      let totalGoodsAmount = JSON.parse(localStorage.getItem("OrderDto"))
        .totalOrderAmount;
      let orderDynamicList = JSON.parse(
        sessionStorage.getItem("orderDynamicList")
      ) || [];

      // 获取商品优惠券列表对象
      let SelectCouponUseBo = this.SelectCouponUseBo;

      // console.log(SelectCouponUseBo);
      //  1创建被选中优惠券列表
      let dynamicCalcSelectedCouponList = Array(SelectCouponUseBo.length);
      for (let i = 0; i < dynamicCalcSelectedCouponList.length; i++) {
        let item = {};
        item.couponId = SelectCouponUseBo[i].couponId;
        item.couponSelectQuantity = orderDynamicList[i]
          ? orderDynamicList[i].couponSelectQuantity
          : 0;
        item.couponAmount = SelectCouponUseBo[i].couponAmount;
        item.status =  SelectCouponUseBo[i].status
          ? SelectCouponUseBo[i].status
          : 0;
        dynamicCalcSelectedCouponList[i] = item;
      }
      // 挂载选中数量
      dynamicCalcSelectedCouponList[index].couponSelectQuantity = num;
      dynamicCalcSelectedCouponList[index].status = 1;
      sessionStorage.setItem(
        "orderDynamicList",
        JSON.stringify(dynamicCalcSelectedCouponList)
      );

      // console.log(dynamicCalcSelectedCouponList);

      // 创建请求选中优惠券对象列表
      let userId = localStorage.getItem('isLogin')
      let OrderDto = JSON.parse(localStorage.getItem('OrderDto'))
      // let calcVD = localStorage.getItem("calcVD")
      let memberBo = JSON.parse(localStorage.getItem("MemberBo"));
      let memberDto =null
        memberBo.forEach(item => {
        if (item.userId == userId) {
          memberDto = item;
        }
      })
      let data = {
        // couponReduceTargetFlag: 1,
        // userId,
        // orderId: OrderDto.orderId,
        // orderNo: OrderDto.orderNo,
        memberDto: memberDto,
        orderDto: OrderDto,
        totalAmount: totalGoodsAmount,
        dynamicCalcSelectedCouponList
      };
      console.log('订单优惠请求列表：')
      console.log(data)

      // this.$store.state.selectSKUId = []
      // console.log(this.$store.state.selectSKUId)
      // 添加请求等待
      let flg = true;
      const toast = Toast.loading({
        duration: 0,
        forbidClick: true,
        message: "加载中..."
      });
      // 发送请求
      this.$axios({
        method: "post",
        url: "/couponSettle/dynamicSelect",
        data: data
      })
        .then(res => {
          flg = false;
          console.log('订单优惠结果：')
          console.log(res)
          let { data } = res;
          let newSelectedList = [];
          let dynamicCalcSelectedCouponList =
            data.data.dynamicCalcSelectedCouponList;
          for (let i = 0; i < this.SelectCouponUseBo.length; i++) {
            for (let j = 0; j < dynamicCalcSelectedCouponList.length; j++) {
              if (
                dynamicCalcSelectedCouponList[j].couponId ===
                this.SelectCouponUseBo[i].couponId
              ) {
                let obj = Object.assign(
                  {},
                  this.SelectCouponUseBo[i],
                  dynamicCalcSelectedCouponList[j]
                );
                newSelectedList.push(obj);
              }
            }
          }
            // 深拷贝
          let _obj = JSON.stringify(newSelectedList);

          this.SelectCouponUseBo = JSON.parse(_obj);
          console.log(this.SelectCouponUseBo)
          // 获取优惠减金额 缓存sessionStorage中，以便后面使用
          let coun = this.SelectCouponUseBo[index].couponReducedAmount;
          sessionStorage.setItem("couponReducedAmount", coun);

          this.SelectCouponUseBo[
            index
          ].couponTotalRemainQuantity = this.couponTotalQuantity[index];
          this.SelectCouponUseBo[index].couponTotalRemainQuantity -= num;

          // console.log(data.data.finalTotalAmount);
          let finalTotalAmount = data.data.finalTotalAmount;

          this.couponReducedAmount =
            Math.round((totalGoodsAmount - finalTotalAmount) * 100) / 100;
        })
        .catch(err => {
          console.log(err);
        });
      // 清除请求等待
      const timer = setInterval(() => {
        if (flg) {
          toast.message = "加载中...";
        } else {
          clearInterval(timer);
          Toast.clear();
        }
      }, 0);
    },
    goBack() {
      let memberBo = JSON.parse(localStorage.getItem("MemberBo"));
      let user1 = JSON.parse(localStorage.getItem("user1"));
      let orderDto = JSON.parse(localStorage.getItem("OrderDto"));
      let goodsCutList = JSON.parse(localStorage.getItem("goodsCutList"));
      let SelectCouponUseBoList = JSON.parse(
        localStorage.getItem("SelectCouponUseBoList")
      ) || []
      let userId = user1.userId;

      // 获取商品优惠券使用列表
      let goodsUseCouponsList = [];
      let guobj = {};
      console.log(SelectCouponUseBoList)
      let len = SelectCouponUseBoList.length
      if( len > 0 ){
        SelectCouponUseBoList.forEach(item => {
          guobj.skuId = item.skuId;
          // guobj.goodsSalePrice = item.goodsSalePrice;
          item.SelectCouponUseBo.forEach(i => {
            if (i.couponSelectQuantity && i.status !== 2) {

              guobj.couponSelectQuantity = i.couponSelectQuantity;
              guobj.couponId = i.couponId;
              goodsUseCouponsList.push(JSON.parse(JSON.stringify(guobj)));
            }
          });
        });
      } 
      console.log(goodsUseCouponsList)
      // 获取用户信息对象
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
      // console.log(pList);

      // 给商品信息列表添加优惠券模板信息
      pList.forEach(item => {
        //  获取相应skuId
        let paygoods = 0;
        if( goodsCutList && goodsCutList.length ){
          goodsCutList.forEach(i => {
            if (item.skuId === i.skuId) {
              paygoods = i.goodsCut;
            }
          })
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

        // 遍历循环商品使用优惠券列表 将商品使用优惠券信息push进去
        console.log(goodsUseCouponsList)
        if(goodsUseCouponsList.length) {
          
          goodsUseCouponsList.forEach(k => {
            if (_obj.skuId === k.skuId) {
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

      // console.log(this.SelectCouponUseBo);
      orderDto.orderItemList = orderItemList;
      // console.log(orderItemList);

      // 获取订单优惠列表对象
      let useOrderCouponList = [];
      this.SelectCouponUseBo.forEach(item => {
        if (item.couponSelectQuantity && item.status !== 2 ) {
          let orderCouponObj = {
            couponId: item.couponId,
            couponQuantity: item.couponSelectQuantity
          };
          useOrderCouponList.push(orderCouponObj);
        }
      });

      orderDto.useCoupons = useOrderCouponList;

      let data = {
        memberDto,
        orderDto
      };
      console.log('获取订单结算请求对象：');
      console.log(data);
      localStorage.setItem("userOrderDto", JSON.stringify(data));

      this.$axios({
        method: "post",
        url: "/couponSettle/order/settlement",
        data: data
      }).then(res => {
        console.log('请求结果：')
        console.log(res)
        let { data } = res;
        if (data.success) {
          let result = data.data;
          localStorage.setItem("orderDataObj", JSON.stringify(result));
          this.$store.state.getcount = true;
          localStorage.setItem("orderCouponAmount", this.couponReducedAmount);
          this.$router.go(-1);
        } else {
          Toast({
            duration: 1000,
            message: data.message
          });
        }
      });
      sessionStorage.removeItem("orderDynamicList");
    }
  }
};
</script>

<style scoped>
.shopCoupone {
  margin-top: 46px;
  margin-bottom: 50px;
}
.shopCoupone .coupH4 {
  font-size: 18px;
  color: rgb(247, 94, 94);
}

/* 领取优惠券页面信息 */
.ticket {
  margin: 10px 5px;
  display: flex;
  justify-content: space-between;
}
.ticket-active div {
  background-color: #fff !important;
}
.ticket-active .left,
.ticket-active .right {
  border: 1px solid #9e9e9e !important;
  color: #9e9e9e !important;
}
.ticket-active .left b {
  color: #9e9e9e !important;
}
.ticket-active .right a {
  color: #9e9e9e !important;
}
.ticket div {
  background-color: rgba(251, 249, 109, 0.36);
}
.ticket .laybel {
  background-color: transparent;
}
.ticket .left {
  height: 100px;
  padding: 10px 5px;
  width: 70%;
  border: 1px solid rgb(248, 177, 177);
  border-radius: 5px;
  color: #ff976a;
  box-sizing: border-box;
}
.ticket .left b {
  font-size: 18px;
  color: #f44;
}
.ticket-active .left .num {
  display: none;
}
.ticket .left .num {
  padding-left: 10px;
  width: 40px;
  border: none;
  color: #333;
  background-color: #fafafa;
  border-radius: 8px;
}
.ticket .left .numBtn {
  float: right;
  margin-right: 20px;
  width: 60px;
  border: none;
  border-radius: 8px;
  background-color: rgba(235, 199, 151, 0.54);
  color: #ff6c6c;
}
.ticket .right {
  height: 100px;
  width: 30%;
  padding: 10px 5px;
  border: 1px solid rgb(248, 177, 177);
  border-radius: 5px;
  color: rgb(247, 94, 94);
  box-sizing: border-box;
}
.ticket .right a {
  padding: 25px 0;
  display: inline-block;
  color: rgb(247, 94, 94);
}
.couponeBtn {
  border-radius: 10px;
  background-color: rgb(235, 199, 151);
}
.van-popup {
  color: #ff976a;
}
.van-cell {
  color: #ff976a;
}
</style>



 
