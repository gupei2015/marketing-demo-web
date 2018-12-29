<template>
  <div class="myCoupone">
     
       <span class="t1">你总共有110张优惠券</span><br>
       <strong class="t2">￥5898</strong><br>
       <span class="t3">店铺优惠券可在店内使用</span>
    
  </div>
</template>
<script>
export default {
  data: () => ({

  })
}
</script>
 
 <style scoped>
  .myCoupone {
    padding: 30px 0;
    text-align: center;
    width: 100%;
    background-color: red;
    color: #fff;
  }
  .myCoupone .t1 {
    font-weight: 700; 
  } 
  .myCoupone .t2 {
    font-size: 30px; 
  } 
  .myCoupone .t3 {
    font-size: 12px; 
  }
 </style>
 
