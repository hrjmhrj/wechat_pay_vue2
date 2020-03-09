import Vue from 'vue';
import Vuex from 'vuex';
// 引入JSON配置文件
import configJson from '../../static/json/configJson';

Vue.use(Vuex);

/**
 * 定义数据格式
 */
const state = {
  userInfo: {
    openid:"123456",
    token:""
  },
};

/**
 * 设置
 */
const mutations = {
  /**
   * 设置全局用户openid
   * @param state
   * @param openid
   */
  set_openid(state, openid) {
    state.userInfo.openid = openid
    sessionStorage.setItem("openid", openid);
  },
  /**
   * 设置全局用户token
   * @param state
   * @param token
   */
  set_token(state, token) {
    state.userInfo.token = token
    sessionStorage.setItem(configJson.tokenName, token);
  }
};

/**
 * 获取
 */
const getters = {
  getInfo: state => {
    return state.userInfo;
  }
};

const actions = {
};

const store = new Vuex.Store({
  state,
  mutations,
  getters,
  actions,
  modules: {}
});
export default store;
