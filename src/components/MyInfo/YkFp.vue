<template>
  <div class="my-info-ykfp-div">
    <!--列表-->
    <van-pull-refresh v-model="refreshIsLoading" @refresh="onRefresh">
      <div class="ykfp-list-div">
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" :loading-text="loadText" :offset="100" @load="onLoad" :immediate-check="false">
            <div v-for="(item, index) in ykAllData">
              <van-cell class="ykfp-cell" :key="index" is-link center @click="clickOneYkfp(item.KPSQID)">
                <span class="ykfp-cell-text-span" >
                  企业名称(个人)：<span>{{item.QYMC}}</span>
                </span>
                <span class="ykfp-cell-text-span" >
                  金　　额：<span>{{item.ZJE}}</span>元
                </span>
                <span class="ykfp-cell-text-span" >
                  申请时间：<span>{{item.CREATETIME}}</span>
                </span>
              </van-cell>
            </div>
          </van-list>
      </div>
    </van-pull-refresh>
    <!--发票信息-->
    <div v-if="showOverlayFlag" class="ykfp-fpxx">
      <!--头部-->
      <van-sticky :offset-top="0">
        <van-nav-bar title="发票信息" left-text="返回" left-arrow @click-left="onClickBarLeft"/>
      </van-sticky>
      <p/>
      <!--发票信息-->
      <div style="padding-bottom: 50px;">
        <!--发票类型-->
        <van-field label="发票类型" :value="FplxFn(ykfpxx.FPLX)" input-align="right" readonly required/>
        <!--企业名称(个人)-->
        <van-field label="企业名称/个人" :value="ykfpxx.QYMC" type="textarea" rows="1" autosize input-align="right" disabled  required/>
        <!--联系电话-->
        <van-field label="联系电话" :value="ykfpxx.LXDH" input-align="right" disabled  required/>
        <!--邮箱-->
        <van-field label="邮　　箱" :value="ykfpxx.EMAIL" input-align="right" disabled  required/>
        <!--邮寄地址-->
        <van-field label="邮寄地址" :value="ykfpxx.YJDZ" type="textarea" rows="1" autosize input-align="right" disabled  />
        <!--税号-->
        <van-field label="税　　号" :value="ykfpxx.SH" input-align="right" disabled />
        <!--公司地址-->
        <van-field label="公司地址" :value="ykfpxx.GSDZ" type="textarea" rows="1" autosize input-align="right" disabled  />
        <!--开户银行-->
        <van-field label="开户银行" :value="ykfpxx.KHYH" input-align="right" disabled  />
        <!--银行账户-->
        <van-field label="银行账户" :value="ykfpxx.YHZH" input-align="right" disabled  />
        <p/>
        <!--发票号码-->
        <van-field label="发票号码" :value="ykfpxx.FPHM" type="textarea" rows="1" autosize input-align="right" disabled  />
        <!--发票代码-->
        <van-field label="发票代码" :value="ykfpxx.FPDM" type="textarea" rows="1" autosize input-align="right" disabled  />
        <p/>
        <!--发票明细-->
        <van-panel title="明细">
          <div v-for="(item,index) in ykfpxx.FPMX" :key="index" class="mx-list">
            <van-field label="商品名称" :value="item.VIDEONAME" type="textarea" rows="1" autosize input-align="right" disabled  style="color:#969799"/>
            <van-field label="商品类型" :value="item.TYPE == 'ps' ? '产品服务' : '视频课程'" input-align="right" disabled  style="color:#969799"/>
            <van-field label="价　　格" :value="item.COST+'元'" input-align="right" disabled  style="color:#969799"/>
            <van-field label="时　　间" :value="item.CREATETIME" input-align="right" disabled  style="color:#969799"/>
            <van-divider/>
          </div>
        </van-panel>
      </div>
      <p/>
  </div>
    <!--加载遮罩层-->
    <van-overlay :show="lodingOverlayShow" z-index="103">
      <div class="wrapper" @click.stop>
        <van-loading/>
      </div>
    </van-overlay>
  </div>
</template>

<script>
  import axios from 'axios';
  import { List,Cell,Sticky,NavBar,Field,Panel,Divider,Loading,Overlay,Notify,PullRefresh  } from 'vant';
  export default {
    name: "yk-fp",
    components:{
      [PullRefresh.name]:PullRefresh,
      [Overlay.name]:Overlay,
      [Loading.name]:Loading,
      [Divider.name]:Divider,
      [Panel.name]:Panel,
      [Notify.name]:Notify,
      [Field.name]:Field,
      [NavBar.name]:NavBar,
      [Sticky.name]:Sticky,
      [Cell.name]:Cell,
      [List.name]:List
    },
    data(){
      return{
        loading:false, // 列表是否在加载中
        finished:true, //列表是否加载完全
        loadText:"加载中",
        refreshIsLoading:false, //下拉状态
        ykAllData:[], //已开发票列表
        showOverlayFlag:false,//发票信息显示标志
        ykfpxx:{
          FPLX:"",//发票类型
          QYMC:"",//企业名称
          LXDH:"",//联系电话
          EMAIL:"",//电子邮箱
          YJDZ:"",//邮寄地址
          SH:"",//税号
          GSDZ:"",//公司地址
          KHYH:"",//开户银行
          YHZH:"",//银行账户
          FPHM:"",//发票号码
          FPDM:"",//发票代码
          FPMX:[
            {
              VIDEONAME:"", //商品名称
              TYPE:"", //商品类型
              COST:"",//商品价格
            }
          ],//发票明细
        },//当前申请记录的明细
        lodingOverlayShow:false,//加载遮罩层
        requestYkListData:{
          limit: 10,
          page:0,
          OPENID: this.$store.state.userInfo.openid,
        },//请求已开发票列表的参数
        requestOneYkData:{
          OPENID:this.$store.state.userInfo.openid,
          KPSQID:""
        }//请求已开发票详细信息的参数
      }
    },
    methods:{
      onLoad(){
        this.requestYkListData.page++;
        this.loading = true;
        this.requestAxios("/aisino/getYkfpListByOpenid",this.requestYkListData,"请求已开发票列表失败",this.getYkfpListSuccess,this.getYkfpListError,false);
      },//加载列表
      onRefresh(){
        // 清空列表数据
        this.ykAllData = [];
        this.requestYkListData.page = 0;
        this.finished = false;
        // 重新加载数据
        // 将 refreshIsLoading 设置为 true，表示处于加载状态
        this.refreshIsLoading = true;
        this.onLoad();
      },//下拉刷新操作函数
      clickOneYkfp(KPSQID){
        this.ykfpxx = [];
        this.requestOneYkData.KPSQID = KPSQID;
        this.requestAxios("/aisino/getOneYkfpInfoByKpsqIdAndOpenid",this.requestOneYkData,"请求发票详情失败",this.getOneYkfpInfoSuccess,this.getOneYkfpInfoError,true);
        this.showOverlayFlag = true;
      },//点击获取当前发票的详情
      notifyStr(type,msg){
        Notify({ type: type, message: msg });
      },//弹出提示
      onClickBarLeft(){
        this.showOverlayFlag = false;
      },//返回上一页
      FplxFn(FPLX){
        if(FPLX == "0"){
          return "电子发票"
        }else if(FPLX == "1"){
          return "专用发票"
        }else if(FPLX == "2"){
          return "普通发票"
        }
        return ""
      }, //动态判断发票类型
      requestAxios(url,data,errorMsg,successFn,errorFn,layFlag){
        if(layFlag){
          this.lodingOverlayShow = true;
        }
        axios.post(url, data).then(response => {
          successFn(response.data);
          this.lodingOverlayShow = false;
        }).catch(error => {
          errorFn(errorMsg);
          this.lodingOverlayShow = false;
        });
      },//请求后台 (路由，数据，失败的msg,，成功执行函数,失败执行函数,是否显示加载层)
      getOneYkfpInfoSuccess(responseData){
        if(responseData.success){
          this.ykfpxx = responseData.obj;
        }else{
          this.notifyStr("danger",responseData.msg);
        }
      }, //请求指定已开发票信息成功
      getOneYkfpInfoError(errorMsg){
        this.notifyStr("danger",errorMsg);
      }, //请求指定已开发票信息失败
      getYkfpListSuccess(responseData){
        if(responseData.success){
          if(responseData.obj[1].length>0){
            this.ykAllData = this.ykAllData.concat(responseData.obj[1])
          }
          responseData.obj[0] == this.ykAllData.length ? this.finished = true : null;
        }else{
          this.finished = true;
          this.notifyStr("danger",responseData.msg);
        }
        this.refreshIsLoading = false;
        this.loading = false;
      },//请求已开发票列表成功
      getYkfpListError(errorMsg){
        this.lodingOverlayShow = false;
        this.loading = false;
        this.finished = true;
        this.refreshIsLoading = false;
        this.notifyStr("danger",errorMsg);
      },//请求已开发票列表失败
    },
    created(){
      this.onLoad();
    },
  }
</script>

<style scoped>
  .ykfp-list-div{
    min-height: 100vh;
  }
  .van-list .ykfp-cell{
    background: #fff !important;
    border-radius: 5px !important;
    padding:5px 0px 5px 7px !important;
    margin: 2vw auto !important;
    border: 1px solid #e9eaeb !important;
    width: 90vw !important;
  }
  .ykfp-list-div .van-cell:not(:last-child)::after{
    border:none;
  }
  .ykfp-cell-text-span{
    display: block;
    padding:1px 0;
    color: #5f5f5f;
    font-size: 14px;
    -webkit-line-clamp: 1;
    text-align: left;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .ykfp-fpxx{
    overflow-x:hidden;
    overflow-y:scroll;
    -webkit-overflow-scrolling: touch;
    width: 100vw;
    min-height: 101%;
    position: fixed;
    bottom:0;
    top: 0;
    left: 0;
    z-index: 102;
    background: #f6f6f6;
  }
  .mx-list .van-cell:not(:last-child)::after{
    border:none;
  }
  .mx-list .van-cell{
    padding: 2px 16px;
  }
  .mx-list .van-divider{
    margin:0 0;
  }
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
</style>
