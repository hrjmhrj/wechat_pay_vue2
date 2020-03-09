<template>
  <!--下拉刷新组件-->
  <van-pull-refresh v-model="refreshIsLoading" @refresh="onRefresh">
    <div style="padding:1vh 2vw;min-height: 100vh;width: 98vw;" class="my-info-div">
      <!--列表组件-->
      <van-list v-model="listLoading" :finished="listFinished" finished-text="没有更多了" @load="onLoadList">
        <van-grid :column-num="2" :gutter="15" :border="false">
          <van-grid-item v-for="(index,item) in listData" :key="item">
            <!--骨屏架组件-->
            <van-skeleton :row="4" :loading="skeletonLoading" row-width="50%">
              <div v-if="index%2==0">
                <van-image radius="10" fit="contain" src="http://hyfwzx.schtxxcdfgs.com:9004/hyfwzxht/springboot/aa62e941-5c01-4714-815c-543d6238a75d-20191029143704.jpg">
                  <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                  </template>
                </van-image>
              </div>
              <div v-else>
                <van-image radius="10" fit="contain" src="http://hywfwzx.schtxxcdfgs.com:9004/hyfwzxht/springboot/aa62e941-5c01-4714-815c-543d6238a75d-20191029143704.jpg">
                  <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                  </template>
                </van-image>
              </div>
              <div>
                <span class="text-overflow text-overflow-title">
                  销方红字发票信息表开具
                </span>
                <span class="text-overflow text-overflow-body">
                  销方红字发票信息表开具示例（20191230）的介绍
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
  import { Skeleton,PullRefresh,List,Grid,GridItem,Image } from 'vant';
  export default {
    name: "purchase-history",
    components:{
      [Image.name]:Image,
      [Grid .name]:Grid, //
      [GridItem .name]:GridItem, //
      [List .name]:List, //列表
      [Skeleton.name]:Skeleton, //骨屏架
      [PullRefresh.name]:PullRefresh //下拉刷新
    },
    data(){
      return{
        skeletonLoading:false, //骨屏架加载标志
        refreshIsLoading:true, //下拉刷新加载标志
        listData: [], //列表数据
        listFinished: false, //数据全部加载完毕
        listLoading: false, //列表加载标志
      }
    },
    methods:{
      // 加载列表数据
      onLoadList() {
        setTimeout(() => {
          if (this.refreshIsLoading) {
            this.listData = [];
            this.refreshIsLoading = false;
          }

          for (let i = 0; i < 10; i++) {
            this.listData.push(this.listData.length + 1);
          }
          this.listLoading = false;

          if (this.listData.length >= 40) {
            this.listFinished = true;
          }
        }, 1000);
      },

      //下拉刷新
      onRefresh() {
        // 清空列表数据
        this.listFinished = false;
        // 重新加载数据
        // 将 refreshIsLoading 设置为 true，表示处于加载状态
        this.refreshIsLoading = true;
        this.onLoadList();
      }
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
    font-size: 13px;
    line-height: 13px;
    height: 26px;
    -webkit-line-clamp: 2;
  }
  .text-overflow-body {
    font-size: 11px;
    line-height: 11px;
    height: 11px;
    color:#8a8a8a;
    -webkit-line-clamp: 1;
  }
</style>
<style>
  .my-info-div .van-grid-item__content{
    padding: 0 0 !important;
  }
</style>
