<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  @import "./assets/css/reset.css";
  @import "./assets/css/common.css";
  #app{
    width: 100vw;
    height: 100vh;
    overflow: auto;
  }
</style>
