<template>
</template>

<script>
  import { Toast } from 'vant';
  export default {
    name: "page405",
    created(){
      Toast.fail({
      duration: 0,
      icon: "warning",
      message: "405\n非法访问"
      });
    }
  }
</script>

<style scoped>

</style>
