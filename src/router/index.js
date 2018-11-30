import Vue from 'vue'
import Router from 'vue-router'
import Map from '../views/Map'
import Home from '../views/Home'
import Database from '../views/Database'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/map',
      name: 'Map',
      component: Map
    },
    {
      path: '/db',
      name: 'DB',
      component: Database
    }
  ]
})
