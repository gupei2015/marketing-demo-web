<template>
  <div class="coupone">
    <van-tabs v-model="active">
      <van-tab title="积分">
        <mycoupone></mycoupone>
      </van-tab>
      <van-tab title="优惠券">
        <mycoupone></mycoupone>
      </van-tab>
      <van-tab title="店铺券">
        <mycoupone></mycoupone>
        <div class="content">
          <h2>已领取的店铺券</h2>
          <van-card num="2" tag="优惠券" price="2.00" desc="描述信息" title="商品标题" :thumb="'/static/20181108_03.png'" origin-price="10.00">
            <div slot="footer">
              <van-button size="mini">按钮</van-button>
              <van-button size="mini">按钮</van-button>
            </div>
          </van-card>
          <van-card num="2" tag="优惠券" price="2.00" desc="描述信息" title="商品标题" :thumb="'/static/20181108_03.png'" origin-price="10.00">
            <div slot="footer">
              <van-button size="mini">按钮</van-button>
              <van-button size="mini">按钮</van-button>
            </div>
          </van-card>
          <van-card num="2" tag="优惠券" price="2.00" desc="描述信息" title="商品标题" :thumb="'/static/20181108_03.png'" origin-price="10.00">
            <div slot="footer">
              <van-button size="mini">按钮</van-button>
              <van-button size="mini">按钮</van-button>
            </div>
          </van-card>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import Mycoupone from "./mode/Mycoupone";
export default {
  data: () => ({
    active: 2
  }),
  components: {
    Mycoupone
  }
};
</script>
<style scoped>
.coupone {
  margin-top: 46px;
}
.content h2 {
  margin-top: 5px;
  margin-bottom: 0;
  font-weight: normal;
  text-align: center;
  background-color: rgb(233, 166, 166);
  color: #444;

}
</style>

