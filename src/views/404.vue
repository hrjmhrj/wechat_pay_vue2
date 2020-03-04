<template>
</template>

<script>
  import { Toast } from 'vant';
  export default {
    name: "page404",
    created(){
      Toast.fail({
        duration: 0,
        icon: "warning",
        message: "404\n页面不存在"
      });
    }
  }
</script>

<style scoped>

</style>
