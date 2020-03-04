<template>
</template>

<script>
    import { Toast } from 'vant';
    export default {
      name: "page500",
      created(){
        Toast.fail({
          duration: 0,
          icon: "warning",
          message: "500\n访问出错"
        });
      }
    }
</script>

<style scoped>

</style>
