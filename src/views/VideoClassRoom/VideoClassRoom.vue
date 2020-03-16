<template>
    <!--下拉刷新组件-->
    <van-pull-refresh v-model="refreshIsLoading" @refresh="onRefresh">
      <div style="padding:1vh 2vw;min-height: 100vh;width: 96vw;" class="my-info-div">
        <!--列表组件-->
        <van-list v-model="listLoading" :finished="listFinished" finished-text="没有更多了" @load="onLoadList">
          <van-grid :column-num="2" gutter="3vw" :border="false">
            <van-grid-item v-for="(item,index) in VIDEOLIST" :key="index" @click="videobf(item.VIDEOID)">
              <!--骨屏架组件-->
              <van-skeleton :row="4" :loading="skeletonLoading" row-width="50%">
                <div>
                  <div style="position: absolute;z-index: 8;margin:2% 4%;">
                    <van-tag round type="danger" v-show="item.IS_FREE == 'Y'">免费</van-tag>
                    <van-tag round type="warning" v-show="item.IS_FREE != 'Y'">付费</van-tag>
                  </div>
                  <van-image width="43.5vw" height="28vw"  lazy-load radius="10" fit="fill" :src="item.VIDEOCOVER" style="border: 1px solid #f3f3f3;box-sizing: border-box">
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
        <!--用户浮标-->
        <div style="position: fixed;z-index: 8;top: 77%;right: 3%;" @click="userinfo">
          <van-icon name='static/images/usertb.png' color="#1989fa" size="3rem"/>
        </div>
      </div>
    </van-pull-refresh>
</template>

<script>

  import {Notify,Popup,Grid,GridItem,Toast,Tag,Image,Icon,Button,SubmitBar,Loading,List,Skeleton,PullRefresh} from 'vant';
  import axios from 'axios'
  import Bus from "../../components/utils/bus";
  import {videoPlayer} from 'vue-video-player'
  import 'video.js/dist/video-js.css'


  export default {
    name: "VideoClassRoom",
    data() {
      return {
        VIDEOLIST: [],//相关的全部数据
        VIDEOID: '',//ID
        VIDEONAME: '',//名称
        FILENAME: '',//保存在服务器的视的名称    处理后的动态路径
        VIDEOMS: '',//简介
        VIDEOCOVER: '',//封面图名     处理后的动态路径
        VIPID: '',//等级限制
        VIDEOORDER: '',//排序字段
        USERID: '',//操作人
        UPDATETIME: '',//修改时间
        CREATETIME: '',//创建时间
        IS_FREE: '',//是否免费（是为Y）
        COST: '',//费用
        TYPE: '',//视频：video；产品服务（productService）：ps
        ONLINE: '',//是否在线：是Y；否N

        skeletonLoading:true, //骨屏架加载标志
        refreshIsLoading:false, //下拉刷新加载标志
        listFinished: false, //数据全部加载完毕
        listLoading: false, //列表加载标志
        requestData: { // 请求数据传输的参数
          limit:10, //条数
          page:0, // 页数
          OPEN_ID: this.$store.state.userInfo.openid, //用户ID
        },
      }
    },
    methods: {
      //点击播放路由跳转
      videobf(VIDEOID) {
        this.$router.push({
          path: `/VideoPlay/${VIDEOID}/goMinusOne`,
        })
      },
      //用户信息
      userinfo() {
        this.$router.push({name: 'MyInfo', params: {OPEN_ID: this.requestData.OPEN_ID}})
      },
      // 加载列表数据
      onLoadList() {
        this.listLoading = true;
        this.requestData.page++;
        this.requestAxios("/aisino/selectVideoList",this.requestData,this.onLoadSuccessFn,this.onLoadErrorFn);
      },
      onLoadSuccessFn(responseData){
        if(responseData.success){
          if(responseData.obj[1].length>0){
            this.VIDEOLIST = this.VIDEOLIST.concat(responseData.obj[1])
          }
          responseData.obj[0] == this.VIDEOLIST.length ? this.listFinished = true : null;
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
        this.notifyStr("danger","获取视频列表失败");
      },
      //请求后台 (路由，数据，成功的执行函数，失败的执行函数)
      requestAxios(url,data,successFn,errorFn){
        axios.post(url, data).then(response => {
          successFn(response.data);
        }).catch(error => {
          errorFn();
        });
      },
      //下拉刷新
      onRefresh() {
        // 清空列表数据
        this.VIDEOLIST = [];
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
    components: {
      [Notify.name]: Notify,
      [Popup.name]: Popup,
      [Grid.name]: Grid,
      [GridItem.name]: GridItem,
      [Toast.name]: Toast,
      [Tag.name]: Tag,
      [Image.name]: Image,
      [Icon.name]: Icon,
      [videoPlayer.name]: videoPlayer,
      [Button.name]: Button,
      [SubmitBar.name]: SubmitBar,
      [Loading.name]:Loading,
      [List .name]:List, //列表
      [Skeleton.name]:Skeleton, //骨屏架
      [PullRefresh.name]:PullRefresh //下拉刷新
    },
    mounted() {
      let openid = "olA3Y1bL5BRPMv7K10hsGQQWP0Hc";
      this.$store.commit('set_openid', openid);
      this.requestData.OPEN_ID = this.$store.state.userInfo.openid //用户ID
      console.log(this.$store.state.userInfo.openid)
    },

    created() {
    }
  }
</script>

<style>
  .my-info-div .van-grid-item__content{
    padding: 0 0 !important;
  }
</style>
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

  .block {
    width: 100vw;
    height: 100vh;
    background-color: #fff;
  }

</style>
