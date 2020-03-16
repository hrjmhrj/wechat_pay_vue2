<template>
  <!--下拉刷新组件-->
  <van-pull-refresh v-model="refreshIsLoading" @refresh="onRefresh">
    <div style="padding:1vh 2vw;min-height: 100vh;width: 96vw;" class="my-info-div">
      <!--列表组件-->
      <van-list v-model="listLoading" :finished="listFinished" finished-text="没有更多了" @load="onLoadList">
        <van-grid :column-num="2" gutter="3vw" :border="false">
          <van-grid-item v-for="(item,index) in listData" :key="index" @click="clickItem(item.VIDEOID)">
            <!--骨屏架组件-->
            <van-skeleton :row="4" :loading="skeletonLoading" row-width="50%">
              <div>
                <van-image width="43.5vw" height="28vw"  lazy-load radius="10" fit="fill" :src="'http://hyfwzx.schtxxcdfgs.com:9004/hyfwzxht/springboot/'+item.VIDEOCOVER" style="border: 1px solid #f3f3f3;box-sizing: border-box">
                </van-image>
              </div>
              <div>
                <span class="text-overflow text-overflow-title">
                  {{item.VIDEONAME}}
                </span>
                <span class="text-overflow text-overflow-body">
                  {{item.VIDEOMS}}
                </span>
              </div>
            </van-skeleton>
          </van-grid-item>
        </van-grid>
      </van-list>
    </div>
  </van-pull-refresh>
</template>
<script>
  import axios from 'axios';
  import { Skeleton,PullRefresh,List,Grid,GridItem,Image,Loading,Notify } from 'vant';
  export default {
    name: "purchase-history",
    components:{
      [Notify.name]:Notify,
      [Loading.name]:Loading,
      [Image.name]:Image,
      [Grid .name]:Grid, //
      [GridItem .name]:GridItem, //
      [List .name]:List, //列表
      [Skeleton.name]:Skeleton, //骨屏架
      [PullRefresh.name]:PullRefresh //下拉刷新
    },
    data(){
      return{
        skeletonLoading:true, //骨屏架加载标志
        refreshIsLoading:false, //下拉刷新加载标志
        listFinished: false, //数据全部加载完毕
        listLoading: false, //列表加载标志
        listData: [], //列表数据
        requestData:{
          limit:10, //条数
          page:0, // 页数
          OPENID:this.$store.state.userInfo.openid
        }, //请求发送的数据
      }
    },
    methods:{
      onLoadList() {
        this.listLoading = true;
        this.requestData.page++;
        this.requestAxios("/aisino/getPurchaseHistory",this.requestData,this.onLoadSuccessFn,this.onLoadErrorFn);
      },// 加载列表数据
      onLoadSuccessFn(responseData){
        if(responseData.success){
          if(responseData.obj[1].length>0){
            this.listData = this.listData.concat(responseData.obj[1])
          }
          responseData.obj[0] == this.listData.length ? this.listFinished = true : null;
        }else{
          this.listFinished = true;
          this.notifyStr("danger",responseData.msg);
        }
        this.listLoading = false;
        this.skeletonLoading = false;
        this.refreshIsLoading = false;
      },
      onLoadErrorFn(){
        this.listLoading = false;
        this.listFinished = true;
        this.skeletonLoading = false;
        this.refreshIsLoading = false;
        this.notifyStr("danger","获取购买历史失败");
      },
      requestAxios(url,data,successFn,errorFn){
        axios.post(url, data).then(response => {
          successFn(response.data);
        }).catch(error => {
          errorFn();
        });
      },//请求后台 (路由，数据，成功的执行函数，失败的执行函数)
      clickItem(VIDEOID){
        this.$router.push({
          path: `/VideoPlay/${VIDEOID}/goMinusOne`,
        })
      },//点击
      onRefresh() {
        // 清空列表数据
        this.listData = [];
        this.requestData.page = 0;
        this.listFinished = false;
        // 重新加载数据
        // 将 refreshIsLoading 设置为 true，表示处于加载状态
        this.refreshIsLoading = true;
        this.onLoadList();
      }, // 下拉刷新
      notifyStr(type,msg){
        Notify({ type: type, message: msg });
      },//弹出提示
    },
    created(){

    }
  }



</script>
<style scoped>
  /*超出范围变省略号*/
  .text-overflow {
    text-align: left;
    display:block;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .text-overflow-title {
    width: 43.5vw;
    font-size: 13px;
    line-height: 13px;
    height: 13px;
    -webkit-line-clamp: 1;
    margin: 3px 0 3px 0;
  }
  .text-overflow-body {
    width: 43.5vw;
    font-size: 11px;
    line-height: 11px;
    height: 11px;
    color:#8a8a8a;
    overflow : hidden ;
    text-overflow : ellipsis ;
    white-space : nowrap ;
  }
</style>
<style>
  .my-info-div .van-grid-item__content{
    padding: 0 0 !important;
  }
</style>
