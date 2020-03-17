<template>
    <div v-if="haveOpenid">
      <van-button type="danger" @click="clickBtn">{{openid}}</van-button>
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
        openid:"123"
      }
    },
    methods:{
      clickBtn(){
        alert(123)
      },
      //获取openid
      getOpenId(){
        var fromurl;
        var appid = "wx4d4e347e23a5f170";
        this.code = this.getUrlKey('code');
        if(!this.code){
          fromurl=location.href;
          var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+ appid
            + "&redirect_uri="+ encodeURIComponent(fromurl)
            + "&response_type=code"
            + "&scope=snsapi_base"
            + "&state=STATE#wechat_redirect";
          location.href=url;
        }else{
          axios.post('/aisino/getOpenidByCode?code='+this.code, null).then(response => {
            console.log(response.data)
            if(!response.data.obj){
              console.log(2222)
              var newUrl = location.href;
              location.href = newUrl.substring(0,newUrl.indexOf("?"));
              return;
            }else{
              console.log(33333)
              this.$store.commit('set_openid', response.data.obj);
              this.haveOpenid = true;
              this.openid = response.data.obj;
              //只有成功后才能显示页面
            }
          }).catch(function (error) {
            console.log(4444)
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
        console.log(1111)
      }
      if(this.haveOpenid){
        // 初始化的操作请求
      }
    },
    mounted(){
      if(this.$store.state.openid !== null||this.$store.state.openid != ''){
        this.haveOpenid = true;
      }
    },
  }

</script>

<style scoped>

</style>
