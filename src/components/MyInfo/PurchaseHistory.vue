<template>
  <!--下拉刷新组件-->
  <van-pull-refresh v-model="refreshIsLoading" @refresh="onRefresh">
    <div style="padding:1vh 2vw;min-height: 100vh;width: 96vw;" class="my-info-div">
      <!--列表组件-->
      <van-list v-model="listLoading" :finished="listFinished" finished-text="没有更多了" @load="onLoadList">
        <van-grid :column-num="2" gutter="2vw" :border="false">
          <van-grid-item v-for="(item,index) in listData" :key="index" @click="clickItem(item.VIDEOID)">
            <!--骨屏架组件-->
            <van-skeleton :row="4" :loading="skeletonLoading" row-width="50%">
              <div>
                <van-image width="45vw" lazy-load radius="10" fit="contain" :src="'http://hyfwzx.schtxxcdfgs.com:9004/hyfwzxht/springboot/'+item.VIDEOCOVER">
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
        listData: [
          {
            VIDEOID:"19601a0c5f10c42679ff173f5ccc5583b", //产品ID
            VIDEONAME:"2019年9月底，四川税务上线了发票综合服务平台2.0，可以通过云平台的查询平台登录，这次升级后，部分ie浏览器版本低的客户登录会报错。本视频讲解处理方法，视频中用到的网址：https://support.microsoft.com/zh-cn/help/17621/internet-explorer-downloads", //产品名称
            FILENAME:"http://hyfwzx.schtxxcdfgs.com:9004/hyfwzxht/springboot/af1a78f0-7099-44d0-8072-752bd97a6aac-20191029143658.mp4",// 视频路径名称
            VIDEOMS:"2019年9月底，四川税务上线了发票综合服务平台2.0，可以通过云平台的查询平台登录，",//产品介绍
            VIDEOCOVER:"aa62e941-5c01-4714-815c-543d6238a75d-20191029143704.jpg",//产品封面
            COST:"100",//费用
            TYPE:"video"//视频，产品标识 video/ps
          },
          {
            VIDEOID:"2awdd0c5f10c42679ff173f5ccc5583b", //产品ID
            VIDEONAME:"24小时在线咨询服务", //产品名称
            FILENAME:"",// 视频路径名称
            VIDEOMS:"总部最新录制的销方增值税专用发票红字信息表开具示例指导",//产品介绍
            VIDEOCOVER:"aa62e941-5c01-4714-815c-543d6238a75d-20191029143704.jpg",//产品封面
            COST:"200",//费用
            TYPE:"ps"//视频，产品标识 video/ps
          },
          {
            VIDEOID:"39601a0c5f10c42679ff173f5ccc5583b", //产品ID
            VIDEONAME:"2019年9月底，四川税务上线了发票综合服务平台2.0，可以通过云平台的查询平台登录，这次升级后，部分ie浏览器版本低的客户登录会报错。本视频讲解处理方法，视频中用到的网址：https://support.microsoft.com/zh-cn/help/17621/internet-explorer-downloads", //产品名称
            FILENAME:"http://hyfwzx.schtxxcdfgs.com:9004/hyfwzxht/springboot/af1a78f0-7099-44d0-8072-752bd97a6aac-20191029143658.mp4",// 视频路径名称
            VIDEOMS:"2019年9月底，四川税务上线了发票综合服务平台2.0，可以通过云平台的查询平台登录，这次升级后，部分ie浏览器版本低的客户登录会报错。本视频讲解处理方法，视频中用到的网址：https://support.microsoft.com/zh-cn/help/17621/internet-explorer-downloads",//产品介绍
            VIDEOCOVER:"aa62e941-5c01-4714-815c-543d6238a75d-20191029143704.jpg",//产品封面
            COST:"100",//费用
            TYPE:"video"//视频，产品标识 video/ps
          },
          {
            VIDEOID:"4awdd0c5f10c42679ff173f5ccc5583b", //产品ID
            VIDEONAME:"24小时在线咨询服务", //产品名称
            FILENAME:"",// 视频路径名称
            VIDEOMS:"总部最新录制的销方增值税专用发票红字信息表开具示例指导",//产品介绍
            VIDEOCOVER:"aa62e941-5c01-4714-815c-543d6238a75d-20191029143704.jpg",//产品封面
            COST:"200",//费用
            TYPE:"ps"//视频，产品标识 video/ps
          }
        ], //列表数据
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
        this.requestAxios("/aisino/getPurchaseHistory",this.requestData,this.onLoadSuccessFn,this.onLoadErrorFn());
      },// 加载列表数据
      onLoadSuccessFn(responseData){
        if(responseData.success){
          this.notifyStr("danger",responseData.msg);
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
        this.skeletonLoading = true;
        this.refreshIsLoading = false;
      },
      requestAxios(url,data,successFn,errorFn){
        axios.post(url, data).then(response => {
          successFn(response.data);
        },error => {
          errorFn();
        });
      },//请求后台 (路由，数据，成功的执行函数，失败的执行函数)
      clickItem(VIDEOID){

      },//点击
      //下拉刷新
      onRefresh() {
        // 清空列表数据
        this.listData = [];
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
    width: 45vw;
    font-size: 13px;
    line-height: 13px;
    height: 26px;
    -webkit-line-clamp: 2;
    margin-bottom: 7px;
  }
  .text-overflow-body {
    width: 45vw;
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
