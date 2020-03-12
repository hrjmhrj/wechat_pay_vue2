<template>
  <div class="block" id="block">
    <!--播放页面-->
      <div style="z-index: 10;position: absolute;top: 0;left: 0;">

        <div class="wrapper">

          <div class="player"><!--播放器-->
            <video-player class="video-player vjs-custom-skin"
                          ref="videoPlayer"
                          :playsinline="true"
                          :options="playerOptions"
            ></video-player>
          </div>

          <div class="caption" style="margin: 2% 2% 2% 2%;"><!--标题和详细介绍内容-->
            <span style="display: inline-block;width: 80vw;text-align:left;font-size: 4vw;font-weight: bold;">
                {{ITEMS.VIDEONAME}}
            </span>
            <span style="display: inline-block;width: 14vw;text-align: right;">
                <van-button type="warning" @click="fanhuiVD" size="mini" round>返回</van-button>
            </span>

            <div style="color: darkgray; font-size: x-small;margin-top: 1%;">
              {{ITEMS.VIDEOMS}}
            </div>
          </div>

          <div style="background-color: #F7F7F7;height: 1.2vh;margin: 2% 0% 2% 0%;"></div>

          <div class="recommend" style="margin: 2% 2% 16% 2%;"><!--推荐的内容-->
            <div style="display: inline-block;width: 82vw;text-align:left;font-size: 4vw;font-weight: bold;">
              为您推荐
            </div>

            <div class="block">
              <!--推荐视频-->
              <div style="width: 100%;height: 100%;z-index: 9;margin-top: 2%;">
                <van-grid :clickable="true" :column-num="2" :square="false" :border="false"
                          style="width: 100%; height: 100%;margin-left: -2%;"
                          :center="true">
                  <div style="width: 48%; height: 25%;margin: 0% 1%;" v-for="(item,index) in VIDEOLIST">
                    <div style="position: absolute;z-index: 8;margin:2% 4%;">
                      <van-tag round type="danger" v-show="item.IS_FREE == 'Y'">免费</van-tag>
                      <van-tag round type="warning" v-show="item.IS_FREE != 'Y'">付费</van-tag>
                    </div>
                    <div style="z-index: 7;height: 100%;">
                      <van-grid-item style="height: 100%;" :key="index" @click="videobf1(item)">
                        <div style="height: 100%;width: 100%;">
                          <van-image :src="item.VIDEOCOVER"
                                     style=" width: 100%;height: 76%;margin-top: -7%;"/>
                          <div
                            style="text-overflow: clip;-webkit-box-orient: vertical;-webkit-line-clamp: 2;word-break: break-all;display: -webkit-box;line-height: 1.2rem;overflow: hidden;margin-top: 2%;">
                            {{item.VIDEONAME}}
                          </div>
                        </div>
                      </van-grid-item>
                    </div>
                  </div>
                </van-grid>
              </div>
            </div>

            <!--购买区-->
            <van-submit-bar style="background-color:#f7f7f7;" v-show="ITEMS.IS_FREE != 'Y'"
                            :price='ITEMS.COST*100'
                            :button-text='this.STATUS'
                            button-type="info"
                            @submit="purchase"
                            :disabled="GOUMAI"
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
  import Bus from "../../components/utils/bus";
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
            src: '../../static/video/aaaa.mp4',  // 视频路径
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
        ITEMS: '',//相关的全部数据
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
        STATUS: '',//是否支付
        GOUMAI: false,//购买是否失效

        noData: '未查询到数据',
        nulldataImg: false, // 没有数据时显示
        loading: false, // 通过loading和finished两个变量控制加载状态
        finished: false,
        loadText: '加载中...',
        limit: 10,//每次加载10条数据
        page: 1,
        userData: { // 请求数据传输的参数
          OPEN_ID: '', //用户ID
        },
      }
    },
    methods: {
      //推荐区视频
      getVideoinfo() {
        axios.post('/aisino/selectVideoList').then(response => {
          if (response.data.success) {
            this.VIDEOLIST = [];
            this.VIDEOLIST = response.data.obj
          }
        }).catch(error => {
          console.info(error + '网络异常，请稍候重试！');
        })
      },

      //推荐区播放
      videobf1(item) {
        this.ITEMS = item;
        this.playerOptions.sources = item.FILENAME
        this.playerOptions.poster = item.VIDEOCOVER

        if (item.IS_FREE != 'Y') {//判断是否收费
          this.userorder();
        }

        //点击置顶
        var timer = setInterval(function () {
          let osTop = document.documentElement.scrollTop || document.body.scrollTop;
          let ispeed = Math.floor(-osTop / 5);
          document.documentElement.scrollTop = document.body.scrollTop = osTop + ispeed;
          this.isTop = true;
          if (osTop === 0) {
            clearInterval(timer);
          }
        }, 30)

      },
      //返回财税小讲堂首页
      fanhuiVD() {
        this.$router.push({name: 'VideoClassRoom'})
      },
      //购买
      purchase() {
        console.log("购买")
        var asd={}
        //店铺号
        asd["VIDEOID"]=this.ITEMS.VIDEOID
        asd["OPEN_ID"]= this.userData.OPEN_ID
        asd["orderNo"]= ""
        asd["price"]= this.ITEMS.COST
        asd["SPMC"]='财税小讲堂'
        console.log(this.ITEMS.VIDEOID)
        console.log(this.userData.OPEN_ID)
        console.log(this.ITEMS.COST)
        //跳转支付页面
        axios.post('/nuonuoPay',asd ).then(response=>{
          let todata=response.data.obj
          window.location.href=todata
        })
      },

      //根据openid查订单购买信息
      userorder() {
        let a = {
          OPEN_ID: this.userData.OPEN_ID,
          VIDEOID: this.ITEMS.VIDEOID
        }
        axios.post('/aisino/selectUserOrder', a).then(response => {
          if (response.data.success && response.data.obj.length != 0) {
            //console.log(response.data.obj[0].STATUS)
            if (response.data.obj[0].STATUS == '已支付') {
              this.STATUS = '已购'
              this.GOUMAI = true
              if (this.TYPE == 'ps' || this.ITEMS.TYPE == 'ps') {
                Toast({
                  message: '已购买，请联系管理员，联系电话66778811-8645',
                  duration: 5000
                });
              }
            } else {
              this.STATUS = '购买'
              this.playerOptions.sources = "购买后可看"
            }
          } else {
            console.info('网络异常，请稍候重试！');
          }
        }).catch(error => {
          console.info(error + '网络异常，请稍候重试！');
        })
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
      this.ITEMS = this.$route.params.item;
      this.getVideoinfo();
      this.playerOptions.sources = this.$route.params.item.FILENAME
      this.playerOptions.poster = this.$route.params.item.VIDEOCOVER


      this.$store.commit('set_openid', 'olA3Y1bL5BRPMv7K10hsGQQWP0Hc');

      this.userData.OPEN_ID = this.$store.state.userInfo.openid //用户ID
      if (this.$route.params.item.IS_FREE != 'Y' || this.ITEMS.IS_FREE != 'Y') {
        this.userorder();
      }
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
