// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Axios from 'axios'
import store from './store'
import Qs from 'qs'

import {
  NavBar,
  Button,
  Cell,
  CellGroup,
  Icon,
  Tabbar,
  TabbarItem,
  Tab,
  Tabs,
  Card,
  Popup,
  GoodsAction,
  GoodsActionBigBtn,
  GoodsActionMiniBtn,
  swipe,
  SwipeItem,
  Lazyload,
  Panel,
  AddressList,
  Sku,
  CouponCell,
  CouponList,
  SubmitBar,
  Checkbox,
  CheckboxGroup,
  ContactCard,
  ContactList,
  ContactEdit,
  Stepper,
  RadioGroup,
  Radio,
  Loading
} from 'vant'
// 引入动画animate.css 插件
import 'animate.css/animate.css'
// import VueRouter from 'vue-router';
Vue
  .use(NavBar)
  .use(Button)
  .use(Cell)
  .use(CellGroup)
  .use(Icon)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Tab)
  .use(Tabs)
  .use(Card)
  .use(Popup)
  .use(GoodsAction)
  .use(GoodsActionBigBtn)
  .use(GoodsActionMiniBtn)
  .use(swipe)
  .use(SwipeItem)
  .use(Lazyload)
  .use(Panel)
  .use(AddressList)
  .use(Sku)
  .use(CouponCell)
  .use(CouponList)
  .use(SubmitBar)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(ContactCard)
  .use(ContactList)
  .use(ContactEdit)
  .use(Stepper)
  .use(Radio)
  .use(RadioGroup)
  .use(Loading)
Vue.config.productionTip = false
//Axios.defaults.baseURL = "http://10.19.131.80:8118"    //"http://10.19.144.124:8118" // "http://10.19.248.200:30664" //"http://10.19.144.124:8118"  // "http://localhost:8118"
Axios.defaults.baseURL = "http://localhost:8118"
Vue.prototype.$axios = Axios
Vue.prototype.qs = Qs

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: c => c(App)
})
