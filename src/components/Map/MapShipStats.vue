<template>
    <div id="shipStats" class="mapPane">
        <div id="shipmove" v-html="shipMove"></div>
        <div id="shipdocked" v-html="shipDocked"></div>
        <h3><span>Farthest Ship:</span></h3>
        <div id="shipfar" v-html="shipFarthest"></div>
    </div>
</template>

<script>
  export default {
    name: 'MapShipStats',
    props: ['shipMove', 'shipDocked', 'shipFarthest']
  }
</script>

<style scoped>
    #shipmove h3 {
        margin-top: 0;
    }

    .mapPane {
        background: rgb(255, 255, 255);
        margin: 10px;
        margin-top: 0;
        width: 170px;
        border-radius: 2px;
        padding: 8px;
        box-shadow: 0 1px 4px -1px rgba(0, 0, 0, 0.3);
    }
</style>
