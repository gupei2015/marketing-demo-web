import Vue from 'vue'
import Router from 'vue-router'
import Main from '../components/Main'
import Shop from '../components/Shop'
import Goods from '../components/Cart'
import Personal from '../components/Personal'
import Register from '../components/user/Register'
import Login from '../components/user/Login'
import Coupone from '../components/coupone/Coupone'
import cartInfo from '../components/cart/CartInfo'
import GoodsInfo from '../components/goods/GoodsInfo'
import Accountant from '../components/user/Accountant'
import Goodscoupone from '../components/coupone/GoodsCoupone'
import Shopcoupone from '../components/coupone/ShopCoupone'
import Couponlist from '../components/user/Couponlist'
import Myorder from '../components/user/Myorder'



Vue.use(Router)

export default new Router({
  routes: [{
      'path': '/',
      redirect: '/main'
    },
    {
      'path': '/shop',
      component: Shop
    },
    {
      'path': '/main',
      component: Main
    },
    {
      'path': '/goods',
      component: Goods
    },
    {
      name: "Goodscoupone",
      'path': '/cart/goodscoupone',
      component: Goodscoupone
    },
    {
      'path': '/cart/shopcoupone',
      component: Shopcoupone
    },
    {
      'path': '/personal',
      component: Personal
    },
    {
      'path': '/personal/register',
      component: Register
    },
    {
      'path': '/personal/login',
      component: Login
    },
    {
      'path': '/personal/coupone',
      component: Coupone
    },
    {
      'path': '/cart',
      component: cartInfo

    },
    {
      'path': '/goodsInfo/:shopId/:goodsId',
      component: GoodsInfo
    }, 
    {
      'path': '/personal/accountant',
      component: Accountant
    },
    {
      'path': '/personal/couponList',
      component: Couponlist
    },
     {
      'path': '/personal/myorder',
      component: Myorder
    },
    
  ]
})
