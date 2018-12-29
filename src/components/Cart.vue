<template>
  <div class="cart">
    <div
      v-for="item in goodsCouponList"
      :key="item.couponId"
    >
      <van-card
        tag="优惠券"
        :desc="item.couponDesc"
        :title="item.couponNam"
        :thumb="'/static/20181108_03.png'"
      >
        <div slot="footer">
          <!-- <van-button size="mini">按钮</van-button> -->
          <van-button
            size="mini"
            @click.prevent="onClickBtn(item.couponId, item.activityId, item.requestQuantity)"
          >领券</van-button>
        </div>
      </van-card>
    </div>
    <!-- <van-card
      tag="优惠券"
      desc="购买指定商品300元以上使用"
      title="领取2张满300元商品可并存9折券"
      :thumb="'/static/20181108_03.png'"
    >
      <div slot="footer">

        <van-button
          size="mini"
          @click.prevent="onClickBtn"
        >领券</van-button>
      </div>
    </van-card>
    <van-card
      tag="优惠券"
      desc="下单500元以上用券享受8折优惠"
      title="领取1张下单满500元排他8折券"
      :thumb="'/static/20181108_03.png'"
    >
      <div slot="footer">
        <van-button
          size="mini"
          @click.prevent="onClickBtn"
        >领券</van-button>
      </div>
    </van-card>
    <van-card
      tag="优惠券"
      desc="下单500元以上用券享受8折优惠"
      title="领取1张下单满500元可并存8折券"
      :thumb="'/static/20181108_03.png'"
    >
      <div slot="footer">
        <van-button
          size="mini"
          @click.prevent="onClickBtn"
        >领券</van-button>
      </div>
    </van-card>
    <van-card
      tag="优惠券"
      desc="下单50元以上使用"
      title="领取1张下单满50减5排他券"
      :thumb="'/static/20181108_03.png'"
    >
      <div slot="footer">
        <van-button
          size="mini"
          @click.prevent="onClickBtn"
        >领券</van-button>
      </div>
    </van-card>
    <van-card
      tag="优惠券"
      desc="下单100元以上使用"
      title="领取2张下单满100减10并存券"
      :thumb="'/static/20181108_03.png'"
    >
      <div slot="footer">
        <van-button
          size="mini"
          @click.prevent="onClickBtn"
        >领券</van-button>
      </div>
    </van-card>
    <van-card
      tag="优惠券"
      desc="下单500元以上使用"
      title="领取5张下单满500减20并存券"
      :thumb="'/static/20181108_03.png'"
    >
      <div slot="footer">
        <van-button
          size="mini"
          @click.prevent="onClickBtn"
        >领券</van-button>
      </div>
    </van-card>
    <van-card
      tag="优惠券"
      desc="购买单项商品满200元以上使用"
      title="领取1张商品满200减10排他券"
      :thumb="'/static/20181108_03.png'"
    >
      <div slot="footer">
        <van-button
          size="mini"
          @click.prevent="onClickBtn"
        >领券</van-button>
      </div>
    </van-card>
    <van-card
      tag="优惠券"
      desc="购买单项商品满200元以上使用"
      title="领取1张商品满200减10并存券"
      :thumb="'/static/20181108_03.png'"
    >
      <div slot="footer">
        <van-button
          size="mini"
          @click.prevent="onClickBtn"
        >领券</van-button>
      </div>
    </van-card>
    <van-card
      tag="优惠券"
      desc="下单买指定商品使用一口价"
      title="领取1张商品一口价20元券"
      :thumb="'/static/20181108_03.png'"
    >
      <div slot="footer">
        <van-button
          size="mini"
          @click.prevent="onClickBtn"
        >领券</van-button>
      </div>
    </van-card>
    <van-card
      tag="优惠券"
      desc="购买特定商品抵扣2元"
      title="领取5张商品2元抵价券"
      :thumb="'/static/20181108_03.png'"
    >
      <div slot="footer">
        <van-button
          size="mini"
          @click.prevent="onClickBtn"
        >领券</van-button>
      </div>
    </van-card>
    <van-card
      tag="优惠券"
      desc="下单抵扣5元"
      title="领取1张下单5元抵价券"
      :thumb="'/static/20181108_03.png'"
    >
      <div slot="footer">
        <van-button
          size="mini"
          @click.prevent="onClickBtn"
        >领券</van-button>
      </div>
    </van-card>
    <van-card
      tag="优惠券"
      desc="购买指定数量的商品使用"
      title="领取5张满5件商品打8折排他优惠券"
      :thumb="'/static/20181108_03.png'"
    >
      <div slot="footer">
        <van-button
          size="mini"
          @click.prevent="onClickBtn"
        >领券</van-button>
      </div>
    </van-card>
    <van-card
      tag="优惠券"
      desc="购买指定数量的商品使用"
      title="领取2张买满5件商品减30元并存券"
      :thumb="'/static/20181108_03.png'"
    >
      <div slot="footer">
        <van-button
          size="mini"
          @click.prevent="onClickBtn"
        >领券</van-button>
      </div>
    </van-card> -->

  </div>
</template>

<script>
import { Toast } from "vant";
import { Dialog } from "vant";
export default {
  data() {
    return {
      show: false,
      goodsCouponList: [
        {
          couponNam: "领取5张满300元商品排他9折券",
          couponDesc: "购买指定商品300元以上使用",
          couponId: 13,
          activityId: 25,
          requestQuantity: 5
        },
        {
          couponNam: "领取5张满300元商品可并存9折券",
          couponDesc: "购买指定商品300元以上使用",
          couponId: 14,
          activityId: 26,
          requestQuantity: 5
        },
        {
          couponNam: "领取5张下单满500元排他8折券",
          couponDesc: "下单500元以上用券享受8折优惠",
          couponId: 15,
          activityId: 27,
          requestQuantity: 5
        },
        {
          couponNam: "领取5张下单满500元可并存8折券",
          couponDesc: "下单500元以上用券享受8折优惠",
          couponId: 16,
          activityId: 28,
          requestQuantity: 5
        },
        {
          couponNam: "领取5张下单满50减5排他券",
          couponDesc: "下单50元以上使用",
          couponId: 17,
          activityId: 29,
          requestQuantity: 5
        },
        {
          couponNam: "领取5张下单满100减10并存券",
          couponDesc: "下单100元以上使用",
          couponId: 18,
          activityId: 30,
          requestQuantity: 5
        },
        {
          couponNam: "领取5张下单满500减20并存券",
          couponDesc: "下单500元以上使用",
          couponId: 19,
          activityId: 31,
          requestQuantity: 5
        },
        {
          couponNam: "领取5张商品满200减10排他券",
          couponDesc: "购买单项商品满200元以上使用",
          couponId: 20,
          activityId: 32,
          requestQuantity: 5
        },
        {
          couponNam: "领取5张商品满200减10并存券",
          couponDesc: "购买单项商品满200元以上使用",
          couponId: 21,
          activityId: 33,
          requestQuantity: 5
        },
        {
          couponNam: "领取5张商品一口价20元券",
          couponDesc: "下单买指定商品使用一口价",
          couponId: 22,
          activityId: 34,
          requestQuantity: 5
        },
        {
          couponNam: "领取5张商品2元抵价券",
          couponDesc: "购买特定商品抵扣2元",
          couponId: 23,
          activityId: 35,
          requestQuantity: 5
        },
        {
          couponNam: "领取5张下单5元抵价券",
          couponDesc: "下单抵扣5元",
          couponId: 24,
          activityId: 36,
          requestQuantity: 5
        },
        {
          couponNam: "领取5张满5件商品打8折排他优惠券",
          couponDesc: "购买指定数量的商品使用",
          couponId: 25,
          activityId: 37,
          requestQuantity: 5
        },
        {
          couponNam: "领取5张买满5件商品减30元并存券",
          couponDesc: "购买指定数量的商品使用",
          couponId: 26,
          activityId: 38,
          requestQuantity: 5
        },
        {
          couponNam: "领取5积分",
          couponDesc: "每日签到领取5积分",
          couponId: 27,
          activityId: 40,
          requestQuantity: 5
        }
      ]
    };
  },
  methods: {
    onClickBtn(id, activeId, count) {
      let MemberBo = JSON.parse(localStorage.getItem("MemberBo"));
      let userId = localStorage.getItem("isLogin");
      let memberDto = null;
      MemberBo.forEach(item => {
        if (item.userId === userId) {
          memberDto = item;
        }
      });
      delete memberDto.passWord;
      delete memberDto.phoneNumber;
      delete memberDto.expValue;

      let data = {
        couponReceiveReqDto: {
          couponId: id,
          activityId: activeId,
          userId: userId,
          requestQuantity: count,
          sceneDesc: "活动领取",
          orderDto: {},
          orderItemDto: {}
        },
        memberDto
      };
      console.log(data);
      let flg = true;
      const toast = Toast.loading({
        duration: 0,
        forbidClick: true,
        mask: true,
        message: "加载中..."
      });

      this.$axios({
        method: "post",
        url: "/couponReceive/produceCoupon",
        data: data
      }).then(res => {
        console.log(res);
        if (res.data.success === true) {
          flg = false;
        } else {
          Toast({
            duration: 1000,
            message: res.data.message
          });
        }
      });

      const timer = setInterval(() => {
        // console.log(flg1);
        if (flg) {
          toast.message = "加载中...";
        } else {
          clearInterval(timer);
          Toast.clear();
          Dialog.alert({
            message: "领券成功！"
          }).then(() => {
            // on close
          });
        }
      }, 10);
    },
    callback() {
      this.show = !this.show;
    }
  }
};
</script>


<style scoped>
.cart {
  margin-top: 46px;
  margin-bottom: 50px;
  background-color: pink;
  width: 100%;
  /* background: url(/static/20181107_02.png) no-repeat; */
}
</style>
