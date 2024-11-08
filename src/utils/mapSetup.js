import { expressEastRouteCoordinates, expressEastBusStops } from './busData/expressEastData';
import { expressWestRouteCoordinates, expressWestBusStops } from './busData/expressWestData';
import { hospitalExpressRouteCoordinates, hospitalExpressBusStops } from './busData/hospitalExpressData';
import { hospitalRouteCoordinates, hospitalBusStops } from './busData/hospitalData';
import { innerRouteCoordinates, innerBusStops } from './busData/innerData';
import { outerRouteCoordinates, outerBusStops } from './busData/outerData';
import { railroadRouteCoordinates, railroadBusStops } from './busData/railroadData';
import { bikeShareStations } from './bikeData/bikeShare';

const leafletHTML = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
      <style>
        #map {
          height: 100%; 
          width: 100%; 
          margin: 0; 
          position: relative; 
          overflow: hidden;
        }
        body, html { 
          height: 100%; 
          margin: 0; 
          padding: 0; 
          overflow: hidden; 
        }
        .leaflet-control-container { 
          overflow: visible; 
          z-index: 1000; 
        }
      </style>
    </head>


    <body>
      <div id="map"></div>
      <script>

        // Create marker icons
        var expressEastStopIcon = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
          iconSize: [18, 30],
          iconAnchor: [9, 30],
          popupAnchor: [1, -25],
          shadowSize: [35, 35] 
        });

        var expressWestStopIcon = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
          iconSize: [18, 30],
          iconAnchor: [9, 30],
          popupAnchor: [1, -25],
          shadowSize: [35, 35] 
        });

        var hospitalExpressStopIcon = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
          iconSize: [18, 30],
          iconAnchor: [9, 30],
          popupAnchor: [1, -25],
          shadowSize: [35, 35] 
        });

        var hospitalStopIcon = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
          iconSize: [18, 30],
          iconAnchor: [9, 30],
          popupAnchor: [1, -25],
          shadowSize: [35, 35] 
        });

        var innerStopIcon = new L.Icon({ 
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png', 
          iconSize: [18, 30],
          iconAnchor: [9, 30],
          popupAnchor: [1, -25],
          shadowSize: [35, 35] 
        });

        var outerStopIcon = new L.Icon({ 
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png', 
          iconSize: [18, 30],
          iconAnchor: [9, 30],
          popupAnchor: [1, -25],
          shadowSize: [35, 35] 
        });

        var railroadStopIcon = new L.Icon({ 
          iconSize: [18, 30],
          iconAnchor: [9, 30],
          popupAnchor: [1, -25],
          shadowSize: [35, 35] 
        });

        var bikeIcon = new L.Icon({ 
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png', 
          iconSize: [22, 37],
          iconAnchor: [11, 37],
          popupAnchor: [1, -30],
          shadowSize: [40, 40]
        });

        //Bus Icons
        var busExpressEast = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
          iconSize: [26, 44],
          iconAnchor: [13, 44],
          popupAnchor: [1, -34],
          shadowSize: [44, 44]
        });

        var busExpressWest = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
          iconSize: [22, 37],
          iconAnchor: [11, 37],
          popupAnchor: [1, -30],
          shadowSize: [40, 40]
        });

        var busHospitalExpress = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
          iconSize: [22, 37],
          iconAnchor: [11, 37],
          popupAnchor: [1, -30],
          shadowSize: [40, 40]
        });

        var busHospital = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
          iconSize: [22, 37],
          iconAnchor: [11, 37],
          popupAnchor: [1, -30],
          shadowSize: [40, 40]
        });

        var busInner = new L.Icon({ 
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png', 
          iconSize: [22, 37],
          iconAnchor: [11, 37],
          popupAnchor: [1, -30],
          shadowSize: [40, 40]
        });

        var busOuter = new L.Icon({ 
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png', 
          iconSize: [22, 37],
          iconAnchor: [11, 37],
          popupAnchor: [1, -30],
          shadowSize: [40, 40]
        });

        var busRailroad = new L.Icon({ 
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png',
          iconSize: [22, 37],
          iconAnchor: [11, 37],
          popupAnchor: [1, -30],
          shadowSize: [40, 40]
        });

        var busIcon = new L.Icon({ 
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gray.png',
          iconSize: [22, 37],
          iconAnchor: [11, 37],
          popupAnchor: [1, -30],
          shadowSize: [40, 40]
        });

        // Initialize map
        var map = L.map('map', { zoomControl: false }).setView([40.9126, -73.1234], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);

        // Function to update user location
        function updateUserLocation(lat, lng) {
          if (userMarker) { map.removeLayer(userMarker); }
          userMarker = L.marker([lat, lng]).addTo(map).bindPopup('You are here').openPopup();
          map.setView([lat, lng], 15);
        }

        // Initialize map features
        var userMarker, 
        expressEastPolyline, 
        expressWestPolyline, 
        hospitalExpressPolyline, 
        hospitalPolyline, 
        innerPolyLine, 
        outerPolyLine, 
        railroadPolyline;

        var expressEastStopMarkers = [], 
        expressWestStopMarkers = [], 
        hospitalExpressStopMarkers = [], 
        hospitalStopMarkers = [], 
        innerStopMarkers = [], 
        outerStopMarkers = [], 
        railroadStopMarkers = [], 
        bikeShareMarkers = [];

        var busMarkers = {};

        // Function to update bus markers on the map
        function updateBusMarkers(buses) {
          Object.keys(busMarkers).forEach(id => {
            if (!buses.some(bus => bus.id === parseInt(id))) {
              map.removeLayer(busMarkers[id]);
              delete busMarkers[id];
            }
          });

          buses.forEach(bus => {
            let markerIcon;
            let name;

            switch (bus.route) {
              case 529:
                markerIcon = busExpressEast;
                name = 'Express East';
                break;
              case 530:
                markerIcon = busExpressWest;
                name = 'Express West';
                break;
              case 531:
                markerIcon = busHospital;
                name = 'Hospital';
                break;
              case 533:
                markerIcon = busInner;
                name = 'Inner';
                break;
              case 534:
                markerIcon = busOuter;
                name = 'Outer';
                break;
              case 537:
                markerIcon = busRailroad;
                name = 'Railroad';
                break;
              default:
                return;
            }

            if (busMarkers[bus.id]) {
              busMarkers[bus.id].setLatLng([bus.lat, bus.lon]);
            } else {
              const marker = L.marker([bus.lat, bus.lon], { icon: markerIcon });
              marker.bindPopup(\`
              <div>
                <strong>\${name}</strong><br />
                Heading: \${bus.heading}°<br />
                Last stop ID: \${bus.lastStop || 'Unknown'}
              </div>
            \`);
              busMarkers[bus.id] = marker;
            }
          });
        }


        // Function to show map features
        function updateMapFeatures(showExpressEast, showExpressWest, showHospitalExpress, showHospital, showInner, showOuter, showRailroad, showBikeShare) {
          // Clear existing layers
          if (expressEastPolyline) map.removeLayer(expressEastPolyline);
          if (expressWestPolyline) map.removeLayer(expressWestPolyline);
          if (hospitalExpressPolyline) map.removeLayer(hospitalExpressPolyline);
          if (hospitalPolyline) map.removeLayer(hospitalPolyline);
          if (innerPolyLine) map.removeLayer(innerPolyLine);
          if (outerPolyLine) map.removeLayer(outerPolyLine);
          if (railroadPolyline) map.removeLayer(railroadPolyline);

          expressEastStopMarkers.forEach(marker => map.removeLayer(marker));
          expressWestStopMarkers.forEach(marker => map.removeLayer(marker));
          hospitalExpressStopMarkers.forEach(marker => map.removeLayer(marker));
          hospitalStopMarkers.forEach(marker => map.removeLayer(marker));
          innerStopMarkers.forEach(marker => map.removeLayer(marker));
          outerStopMarkers.forEach(marker => map.removeLayer(marker));
          railroadStopMarkers.forEach(marker => map.removeLayer(marker));
          bikeShareMarkers.forEach(marker => map.removeLayer(marker));

          // Clear existing layers
          expressEastStopMarkers = [];
          expressWestStopMarkers = [];
          hospitalExpressStopMarkers = [];
          hospitalStopMarkers = [];
          innerStopMarkers = [];
          outerStopMarkers = [];
          railroadStopMarkers = [];
          bikeShareMarkers = [];

          // Add bike share stations
          if (showBikeShare) {
            ${JSON.stringify(bikeShareStations)}.forEach(station => {
              var marker = L.marker(station.position, { icon: bikeIcon }).addTo(map);
              marker.bindPopup(station.name);
              bikeShareMarkers.push(marker);
            });
          }

          // Add express east route
          if (showExpressEast) {
            expressEastPolyline = L.polyline(${JSON.stringify(expressEastRouteCoordinates)}, {color: 'blue', weight: 3}).addTo(map);
            ${JSON.stringify(expressEastBusStops)}.forEach(stop => {
              var marker = L.marker(stop.position, { icon: expressEastStopIcon }).addTo(map);
              marker.bindPopup(stop.name);
              expressEastStopMarkers.push(marker);
            });

            Object.keys(busMarkers).forEach(id => {
              if (busMarkers[id].options.icon === busExpressEast)
                map.addLayer(busMarkers[id]);
            });
          } else {
            Object.keys(busMarkers).forEach(id => {
              if (busMarkers[id].options.icon === busExpressEast)
                map.removeLayer(busMarkers[id]);
            });
          }

          // Add express west route
          if (showExpressWest) {
            expressWestPolyline = L.polyline(${JSON.stringify(expressWestRouteCoordinates)}, {color: 'red', weight: 3}).addTo(map);
            ${JSON.stringify(expressWestBusStops)}.forEach(stop => {
              var marker = L.marker(stop.position, { icon: expressWestStopIcon }).addTo(map);
              marker.bindPopup(stop.name);
              expressWestStopMarkers.push(marker);
            });

            Object.keys(busMarkers).forEach(id => {
              if (busMarkers[id].options.icon === busExpressWest)
                map.addLayer(busMarkers[id]);
            });
          } else {
            Object.keys(busMarkers).forEach(id => {
              if (busMarkers[id].options.icon === busExpressWest)
                map.removeLayer(busMarkers[id]);
            });
          }

          // Add hospital express route
          if (showHospitalExpress) {
            hospitalExpressPolyline = L.polyline(${JSON.stringify(hospitalExpressRouteCoordinates)}, {color: 'violet', weight: 3}).addTo(map);
            ${JSON.stringify(hospitalExpressBusStops)}.forEach(stop => {
              var marker = L.marker(stop.position, { icon: hospitalExpressStopIcon }).addTo(map);
              marker.bindPopup(stop.name);
              hospitalExpressStopMarkers.push(marker);
            });

            Object.keys(busMarkers).forEach(id => {
              if (busMarkers[id].options.icon === busHospitalExpress)
                map.addLayer(busMarkers[id]);
            });
          } else {
            Object.keys(busMarkers).forEach(id => {
              if (busMarkers[id].options.icon === busHospitalExpress)
                map.removeLayer(busMarkers[id]);
            });
          }

          // Add hospital route
          if (showHospital) {
            hospitalPolyline = L.polyline(${JSON.stringify(hospitalRouteCoordinates)}, {color: 'purple', weight: 3}).addTo(map);
            ${JSON.stringify(hospitalBusStops)}.forEach(stop => {
              var marker = L.marker(stop.position, { icon: hospitalStopIcon}).addTo(map);
              marker.bindPopup(stop.name);
              hospitalStopMarkers.push(marker);
            });

            Object.keys(busMarkers).forEach(id => {
              if (busMarkers[id].options.icon === busHospital)
                map.addLayer(busMarkers[id]);
            });
          } else {
            Object.keys(busMarkers).forEach(id => {
              if (busMarkers[id].options.icon === busHospital)
                map.removeLayer(busMarkers[id]);
            });
          }

          // Add inner loop
          if (showInner) {
            innerPolyLine = L.polyline(${JSON.stringify(innerRouteCoordinates)}, {color: 'orange', weight: 3}).addTo(map);
            ${JSON.stringify(innerBusStops)}.forEach(stop => {
              var marker = L.marker(stop.position, { icon: innerStopIcon }).addTo(map);
              marker.bindPopup(stop.name);
              innerStopMarkers.push(marker);
            });

            Object.keys(busMarkers).forEach(id => {
              if (busMarkers[id].options.icon === busInner)
                map.addLayer(busMarkers[id]);
            });
          } else {
            Object.keys(busMarkers).forEach(id => {
              if (busMarkers[id].options.icon === busInner)
                map.removeLayer(busMarkers[id]);
            });
          }

          // Add outer loop
          if (showOuter) {
            outerPolyLine = L.polyline(${JSON.stringify(outerRouteCoordinates)}, {color: 'green', weight: 3}).addTo(map);
            ${JSON.stringify(outerBusStops)}.forEach(stop => {
              var marker = L.marker(stop.position, { icon: outerStopIcon}).addTo(map);
              marker.bindPopup(stop.name);
              outerStopMarkers.push(marker);
            });

            Object.keys(busMarkers).forEach(id => {
              if (busMarkers[id].options.icon === busOuter)
                map.addLayer(busMarkers[id]);
            });
          } else {
            Object.keys(busMarkers).forEach(id => {
              if (busMarkers[id].options.icon === busOuter)
                map.removeLayer(busMarkers[id]);
            });
          }

          // Add railroad loop
          if (showRailroad) {
            railroadPolyline = L.polyline(${JSON.stringify(railroadRouteCoordinates)}, {color: 'black', weight: 3}).addTo(map);
            ${JSON.stringify(railroadBusStops)}.forEach(stop => {
              var marker = L.marker(stop.position, { icon: railroadStopIcon }).addTo(map);
              marker.bindPopup(stop.name);
              railroadStopMarkers.push(marker);
            });

            Object.keys(busMarkers).forEach(id => {
              if (busMarkers[id].options.icon === busRailroad)
                map.addLayer(busMarkers[id]);
            });
          } else {
            Object.keys(busMarkers).forEach(id => {
              if (busMarkers[id].options.icon === busRailroad)
                map.removeLayer(busMarkers[id]);
            });
          }
        }

        window.addEventListener('message', function(event) {
          var data = JSON.parse(event.data);
          if (data.type === 'userLocation') {
            updateUserLocation(data.latitude, data.longitude);
          } else if (data.type === 'toggleFeatures') {
            updateMapFeatures(data.showExpressEast, data.showExpressWest, data.showHospitalExpress, 
              data.showHospital, data.showInner, data.showOuter, data.showRailroad, data.showBikeShare);
          } else if (data.type === 'busData') {
            updateBusMarkers(data.buses);
          }
        });

      </script>
    </body>
  </html>
`;

export { leafletHTML };