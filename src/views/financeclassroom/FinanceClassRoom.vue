<template>
    <div v-if="haveOpenid">
      <van-button type="danger" @click="clickBtn">{{openid}}{{haveOpenid}}</van-button>
      <van-tabs v-model="active">
        <van-tab title="标签 1">{{code}}</van-tab>
        <van-tab title="标签 2">内容 2</van-tab>
        <van-tab title="标签 3">内容 3</van-tab>
        <van-tab title="标签 4">内容 4</van-tab>
      </van-tabs>
    </div>
</template>

<script>
  import axios from 'axios';
  import {Button} from 'vant'
  import { Tab, Tabs } from 'vant';

  export default {
    name: "finance-class-room",
    components: {
      [Button.name]:Button,
      [Tab.name]:Tab,
      [Tabs.name]:Tabs
    },
    data(){
      return {
        haveOpenid:false,
        active: 2,
        openid:"123",
        code:"123",
      }
    },
    methods:{
      clickBtn(){
        alert(this.getUrlKey("code")+"****"+this.code);
      },
      //获取openid
      getOpenId(){
        var fromurl;
        var appid = "wx4d4e347e23a5f170";
        this.code = this.getUrlKey('code');
        if(!this.code){
          console.error(111)
          fromurl=location.href;
          var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+ appid
            + "&redirect_uri="+ encodeURIComponent(fromurl)
            + "&response_type=code"
            + "&scope=snsapi_base"
            + "&state=STATE#wechat_redirect";
          window.location.href=url;
        }else{
          console.error(222)
          axios.post('/aisino/getOpenidByCode?code='+this.code, null).then(response => {
            if(!response.data.obj){
              var newUrl = location.href;
              window.location.href = newUrl.substring(0,newUrl.indexOf("?"));
              return;
            }else{
              this.$store.commit('set_openid', response.data.obj);
              this.haveOpenid = true;
              this.openid = response.data.obj;
            }
          }).catch(function (error) {
            alert("无法获取信息，刷新后重试");
          });
        }
      },
      //获取url后面指定参数
      getUrlKey(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
      },
    },
    created(){
      let urlTemp = process.env.API_ROOT
      if(urlTemp.indexOf("localhost") == -1&&(this.$store.state.userInfo.openid == null||this.$store.state.userInfo.openid == '')){
        this.getOpenId();
      }else if(urlTemp.indexOf("localhost") != -1){
        this.$store.commit('set_openid', "666666");
        this.haveOpenid = true;
      }
    },
    activated(){
      if(this.$store.state.openid !== null||this.$store.state.openid != ''){
        this.haveOpenid = true;
      }
      let urlTemp = process.env.API_ROOT
      if(urlTemp.indexOf("localhost") == -1&&(this.$store.state.userInfo.openid == null||this.$store.state.userInfo.openid == '')){
        this.getOpenId();
      }
      if(this.haveOpenid){
        // 初始化的操作请求
      }
    }
  }

</script>

<style scoped>

</style>
