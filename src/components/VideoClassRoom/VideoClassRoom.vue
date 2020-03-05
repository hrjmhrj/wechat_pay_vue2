<template>
  <div class="block">
    <div style="width: 100vw;height: 6vh;line-height: 6vh;position: fixed;top: 0;z-index: 999;background: #fff;">
      <van-grid>
        <van-grid-item icon="photo-o" text="文字" />
        <van-grid-item icon="photo-o" text="文字" />
        <van-grid-item icon="photo-o" text="文字" />
        <van-grid-item icon="photo-o" text="文字" />
      </van-grid>
    </div>

    <!--详情弹框-->
    <!-- <van-popup v-model="show" closeable round position="center" :style="{ height: '85%' ,width: '75%',background: '#fcfcfc'}">
      <div :name="item.SFH" :label-disabled="true" class="tab-checkbox-info" v-for="(item, index) in OrderDetail"
           :key="index" style="margin-top: 5%;margin-left: 3%;">
      <van-card style="background-color: #FFF"
        :key="index"
        :num="item.FOOD_NUM"
        :price="item.FOOD_MONEY.toFixed(2)"
        :desc="'菜品单价'+item.FOOD_PRICE.toFixed(2)+'元'"
        :title="item.FOOD_NAME"
        :thumb="item.FOOD_PIC_URL == ''?'null':item.FOOD_PIC_URL"
      >
       <div slot="tags">
        <van-tag plain type="danger">菜品状态：{{item.FOOD_STATUS}}</van-tag>
      </div>
      </van-card>

      </div>
      &lt;!&ndash; <van-cell :name="item.SFH" :label-disabled="true" class="tab-checkbox-info" v-for="(item, index) in OrderDetail"
                 :key="index" style="margin-top: 5%">

          <span class="checkbox-text-span">
             　<span class="checkbox-text-span-span">菜品名称：{{item.FOOD_NAME}}</span>
                 </span>
         <van-divider dashed hairline :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 0 0 0',width: '100%' }"></van-divider>
         <span class="checkbox-text-span">
             　<span class="checkbox-text-span-span">菜品数量：{{item.FOOD_NUM}}</span>
                 </span>
         <van-divider dashed hairline :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 0 0 0',width: '100%' }"></van-divider>
         <span class="checkbox-text-span">
             　<span class="checkbox-text-span-span"> 菜品单价：{{item.FOOD_PRICE}}元</span>
                 </span>
         <van-divider dashed hairline :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 0 0 0',width: '100%' }"></van-divider>
         <span class="checkbox-text-span">
             <span class="checkbox-text-span-span"> 菜品总价：{{item.FOOD_MONEY}}元</span>
                 </span>
         <van-divider dashed hairline :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 0 0 0',width: '100%' }"></van-divider>
         <span class="checkbox-text-span">
             <span class="checkbox-text-span-span">菜品状态：{{item.FOOD_STATUS}}</span>
                 </span>
       </van-cell>&ndash;&gt;
      <div style="color: white;width: 33%;height: 4%;text-align: center;padding: 1vh 1vw;margin-left: 32%;margin-bottom: 5%;margin-top: 4%;border-radius: 999vw;background: linear-gradient(to right, rgb(255, 96, 52), rgb(238, 10, 36));" @click="goback" round >
        <p style="padding: 3% 0% 0% 0%;">返&emsp;回</p>
      </div>
    </van-popup>
-->
  </div>


</template>

<script>

    import {Notify,Popup,Dialog,Grid,GridItem } from 'vant';
    import axios from 'axios'
    import Bus from "../utils/bus";

    export default {
        name: "VideoClassRoom",
        data() {
            return {
                BY1: '',//存店铺号
                noData:'未查询到数据',
                nulldataImg: false, // 没有数据时显示
                loading: false, // 通过loading和finished两个变量控制加载状态
                finished: false,
                loadText:'加载中...',
                limit:10,//每次加载10条数据
                page:1,
                show:false,
                contactShow: false,
                contactDetail: {},
                searchData1:{
                    QsSj:'',
                    JsSj:'',
                },
                searchData:{
                    QsSj:'',
                    JsSj:'',
                    Yhh:'',
                },
                YKAllData:[],
                OrderDetail:[],
                searchvalue:'',//搜索参数
                userData:{ // 请求数据传输的参数
                    USER_TYPE: this.$store.state.userInfo.userType, //用户类型 0:企业,1:普通用户,电脑端用户为3
                    S_CID: this.$store.state.userInfo.userName,// 用户号目前取不到值
                    YH_UUID: this.$store.state.userInfo.userId,// 用户唯一id
                },
            }
        },
        methods: {
          /*
                    //查看联系方式
                    ContractRow(item){
                      this.contactShow = true
                      this.contactDetail=item
                    },
                      //点击进入订单详情
                      ToOrderDetail(item) {
                          let orderID={
                              ORDER_ID:item.ORDER_ID
                          }
                          console.log(orderID)
                          axios.post(`/aisino/getOrderFoodList`,JSON.stringify(orderID), {headers: {'Content-Type': 'application/json;charset=UTF-8'}}).then(response => {
                              const res = response.data
                              console.log('res='+JSON.stringify(res))
                              if (res.status == '0') {
                                  let data={
                                      order:item,
                                      orderFood:res.data
                                  }
                                  console.log(data)
                                  //debugger
                                  Bus.$emit('orderFoodStart', data)
                              } else {
                                  Notify({
                                      message: '未查询到订单明细数据',
                                      duration: 2000
                                  });
                              }
                          })
                      },
                      //返回首页
                      gotoSY(){
                          window.history.go(-1)
                      },
                      //弹框返回
                      goback(){
                          this.show =false
                      },
                    //弹框返回
                      goback1() {
                         this.contactShow = false
                       },
                    //获取urlkey
                    getUrlKey: function (name) {
                      return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
                    },
                    //异步更新数据
                    onLoad() {//只要检测到你在上划，默认距离底部300px时就刷新
                      //debugger
                      console.log(this.searchvalue)
                      setTimeout(() => {//通过setTimeOut进行延时模拟异步更新，把延时时间调大点效果就很明显 也可以不用setTimeOut
                        this.BY1 = this.$route.params.BY1
                        let DESK_ID=this.$route.params.zhuoHao
                        let USER_ID = this.$store.state.OPENID
                        //console.log("GFHM="+this.$store.state.userInfo.userId)
                        let formData={
                          USER_ID:USER_ID,
                          BY1: this.BY1,
                          DESK_ID:DESK_ID,
                          limit: this.limit,
                          page: this.page++,
                          BY4:this.searchvalue,
                        }
                        //debugger
                        console.log("查询已开发票传入的参数"+JSON.stringify(formData))
                        axios.post(`/aisino/getOrderListMobile`, formData).then(res=>{
                          //debugger
                          if (res.data.msg=='查询成功') {
                            if (res.data.count) {
                              this.YKAllData = this.YKAllData.concat(res.data.data)
                              this.nulldataImg = false;
                              console.log(JSON.stringify(this.YKAllData))
                            } else {
                              this.YKAllData = []
                              this.nulldataImg = true;
                              this.noData = '未查询到数据';
                            }
                            //加载状态结束
                            this.loading = false
                            //数据全部加载完成
                            if (this.YKAllData.length == res.data.count) {
                              this.finished = true
                              this.loadText = "加载完成"
                            }
                          }else{
                            this.YKAllData = []
                            this.nulldataImg = true
                            this.finished = true
                          }
                        },error=>{
                          this.finished = true;
                          this.loading = false;
                          this.YKAllData = [];
                          this.nulldataImg = true;
                          this.noData = '服务异常，请稍后重试';
                          Notify({ type: 'danger', message:"服务异常，请稍后重试"});
                        })
                      }, 1)
                    },
                  },
                  created(){
                      //this.onLoad()//注意一个参数：immediate-check 是否在初始化时立即执行滚动位置检查，默认是true，就在created的时候就执行一次onLoad加载，如果你的代码不需要一开始就执行onLoad，设置为false.
                  },*/
        },
        components:{
            Notify,
            Popup,
            Dialog,
            Grid,
            GridItem
        },
        mounted () {// 两个子组件传递数据
            Bus.$on('DkToYkFlag', res => { // 有待开生成已开标志
                //console.log("收到消息:有待开生成已开"+res)
                this.YKAllData=[]
                this.onLoad()
            });
            Bus.$on('searchYkPageFlag', res => { // 已开页面搜索
                //console.log("已开页面搜索数据："+JSON.stringify(res))
                this.searchData1={
                    QsSj:res.searchData.QsSj,
                    JsSj:res.searchData.JsSj
                }
                //console.log(JSON.stringify(this.searchData1))
                this.YKAllData = []
                this.page=1
                this.onLoad()
            });
            // 订单详情弹框数据传输
            Bus.$on('orderFoodStart', res => {
                //debugger
                //console.log("收到消息:订单详情已传送过来"+JSON.stringify(res.orderFood))
                if (res.orderFood.length==0){
                    Notify({
                        message: '该订单无菜品信息',
                        duration: 2000
                    });
                    return
                }else {
                    this.OrderDetail=res.orderFood
                    this.show =true
                }
                //ocnsole.log("接收到数据"+JSON.stringify(this.OrderDetail))
            });
        },
        beforeDestroy() {
            Bus.$off('orderFoodStart');
        },
    }
</script>

<style scoped>
  .van-image {
    margin: auto -9%;
  }
  .list{
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
    border:1px solid #eee;
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
    overflow: auto;/*规定当内容溢出元素框时发生的事情 auto如果内容被修剪，则浏览器会显示滚动条以便查看其余的内容*/
    white-space: nowrap;/*设置如何处理元素内的空白 nowrap文本不会换行，文本会在在同一行上继续，直到遇到 <br> 标签为止*/
    text-overflow: ellipsis; /*规定当文本溢出包含元素时发生的事情  ellipsis显示省略符号来代表被修剪的文本*/
  }

  .block {
    width: 100vw;
    height: 100vh;
    background-color: #fff;
  }

</style>
