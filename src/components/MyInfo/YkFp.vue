<template>
  <div class="my-info-ykfp-div">
    <!--列表-->
    <div class="ykfp-list-div">
      <van-list v-model="loading" :finished="finished" :loading-text="loadText" :offset="100" @load="onLoad">
        <van-cell class="ykfp-cell" v-for="(item, index) in ykAllData" :key="index" is-link center @click="clickOneYkfp(item.KPSQID)">
          <template slot="title">
          <span class="ykfp-cell-text-span" >
            企业名称(个人)：<span>{{item.QYMC}}</span>
          </span>
            <span class="ykfp-cell-text-span" >
            金　　额：<span>{{item.ZJE}}</span>元
          </span>
          </template>
        </van-cell>
      </van-list>
    </div>
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
        <van-field label="邮　　箱" :value="ykfpxx.EMAIL" input-align="right" disabled  />
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
  import { List,Cell,Sticky,NavBar,Field,Panel,Divider,Loading,Overlay,Notify  } from 'vant';
  export default {
    name: "yk-fp",
    components:{
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
        loading:false,
        finished:true,
        loadText:"加载中",
        ykAllData:[
          {
            KPSQID:"kpsqid1",//开票申请ID
            QYMC:"企业名称（个人）1",//企业名称
            ZJE:123.35//总金额
          },
          {
            KPSQID:"kpsqid2",//开票申请ID
            QYMC:"企业名称（个人）2",//企业名称
            ZJE:2123.35//总金额
          },
          {
            KPSQID:"kpsqid3",//开票申请ID
            QYMC:"企业名称（个人）3",//企业名称
            ZJE:3123.35//总金额
          },
          {
            KPSQID:"kpsqid4",//开票申请ID
            QYMC:"企业名称（个人）4",//企业名称
            ZJE:4123.35//总金额
          },
          {
            KPSQID:"kpsqid5",//开票申请ID
            QYMC:"企业名称（个人）5",//企业名称
            ZJE:5123.35//总金额
          },
          {
            KPSQID:"kpsqid6",//开票申请ID
            QYMC:"企业名称（个人）6",//企业名称
            ZJE:6123.35//总金额
          },
        ],
        showOverlayFlag:false,//发票信息显示标志
        ykfpxx:{
          FPLX:"1",//发票类型
          QYMC:"宝鸡有一群怀揣着梦想的少年相信在牛大叔的带领下会创造生命的奇迹网络科技有限公司",//企业名称
          LXDH:"028-3221965",//联系电话
          EMAIL:"978784945@qq.com",//电子邮箱
          YJDZ:"四川省成都市锦江区中道街秀色天涯1单元11楼1101号",//邮寄地址
          SH:"91510105MA6B6FA64H",//税号
          GSDZ:"四川省成都市锦江区中道街秀色天涯1单元11楼1101号",//公司地址
          KHYH:"四川省成都市工商银行成都分行锦江区支行",//开户银行
          YHZH:"6212264402074359851",//银行账户
          FPHM:"1300053140,1300053141,1300053142",//发票号码
          FPDM:"02995606,02995607,02995608",//发票代码
          FPMX:[
            {
              VIDEONAME:"122测试产品服务", //商品名称
              TYPE:"ps", //商品类型
              COST:"100",//商品价格
            },
            {
              VIDEONAME:"2222测试视频", //商品名称
              TYPE:"video", //商品类型
              COST:"100",//商品价格
            }
          ],//发票明细
        },//当前申请记录的明细
        lodingOverlayShow:false,//加载遮罩层
      }
    },
    methods:{
      onLoad(){

      },//加载列表
      clickOneYkfp(KPSQID){
        this.showOverlayFlag = true;
        this.requestAxios("/aaa/aa/aa",null,"请求失败",this.getHistorySuccess,true)
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
      requestAxios(url,data,errorMsg,successFn,layFlag){
        if(layFlag){
          this.lodingOverlayShow = true;
        }
        axios.post(url, data).then(response => {
          successFn();
          this.lodingOverlayShow = false;
        },error => {
          this.lodingOverlayShow = false;
          this.notifyStr("danger",errorMsg);
        });
      },//请求后台 (路由，数据，失败的msg,成功的执行函数，是否显示加载层)
    }
  }
</script>

<style scoped>
  .ykfp-list-div .van-cell:not(:last-child)::after{
    border:none;
  }
  .ykfp-cell{
    background: #fff;border-radius: 5px;padding:5px 0px 5px 7px;
    margin: 2vw auto;border: 1px solid #e9eaeb;width: 90vw;
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
