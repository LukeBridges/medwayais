<template>
    <div>
        <div id="map" style="width:100%;height:100%"></div>
        <div id="keyTable" class="mapPane">
            <div id="shiptime"></div>
            <div id="countDownTextWrapper">Next plot update in {{countDownTime}} seconds.</div>
            <MapKey></MapKey>
        </div>
        <MapShipStats :ship-move="shipMove" :ship-docked="shipDocked" :ship-farthest="shipFarthest"></MapShipStats>
        <CopyrightDisclaimer></CopyrightDisclaimer>
    </div>
</template>

<script>
  import CopyrightDisclaimer from '../components/Map/CopyrightDisclaimer'
  import MapKey from '../components/Map/MapKey'
  import MapShipStats from '../components/Map/MapShipStats'
  import lbjsais from '../lbjs.ais'
  import Tooltip from '../tooltip'
  import * as $ from 'jquery'

  let map, tooltip, gmarkers,
    numrefresh = 180,
    htmls, vectors,
    refreshcounter = 0,
    counter, maxrange = 0,
    maxname, maxmmsi, maxlat, maxlon, maxbearing, maxindex

  export default {
    name: 'Map',
    components: {MapShipStats, MapKey, CopyrightDisclaimer},
    data () {
      return {
        mapCentre: {lat: 51.43245, lng: 0.688333333},
        myLat: 51.3327,
        myLon: 0.4439,
        refreshInterval: 60,
        countDownTime: 0,
        shipMove: '',
        shipDocked: '',
        shipFarthest: '',
      }
    },
    mounted () {
      this.countDownTime = this.refreshInterval + 1
      let mapElem = $(document.getElementById('map'))
      map = new google.maps.Map(mapElem[0], {
        scrollwheel: false,
        zoom: 11,
        center: this.mapCentre,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP,
        },
        streetViewControl: true,
        streetViewControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP,
        },
      })
      map.controls[google.maps.ControlPosition.LEFT_TOP].push(document.getElementById('keyTable'))
      map.controls[google.maps.ControlPosition.RIGHT_TOP].push(document.getElementById('shipStats'))
      mapElem.height(window.innerHeight - 35)

      lbjsais.icons.home = this.mapIcon(require('../assets/mapIcons/marker.png'), 2)
      this.createMarker(
        map,
        new google.maps.LatLng(this.myLat, this.myLon),
        'Receiving Point',
        null,
        lbjsais.icons.home,
      )

      tooltip = document.createElement('div')
      tooltip.style.visibility = 'hidden'

      lbjsais.icons.k = this.mapIcon(require('../assets/mapIcons/mm_20_gray.png'), 0)
      lbjsais.icons.b = this.mapIcon(require('../assets/mapIcons/mm_20_blue.png'), 0)
      lbjsais.icons.a = this.mapIcon(require('../assets/mapIcons/mm_20_red.png'), 0)
      lbjsais.icons.g = this.mapIcon(require('../assets/mapIcons/lifebot.png'), 0)
      lbjsais.icons.hs = this.mapIcon(require('../assets/mapIcons/hispdcrft.png'), 0)
      lbjsais.icons.dr = this.mapIcon(require('../assets/mapIcons/mm_20_green.png'), 0)
      lbjsais.icons.r = this.mapIcon(require('../assets/mapIcons/mm_20_yellow.png'), 0)
      lbjsais.icons.w = this.mapIcon(require('../assets/mapIcons/mm_20_white.png'), 0)
      lbjsais.icons.y = this.mapIcon(require('../assets/mapIcons/mm_20_brown.png'), 0)
      lbjsais.icons.m = this.mapIcon(require('../assets/mapIcons/mm_20_black.png'), 0)
      lbjsais.icons.o = this.mapIcon(require('../assets/mapIcons/mm_20_purple.png'), 0)
      lbjsais.icons.n = this.mapIcon(require('../assets/mapIcons/mm_20_brown.png'), 0)
      lbjsais.icons.track = this.mapIcon(require('../assets/mapIcons/shiptrkicon.gif'), 1)

      lbjsais.iconLookup = {
        30: lbjsais.icons.y,
        31: lbjsais.icons.o,
        32: lbjsais.icons.o,
        33: lbjsais.icons.dr,
        34: lbjsais.icons.y,
        35: lbjsais.icons.k,
        36: lbjsais.icons.b,
        37: lbjsais.icons.b,
        38: lbjsais.icons.w,
        39: lbjsais.icons.w,
        50: lbjsais.icons.g,
        51: lbjsais.icons.g,
        52: lbjsais.icons.o,
        53: lbjsais.icons.o,
        54: lbjsais.icons.o,
        55: lbjsais.icons.k,
        56: lbjsais.icons.w,
        57: lbjsais.icons.w,
        58: lbjsais.icons.g,
        59: lbjsais.icons.g,
        132: lbjsais.icons.home,
        133: lbjsais.icons.track,
      }

      this.autoUpdate()
    },
    methods: {
      makeInfo (Lat, Lon, name, type, aisstr, i) {
        let ais = aisstr.split('!'),
          mmsi = ais[0],
          imo = ais[1],
          call = ais[2],
          dest = ais[3],
          eta = ais[4],
          speed = ais[5],
          course = ais[6],
          status = lbjsais.getStatus(ais[7]),
          length = ais[8],
          width = ais[9],
          draft = ais[10],
          mtime = ais[11],
          aisclass = ais[13],
          callstr, deststr, etastr, spdstr, sizestr, mmsistr, imostr, recstr, statusstr, rangestr, classstr,

          rb = lbjsais.rangeBearing(this.myLat, this.myLon, Lat, Lon),

          latstr = ((Lat < 0) ? 'S' + Math.abs(Lat) : 'N' + Lat),
          lonstr = ((Lon < 0) ? 'W' + Math.abs(Lon) : 'E' + Lon)

        callstr = deststr = etastr = spdstr = sizestr = mmsistr = imostr = recstr = statusstr = rangestr = classstr = ''

        if (rb.range > maxrange) {
          maxrange = rb.range
          maxname = name
          maxmmsi = mmsi
          maxlat = Lat
          maxlon = Lon
          maxbearing = rb.bearing
          maxindex = i
        }

        if ((type < 100) || (type === 133)) {
          callstr = '<tr><td>Callsign:</td><td>' + call + '</td></tr>\n'
          deststr = '<tr><td>Destination:</td><td>' + dest + '</td></tr>\n'
          etastr = '<tr><td>ETA:</td><td>' + eta + '</td></tr>\n'
        }
        if (type < 100) {
          spdstr = '<tr><td>Speed&Dir:</td><td>' + speed + ' kts / ' + course + '<sup>o</sup></td></tr>\n'
          sizestr = '<tr><td>Size:</td><td>' + length + 'm x ' + width + 'm x ' + draft + 'm</td></tr>\n'
        }
        if (mmsi !== '') {
          mmsistr = '<tr><td>MMSI:</td><td><a href=' + mmsi + '"/db.php?mmsi=">' + mmsi + '</a></td></tr>\n'
        }
        if (imo > 0) {
          imostr = '<tr><td>IMO:</td><td>' + imo + '</td></tr>\n'
        }
        if (mtime !== '') {
          recstr = '<tr><td><sup>Received:&nbsp;</sup></td><td><sup>' + mtime + '</sup></td></tr>\n'
        }
        if (status !== '') {
          statusstr = '<tr><td>Status:</td><td>' + status + '</td></tr>\n'
        }
        if (rb.range !== 0) {
          rangestr = '<tr><td>Range&Bear:&nbsp;&nbsp;</td><td>' + rb.range + 'nm / ' + rb.bearing +
            '<sup>o</sup>T</td></tr>\n'
        }
        if (aisclass !== '') {
          classstr = '<tr><td>AIS Class:</td><td>' + lbjsais.getClass(aisclass) + '</td></tr>\n'
        }

        return '<div class="gpopup"><table cellpadding="0" cellspacing="0">\n' +
          '<tr><td>Name:</td><td>' + name + '</a></td></tr>\n' +
          callstr + mmsistr + imostr + statusstr + deststr + etastr +
          '<tr><td>Type:</td><td>' + lbjsais.getType(type) + '</td></tr>\n' + sizestr + spdstr +
          '<tr><td>Location:</td><td>' + latstr + '<sup>o</sup> / ' + lonstr + '<sup>o</sup></td></tr>\n' +
          rangestr + classstr + '<tr><td colspan="2">&nbsp;</td></tr>\n' + recstr + '</table></div>\n'
      },
      mapIcon (image, i) {
        if (i === 1) {
          return {
            url: image,
            anchor: new google.maps.Point(2, 4),
            origin: new google.maps.Point(0, 0),
            size: new google.maps.Size(4, 4),
          }
        }
        if (i === 2) {
          return {
            url: image,
            anchor: new google.maps.Point(10, 34),
            origin: new google.maps.Point(0, 0),
            size: new google.maps.Size(20, 34),
          }
        }
        return {
          url: image,
          anchor: new google.maps.Point(6, 20),
          origin: new google.maps.Point(0, 0),
          size: new google.maps.Size(12, 20),
        }
      },
      addVector (map, from, deltax, deltay) {
        if (deltax === 0 && deltay === 0) {
          return null
        }
        let to = new google.maps.LatLng(from.lat() + deltay, from.lng() + deltax),
          polyline = new google.maps.Polyline({
            path: [from, to],
            strokeColor: '#00ff00',
            strokeOpacity: 1.0,
            strokeWeight: 2,
          })
        polyline.setMap(map)
        return polyline
      },
      createMarker (map, point, name, html, iconz) {
        let marker = new google.maps.Marker({map: map, position: point, icon: iconz})
        if (html) {
          marker.infowindow = new google.maps.InfoWindow(
            {maxWidth: 400, content: '<div id="tooltip"><span>' + html + '</span></div>'})
          google.maps.event.addListener(marker, 'click', function () {
            marker.infowindow.open(map, marker)
          })
        }
        marker.tooltip = new Tooltip({marker: marker, content: name, cssClass: 'tooltip'})

        return marker
      },
      findShip (i) {
        gmarkers[i].infowindow.open(map, gmarkers[i])
      },
      countDown () {
        this.countDownTime--
        if (this.countDownTime <= 0) {
          this.countDownTime = this.refreshInterval
          clearTimeout(counter)
          this.autoUpdate()
          return
        }
        counter = setTimeout(this.countDown, 1000)
      },
      doUpdate (data) {
        if (!data || !data.documentElement || !Tooltip) {
          return
        }
        let xmlmarker = data.documentElement.getElementsByTagName('marker'),
          movehtml = '',
          dockhtml = '',
          sepmove = '',
          sepdock = '',
          movecnt = 0,
          dockcnt = 0,
          lat, lon, name, deltax, deltay, type, ais, aiss, html, icon, aisclass, i, point,
          shiptime = document.getElementById('shiptime'),
          currentTime = new Date()

        if (!gmarkers) {
          gmarkers = []
        }
        if (!htmls) {
          htmls = []
        }
        if (!vectors) {
          vectors = []
        }

        for (i = 0; i < xmlmarker.length; i += 1) {
          lat = parseFloat(xmlmarker[i].getAttribute('lat'))
          lon = parseFloat(xmlmarker[i].getAttribute('lon'))
          name = xmlmarker[i].getAttribute('name')
          deltax = parseFloat(xmlmarker[i].getAttribute('dx'))
          deltay = parseFloat(xmlmarker[i].getAttribute('dy'))
          type = parseInt(xmlmarker[i].getAttribute('type'), 10)
          htmls[i] = this.makeInfo(lat, lon, name, type, xmlmarker[i].getAttribute('ais'), i)
          ais = xmlmarker[i].getAttribute('ais')
          aiss = ais.split('!')
          aisclass = aiss[13]
          icon = lbjsais.getColour(type)
          if (gmarkers[i]) {
            google.maps.event.clearListeners(gmarkers[i], 'click')
            google.maps.event.clearListeners(gmarkers[i], 'mouseover')
            google.maps.event.clearListeners(gmarkers[i], 'mouseout')
            gmarkers[i].setMap(null)
          }
          point = new google.maps.LatLng(lat, lon)
          gmarkers[i] = this.createMarker(map, point, name, htmls[i], icon)
          if (vectors[i]) {
            vectors[i].setMap(null)
          }
          vectors[i] = this.addVector(map, point, deltax, deltay)
          html = '<a href=\'javascript:findShip(' + i + ')\'>' + name + '</a>'
          if ((Math.abs(deltax) > 0 || Math.abs(deltay) > 0) && aisclass !== 'W') {
            movehtml += sepmove + html
            sepmove = ', '
            movecnt += 1
          } else {
            dockhtml += sepdock + html
            sepdock = ', '
            dockcnt += 1
          }
        }

        this.shipMove = '<h3 style=\'color: black; font-weight: bold;\'>Underway</h3>' + movehtml + '.'
        this.shipDocked = '<h3 style=\'color: black; font-weight: bold;\'>Docked, Anchored or Fixed</h3>' + dockhtml +
          '.'
        let timeText = currentTime.toString()
        timeText = timeText.substring(0, timeText.indexOf('GMT') + 3)
        shiptime.innerHTML = timeText

        html = '<a href=\'javascript:findShip(' + maxindex + ')\'>' + maxname + '</a>'

        this.shipFarthest = '&quot;' + html + '&quot; Range: ' + maxrange

        maxrange = 0
      },
      autoUpdate () {
        $.get({url: '/api/data.xml?' + Math.random(), responseType: 'XML', success: this.doUpdate})

        if (refreshcounter++ < numrefresh) {
          window.setTimeout(this.countDown, 1000)
        } else {
          this.countDownTime = 'Press REFRESH to continue updates.'
        }
      },
    },
  }
</script>

<style>
    @import "../assets/mapstyle.css";
</style>
