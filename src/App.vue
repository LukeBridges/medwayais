<template>
    <div id="app">
        <Menu/>
        <router-view/>
    </div>
</template>

<script>
  import Menu from './components/Menu'
  import CopyrightDisclaimer from './components/Map/CopyrightDisclaimer'
  import MapKey from './components/Map/MapKey'
  import MapShipStats from './components/Map/MapShipStats'

  export default {
    name: 'App',
    components: {Menu, CopyrightDisclaimer, MapKey, MapShipStats},
  }
</script>

<style>
    @import "assets/style1.css";

    #app {
        font-family: "Segoe UI", "Lucida Sans Unicode", "Bitstream Vera Sans", "Trebuchet Unicode MS", "Lucida Grande", Verdana, Helvetica, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
