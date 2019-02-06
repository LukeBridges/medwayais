<template>
    <div class="menu">
        <ul>
            <li class="menu-github">
                <a href="https://github.com/LukeBridges/medwayais">
                    <img src="../assets/icons/GitHub-Mark-Light-32px.png" alt="Github"/>
                </a>
            </li>
            <li><router-link to="/">HOME</router-link></li>
            <li><router-link to="/map">LIVE MAP</router-link></li>
            <li><router-link to="/db">DATABASE</router-link></li>
            <li><a href="http://easytide.ukho.gov.uk/EASYTIDE/EasyTide/ShowPrediction.aspx?PortID=0109&amp;PredictionLength=7">Chatham Tides</a></li>
            <li><a href="http://easytide.ukho.gov.uk/EASYTIDE/EasyTide/ShowPrediction.aspx?PortID=0108&amp;PredictionLength=7">Sheerness Tides</a></li>
        </ul>
    </div>
</template>

<script>
  export default {
    name: 'Menu',
  }
</script>

<style scoped>
    @import '../assets/menu_style.css';
</style>
