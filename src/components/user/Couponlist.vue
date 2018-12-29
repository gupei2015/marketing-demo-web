<template>
  <div class="coupoList">

    <h3>优惠券列表</h3>

    <div
      class="ticket"
      v-for="(item, index) in couponList"
      :key="index"
    >
      <div class="left">
        <span>
        有效期：{{item.createAt}}--{{item.endDate}}
        </span>
      </div>
      <div class="right">
        <a href="javascript:;">{{item.remark}}</a>
      </div>
    </div>
    <button @click.self="callback">返回</button>

  </div>
</template>
<script>
export default {
  data: () => ({
    couponList: []
  }),
  created(){
    console.log(this.$route.query.data)
    this.couponList = JSON.parse(this.$route.query.data)
    console.log(this.couponList)
  },
  methods: {
    callback(){
      this.$router.go(-1)
    }
  }

};
</script>
<style lang="less" >
.coupoList {
  margin-top: 50px;
  width: 100%;
  z-index: 999;
  padding: 0 10px;
  padding-bottom: 150px;
    background-color: #fff;
    color: #333;
    font-size: 14px;
    box-sizing: border-box;

 h3 {
  text-align: center;
}
.tip {
  padding: 8px 0;
  display: flex;
  justify-content: space-between;
}
.tip i {
  flex: 1;
  font-style: normal;
  color: #999;
}
.ticket {
  display: flex;
  margin: 10px 0;
  justify-content: space-between;
}
.ticket div {
  
  background-color: rgb(245, 200, 200);
  border: 1px solid rgb(248, 177, 177);
  border-radius: 5px;
  color: rgb(247, 94, 94);
  box-sizing: border-box;
}
.ticket .left {
  padding: 10px 5px;
  width: 70%;
}
.ticket .left span {
  display: inline-block;
  height: 100%;
  line-height: 68px;
}
.ticket .right {
  width: 30%;
  padding: 10px 5px;
}
.ticket .right a {
  padding: 25px 0;
  display: inline-block;
  color: rgb(247, 94, 94);
}
.ticket .left b {
  font-size: 30px;
}
button {
  margin: 10px 0;
  width: 100%;
  height: 40px;
  border: none;
  border-radius: 10px;
  background-color: rgb(87, 133, 202);
  color: #fff;
}
}
</style>

