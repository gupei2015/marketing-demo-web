<template>
  <div class="goodsInfo">
    <div class="header">
      <img
        :src="checkgoods.imgUrl"
        alt=""
      >
    </div>
    <van-panel
      :title="checkgoods.productName"
      :desc="checkgoods.productTitle"
    >
      <div
        class="detail"
        slot="header"
      >
        <span v-cloak>现价：￥{{ checkgoods.actualPrice }}</span>
        <span>原价：<ins
            class="old"
            v-cloak
          >￥{{ checkgoods.originPrice }}</ins></span>
        <p>{{checkgoods.productTitle}}</p>
      </div>
      <div class="content">
        <van-cell-group>
          <van-cell
            title="优惠"
            value="领券"
            label="领券后，再凑￥10.1 可减￥3"
            is-link
          />
          <van-cell
            title="规格"
            value="内容"
            :label="checkgoods.productModelNo"
            is-link
            @click="addCart"
          />
          <van-cell
            title="服务"
            is-link
          />
          <van-cell
            title="参数"
            is-link
            @click="addCart"
          />
        </van-cell-group>
      </div>
      <div
        class="left"
        slot="footer"
      >
        <van-button
          size="small"
          @click="addCart"
        >加入购物车</van-button>
        <van-button
          size="small"
          type="danger"
          @click="checkShop"
        >立即购买</van-button>
      </div>
    </van-panel>

    <van-sku
      ref="SKU"
      v-model="showBase"
      :sku="sku"
      :goods="goods"
      :goods-id="goodsId"
      :hide-stock="sku.hide_stock"
      :quota="0"
      :quota-used="0"
      :disable-stepper-input="true"
      @buy-clicked="onBuyClicked()"
    >
      <template
        slot="sku-actions"
        slot-scope="props"
      >
        <div class="van-sku-actions">
          <van-button
            type="primary"
            bottom-action
            @click="props.skuEventBus.$emit('sku:buy')"
          >确认</van-button>
        </div>
      </template>
    </van-sku>
    <!-- 领取优惠券 -->

    <van-popup
      class="borderClass"
      v-model="show"
      position="bottom"
      :overlay="show"
    >
      <div class="success">
        <h3 @click="callback">优惠</h3>
        <div class="note">
          <p>商品售价￥4099，使用以下优惠至少可减￥30</p>
          <b>促销</b><br>
          <strong>积分:</strong>购买可得409积分<br>
          <div class="tip">
            <i>领取</i> <i>已有积分:516</i>
          </div>
        </div>
        <div class="ticket">
          <div class="left">
            ￥<b>30</b>元店铺优惠券<br>
            满3000使用<br>
            有效期：
          </div>
          <div class="right">
            <a
              href="javascript:;"
              @click="using"
            >{{use}}</a>
          </div>
        </div>
        <div class="useInfo">
          <van-icon name="checked" />
          领取后，使用该券可立减<b class="red">￥30</b>
        </div>
        <button @click.self="callback">完成</button>

      </div>
    </van-popup>

  </div>
</template>
<script>
import { Toast } from "vant";
export default {
  data: () => ({
    num: 1,
    use: "去领取",
    show: false,
    checkgoods: null,
    urlId: [
      { id: 0, url: "/static/20181113150125_01.png" },
      { id: 1, url: "/static/20181113150211_02.png" },
      { id: 2, url: "/static/20181113150235_03.png" },
      { id: 3, url: "/static/20181113150248_04.png" }
    ],
    // picUrl: { id: 1, url: "/static/20181113150211_02.png" },
    // showCustomAction: false,
    showBase: false,
    sku: {
      // 所有sku规格类目与其值的从属关系，比如商品有颜色和尺码两大类规格，颜色下面又有红色和蓝色两个规格值。
      // 可以理解为一个商品可以有多个规格类目，一个规格类目下可以有多个规格值。
      tree: [
        {
          k: "颜色", // skuKeyName：规格类目名称
          v: [
            {
              id: "1215",
              name: "蓝色",
              imgUrl: "/static/20181113150211_02.png"
            },
            {
              id: "30349",
              name: "黄色",
              imgUrl: "/static/20181113150235_03.png"
            }
          ],
          k_s: "s2",
          count: 2 // skuKeyStr：sku 组合列表（下方 list）中当前类目对应的 key 值，value 值会是从属于当前类目的一个规格值 id
        }
      ],
      // 所有 sku 的组合列表，比如红色、M 码为一个 sku 组合，红色、S 码为另一个组合
      list: [
        {
          id: 2259, // skuId，下单时后端需要
          price: 100, // 价格（单位分）
          s1: "1215", // 规格类目 k_s 为 s1 的对应规格值 id
          s2: "30349", // 规格类目 k_s 为 s2 的对应规格值 id
          s3: "0", // 最多包含3个规格值，为0表示不存在该规格
          stock_num: 110 // 当前 sku 组合对应的库存
        },
        {
          id: 2260, // skuId，下单时后端需要
          price: 200, // 价格（单位分）
          s1: "30349", // 规格类目 k_s 为 s1 的对应规格值 id
          s2: "1215", // 规格类目 k_s 为 s2 的对应规格值 id
          s3: "0", // 最多包含3个规格值，为0表示不存在该规格
          stock_num: 220 // 当前 sku 组合对应的库存
        }
      ],
      price: "1.00", // 默认价格（单位元）
      stock_num: 227, // 商品总库存
      collection_id: 2261, // 无规格商品 skuId 取 collection_id，否则取所选 sku 组合对应的 id
      none_sku: false, // 是否无规格商品

      hide_stock: false // 是否隐藏剩余库存
    },
    goods: {
      // 商品标题
      title: "测试商品",
      // 默认商品 sku 缩略图
      picture: "/static/20181113150235_03.png"
    },
    goodsId: 0,
    messageConfig: {
      // 图片上传回调，需要返回一个promise，promise正确执行的结果需要是一个图片url
      uploadImg: () => {
        return new Promise(resolve => {
          setTimeout(() => resolve("/static/20181113150125_01.png"), 1000);
        });
      },
      // 最大上传体积 (MB)
      uploadMaxSize: 3,
      // placehold配置
      placeholderMap: {
        text: "xxx",
        tel: "xxx"
      }
    },
    skuData: {
      // 商品 id
      goodsId: "946755",
      // 选择的商品数量
      selectedNum: 1,
      // 选择的 sku 组合
      selectedSkuComb: {
        id: 2257,
        price: 100,
        s1: "30349",
        s2: "1193",
        s3: "0",
        stock_num: 111
      }
    }
  }),
  created() {
    this.getParams();
  },
  methods: {
    addCart() {
      this.showBase = !this.showBase;
    },
    checkShop() {
      this.showBase = !this.showBase;
      // 切换跳转状态 2 表示跳转到立即支付页面， 1 为加入购物车
      this.num = 2;
    },
    onBuyClicked() {
      let productObj = null;
      let shopId = this.$route.params.shopId || "1";
      let shopName = "";
      let user1 = JSON.parse(localStorage.getItem("user1")) || {};
      // let cartObj = {};
      let objArr = JSON.parse(localStorage.getItem("cartList")) || [];
      let ogjMiddle = {};
      let obj = this.$refs.SKU.getSkuData();
      let { goodsId, selectedNum, selectedSkuComb } = obj;
      // 获取产品列表对象中的某一项
      let allGoodslist = JSON.parse(localStorage.getItem("ProductDto"));

      allGoodslist.forEach(i => {
        if (i.shopId == shopId) {
          productObj = i;
          shopName = i.shopName;
        }
      });
      // 找出对应项
      // 查询对应项列表productList 的SKUID
      let usergoods = productObj.productList.filter(k => {
        return k.skuId == goodsId;
      });

      usergoods[0].purchaseQuantity = selectedNum;
      usergoods[0].productSpec = selectedSkuComb;
      // 获取对应productList项 是数组
      // console.log(usergoods);

      // 判读用户ID
      let userId = JSON.parse(localStorage.getItem("isLogin")) || 0;
      if (!userId) {
        Toast({
          duration: 800,
          message: "请登录"
        });
        location.href = "#/personal/login";
        return;
      }

      if (objArr.length === 0) {
        objArr.push(usergoods[0]);
        ogjMiddle.productList = objArr;
        ogjMiddle.shopId = shopId;
        ogjMiddle.shopName = shopName;
        if (!user1.cartList) {
          //  user1用户列表无
          user1.cartList = [];
          user1.cartList.push(ogjMiddle);
          user1.userId = userId;
        } else if (user1.cartList.length != 0) {
          //user1用户列表有
          // 判断cartList 中是否有选择项
          for (var j = 0; j < user1.cartList.length; j++) {
            var flag = true;
            if (user1.cartList[j].shopId == shopId) {
              for (var m = 0; m < user1.cartList[j].productList.length; m++) {
                if (user1.cartList[j].productList[m].skuId == obj.goodsId) {
                  user1.cartList[j].productList[
                    m
                  ].purchaseQuantity += selectedNum;
                  flag = false;
                }
              }
              if (flag) {
                user1.cartList[j].productList.push(objArr);
              }
            } else {
              user1.cartList.push(ogjMiddle);
            }
          }
        }
      } else {
        let f = objArr.some(i => {
          return i.skuId == obj.goodsId;
        });
        if (f) {
          objArr.forEach(item => {
            if (item.skuId == obj.goodsId) {
              item.purchaseQuantity += obj.selectedNum;
            }
          });
        } else {
          objArr.push(usergoods[0]);
        }

        // 给用户购物车添加选中项
        if (!user1.cartList) {
          ogjMiddle.productList = objArr;
          ogjMiddle.shopId = shopId;
          ogjMiddle.shopName = shopName;
          user1.cartList = [];
          user1.cartList.push(ogjMiddle);
          user1.userId = userId;
        } else if (user1.cartList.length != 0) {
          var flag1 = true;
          for (var j = 0; j < user1.cartList.length; j++) {
            if (user1.cartList[j].shopId == shopId) {
              flag1 = false;
              var flag = true;
              for (var m = 0; m < user1.cartList[j].productList.length; m++) {
                if (user1.cartList[j].productList[m].skuId == obj.goodsId) {
                  user1.cartList[j].productList[
                    m
                  ].purchaseQuantity += selectedNum;
                  flag = false;
                }
              }
              if (flag) {
                user1.cartList[j].productList.push(usergoods[0]);
              }
            }
          }

          if (flag1) {
            ogjMiddle.productList = usergoods;
            ogjMiddle.shopId = shopId;
            ogjMiddle.shopName = shopName;
            user1.cartList.push(ogjMiddle);
          }
          // user1.cartList.push(ogjMiddle);
          user1.userId = userId;
        }
        // cart.push(cartObj);
      }
      // 储存 购物车订单
      localStorage.setItem("cartList", JSON.stringify(objArr));
      localStorage.setItem("user1", JSON.stringify(user1));

      // 判断添加购物车还是立即购买
      if (this.num === 1) {
        this.showBase = !this.showBase;
      } else if (this.num === 2) {
        // 拿到用户购物列表
        let ol = [];
        ol.push(usergoods[0]);
        ogjMiddle.productList = ol;
        ogjMiddle.shopId = shopId;
        ogjMiddle.shopName = shopName;

        //  创建用户购物对象单项列表
        let alone = [];
        alone.push(ogjMiddle);
        console.log(alone);

        // 创建OrderDto 订单对象
        let count = [];
        count.length = alone.length;

        let tprice = 0
        if(alone.length){
          for (var i = 0; i < alone.length; i++) {
            let { productList: arr } = alone[i];
            count[i] = arr.reduce((t, i) => {
              return t + i.actualPrice * i.purchaseQuantity;
            }, 0);
          }
          tprice =
            count.reduce((t0, i0) => {
              return t0 + i0;
            }) 
          tprice = tprice.toFixed(2) - 0
        }

        

        let OrderDto = {
          orderId: Math.random()
            .toString()
            .substr(3, 2),
          orderNo: parseInt(Math.random() * 10000) + new Date().valueOf() + "",
          originOrderAmount: tprice,
          totalOrderAmount: tprice,
          payOrderAmount: tprice,
          orderDate: new Date(),
          revserveTime: new Date() + 7,
          orderItemList: [],
          useCoupons: []
        }
        console.log(OrderDto)
        localStorage.setItem('OrderDto', JSON.stringify(OrderDto))

        this.showBase = !this.showBase;
        this.$router.push({
          path: "/personal/accountant",
          query: {
            totalMarks: JSON.stringify(alone),
            totalPrice: parseInt(
              usergoods[0].actualPrice * usergoods[0].purchaseQuantity 
            )
          }
        });
      }
    },
    onAddCartClicked() {
      Toast("加入购物车");
    },

    callback() {
      this.show = false;
      this.flag = true;
    },

    //获取路由传过来的参数
    getParams() {
      let shopId = this.$route.params.shopId || 1;
      let goodsId = this.$route.params.goodsId || 1;
      // console.log(shopId + "-------" + goodsId);
      let gInfo = JSON.parse(localStorage.getItem("ProductDto"));
      for (var k in gInfo) {
        if (shopId == gInfo[k].shopId) {
          for (var i = 0; i < gInfo[k].productList.length; i++) {
            if (goodsId == gInfo[k].productList[i].skuId) {
              this.checkgoods = gInfo[k].productList[i];
            }
          }

          // console.log(this.checkgoods);
          this.goodsId = this.checkgoods.skuId;
          this.goods.title = this.checkgoods.productName;
          this.goods.picture = this.checkgoods.imgUrl;
          this.sku.price = this.checkgoods.actualPrice;
          this.sku.list.forEach(i => {
            i.price = this.checkgoods.actualPrice * 100;
          });
          return;
        }
      }
    },

    using() {
      this.use = "已领取";
      Toast("你已成功领取优惠券");
    }
  }
};
</script>

<style scoped>
.goodsInfo {
  margin-top: 46px;
  margin-bottom: 50px;
  width: 100%;
  /* height: 621px; */
  font-size: 14px;
  /* background-color: pink; */
}
.header {
  width: 100%;
  height: 250px;
}
.header img {
  width: 100%;
  height: 100%;
}
.detail {
  font-size: 12px;
}
.detail span {
  margin: 0 10px;
  font-size: 14px;
}
.detail p {
  margin-block-start: 0.5em;
  margin-block-end: 0.5em;
  padding: 5px 10px;
  color: #696969;
}
.content {
  padding: 10px 0;
  box-sizing: border-box;
}
.goodsInfo .van-panel .left {
  text-align: right;
}
span ins {
  text-decoration: line-through;
}

.van-goods-action {
  /* position: fixed; */
  z-index: 10;
}

/* 领取优惠券样式 */

.borderClass {
  width: 100%;
  height: 70%;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}
.success {
  position: fixed;
  left: 0;
  bottom: 0;
  padding: 10px;
  width: 100%;
  height: 100%;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  background-color: #fff;
  color: #333;
  font-size: 14px;
  box-sizing: border-box;
}
.success h3 {
  text-align: center;
}
.success .tip {
  padding: 8px 0;
  display: flex;
  justify-content: space-between;
}
.success .tip i {
  flex: 1;
  font-style: normal;
  color: #999;
}
.success .ticket {
  display: flex;
  justify-content: space-between;
}
.success .ticket div {
  height: 100px;
  background-color: rgb(245, 200, 200);
  border: 1px solid rgb(248, 177, 177);
  border-radius: 5px;
  color: rgb(247, 94, 94);
  box-sizing: border-box;
}
.success .ticket .left {
  padding: 10px 5px;
  width: 80%;
}
.success .ticket .right {
  width: 20%;
  padding: 10px 5px;
}
.success .ticket .right a {
  padding: 25px 0;
  display: inline-block;
  color: rgb(247, 94, 94);
}
.success .ticket .left b {
  font-size: 30px;
}
.useInfo {
  margin-top: 8px;
  padding-left: 4px;
  border-radius: 15px;
  background-color: rgb(236, 236, 236);
}
.useInfo .van-icon-checked {
  color: rgb(102, 151, 28);
}
.useInfo .red {
  color: red;
}
.success button {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50px;
  border: none;
  color: rgb(255, 253, 253);
  background-color: rgb(168, 9, 9);
}
</style>


