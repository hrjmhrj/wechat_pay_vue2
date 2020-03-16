<template>
    <div class="my-info-wkfp-div">
      <!--未开列表-->
      <div>
        <!--列表-->
        <van-pull-refresh v-model="refreshIsLoading" @refresh="onRefresh">
          <van-checkbox-group v-model="wkFpCheckData" @change="checkboxGroupChange">
            <van-list v-model="loading" :finished="finished" :loading-text="loadText" @load="onLoad" :offset="100" :immediate-check="false">
              <van-cell class="tab-checkbox-info" v-for="(item, index) in wkAllData" :key="index">
                <van-checkbox :name="index">
                <span class="checkbox-text-span" >
                  商品名称：<span>{{item.VIDEONAME}}</span>
                </span>
                  <span class="checkbox-text-span" >
                  商品性质：<span v-html="item.TYPE == 'ps' ? '服务产品' : '视频'"/>
                </span>
                  <span class="checkbox-text-span" >
                  金　　额：<span>{{item.COST}}</span>元
                </span>
                  <span class="checkbox-text-span" >
                  时　　间：<span>{{item.CREATETIME}}</span>
                </span>
                </van-checkbox>
              </van-cell>
            </van-list>
          </van-checkbox-group>
        </van-pull-refresh>
        <!--合计提交按钮-->
        <van-submit-bar :price="requestSqkpData.ZJE" :button-text="sqkpButtonText" @submit="onSubmit" button-type="info">
          <van-checkbox v-model="allCheckedFlag" style="margin-left:14px;" @click="allCheckedClick">全选</van-checkbox>
        </van-submit-bar>
      </div>
      <!--填写开票信息-->
      <div v-if="showOverlayFlag" class="write-fpxx">
        <!--头部-->
        <van-sticky :offset-top="0">
          <van-nav-bar title="填写开票信息" left-text="返回" left-arrow @click-left="onClickBarLeft"/>
        </van-sticky>
        <!--填写发票信息-->
        <van-form style="padding-bottom: 50px;">
          <p/>
          <!--选择发票类型-->
          <van-field center label="开票类型" :required="true">
            <template #input>
              <van-radio-group v-model="requestSqkpData.FPLX" direction="horizontal">
                <van-radio name="0">电子发票</van-radio>
                <van-radio name="1">专票</van-radio>
                <van-radio name="2">普票</van-radio>
              </van-radio-group>
            </template>
          </van-field>
          <p/>
          <!--填写企业名称/个人-->
          <van-field v-model="requestSqkpData.KPXX.QYMC" v-if="requiredFlagList[requestSqkpData.FPLX].QYMC[0]" :required="requiredFlagList[requestSqkpData.FPLX].QYMC[1]"  maxlength="100" clearable center input-align="right" label="企业名称/个人" placeholder="企业名称（个人）">
            <van-button @click="actionsList.length>0?actionsShow = !actionsShow:null" :disabled="actionsList.length==0" slot="button" size="small" plain  type="info">历史</van-button>
          </van-field>
          <!--联系电话-->
          <van-field v-model="requestSqkpData.KPXX.LXDH" v-if="requiredFlagList[requestSqkpData.FPLX].LXDH[0]" :required="requiredFlagList[requestSqkpData.FPLX].LXDH[1]" type="tel" label="联系电话" placeholder="请输入联系电话" maxlength="20"/>
          <!--邮寄地址-->
          <van-field v-model="requestSqkpData.KPXX.YJDZ" v-if="requiredFlagList[requestSqkpData.FPLX].YJDZ[0]"  :required="requiredFlagList[requestSqkpData.FPLX].YJDZ[1]" type="text" label="邮寄地址" placeholder="请输入邮寄地址" maxlength="100"/>
          <!--邮箱-->
          <van-field v-model="requestSqkpData.KPXX.EMAIL" v-if="requiredFlagList[requestSqkpData.FPLX].EMAIL[0]"  :required="requiredFlagList[requestSqkpData.FPLX].EMAIL[1]" type="text" label="邮箱" placeholder="请输入邮箱地址" maxlength="50"/>
          <p v-if="requestSqkpData.FPLX!=1"/>
          <!--税号-->
          <van-field v-model="requestSqkpData.KPXX.SH" v-if="requiredFlagList[requestSqkpData.FPLX].SH[0]" :required="requiredFlagList[requestSqkpData.FPLX].SH[1]" type="text" label="税号" placeholder="请输入税号" maxlength="20"/>
          <!--公司地址-->
          <van-field v-model="requestSqkpData.KPXX.GSDZ" v-if="requiredFlagList[requestSqkpData.FPLX].GSDZ[0]"  :required="requiredFlagList[requestSqkpData.FPLX].GSDZ[1]" type="text" label="公司地址" placeholder="请输入公司地址" maxlength="89"/>
          <!--开户银行-->
          <van-field v-model="requestSqkpData.KPXX.KHYH" v-if="requiredFlagList[requestSqkpData.FPLX].KHYH[0]"  :required="requiredFlagList[requestSqkpData.FPLX].KHYH[1]" type="text" label="开户银行" placeholder="请输入开户银行" maxlength="100"/>
          <!--银行账户-->
          <van-field v-model="requestSqkpData.KPXX.YHZH" v-if="requiredFlagList[requestSqkpData.FPLX].YHZH[0]"  :required="requiredFlagList[requestSqkpData.FPLX].YHZH[1]" type="tel" label="银行账户" placeholder="请输入银行账户" maxlength="20"/>
        </van-form>
        <!--点击提交-->
        <van-submit-bar :price="requestSqkpData.ZJE" :button-text="tjsqButtonTest" @submit="onFormSubmit" button-type="info"/>
        <!--历史-->
        <van-action-sheet v-model="actionsShow" :round="false" cancel-text="取消" close-on-click-action :actions="actionsList" @select="onActionSelect"/>
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
  import { Checkbox,CheckboxGroup,List,Cell,SubmitBar,Notify,Sticky,NavBar,RadioGroup,Radio,Field } from 'vant';
  import { Form,Button,ActionSheet,Loading,Overlay,PullRefresh  } from 'vant';
  export default {
    components:{
      [PullRefresh.name]:PullRefresh,
      [Overlay.name]:Overlay,
      [Loading.name]:Loading,
      [ActionSheet.name]:ActionSheet,
      [Button.name]:Button,
      [Field.name]:Field,
      [RadioGroup .name]:RadioGroup ,
      [Radio .name]:Radio ,
      [Form .name]:Form ,
      [NavBar.name]:NavBar,
      [Sticky.name]:Sticky,
      [Notify.name]:Notify,
      [SubmitBar.name]:SubmitBar,
      [Cell.name]:Cell,
      [Checkbox.name]:Checkbox,
      [CheckboxGroup.name]:CheckboxGroup,
      [List.name]:List
    },
    name: "wk-fp",
    data(){
      return {
        wkFpCheckData:[], //多选的集合
        wkAllData:[], // 未开票的订单数据
        finished:false, //数据是否加载完成
        loadText: "加载中...", // 加载中的文字
        loading:true, // 列表加载状态
        allCheckedFlag:false, //是否全选中
        sqkpButtonText:"申请开票", //按钮名称
        tjsqButtonTest:"提交开票",//按钮名称
        nulldataImg:false, // 是否有数据
        searchData:{
          limit: 10,
          page:0,
          OPENID: this.$store.state.userInfo.openid,
        },//页面请求参数
        requestSqkpData:{
          OrderIdList:[], //订单List
          ZJE:0.00, //总金额（分）
          ZJE2:0.00,//总金额（元）
          FPLX:"0",//发票类型
          OPENID:this.$store.state.userInfo.openid,
          KPXX:{
            QYMC:"",//企业名称
            SH:"",//税号
            GSDZ:"",//公司地址
            LXDH:"",//联系电话
            KHYH:"",//开户银行
            YHZH:"",//银行账户
            YJDZ:"",//邮寄地址
            EMAIL:"",//电子邮箱
          },//开票信息
        },//填写完开票信息后确认申请开票的参数
        showOverlayFlag:false,//填写开票信息的页面显示标识
        requiredFlagList:[
          {
            QYMC:[true,true],//企业名称
            SH:[true,false],//税号
            GSDZ:[true,false],//公司地址
            LXDH:[true,true],//联系电话
            KHYH:[true,false],//开户银行
            YHZH:[true,false],//银行账户
            YJDZ:[false,false],//邮寄地址
            EMAIL:[true,true],//电子邮箱
          },//电子发票["是否显示","是否必填"]
          {
            QYMC:[true,true],//企业名称
            SH:[true,true],//税号
            GSDZ:[true,true],//公司地址
            LXDH:[true,true],//联系电话
            KHYH:[true,true],//开户银行
            YHZH:[true,true],//银行账户
            YJDZ:[true,true],//邮寄地址
            EMAIL:[false,false],//电子邮箱
          },//专票
          {
            QYMC:[true,true],//企业名称
            SH:[true,false],//税号
            GSDZ:[true,false],//公司地址
            LXDH:[true,true],//联系电话
            KHYH:[true,false],//开户银行
            YHZH:[true,false],//银行账户
            YJDZ:[true,true],//邮寄地址
            EMAIL:[false,false],//电子邮箱
          },//普票
        ],//必填项的标识数组
        actionsShow:false, // 上弹选择器显示标志
        actionsList:[], //上弹选择数组历史
        lodingOverlayShow:false,// 加载中的遮罩层
        refreshIsLoading:false,//下拉加载标志
      }
    },
    methods:{
      onLoad(){
        this.searchData.page++;
        this.loading = true;
        this.requestAxios("/aisino/getWkFpListByOpenid",this.searchData,"请求未开发票订单失败",this.getHistorySuccess,this.getHistoryError,false);
      },// 列表加载方法
      onSubmit(){
        if(this.wkFpCheckData.length>0){
          this.showOverlayFlag = true;
          //初始化一下FPXX
          //Object.assign(this.requestSqkpData.KPXX, this.$options.data().requestSqkpData.KPXX);
          this.requestSqkpData.OrderIdList = [];
          this.wkFpCheckData.forEach((w)=>{
            this.requestSqkpData.OrderIdList.push({"ORDERID":this.wkAllData[w].ORDERID});
          });
          //请求发票信息历史
          if (this.actionsList.length==0){
            this.requestAxios("/aisino/getKpxxHistoryByOpenid",this.searchData,"请求填写历史失败",this.getFpxxHistorySuccess,this.getFpxxHistoryError,false);
          }
        }else{
          Notify({ type: 'danger', message: '至少选择一项' });
        }
      },// 点击申请开票
      onClickBarLeft(){
        this.showOverlayFlag = false;
      },//点击头部返回
      onRefresh(){
        // 清空列表数据
        this.wkFpCheckData = [];
        this.wkAllData = [];
        this.allCheckedFlag = false;
        this.searchData.page = 0;
        this.finished = false;
        // 重新加载数据
        // 将 refreshIsLoading 设置为 true，表示处于加载状态
        this.refreshIsLoading = true;
        this.onLoad();
      },//下拉刷新函数
      onFormSubmit(){
        let checkData = this.requiredFlagList[this.requestSqkpData.FPLX];
        let shReg = new RegExp(/^[A-Z0-9]{15}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/);
        let emailReg = new RegExp(/^[a-zA-Z0-9_]+[a-zA-Z0-9_\-\.]+[a-zA-Z0-9_]+@[\w-]+\.[\w-]+$|^[a-zA-Z0-9_]+[a-zA-Z0-9_\-\.]+[a-zA-Z0-9_]+@[\w-]+\.[\w-]+\.[\w-]+$/);
        let yhzhReg = new RegExp(/^(?:[1-9]{1})(?:\d{15}|\d{18})$/);
        let lxdhSjReg = new RegExp(/^(1[34578]\d{9}$)/);
        let lxdhZjReg = new RegExp(/^(([0-9]{3,4}[-])?[0-9]{7,8}$)/);
        if(checkData.QYMC[1] && this.requestSqkpData.KPXX.QYMC == ""){
          this.notifyStr("danger","请填写企业名称/个人");
          return;
        }else if((checkData.SH[1] && this.requestSqkpData.KPXX.SH == "") || (this.requestSqkpData.KPXX.SH != null && this.requestSqkpData.KPXX.SH != "" && !shReg.test(this.requestSqkpData.KPXX.SH))){
          this.notifyStr("danger","请填写正确的税号");
          return;
        }else if(checkData.GSDZ[1] && this.requestSqkpData.KPXX.GSDZ == ""){
          this.notifyStr("danger","请填写公司地址");
          return;
        }else if((checkData.LXDH[1] && this.requestSqkpData.KPXX.LXDH == "") || (this.requestSqkpData.KPXX.LXDH != null && this.requestSqkpData.KPXX.LXDH != "" && (!lxdhSjReg.test(this.requestSqkpData.KPXX.LXDH) && !lxdhZjReg.test(this.requestSqkpData.KPXX.LXDH)))){
          this.notifyStr("danger","请填写正确的联系电话");
          return;
        }else if(checkData.KHYH[1] && this.requestSqkpData.KPXX.KHYH == ""){
          this.notifyStr("danger","请填写开户银行");
          return;
        }else if((checkData.YHZH[1] && this.requestSqkpData.KPXX.YHZH == "") || (this.requestSqkpData.KPXX.YHZH != null && this.requestSqkpData.KPXX.YHZH != "" && !yhzhReg.test(this.requestSqkpData.KPXX.YHZH))){
          this.notifyStr("danger","请填写正确的银行账户");
          return;
        }else if(checkData.YJDZ[1] && this.requestSqkpData.KPXX.YJDZ == ""){
          this.notifyStr("danger","邮寄地址");
          return;
        }else if((checkData.EMAIL[1] && this.requestSqkpData.KPXX.EMAIL == "") || (this.requestSqkpData.KPXX.EMAIL != null && this.requestSqkpData.KPXX.EMAIL != "" && !emailReg.test(this.requestSqkpData.KPXX.EMAIL))){
          this.notifyStr("danger","请填写正确的电子邮箱");
          return;
        }

        this.requestAxios("/aisino/saveKpxxAndKpsq",this.requestSqkpData,"提交申请失败",this.saveKpsqSuccess,this.saveKpsqError,true);

      },//点击表单提交
      onActionSelect(action){
        this.requestSqkpData.KPXX = action.obj;
      },//选择历史记录的时候
      checkboxGroupChange(names){
        this.allCheckedFlag = this.wkAllData.length == this.wkFpCheckData.length && this.wkFpCheckData.length!=0 ?  true : false;
        if(this.wkFpCheckData.length > 0){
          let allHj = 0.00;
          for(let i = 0; i<this.wkFpCheckData.length; i++){
            allHj += (parseFloat(this.wkAllData[this.wkFpCheckData[i]].COST));
          }
          this.requestSqkpData.ZJE = allHj*100;
          this.requestSqkpData.ZJE2 = allHj;
        }else{
          this.requestSqkpData.ZJE = 0.00;
          this.requestSqkpData.ZJE2 = 0.00;
        }
      },// 多选框修改时触发
      allCheckedClick(){
        if(this.allCheckedFlag){ // 取消全选
          this.allCheckedFlag = false;
          this.wkFpCheckData = [];
        }else{ // 全选
          this.allCheckedFlag = true;
          this.wkFpCheckData = [];
          for(let i=0; i<this.wkAllData.length; i++){
            this.wkFpCheckData.push(i);
          }
        }
      },// 点击全选时触发
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
      },//请求后台 (路由，数据，失败的msg,成功的执行函数，是否显示加载层)
      notifyStr(type,msg){
        Notify({ type: type, message: msg });
      },//弹出提示
      getHistorySuccess(responseData){
        if(responseData.success){
          if(responseData.obj[1].length>0){
            this.allCheckedFlag = false;
            this.wkAllData = this.wkAllData.concat(responseData.obj[1])
          }
          responseData.obj[0] == this.wkAllData.length ? this.finished = true : null;
        }else{
          this.finished = true;
          this.notifyStr("danger",responseData.msg);
        }
        this.refreshIsLoading = false;
        this.loading = false;
      },//获取未开订单成功
      getHistoryError(errorMsg){
        this.lodingOverlayShow = false;
        this.loading = false;
        this.finished = true;
        this.refreshIsLoading = false;
        this.notifyStr("danger",errorMsg);
      },//获取未开订单失败
      getFpxxHistorySuccess(responseData){
        if(responseData.success){
          this.actionsList = responseData.obj;
        }else{
          this.actionsList = [];
        }
      },//获取发票信息历史成功
      getFpxxHistoryError(errorMsg){
        this.actionsList = [];
      },//获取发票信息历史失败
      saveKpsqSuccess(responseData){
        if(responseData.success){
          this.notifyStr("success",responseData.msg);
          this.onRefresh();
          this.actionsList = [];
          this.showOverlayFlag = false;
        }else{
          this.notifyStr("danger",responseData.msg);
        }
      },//提交申请成功
      saveKpsqError(errorMsg){
        this.notifyStr("danger",errorMsg);
      },//提交申请失败
    },
    created(){
      this.onLoad();
    },
    mounted(){
    }
  }
</script>

<style scoped>
  .van-checkbox-group{
    min-height: 100vh;
  }
  .checkbox-text-span{
    display: block;
    padding:1px 0;color: #5f5f5f;font-size: 14px;
    -webkit-line-clamp: 1;
    text-align: left;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .tab-checkbox-info{
    background: #fff;border-radius: 5px;padding:5px 0px 5px 7px;
    margin: 2vw auto;border: 1px solid #e9eaeb;width: 90vw;
  }
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  .van-cell:not(:last-child)::after{
    border:none;
  }
  .write-fpxx{
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
  .van-action-sheet__name{
    -webkit-line-clamp: 1;
    text-align: center;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
