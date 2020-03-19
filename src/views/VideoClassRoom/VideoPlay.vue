<template>
  <div class="block" v-if="userInfo.openid != null && userInfo.openid != '' && userInfo.openid != 'null'">
    <!--播放页面-->
    <div style="z-index: 10;position: absolute;top: 0;left: 0;">
      <div class="wrapper">
        <!--遮盖页面-->
        <van-image style="z-index: 20" v-if="ZHEGAICENG"
                   width="100vw"
                   height="50vw"
                   :src="ZHEZHAOFM"
        />
        <!--播放器-->
        <div style="width: 100vw;min-height: 50vw;" v-if="!ZHEGAICENG">
          <div class="player" v-if="VIDEOCENG">
            <video-player class="video-player vjs-custom-skin"
                          ref="videoPlayer"
                          :playsinline="true"
                          :options="playerOptions"
            ></video-player>
          </div>
        </div>
        <!--标题和详细介绍内容-->
        <div class="caption" style="padding: 2%;">
          <span style="display: inline-block;width: 80vw;text-align:left;font-size: 4vw;font-weight: bold;">
                {{ONEVIDEO.VIDEONAME}}
            </span>
          <span style="display: inline-block;width: 14vw;text-align: right;">
                <van-button type="warning" @click="fanhuiVD" size="mini" round>返回</van-button>
            </span>
          <div style="color: darkgray; font-size: 12px;margin-top: 1%;">
            {{ONEVIDEO.VIDEOMS}}
          </div>
        </div>
        <!--分割线-->
        <div style="background-color: #F7F7F7;height: 1.2vh;"></div>
        <!--推荐的内容-->
        <div class="recommend">
          <div style="padding: 2%;display: inline-block;width: 82vw;text-align:left;font-size: 4vw;font-weight: bold;">
            为您推荐
          </div>
          <div class="tuijianqu">
            <!--推荐视频-->
            <div style="padding:1vh 2vw;min-height: 60vh;width: 96vw;margin-bottom: 15%;" class="my-info-div">
              <!--列表组件-->
              <van-list v-model="listLoading" :finished="listFinished" finished-text="" @load="onLoadList">
                <van-grid :column-num="2" gutter="3vw" :border="false">
                  <van-grid-item v-for="(item,index) in ITEMS" :key="index" @click="videobf1(item)">
                    <!--骨屏架组件-->
                    <van-skeleton :row="4" :loading="skeletonLoading" row-width="50%">
                      <div>
                        <div style="position: absolute;z-index: 8;margin:2% 4%;">
                          <van-tag round type="danger" v-show="item.IS_FREE == 'Y'">免费</van-tag>
                          <van-tag round type="warning" v-show="item.IS_FREE != 'Y'">付费</van-tag>
                        </div>
                        <van-image width="43.5vw" height="28vw" lazy-load radius="10" fit="fill"
                                   :src="item.VIDEOCOVER" style="border: 1px solid #d9d9d9;box-sizing: border-box">
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
          </div>
          <!--购买区-->
          <van-submit-bar style="background-color:#f7f7f7;" v-show="ONEVIDEO.IS_FREE != 'Y'"
                          :price='ONEVIDEO.COST*100'
                          :button-text="STATUS"
                          button-type="info"
                          @submit="purchase"
                          :disabled='GOUMAI'
                          :suffix-label='QIXIAN'
          >
          </van-submit-bar>
        </div>
      </div>
    </div>
  </div>


</template>

<script>

  import {Notify, Popup, Grid, GridItem, Toast, Tag, Image, Icon, Button, SubmitBar, Loading, List, Skeleton,PullRefresh} from 'vant';
  import {mapState} from 'vuex'
  import axios from 'axios'
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
            src: 'static/video/aaaa.mp4',  // 视频路径
            type: 'video/mp4'  // 类型
          }],
          poster: "static/images/spfm.png", //你的封面地址
          // width: document.documentElement.clientWidth,
          notSupportedMessage: '此视频暂无法播放，请刷新后再试（格式不支持或未购买）', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
            timeDivider: true,
            durationDisplay: true,
            remainingTimeDisplay: false,
            fullscreenToggle: true  //全屏按钮
          }
        },
        ITEMS: [],//视频列表相关的全部数据
        ONEVIDEO: {//单个视频的所有数据
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
          DEADLINE: '',//到期时间
          QIXIAN:'',//期限  永久  /年
        },
        GOUMAI: true,//购买是否失效
        STATUS: '购买',//是否支付
        ZHEZHAOFM: 'static/images/pxfm.png',//遮盖图
        VIDEOCENG: false,//播放层
        ZHEGAICENG: false,//遮盖层
        userData: { // 请求数据传输的参数
          limit: 6, //条数
          page: 0, // 页数
          OPEN_ID: '', //用户ID
        },
        skeletonLoading: true, //骨屏架加载标志
        refreshIsLoading: false, //下拉刷新加载标志
        listFinished: false, //数据全部加载完毕
        listLoading: false, //列表加载标志
        GOFLAG: false, //返回上一页的方式（false 指定路由 /true -1）
        code:"",//获取oepnid所需要的CODE
      }
    },
    methods: {
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
              if(response.data.obj != null && response.data.obj != '' && response.data.obj !== 'null'){
                this.ONEVIDEO.VIDEOID = this.$route.params.VIDEOID;
                this.$route.params.GOFLAG == "goRoute" ? this.GOFLAG = false : this.GOFLAG = true;
                this.GOUMAI = true
                this.userData.OPEN_ID = this.$store.state.userInfo.openid;
                this.getOneVideo();
              }
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
      //查询当前单个视频信息
      getOneVideo() {
        this.VIDEOCENG = false//播放层
        this.ZHEGAICENG = false//遮盖层
        this.GOUMAI = true
        let _this = this;
        let a = {
          VIDEOID: _this.ONEVIDEO.VIDEOID,//视频ID
          limit: 10, //条数
          page: 0, // 页数
        }
        axios.post('/aisino/selectVideoList', a).then(response => {
          if (response.data.success) {
            if (response.data.obj[1][0].IS_FREE != 'Y') {
              _this.userorder(response.data.obj[1][0]);
            } else {
              _this.ONEVIDEO = response.data.obj[1][0]
              //遮盖层
              if (response.data.obj[1][0].TYPE == 'ps') {
                _this.VIDEOCENG = false//播放层
                _this.ZHEGAICENG = true//遮盖层
                _this.QIXIAN = '/年'
              } else {
                _this.VIDEOCENG = true//播放层
                _this.ZHEGAICENG = false//遮盖层
                _this.QIXIAN = '/永久'
                _this.playerOptions.poster = response.data.obj[1][0].VIDEOCOVER
                _this.playerOptions.sources = response.data.obj[1][0].FILENAME
              }
              _this.videobf1(_this.ONEVIDEO)
            }
          } else {
            _this.VIDEOCENG = false//播放层
            _this.ZHEGAICENG = true//遮盖层
            console.info('查询失败，请稍候重试！');
            Toast({
              message: '网络异常，请稍候重试！',
              duration: 3000
            });
          }
        }).catch(error => {
          console.info(error + '网络异常，请稍候重试！');
          Toast({
            message: '网络异常，请稍候重试！',
            duration: 3000
          });
        })
      },
      //推荐区播放
      videobf1(item) {
        this.GOUMAI = true
        this.VIDEOCENG = false//播放层
        this.ZHEGAICENG = false//遮盖层
        this.ONEVIDEO = item;
        let _this = this
        _this.VIDEOCENG = false//播放层
        //判断视频是不是收费
        if (item.IS_FREE != 'Y') {
          _this.userorder(item);
        } else {
          if (item.TYPE != 'ps' & item.FILENAME != null) {
            _this.playerOptions.sources = item.FILENAME
          }
          if (item.TYPE != 'ps' & item.FILENAME == null) {
            _this.playerOptions.sources = "没有获取到视频地址"
          }
          setTimeout(function(){
            if (item.TYPE == 'ps') {
              _this.QIXIAN = '/年'
              //显示遮罩层
              _this.VIDEOCENG = false//播放层
              _this.ZHEGAICENG = true//遮盖层
            } else {
              _this.QIXIAN = '/永久'
              _this.VIDEOCENG = true//播放层
              _this.ZHEGAICENG = false//遮盖层
            }
          }, 500);
          //判断封面地址是不是空
          if (item.VIDEOCOVER != null) {
            _this.playerOptions.poster = item.VIDEOCOVER
          } else if (item.TYPE != 'ps') {
            _this.playerOptions.poster = 'static/images/spfm.png'
          } else if (item.TYPE == 'ps') {
            _this.playerOptions.poster = 'static/images/pxfm.png'
          }
        }
        //点击置顶
        var timer = setInterval(function () {
          let osTop = document.documentElement.scrollTop || document.body.scrollTop;
          let ispeed = Math.floor(-osTop / 5);
          document.documentElement.scrollTop = document.body.scrollTop = osTop + ispeed;
          _this.isTop = true;
          if (osTop === 0) {
            clearInterval(timer);
          }
        }, 30)
      },
      //返回财税小讲堂首页
      fanhuiVD() {
        if (this.GOFLAG) {
          this.$router.go(-1);
        } else {
          this.$router.push({name: '/'})
          let url = "http://hyfwzx.schtxxcdfgs.com/vueproject/nbxm_hyfwzx_vue/index.html#/";
          window.location.href=url;
        }
      },
      //购买
      purchase() {
        var asd = {}
        //店铺号
        asd["VIDEOID"] = this.ONEVIDEO.VIDEOID
        asd["OPEN_ID"] = this.userData.OPEN_ID
        //asd["orderNo"] = ""
        asd["price"] = this.ONEVIDEO.COST
        asd["SPMC"] = this.ONEVIDEO.VIDEONAME
        //跳转支付页面
        axios.post('/nuonuoPay', asd).then(response => {
          let todata = response.data.obj
          window.location.href = todata
        })
      },
      //如果是收费视频则根据openid查订单购买信息
      userorder(item) {
        this.GOUMAI = true
        let _this = this;
        let a = {
          OPEN_ID: this.userData.OPEN_ID,
          VIDEOID: this.ONEVIDEO.VIDEOID,
        }
        this.ONEVIDEO = item
        this.playerOptions.sources = "判断"
        axios.post('/aisino/selectUserOrder', a).then(response => {
          if (response.data.obj.length != 0 && response.data.success) {
            if (response.data.obj[0].STATUS == '已支付') {
              if (response.data.obj[0].TYPE != 'ps') {
                _this.VIDEOCENG = true//播放层
                _this.ZHEGAICENG = false//遮盖层
                _this.QIXIAN = '/永久'
                _this.GOUMAI = true
                _this.STATUS = '已购'
                _this.playerOptions.poster = item.VIDEOCOVER
                _this.playerOptions.sources = item.FILENAME
              }
              if (response.data.obj[0].TYPE == 'ps') {
                _this.QIXIAN = "/年"
                //显示遮盖层
                _this.VIDEOCENG = false//播放层
                _this.ZHEGAICENG = true//遮盖层
                if (response.data.obj[0].DEADLINE == '未过期') {
                  _this.GOUMAI = true
                  _this.STATUS = '已购'
                  Toast({
                    message: '已购买，请联系管理员，联系电话66778811-8645',
                    duration: 5000
                  });
                } else {
                  _this.GOUMAI = false
                  _this.STATUS = "购买"
                }
              }
            }
          } else if (response.data.obj.length == 0 && response.data.success) {
            if (item.TYPE == 'ps') {
              _this.QIXIAN = "/年"
              _this.ZHEGAICENG = true//遮盖层
              _this.VIDEOCENG = false//播放层
            } else {
              _this.QIXIAN = '/永久'
              _this.VIDEOCENG = true//播放层
              _this.ZHEGAICENG = false//遮盖层
              _this.playerOptions.poster = item.VIDEOCOVER
              _this.playerOptions.sources = "判断"
            }
            _this.GOUMAI = false
          } else {
            _this.ZHEGAICENG = true//遮盖层
            _this.VIDEOCENG = false//播放层
            _this.GOUMAI = true
            console.info('请求失败，请稍候重试！');
            Toast({
              message: '网络异常，请稍候重试！',
              duration: 3000
            });
          }
        }).catch(error => {
          console.info(error + '网络异常，请稍候重试！');
          Toast({
            message: '网络异常，请稍候重试！',
            duration: 3000
          });
        })
      },
      // 加载列表数据
      onLoadList() {
        this.listLoading = true;
        this.listFinished = true;
        //this.userData.page++;
        let _this = this
        this.requestAxios("/aisino/selectVideoList", _this.userData, _this.onLoadSuccessFn, _this.onLoadErrorFn);
      },
      onLoadSuccessFn(responseData) {
        let _this = this
        if (responseData.success) {
          if (responseData.obj[1].length > 0) {
            _this.ITEMS = _this.ITEMS.concat(responseData.obj[1])
          }
          responseData.obj[0] == _this.ITEMS.length ? _this.listFinished = true : null;
        } else {
          _this.listFinished = true;
          _this.notifyStr("danger", responseData.msg);
        }
        _this.listFinished = true;
        _this.listLoading = false;
        _this.skeletonLoading = false;
        _this.refreshIsLoading = false;
      },
      onLoadErrorFn() {
        let _this = this
        _this.listLoading = false;
        _this.listFinished = true;
        _this.skeletonLoading = false;
        _this.refreshIsLoading = false;
        _this.notifyStr("danger", "获取视频列表失败");
      },
      //请求后台 (路由，数据，成功的执行函数，失败的执行函数)
      requestAxios(url, data, successFn, errorFn) {
        axios.post(url, data).then(response => {
          successFn(response.data);
        }).catch(error => {
          errorFn();
        });
      },
      //下拉刷新
      onRefresh() {
        // 清空列表数据
        this.ITEMS = [];
        this.userData.page = 0;
        this.listFinished = true;
        // 重新加载数据
        // 将 refreshIsLoading 设置为 true，表示处于加载状态
        this.refreshIsLoading = true;
        this.onLoadList();
      }, // 下拉刷新
      notifyStr(type, msg) {
        Notify({type: type, message: msg});
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
      [Loading.name]: Loading,
      [List.name]: List, //列表
      [Skeleton.name]: Skeleton, //骨屏架
      [PullRefresh.name]: PullRefresh //下拉刷新
    },
    created(){
      let urlTemp = process.env.API_ROOT
      if(urlTemp.indexOf("localhost") == -1&&(this.$store.state.userInfo.openid == null||this.$store.state.userInfo.openid == '' || this.$store.state.userInfo.openid == 'null')){
        this.getOpenId();
      }else if(urlTemp.indexOf("localhost") != -1){
        this.$store.commit('set_openid', "olA3Y1bL5BRPMv7K10hsGQQWP0Hc");
        this.ONEVIDEO.VIDEOID = this.$route.params.VIDEOID;
        this.$route.params.GOFLAG == "goRoute" ? this.GOFLAG = false : this.GOFLAG = true;
        this.GOUMAI = true
        this.userData.OPEN_ID = "olA3Y1bL5BRPMv7K10hsGQQWP0Hc";
        this.getOneVideo();
      }
    },
    computed: {
      ...mapState(['userInfo'])
    },
  }
</script>

<style>
  .video-js .vjs-big-play-button {
    margin: 18% 40%;
    /*播放按钮换成圆形 */
    height: 2em;
    width: 2em;
    line-height: 2em;
    border-radius: 1em;
  }

  .my-info-div .van-grid-item__content {
    padding: 0 0 !important;
  }
</style>
<style scoped>
  /*超出范围变省略号*/
  .text-overflow {
    text-align: left;
    display: block;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .text-overflow-title {
    width: 43.5vw;
    font-size: 13px;
    line-height: 13px;
    height: 14px;
    -webkit-line-clamp: 1;
    white-space : nowrap ;
    padding: 1px 0;
    margin: 2px 0 0px 0;
  }

  .text-overflow-body {
    width: 43.5vw;
    font-size: 11px;
    line-height: 11px;
    height: 11px;
    color: #8a8a8a;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    white-space: nowrap;
    margin: 5px 0 4px 0;
  }

  .block {
    width: 100vw;
    height: auto;
    background-color: #fff;
  }

</style>
