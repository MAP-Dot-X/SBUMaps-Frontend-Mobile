import { expressEastRouteCoordinates, expressEastBusStops } from './busData/expressEastData';
import { expressWestRouteCoordinates, expressWestBusStops } from './busData/expressWestData';
import { hospitalExpressLoopRouteCoordinates, hospitalExpressLoopBusStops } from './busData/hospitalExpressData';
import { hospitalRouteCoordinates, hospitalBusStops } from './busData/hospitalLoopData';
import { innerLoopRouteCoordinates, innerLoopBusStops } from './busData/innerLoopData';
import { outerLoopRouteCoordinates, outerLoopBusStops } from './busData/outerLoopData';
import { railroadRouteCoordinates, railroadBusStops } from './busData/railroadLoopData';
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
          iconSize: [12, 20],
          iconAnchor: [6, 20],
          popupAnchor: [1, -18],
          shadowSize: [20, 20] 
        });

        var expressWestStopIcon = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
          iconSize: [12, 20],
          iconAnchor: [6, 20],
          popupAnchor: [1, -18],
          shadowSize: [20, 20],
        });

        var hospitalExpressStopIcon = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
          iconSize: [12, 20],
          iconAnchor: [6, 20],
          popupAnchor: [1, -18],
          shadowSize: [20, 20],
        });

        var hospitalRouteStopIcon = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
          iconSize: [12, 20],
          iconAnchor: [6, 20],
          popupAnchor: [1, -18],
          shadowSize: [20, 20],
        });

        var outerStopIcon = new L.Icon({ 
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png', 
          iconSize: [12, 20], 
          iconAnchor: [6, 20], 
          popupAnchor: [1, -18], 
          shadowSize: [20, 20]
        });

        var innerStopIcon = new L.Icon({ 
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png', 
          iconSize: [12, 20], 
          iconAnchor: [6, 20], 
          popupAnchor: [1, -18], 
          shadowSize: [20, 20]
        });

        var redIcon = new L.Icon({ 
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png', 
          iconSize: [12, 20], 
          iconAnchor: [6, 20], 
          popupAnchor: [1, -18], 
          shadowSize: [20, 20]
        });


        // Initialize map
        var map = L.map('map', { zoomControl: false }).setView([40.9126, -73.1234], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);

        // Initialize map features
        var userMarker, expressEastPolyline, expressWestPolyline, hospitalExpressPolyline, outerPolyLine, innerPolyLine, hospitalPolyline, railroadPolyline;
        var expressEastStopMarkers = [], expressWestStopMarkers = [], hospitalExpressStopMarkers = [], outerStopMarkers = [], innerStopMarkers = [], 
            hospitalStopMarkers = [], railroadStopMarkers = [], bikeShareMarkers = [];

        // Function to update user location
        function updateUserLocation(lat, lng) {
          if (userMarker) { map.removeLayer(userMarker); }
          userMarker = L.marker([lat, lng]).addTo(map).bindPopup('You are here').openPopup();
          map.setView([lat, lng], 15);
        }

        // Function to show map features
        function updateMapFeatures(showExpressEast, showExpressWest, showHospitalExpress, showOuter, showInner, showHospital, showRailroad, showBikeShare) {
          // Clear existing layers
          if (expressEastPolyline) map.removeLayer(expressEastPolyline);
          if (expressWestPolyline) map.removeLayer(expressWestPolyline);
          if (hospitalExpressPolyline) map.removeLayer(hospitalExpressPolyline);
          if (outerPolyLine) map.removeLayer(outerPolyLine);
          if (innerPolyLine) map.removeLayer(innerPolyLine);
          if (hospitalPolyline) map.removeLayer(hospitalPolyline);
          if (railroadPolyline) map.removeLayer(railroadPolyline);
          
          expressEastStopMarkers.forEach(marker => map.removeLayer(marker));
          expressWestStopMarkers.forEach(marker => map.removeLayer(marker));
          hospitalExpressStopMarkers.forEach(marker => map.removeLayer(marker));
          outerStopMarkers.forEach(marker => map.removeLayer(marker));
          innerStopMarkers.forEach(marker => map.removeLayer(marker));
          hospitalStopMarkers.forEach(marker => map.removeLayer(marker));
          railroadStopMarkers.forEach(marker => map.removeLayer(marker));
          bikeShareMarkers.forEach(marker => map.removeLayer(marker));

          // Clear existing layers
          expressEastStopMarkers = [];
          expressWestStopMarkers = [];
          hospitalExpressStopMarkers = [];
          outerStopMarkers = [];
          innerStopMarkers = [];
          hospitalStopMarkers = [];
          railroadStopMarkers = [];
          bikeShareMarkers = [];


          // Add bike share stations
          if (showBikeShare) {
            ${JSON.stringify(bikeShareStations)}.forEach(station => {
              var marker = L.marker(station.position, { icon: redIcon }).addTo(map);
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
          }

          // Add express west route
          if (showExpressWest) {
            expressWestPolyline = L.polyline(${JSON.stringify(expressWestRouteCoordinates)}, {color: 'red', weight: 3}).addTo(map);
            ${JSON.stringify(expressWestBusStops)}.forEach(stop => {
              var marker = L.marker(stop.position, { icon: expressWestStopIcon }).addTo(map);
              marker.bindPopup(stop.name);
              expressWestStopMarkers.push(marker);
            });
          }

          // Add hospital express route
          if (showHospitalExpress) {
            hospitalExpressPolyline = L.polyline(${JSON.stringify(hospitalExpressLoopRouteCoordinates)}, {color: 'violet', weight: 3}).addTo(map);
            ${JSON.stringify(hospitalExpressLoopBusStops)}.forEach(stop => {
              var marker = L.marker(stop.position, { icon: hospitalExpressStopIcon }).addTo(map);
              marker.bindPopup(stop.name);
              hospitalExpressStopMarkers.push(marker);
            });
          }

          // Add outer loop
          if (showOuter) {
            outerPolyLine = L.polyline(${JSON.stringify(outerLoopRouteCoordinates)}, {color: 'green', weight: 3}).addTo(map);
            ${JSON.stringify(outerLoopBusStops)}.forEach(stop => {
              var marker = L.marker(stop.position, { icon: outerStopIcon}).addTo(map);
              marker.bindPopup(stop.name);
              outerStopMarkers.push(marker);
            });
          }

          // Add inner loop
          if (showInner) {
            innerPolyLine = L.polyline(${JSON.stringify(innerLoopRouteCoordinates)}, {color: 'orange', weight: 3}).addTo(map);
            ${JSON.stringify(innerLoopBusStops)}.forEach(stop => {
              var marker = L.marker(stop.position, { icon: innerStopIcon }).addTo(map);
              marker.bindPopup(stop.name);
              innerStopMarkers.push(marker);
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
          }

          // Add railroad loop
          if (showRailroad) {
            railroadPolyline = L.polyline(${JSON.stringify(railroadRouteCoordinates)}, {color: 'black', weight: 3}).addTo(map);
            ${JSON.stringify(railroadBusStops)}.forEach(stop => {
              var marker = L.marker(stop.position, { icon: redIcon }).addTo(map);
              marker.bindPopup(stop.name);
              railroadStopMarkers.push(marker);
            });
          }
        }

        window.addEventListener('message', function(event) {
          var data = JSON.parse(event.data);
          if (data.type === 'userLocation') {
            updateUserLocation(data.latitude, data.longitude);
          } else if (data.type === 'toggleFeatures') {
            updateMapFeatures(data.showExpressEast, data.showExpressWest, data.showHospitalExpress, data.showOuter, data.showInner, data.showHospital, data.showRailroad, data.showBikeShare);
          }
        });
      </script>
    </body>
  </html>
`;

export { leafletHTML };