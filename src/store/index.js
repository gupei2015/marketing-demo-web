import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    flag: false,
    gcshow: false,
    getcount: false,
    getPriceCut: true,
    now: false,
    rend: false,
    first: true,
    orderFlag: false,
    userName: "",
    userCode: "",
    isLogin: ''
  },
  getters: {
    // change(state) {
    //   state.flag = !state.flag
    // }
  },
  mutations: {
    
  },
  actions: {
    
  }
}) 