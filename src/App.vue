<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive">
        <!-- 这里是会被缓存的视图组件，比如 page1,page2 -->
      </router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive">
      <!-- 这里是不被缓存的视图组件，比如 page3 -->
    </router-view>
  </div>
</template>

<script>
  export default {
    name: 'App',
  };
</script>

<style>
  body {
    margin: 0 !important;
    padding: 0 !important;
    box-sizing: border-box !important;
    min-height:100vh !important;
    width: 100vw !important;
    background: #fff !important;
  }
</style>
