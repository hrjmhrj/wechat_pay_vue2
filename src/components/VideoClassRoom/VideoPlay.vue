<template>
  <div class="block">
    <!--播放页面-->
    <div style="z-index: 10;position: absolute;top: 0;left: 0;">

      <div class="wrapper">
        <div class="block">

          <div class="player"><!--播放器-->
            <video-player class="video-player vjs-custom-skin"
                          ref="videoPlayer"
                          :playsinline="true"
                          :options="playerOptions"
            ></video-player>
          </div>

          <div class="caption" style="margin: 2% 2% 2% 2%;"><!--标题和详细介绍内容-->
            <span style="display: inline-block;width: 80vw;text-align:left;font-size: 4vw;font-weight: bold;">
                课程名称
            </span>
            <span style="display: inline-block;width: 14vw;text-align: right;">
                <van-button type="warning" @click="fanhuiVD" size="mini" round>返回</van-button>
            </span>

            <div style="color: darkgray; font-size: x-small;margin-top: 1%;">
              详情介绍详情介绍详情介绍详情介绍详情介绍详情介绍详情介绍详情介绍详情介绍详情介绍详情介绍详情介绍
            </div>
          </div>

          <div style="background-color: #F7F7F7;height: 1.2vh;margin: 2% 0% 2% 0%;"></div>

          <div class="recommend" style="margin: 2% 2% 16% 2%;"><!--推荐的内容-->
            <div style="display: inline-block;width: 82vw;text-align:left;font-size: 4vw;font-weight: bold;">
              为您推荐
            </div>
            <!--推荐视频-->
            <div style="width: 100%;height: 100%;z-index: 9;margin-top: 2%;">
              <van-grid :clickable="true" :column-num="2" :square="false" :border="false"
                        style="width: 100%; height: 100%"
                        :center="true">
                <div style="width: 48%; height: 25%;margin: 0% 1%;" v-for="value in 12">
                  <div style="position: absolute;z-index: 8;margin:1% 4%;">
                    <van-tag round type="danger">免费</van-tag>
                    <van-tag round type="warning">付费</van-tag>
                  </div>
                  <div style="z-index: 7;height: 100%;">
                    <van-grid-item style="height: 100%;" :key="value" @click="videobf1(value)">
                      <div style="height: 100%;width: 100%;">
                        <van-image src="https://img.yzcdn.cn/vant/apple-2.jpg"
                                   style=" width: 100%;height: 76%;margin-top: -7%;"/>
                        <div
                          style="text-overflow: clip;-webkit-box-orient: vertical;-webkit-line-clamp: 2;word-break: break-all;display: -webkit-box;line-height: 1.2rem;overflow: hidden;margin-top: 2%;">
                          TVB 优酷同步热播剧《法证先锋4》第13集预告片_标清.mp4
                        </div>
                      </div>
                    </van-grid-item>
                  </div>
                </div>
              </van-grid>
            </div>
          </div>

          <!--购买区-->
          <van-submit-bar style="background-color:#f7f7f7;"
                          :price="3050"
                          button-text="购买"
                          button-type="info"
                          @submit="purchase"
          >
            <span slot="default"><van-icon name="shopping-cart-o" size="2rem"/></span>
          </van-submit-bar>


        </div>
      </div>


    </div>

  </div>


</template>

<script>

  import {Notify, Popup, Grid, GridItem, Toast, Tag, Image, Icon, Button, SubmitBar} from 'vant';
  import axios from 'axios'
  import Bus from "../utils/bus";
  import {videoPlayer} from 'vue-video-player'
  import 'video.js/dist/video-js.css'


  export default {
    name: "VideoPlay",
    data() {
      return {

        playerOptions: {
          playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
          autoplay: false, //如果true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 导致视频一结束就重新开始。
          preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: 'zh-CN',
          aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [{
            src: '../../static/video/aaaa.mp4',  // 路径
            type: 'video/mp4'  // 类型
          }],
          poster: "https://img.yzcdn.cn/vant/apple-2.jpg", //你的封面地址
          // width: document.documentElement.clientWidth,
          notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
            timeDivider: true,
            durationDisplay: true,
            remainingTimeDisplay: false,
            fullscreenToggle: true  //全屏按钮
          }
        },

        BY1: '',//存店铺号
        noData: '未查询到数据',
        nulldataImg: false, // 没有数据时显示
        loading: false, // 通过loading和finished两个变量控制加载状态
        finished: false,
        loadText: '加载中...',
        limit: 10,//每次加载10条数据
        page: 1,
        show: false,
        contactShow: false,
        contactDetail: {},
        searchData1: {
          QsSj: '',
          JsSj: '',
        },
        searchData: {
          QsSj: '',
          JsSj: '',
          Yhh: '',
        },
        YKAllData: [],
        OrderDetail: [],
        searchvalue: '',//搜索参数
        userData: { // 请求数据传输的参数
          USER_TYPE: this.$store.state.userInfo.userType, //用户类型 0:企业,1:普通用户,电脑端用户为3
          S_CID: this.$store.state.userInfo.userName,// 用户号目前取不到值
          YH_UUID: this.$store.state.userInfo.userId,// 用户唯一id
        },
      }
    },
    methods: {
      /*videobf(value) {
        console.log(value)
        //获取openid  console.log(this.$store.state.userInfo.openid)
        //this.$router.push({name: 'OrderMobilePhone', params: {BY1: this.BY1, zhuoHao: this.zhuoHao}})
        axios.post('/aisino/selectVideoList').then(response => {
          console.log(response);
          console.log(response.data.obj)
          if (response.status == 200) {
            console.log(response.data.obj)
          }
        }, response => {
          console.info('网络异常，请稍候重试！');
        })
        /!*var sdf = []
        var asd = {}
        asd["price"] = this.price
        asd["BY1"] = this.BY1
        asd["zhuoHao"] = this.zhuoHao
        asd["data"] = this.jlList
        asd["waimai"]=this.formDa
        asd["openid"]=this.$store.state.OPENID //后边根据这个判断用户
        sdf.push(asd)
        axios.post('/aisino/selectVideoList', sdf).then(response => {
          let todata = response.data.status
          if (todata == 200) {
            // 清空购物车
            this.jlList = []
            this.intnum = 0
            this.price = 0
            this.overlay = false;
            this.overlayshow = false;
            this.allcpshow = false;
          }
          this.WmOrZcshPay()
        })*!/

      },*/
      //推荐区播放
      videobf1(value) {
        location.reload();
        console.log(111111)
        console.log(value)
      },
      //返回财税小讲堂首页
      fanhuiVD() {
        location.reload();
      },
      //购买
      purchase() {
        console.log("购买")
        var asd={}
        //店铺号
        asd["BY1"]=this.BY1
        //asd["ZH"]= this.AllCPList[0].deskid
        //asd["orderNo"]= this.AllCPList[0].orderid
        asd["price"]= this.AllPrice
        //asd["zhuoZiName"]= this.zhuoZiName
        asd["SPMC"]='财税小讲堂'
        //跳转支付页面
        axios.post('/nuonuoPay',asd ).then(response=>{
          let todata=response.data.obj
          window.location.href=todata
        })
      },
      //用户信息
      userinfo() {
        console.log("用户")
      },

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
    },
    mounted() {
    },
  }
</script>

<style>
  .video-js .vjs-big-play-button {
    margin: 17% 35%;
    /*播放按钮换成圆形 */
    height: 2em;
    width: 2em;
    line-height: 2em;
    border-radius: 1em;
  }

</style>
<style scoped>
  .list {
    text-align: center;
    background-color: #f4f4f4;
  }

  .van-checkbox .van-checkbox__icon--checked {
    padding: 0 10px;
  }

  .tab-checkbox-info {
    width: 90%;
    border-radius: 1vw;
    margin-bottom: 5px;
    padding: 5px 5px 5px 5px;
    margin-left: 5%;
    border: 1px solid #eee;
    margin-top: 1%;
  }

  .checkbox-text-span {
    display: block;
    padding: 1px 0;
    color: #5f5f5f;
    font-size: 14px;
    width: 98%;
  }

  .checkbox-text-span-span {
    margin-left: 10px;
    width: 80%;
    display: inline-block;
    float: left;
    text-align: justify;
  }

  .checkbox-text-span-text {
    display: inline-flex;
    min-width: 45vw;
    max-width: 69vw;
    overflow: auto; /*规定当内容溢出元素框时发生的事情 auto如果内容被修剪，则浏览器会显示滚动条以便查看其余的内容*/
    white-space: nowrap; /*设置如何处理元素内的空白 nowrap文本不会换行，文本会在在同一行上继续，直到遇到 <br> 标签为止*/
    text-overflow: ellipsis; /*规定当文本溢出包含元素时发生的事情  ellipsis显示省略符号来代表被修剪的文本*/
  }

  .block {
    width: 100vw;
    height: 100vh;
    background-color: #fff;
  }

</style>
