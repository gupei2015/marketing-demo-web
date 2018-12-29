<template>
  <div class="shop">
    <van-popup v-model="show">
      <div class="tick">
        <div class="info">
          <span class="big">你已累计参与抽奖1天</span><br>
          <span class="small">再冲刺2天，可冲刺白银礼包</span>
        </div>
        <div class="share">
          <div class="left">
            立即分享活动给好友<br>
            邀好友分十亿奖池
          </div>
          <div class="right" @click="toShare">分享</div>
        </div>
      </div>
      <van-icon name="close" @click="show= !show"></van-icon>
    </van-popup>
    <img src="/static/_1080x1800Q90s58.jpg" alt="">

    <van-panel title="标题" desc="描述信息" status="状态">
      <div class="content">内容</div>
      <div class="left" slot="footer">
        <van-button size="small">加入购物车</van-button>
        <van-button size="small" type="danger">立即购买</van-button>
      </div>
    </van-panel>
    <van-panel title="标题" desc="描述信息" status="状态">
      <div class="content">内容</div>
      <div class="left" slot="footer">
        <van-button size="small">加入购物车</van-button>
        <van-button size="small" type="danger">立即购买</van-button>
      </div>
    </van-panel>
    <van-panel title="标题" desc="描述信息" status="状态">
      <div class="content">内容</div>
      <div class="left" slot="footer">
        <van-button size="small">加入购物车</van-button>
        <van-button size="small" type="danger">立即购买</van-button>
      </div>
    </van-panel>
    <van-panel title="标题" desc="描述信息" status="状态">
      <div class="content">内容</div>
      <div class="left" slot="footer">
        <van-button size="small">加入购物车</van-button>
        <van-button size="small" type="danger">立即购买</van-button>
      </div>
    </van-panel>
  </div>

</template>

<script>
import { Toast } from 'vant'
export default {
  data() {
    return {
      show: false
    };
  },
  created() {
    this.showPopup();
  },
  methods: {
    showPopup() {
      setTimeout(() => {
        this.show = !this.show;
      }, 1000);
    },
    toShare() {
      Toast('分享到朋友圈')
    }
  }
};
</script>


<style scoped>
.shop {
  margin-top: 46px;
  width: 100%;
}
.shop img {
  width: 100%;
}
.content {
  padding: 10px 15px;
  box-sizing: border-box;
}
.shop .van-panel .left {
  text-align: right;
}
.van-popup {
  border-radius: 20px;
}
.tick {
  border-radius: 10px;
  background-color: rgb(184, 102, 204);
  color: #fff;
}
.tick .info {
  padding-top: 55px;
  width: 300px;
  height: 250px;
  line-height: 30px;
  text-align: center;
  box-sizing: border-box;
}
.tick .info .big {
  font-size: 22px;
}
.tick .info .small {
  font-size: 14px;
}
.tick .share {
  position: absolute;
  left: 50%;
  bottom: 20px;
  transform: translateX(-50%);
  padding: 5px 8px;
  width: 200px;
  height: 30px;
  font-size: 14px;
  border-radius: 25px;
  background-color: rgb(247, 20, 228);
}
.tick .share .left {
  float: left;
  height: 100%;
  line-height: 15px;
}
.tick .share .right {
  float: right;
  padding: 0 20px;
  height: 100%;
  line-height: 30px;
  font-weight: 700;
  background-color: red;
  border-radius: 20px;
}
.van-icon-close {
  position: absolute;
  right: -10px;
  top : 5px;
  transform: translateX(-50%);
  color: #fff;
  font-size: 30px;
}
</style>
