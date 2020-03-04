<template>
    <div>
      {{openid}}
    </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: "finance-class-room",
    data(){
      return {
        openid:"123"
      }
    },
    methods:{
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
          axios.post(`/aisino/getOpenidByCode?code=`+this.code, null).then(response => {
            if(!response.data.obj){
              var newUrl = location.href;
              location.href = newUrl.substring(0,newUrl.indexOf("?"));
              return;
            }else{
              this.$store.commit('set_openid', response.data.obj);
            }
          });
        }
      },
      //获取url后面指定参数
      getUrlKey(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
      },

    },
    mounted(){
      //this.getOpenId()
    }
  }
</script>

<style scoped>

</style>
