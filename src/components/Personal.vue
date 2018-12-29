<template>
  <div class="personal">
    <!-- <couponlist></couponlist> -->
    <div class="userImg">
      <img
        src="#"
        alt=""
      >
      <span>{{$store.state.userName ? $store.state.userName: "用户名"}}</span><br>
      <span>{{$store.state.userCode ? $store.state.userCode:"用户编号" }}</span>
    </div>
    <!-- <div class="banner"> -->
      <!-- <Mycoupone ></Mycoupone> -->
    <!-- </div> -->
    <!-- 个人中心详细信息 -->
    <div class="content">
      <van-tabs
        v-model="active"
        @click="onClick"
      >
        <van-tab title="我的优惠券">
          <div class="tips">
            <!-- <div class="header">
              <h3>优惠</h3>
              <div class="note">
                <p>商品售价￥4099，使用以下优惠至少可减￥30</p>
                <b>促销</b><br>
                <strong>积分:</strong>购买可得409积分<br>
                <div class="tip">
                  <i>已有积分:516</i>
                </div>
              </div>
              <div class="ticket">
                <div class="left">
                  ￥<b>30</b>元店铺优惠券<br>
                  满3000使用<br>

                </div>
                <div class="right">
                  <a href="javascript:;">去使用</a>
                </div>
              </div>
              <div class="useInfo">
                <van-icon name="checked" />
                领取后，使用该券可立减<b class="red">￥30</b>
              </div>
            </div> -->

            <div
              class="ticket"
              v-for="(item, index) in dataList"
              :key="index"
            >
              <div class="left">
                <b>{{item.couponName}}</b><br>
                <span>{{item.couponDesc}}</span>
                <span>数量：{{item.CouponSummary.couponQuantity}}</span>
              </div>
              <div class="right">
                <a
                  href="javascript:;"
                  @click="callback(item.CouponSummary.couponId)"
                >详情</a>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title=""></van-tab>
        <van-tab title="我的订单">
          <orderlist v-if="$store.state.orderFlag"></orderlist>
          <div v-else>
            没有订单
          </div>

        </van-tab>
      </van-tabs>
    </div>
    <!-- 领取优惠券弹框 -->
    <!-- 优惠券列表 -->
    <van-popup
      v-model="showList"
      position="bottom"
    >
      <van-coupon-list
        :coupons="getCouponListData"
        :show-exchange-bar="false"
        close-button-text="返回"
        @change="onChange"
        @exchange="onExchange"
      />
    </van-popup>

  </div>
</template>

<script>
import { Popup } from "vant";
import { Toast } from "vant";
import Mycoupone from "./coupone/mode/Mycoupone";
import Orderlist from "./user/OrderList";
import Couponlist from "./user/Couponlist";
// let moment = require("moment");

// 定义一张优惠券
// const coupon = {
//   // available: 1,
//   // discount: 0,
//   // denominations: 150,
//   // originCondition: 0,
//   // reason: "",
//   // value: 150,
//   name: "优惠券名",
//   startAt: 1489104000,
//   endAt: 1514592000
// };

export default {
  data() {
    return {
      active: 0,
      dataList: [],
      couponList: [],
      showList: false,
      chosenCoupon: -1,
      coupons: [],
      // disabledCoupons: [coupon],
      couponshow: false,
    };
  },
  created(){
    this. onClick(this.active)
    this.onOrderList()
  },
  methods: {
    onClick(index, title) {
      if (index === 0) {
        let userId = localStorage.getItem("isLogin");
        let flg = true;
        const toast = Toast.loading({
          duration: 0,
          forbidClick: true,
          message: "加载中..."
        });
        this.$axios({
          method: "get",
          url: `/couponSummary/getUserCoupon?userId=${userId}`
        }).then(res => {
          flg = false;
          // console.log(res);
          if (res.data.success === true) {
            this.dataList = res.data.data;
          } else if (res.data.success === false) {
            toast({
              duration: 1000,
              message: res.data.message
            });
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
      }
    },
    callback(cId) {
      let userId = localStorage.getItem("isLogin");
      this.$axios({
        method: "get",
        url: `/couponSummary/getUserCouponDetail?userId=${userId}&couponId=${cId}`
      }).then(res => {
        // console.log(res);
        if (res.data.success) {
          this.couponList = res.data.data;
          this.showList = !this.showList;
        } else {
          Toast({
            duration: 1000,
            message: res.data.message
          });
        }
      });
    },
    onChange(index) {
      this.showList = false;
      this.chosenCoupon = index;
    },
    onExchange(code) {
      this.coupons.push(coupon);
    },
    onOrderList(){
      let user = localStorage.getItem('user')
      let isLogin = localStorage.getItem("isLogin")
      if(!user){
        this.$store.state.orderFlag = false
      }
    }
  },
  components: {
    Mycoupone,
    Orderlist,
    Couponlist
  },
  computed: {
     getCouponListData(){
      let L = this.couponList.length;
      let _obj = {}
      let couponsl = []
      if (L > 0) {
      
        this.couponList.forEach(item => {
          let startTime = item.createAt.split('-').join(' ')
          let endTime = item.endDate.split('-').join(' ')
          
         let st= Date.parse(startTime)/1000
         let end = Date.parse(endTime)/1000
          if(item.couponNo){
            _obj.name = `券号：${item.couponNo}(${item.remark})`
          } else if( item.remainQuantity) {
            _obj.name = `积分：${item.remainQuantity}(${item.remark})`
          }
          _obj.startAt = st
          _obj.endAt = end
          couponsl.push(JSON.parse(JSON.stringify(_obj)))
        });

      }
  return couponsl
    },
  }

};
</script>


<style lang="less">
/* 个人中心页面详情 */
.personal {
  margin-top: 46px;
  overflow: hidden;
  background-color: #fff;
  width: 100%;

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
  .userImg span {
    font-size: 14px;
  }

  .banner {
    padding: 5px 0;
    width: 100%;
    /* height: 160px; */
    background-color: rgb(235, 211, 168);
  }

  .content {
    padding-bottom: 200px;


/* 领取优惠券页面信息 */


/* 优惠券详情信息 */

    .tips { 
      padding: 10px;
      width: 100%;
      height: 80%;
      background-color: #fff;
      color: #fff;
      font-size: 14px;
      box-sizing: border-box;
      .ticket {
        margin: 20px 0;
        display: flex;
        justify-content: space-between;
       div {
        height: 100px;
        background-color: rgba(251, 249, 109, 0.36);
        border: 1px solid rgb(248, 177, 177);
        border-radius: 5px;
        color: rgb(247, 94, 94);
        box-sizing: border-box;
        }
       .left {
        padding: 10px 5px;
        width: 80%;
        box-shadow: 0 0 15px #ccc;}
      .right {
        width: 20%;
        padding: 10px 5px;
        box-shadow: 0 0 15px #ccc;
        }
      .right a {
        padding: 25px 0;
        display: inline-block;
        color: rgb(247, 94, 94);
        }
      .left b {
        display: inline-block;
        width: 70%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 16px;
        }
      .left { 
          span {
            display: block;
            margin-top: 10px;
          }
        } 
      } 
      .header {
        margin-bottom: 50px;
        background: linear-gradient(
          to right,
          rgb(241, 45, 45),
          rgb(235, 211, 168),
          rgb(241, 45, 45)
          );
          .ticket{
            margin: 20px 0;
            display: flex;
            justify-content: space-between;
              div {
              height: 100px;
              background-color: rgba(251, 249, 109, 0.36);
              border: 1px solid rgb(248, 177, 177);
              border-radius: 5px;
              color: rgb(247, 94, 94);
              box-sizing: border-box;
              }
             .left {
              padding: 10px 5px;
              width: 80%;
              box-shadow: 0 0 15px #ccc;
              }
            .right {
              width: 20%;
              padding: 10px 5px;
              box-shadow: 0 0 15px #ccc;
              }
             .right a {
              padding: 25px 0;
              display: inline-block;
              color: rgb(247, 94, 94);
              }
             .left b {
              display: inline-block;
              width: 70%;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              font-size: 16px;
              }
          }
        .useInfo {
          margin-top: 8px;
          padding-left: 4px;
          border-radius: 15px;
          background-color: rgb(236, 236, 236);
          .van-icon-checked {
            color: rgb(102, 151, 28);
          }
          .red {
            color: red;
          }
        }

        h3 {
          text-align: center;
        }
        .node{
          .tip {
            padding: 8px 0;
            display: flex;
            justify-content: space-between;
            i {
            flex: 1;
            font-style: normal;
            color: rgb(223, 213, 213);
            }
          }
        }
      }
    }
  }
/* 领取优惠券样式 */
.van-popup {
  .van-coupon-list {
    .van-tabs {
      .van-tabs__wrap {
        .van-tabs__nav{
  
          .van-tabs__line{
            display: none;
          }
        }
        .van-tab {
          span.van-ellipsis{
            display: none;
          }
        }
      }
    }
    .van-tabs__content{
      .van-tab__pane{
        .van-coupon-list__list{  
          .van-coupon-item{
            h2 {
              color: #f75e5e;
              font-size: 14px;
            }
            .van-coupon-item__content{
              background-color: rgba(251, 249, 109, 0.36);
              .van-coupon-item__head{
                display: none;
              }
            }
          }
        }
      }
    }
  }
  }
}
</style>
