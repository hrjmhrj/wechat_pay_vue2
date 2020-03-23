<template>
  <div class="my-info-div" v-if="userInfo.openid != null && userInfo.openid != '' && userInfo.openid != 'null'">
    <!--头部-->
    <van-sticky :offset-top="0">
      <van-nav-bar
        id="con"
        title="我的信息"
        left-text="返回"
        left-arrow
        @click-left="onClickBarLeft"
      />
    </van-sticky>
    <van-tabs v-model="active" :offset-top=topBarHeight sticky color="#1989fa" title-active-color="#1989fa">
      <van-tab title="购买历史">
        <div class="van-tab-div">
          <purchase-history/>
        </div>
      </van-tab>
      <van-tab title="未开发票" name="dk">
        <div class="van-tab-padding">
          <WkFp/>
        </div>
      </van-tab>
      <van-tab title="已开发票">
        <div class="van-tab-div">
          <YkFp/>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import axios from 'axios'
  import purchaseHistory from '../../components/MyInfo/PurchaseHistory'
  import WkFp from '../../components/MyInfo/WkFp'
  import YkFp from '../../components/MyInfo/YkFp'
  import { NavBar,Tab,Tabs,Sticky,SubmitBar  } from 'vant';
  export default {
    name: "my-info",
    components:{
      YkFp,
      WkFp,
      purchaseHistory,
      [SubmitBar.name]:SubmitBar,
      [NavBar.name]:NavBar,
      [Tab.name]:Tab,
      [Tabs.name]:Tabs,
      [Sticky.name]:Sticky
    },
    data(){
      return{
        active:0,
        topBarHeight:46,
        isLoading:false,
        code:"",

      }
    },
    methods:{
      //点击头部返回
      onClickBarLeft(){
        let url = "http://hyfwzx.schtxxcdfgs.com/vueproject/nbxm_hyfwzx_vue_zs/index.html#/";
        window.location.href=url;
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
          window.location.href=url;
        }else{
          axios.post('/aisino/getOpenidByCode?code='+this.code, null).then(response => {
            if(!response.data.obj){
              var newUrl = location.href;
              window.location.href = newUrl.substring(0,newUrl.indexOf("?"));
              return;
            }else{
              this.$store.commit('set_openid', response.data.obj);

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
    created() {
      let urlTemp = process.env.API_ROOT
      if(urlTemp.indexOf("localhost") == -1&&(this.$store.state.userInfo.openid == null||this.$store.state.userInfo.openid == '' || this.$store.state.userInfo.openid == 'null')){
        this.getOpenId();
      }else if(urlTemp.indexOf("localhost") != -1){
        this.$store.commit('set_openid', "olA3Y1bL5BRPMv7K10hsGQQWP0Hc");
      }
    },
    mounted(){
      if(this.$store.state.openid !== null && this.$store.state.openid != '' && this.$store.state.openid !== 'null'){
        this.topBarHeight = document.getElementById('con').offsetHeight;
      }
    },
    computed: {
      ...mapState(['userInfo'])
    },
  }
</script>

<style scoped>
  .van-tab-padding{
    padding:0 0 60px 0;
  }
</style>
