<template>
  <div id="app">
    <keep-alive>
      <router-view/>
    </keep-alive>
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
  }
</style>
