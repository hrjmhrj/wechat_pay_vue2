<template>
  <div class="my-info-div">
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
      }
    },
    methods:{
      //点击头部返回
      onClickBarLeft(){
        this.$router.go(-1);
      },
    },
    created(){
      this.$store.commit('set_openid', "olA3Y1bL5BRPMv7K10hsGQQWP0Hc");
    },
    mounted(){
      console.log(JSON.stringify(this.$store.state.userInfo))
      this.topBarHeight = document.getElementById('con').offsetHeight;
    }
  }
</script>

<style scoped>
  .van-tab-padding{
    padding:0 0 50px 0;
  }
</style>
