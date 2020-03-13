<template>
  <div class="block">

    <!--财税小讲堂首页-->
    <div style="width: 100%;height: 100%;z-index: 9;margin-top: 2%;">
      <van-grid :clickable="true" :column-num="2" :square="false" :border="false" style="width: 100%; height: 100%"
                :center="true">
        <div style="width: 48%; height: 25%;margin: 0% 1%;" v-for="(item,index) in VIDEOLIST">
          <div style="position: absolute;z-index: 8;margin:2% 4%;">
            <van-tag round type="danger" v-show="item.IS_FREE == 'Y'">免费</van-tag>
            <van-tag round type="warning" v-show="item.IS_FREE != 'Y'">付费</van-tag>
          </div>
          <div style="z-index: 7;height: 100%;">
            <van-grid-item style="height: 100%;" :key="index" @click="videobf(item)">
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
      <!--用户浮标-->
      <div style="position: fixed;z-index: 8;top: 77%;right: 3%;" @click="userinfo">
        <van-icon name='../../static/images/usertb.png' color="#1989fa" size="3rem"/>
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
      videobf(item) {
        this.$router.push({name: 'VideoPlay', params: {item: item}})
      },
      //进页面要加载的数据
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
      //用户信息
      userinfo() {
        this.$router.push({name: 'MyInfo', params: {OPEN_ID: this.userData.OPEN_ID}})
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
      this.$store.commit('set_openid', 'olA3Y1bL5BRPMv7K10hsGQQWP0Hc');

      this.userData.OPEN_ID = this.$store.state.userInfo.openid //用户ID
      console.log(this.$store.state.userInfo.openid)
    },

    created() {
      //初始化页面
      this.getVideoinfo();
    }
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
