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
    <van-tabs v-model="active" animated :offset-top=topBarHeight sticky color="#1989fa" title-active-color="#1989fa">
      <van-tab title="购买历史">
        <div class="van-tab-div">
          <purchase-history/>
        </div>
      </van-tab>
      <van-tab title="未开发票">
        <div>
          2
        </div>
      </van-tab>
      <van-tab title="已开发票">
        <div>
          3
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
  import purchaseHistory from '../../components/MyInfo/PurchaseHistory'
  import { NavBar,Tab,Tabs,Sticky } from 'vant';
  export default {
    name: "my-info",
    components:{
      purchaseHistory,
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

    },
    mounted(){
      this.topBarHeight = document.getElementById('con').offsetHeight;
    }
  }
</script>

<style scoped>
  .my-info-div .van-tab-div{
    min-height: 100vh;
    background: #fdfdfd;
  }
</style>
