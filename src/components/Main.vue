<template>
  <div class="main">
    <div class="lb">
      <van-swipe :autoplay="3000">
        <van-swipe-item v-for="(image, index) in images" :key="index">
          <img class="lunbotu" v-lazy="image">
        </van-swipe-item>
      </van-swipe>
    </div>
    <!-- 商品详细 -->
    <div  v-for="(item, index) in shopList" :key="index">
      <div  v-for="( i, k ) in item.productList" :key="k" @click="toGoodsInfo(item.shopId, i.skuId) ">
      <van-panel title="" desc="" status="">
        <div class="head" slot="header">
          <div class="h-left">
            {{i.productName}}
          </div>
          <div class="h-right">
            {{item.shopName}}
          </div>
        </div>
        <div class="content">
          <img class="goodsPic" :src="i.imgUrl" alt="" />
          <div class="text">{{i.productTitle}}</div>
        </div>
        <!-- <div class="left" slot="footer">
        </div> -->
      </van-panel>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      images: [
        "/static/_1080x1800Q70s50.jpg",
        "/static/_1080x1800Q90s50.jpg",
        "/static/W7VXa.jpg"
      ],
      // 商品详情信息
      goodsList: [],
      shopList: [
        {
          shopId: "s001",
          shopName: "阿玛尼天猫店",
          productList: [
            {
              skuId: "A00001",
              productName: "ARMANI JEANS阿玛尼",
              productTitle:
                "阿玛尼2018反季羽绒服男短款简约保暖冬季外套男士秋冬简约秋冬上衣",
              actualPrice: "89.11",
              originPrice: "189.15",
              stockQuantity: 999,
              imgUrl: "/static/20181113150125_01.png",
              skuCategoryName: "男装",
              productModelNo: "L",
              productSpec: "黑色 中号"
            },
            {
              skuId: "A00002",
              productName: "保暖夹克衫男士外套",
              productTitle:
                "春秋季中老年爸爸修身男装休闲透气保暖夹克衫男士外套薄款男",
              actualPrice: "199.00",
              originPrice: "389.00",
              stockQuantity: 999,
              imgUrl: "/static/20181122100022.png",
              skuCategoryName: "男装",
              productModelNo: "M",
              productSpec: "蓝色 中号"
            }
          ]
        },
        {
          shopId: "121",
          shopName: "蒙牛旗舰店",
          productList: [
            {
              skuId: "B00001",
              productName: "蒙牛特仑苏纯牛奶",
              productTitle: "蒙牛红枣口味早餐奶250ml*16盒均衡营养 健康美味",
              actualPrice: "56.00",
              originPrice: "159.89",
              stockQuantity: 999,
              imgUrl: "/static/20181113150211_02.png",
              skuCategoryName: "食品饮料",
              productModelNo: "中",
              productSpec: "红枣味 500ml"
            }
          ]
        },
        {
          shopId: "122",
          shopName: "Anchor安佳专卖店",
          productList: [
            {
              skuId: "C00001",
              productName: "Anchor安佳奶粉",
              productTitle:
                "新西兰进口Anchor安佳成人青少年1kg*2全脂奶粉调制乳粉",
              actualPrice: "89.89",
              originPrice: "189.59",
              stockQuantity: 999,
              imgUrl: "/static/20181113150235_03.png",
              skuCategoryName: "婴儿奶粉",
              productModelNo: "1000g",
              productSpec: "1-2岁"
            }
          ]
        },
        {
          shopId: "123",
          shopName: "三只松鼠旗舰店",
          productList: [
            {
              skuId: "D00001",
              productName: "三只松鼠大礼包",
              productTitle:
                "三只松鼠 坚果大礼包1373g 每日坚果礼盒零食组合混合装7袋装",
              actualPrice: "89.69",
              originPrice: "189.69",
              stockQuantity: 999,
              imgUrl: "/static/20181113150248_04.png",
              skuCategoryName: "零食",
              productModelNo: "",
              productSpec: "坚果大礼包装"
            }
          ]
        }
      ]
    };
  },
  created() {
    this.getGoodsLocastrage();
  },
  methods: {
    getGoodsLocastrage() {
      let goodsStr = JSON.stringify(this.shopList);
      localStorage.setItem("ProductDto", goodsStr);
    },
    // 跳转到商品详情页
    toGoodsInfo(shopId, goodsId) {
      location.href = `#/goodsInfo/${shopId}/${goodsId}`;
    }
  }
};
</script>


<style scoped>
.main {
  margin-top: 46px;
  width: 100%;
  margin-bottom: 50px;
}
.lb {
  width: 100%;
  height: 142px;
}
.lunbotu {
  width: 100%;
  height: 141px;
}
.van-swipe__track {
  overflow: hidden;
}
.content {
  display: flex;
  padding: 18px 15px;
  box-sizing: border-box;
  justify-content: flex-start;
}
.content .text {
  margin-left: 10px;
  width: 50%;
  font-size: 14px;
  color: #8e8e8e;
}
.main .head {
  overflow: hidden;
  padding-top: 5px;
  height: 40px;
  background-color: #ff98001a;
  color: #333;
}
.main .head .h-left {
  float: left;
  height: 40px;
  line-height: 40px;
  padding-left: 15px;

}
.main .head .h-right {
  float: right;
   height: 40px;
  line-height: 40px;
  padding-right: 15px;
  color: #f44336
}
.main .van-panel .left {
  text-align: right;
}
.goodsPic {
  width: 50px;
  height: 50px;
}
</style>
