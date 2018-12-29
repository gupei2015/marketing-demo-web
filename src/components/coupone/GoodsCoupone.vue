 <template>
  <div
    class="goodsCoupone"
    @click.self.stop="hidden"
  >
    <h4 class="coupH4">商品可使用券</h4>
    <div v-if="SelectCouponUseBo.length">
      <diV
        v-for=" (item, index) in SelectCouponUseBo "
        :key="item.couponId "
        class="ticket"
        :class="{ 'ticket-active': item.status === 2 }"
      >
        <div class="left">
          <b v-if="item.couponAmount>=1">￥</b><b v-if="item.couponAmount<1 && item.couponAmount >0">{{`${item.couponAmount*10}折`}}</b><b v-else-if="item.couponAmount !==0">{{item.couponAmount}}</b><span
            class="bottomAl"
            v-if="item.couponAmount>=1"
          >元</span> <span class="couponName">{{item.couponName}}</span><br>
          {{item.couponDesc}}<br>
          <form class="laybel">
            <label>
              使用数量：
              <input
                v-show=" item.status !== 2"
                class="num"
                type="number"
                placeholder="0"
                v-model="vList[index]"
                @focus="onFocus(index)"
                @blur="onBlur(index)"
              >
            </label>
            <button
              v-show="(!(item.status|| item.couponTotalRemainQuantity == 0)) || selectNumFocus.length === (index +1) "
              class="numBtn"
              :data-tip="item.couponTotalRemainQuantity ? item.couponTotalRemainQuantity: 0"
              @click.prevent="checkedCoupone(index, couponTotalQuantity[index] ? couponTotalQuantity[index]: 0)"
            >确认</button>
            <!-- <button v-show="selectNumFocus">提交</button> -->
          </form>
        </div>
        <div class="right">
          <a
            href="javascript:;"
            @click="getCouponeView(item.selectCouponReceiveInfoList)"
          >可使用<b>{{ item.couponAvailableQuantity ?item.couponAvailableQuantity : item.couponTotalRemainQuantity}}</b>张</a>
        </div>
      </div>
    </div>
    <div
      v-else
      class="noCoupone"
    >
      没有可使用优惠券！
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
          v-for=" (item, index) in selectCouponReceiveInfoList "
          :key="index"
          :title="`大促凌晨${item.couponAmount}元`"
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
    selectCouponReceiveInfoList: [],
    vList: [],
    value: 1,
    radio: "1",
    show: false,
    couponReducedAmount: 0,
    selectNumFocus: [],
    couponTotalQuantity: [],
    skuId: "",
    vd: 0
  }),
  created() {
    this.getUrlQuery();
    this.getTatolQuantity();
  },
  updated() {
    console.log(this.couponReducedAmount);
  },
  directives: {
    // 无可用优惠券时禁用确认按钮
    disable: {
      inserted(el, binding) {
        let dataTip = el.getAttribute("data-tip");
        let dataStatus = el.getAttribute("data-status");
        if (dataTip == 0) {
          el.setAttribute("disabled", "disabled");
          el.style.backgroundColor = "rgba(204, 204, 204, 0.45)";
          el.style.color = "#999";
        }
      },
      updated(el, binding) {
        let dataTip = el.getAttribute("data-tip");
        let dataStatus = el.getAttribute("data-status");

        if (dataTip == 0) {
          el.setAttribute("disabled", "disabled");
          el.style.cssText =
            "backgroundColor: rgba(204,204,204, 0.45), color: #999";
        }
      }
    }
  },
  methods: {
    getUrlQuery() {
      let data1 = this.$route.query.couponelist;

      if (data1.data) {
        this.SelectCouponUseBo = data1.data.selectCouponUseList;
        this.skuId = data1.data.skuId;
      }
    },
    //获取优惠券总数列表函数
    getTatolQuantity() {
      if (this.SelectCouponUseBo.length) {
        this.SelectCouponUseBo.forEach(item => {
          this.couponTotalQuantity.push(item.couponTotalRemainQuantity);
        });
      }
    },
    getCouponeView(couponeBo) {
      // 获取优惠券的分析明细数组
      this.selectCouponReceiveInfoList = couponeBo;
      // 显示优惠券分类列表
      this.show = !this.show;
    },
    onFocus(index) {
      // console.log(index);
      this.selectNumFocus.length = index + 1;
      // console.log(this.selectNumFocus.length === 1)
    },
    onBlur(index) {
      // console.log(index)
      this.selectNumFocus.length = 0;
    },
    checkedCoupone(index, maxNum) {
      let num = this.vList[index] === undefined ? undefined : this.vList[index] === "" ? 0 : parseInt(this.vList[index]) 
      if (num === undefined) {
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
      if (num === 0) {
        // this.SelectCouponUseBo.forEach((item, index) => {
        //   item.status = 0;
        //   item.couponSelectQuantity = 0;
        //   item.couponTotalRemainQuantity = this.couponTotalQuantity[index];
        //   item.couponReducedAmount = 0;
        //   let oLi = JSON.parse(sessionStorage.getItem("dynamicList"));
        //   if (oLi) {
        //     oLi.forEach(item => {
        //       item.couponSelectQuantity = 0
        //     })
        //     sessionStorage.setItem("dynamicList", JSON.stringify(oLi))
        //   }
        // });
        // console.log("商品详情列表：")
        // console.log( this.SelectCouponUseBo );
        // // 用户选中0 时候 优惠减相应的减去金额
        // // let coun = JSON.parse(sessionStorage.getItem("couponReducedAmount"));
        // this.couponReducedAmount = 0;
        // return;
      }
      // Toast.success({
      //   duration: 800,
      //   message: "确认成功"
      // });

      // 从缓存中获取 商品优惠券请求对象
      let queryItemMatchedCouponReqDto = JSON.parse(
        sessionStorage.getItem("queryItemMatchedCouponReqDto")
      );
      // 从缓存中获取原来已选择的优惠券数据
      let dynamicList = JSON.parse(sessionStorage.getItem("dynamicList")) || [];

      // sessionStorage.removeItem("queryItemMatchedCouponReqDto")
      // sessionStorage.removeItem("dynamicList")

      // console.log(queryItemMatchedCouponReqDto);
      // 解构订单对象
      let { orderItemDto } = queryItemMatchedCouponReqDto;
      // 获取商品优惠券列表对象
      var SelectCouponUseBo = this.SelectCouponUseBo;

      // console.log(SelectCouponUseBo);
      //  1创建被选中优惠券列表
      let dynamicCalcSelectedCouponList = Array(SelectCouponUseBo.length);
      for (let i = 0; i < dynamicCalcSelectedCouponList.length; i++) {
        let item = {};
        item.couponId = SelectCouponUseBo[i].couponId;
        // 如果原来已选中的就保存到新对象中，没有就是0
        item.couponSelectQuantity = dynamicList[i]
          ? dynamicList[i].couponSelectQuantity
          : 0;
        item.couponAmount = SelectCouponUseBo[i].couponAmount;
        item.status = SelectCouponUseBo[i].status
          ? SelectCouponUseBo[i].status
          : 0;
        dynamicCalcSelectedCouponList[i] = item;
      }

      // }
      // 挂载选中数量
      dynamicCalcSelectedCouponList[index].couponSelectQuantity = num 
      dynamicCalcSelectedCouponList[index].status = 1
      sessionStorage.setItem(
        "dynamicList",
        JSON.stringify(dynamicCalcSelectedCouponList)
      );
      console.log(dynamicCalcSelectedCouponList);
      let userId = localStorage.getItem("isLogin");
      // let OrderDto = localStorage.getItem('OrderDto')
      // 创建请求选中优惠券对象列表
      let data = {
        // couponReduceTargetFlag: 2,
        memberDto: queryItemMatchedCouponReqDto.memberDto,
        orderItemDto: queryItemMatchedCouponReqDto.orderItemDto,
        // userId,
        // skuId: queryItemMatchedCouponReqDto.orderItemDto.skuId,
        // shopId: queryItemMatchedCouponReqDto.orderItemDto.shopId,
        // goodsSalePrice:
        //   queryItemMatchedCouponReqDto.orderItemDto.goodsSalePrice,
        // goodsQuantity: queryItemMatchedCouponReqDto.orderItemDto.goodsQuantity,
        totalAmount: queryItemMatchedCouponReqDto.orderItemDto.totalGoodsAmount,
        dynamicCalcSelectedCouponList
      };
      var totalAmount = data.totalAmount;
      console.log(`商品优惠请求列表:`);
      console.log(data);

      let flg = true;
      const toast = Toast.loading({
        duration: 0,
        forbidClick: true,
        message: "加载中..."
      });

      // // 发送请求
      this.$axios({
        method: "post",
        url: "/couponSettle/dynamicSelect",
        data: data
      }).then(res => {
        if(res.data.success === true){
        flg = false;
        let { data } = res;
        console.log(`获取结果：`);
        console.log(data);
        // 获取虚拟值
        this.vd = data.data.virtualCalcTotalAmount;
        console.log(this.vd);
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
        // 重新渲染数据

        let _obj = JSON.stringify(newSelectedList);

        this.SelectCouponUseBo = JSON.parse(_obj);
        console.log(this.SelectCouponUseBo);
        // console.log(this.SelectCouponUseBo);
        sessionStorage.setItem(
          "couponReducedAmount",
          this.SelectCouponUseBo[index].couponReducedAmount
        );
        this.SelectCouponUseBo[
          index
        ].couponTotalRemainQuantity = this.couponTotalQuantity[index];
        this.SelectCouponUseBo[index].couponTotalRemainQuantity -= num;

        // this.vList[index] = '';
        // console.log(data.data.finalTotalAmount);
        let finalTotalAmount = data.data.finalTotalAmount;
        // console.log(totalAmount);
        this.couponReducedAmount =
          Math.round((totalAmount - finalTotalAmount) * 100) / 100;
        }else {
          Toast({
            duration: 1000,
            message: res.data.message
          })
        }
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
    goBack() {
      // 累加商品虚拟值
      // console.log(this.$store.state.selectSKUId);
      // let calcVD = localStorage.getItem("calcVD") - 0 || 0;
      // console.log(calcVD);
      console.log(this.vd);
      if (this.vd) {
        let totalPriceList = JSON.parse(localStorage.getItem("totalPriceList"));
        totalPriceList.forEach(item => {
          if (this.skuId === item.skuId) {
            item.totalOrderAmount = this.vd;
          }
        });
        console.log(totalPriceList);
        localStorage.setItem("totalPriceList", JSON.stringify(totalPriceList))
        this.$store.state.first = false
      }
      console.log(this.$store.state.first)
      // let idList = this.$store.state.selectSKUId

      // if(idList.length === 0 || idList.indexOf(this.skuId) === -1){
      //   // this.$store.state.allVD += this.vd
      //   calcVD += this.vd
      //   this.$store.state.selectSKUId.push(this.skuId)
      // }
      //  console.log(calcVD)
      //  console.log(this.$store.state.selectSKUId)
      //  localStorage.setItem('calcVD', calcVD)

      console.log("商品优惠：");
      console.log(this.couponReducedAmount);
      let SelectCouponUseBoList =
        JSON.parse(localStorage.getItem("SelectCouponUseBoList")) || [];
      // console.log(SelectCouponUseBoList)
      let o = {};
      o.skuId = this.skuId;
      // o.goodsSalePrice = orderItemDto.goodsSalePrice
      let _sleObj = this.SelectCouponUseBo;
      // console.log(_sleObj);
      if (_sleObj.length !== 0) {
        o.SelectCouponUseBo = _sleObj;

        if (SelectCouponUseBoList) {
          let f = true;
          // debugger
          let index;
          SelectCouponUseBoList.forEach((i, k) => {
            if (i.skuId === o.skuId) {
              index = k;
              f = false;
            }
          });
          // console.log(index);
          let objString = JSON.stringify(o);
          SelectCouponUseBoList[index] = JSON.parse(objString);
          if (f) {
            SelectCouponUseBoList.push(o);
          }
        }
      }
      // console.log(SelectCouponUseBoList);
      localStorage.setItem(
        "SelectCouponUseBoList",
        JSON.stringify(SelectCouponUseBoList)
      );

      this.$router.push({
        path: "/cart",
        query: {
          skuId: this.skuId,
          couponReducedAmount: this.couponReducedAmount
        }
      });

      // 清除暂时缓存的数据
      sessionStorage.removeItem("dynamicList");
    }
  }
};
</script>

<style scoped>
.goodsCoupone {
  margin-top: 46px;
  margin-bottom: 50px;
}
.goodsCoupone .coupH4 {
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
.ticket .left .couponName {
  display: inline-block;
  vertical-align: bottom;
  overflow: hidden;
  width: 60%;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ticket .left .bottomAl {
  display: inline-block;
  vertical-align: bottom;
}
.ticket .left b {
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
.ticket .left b {
  font-size: 30px;
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
.disableBtn {
  background-color: rgba(204, 204, 204, 0.45) !important;
  color: #999 !important;
}
.noCoupone {
  font-size: 20px;
  color: #999;
}
</style>



 
