import { outerLoopRouteCoordinates, outerLoopBusStops } from './outerLoopRoute';
import { innerLoopRouteCoordinates, innerLoopBusStops } from './innerLoopRoute';
import { hospitalRouteCoordinates, hospitalBusStops } from './hospitalLoopRoute';
import { bikeShareStations } from './bikeShare';

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
        var greenIcon = new L.Icon({ 
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png', 
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', 
          iconSize: [25, 41], 
          iconAnchor: [12, 41], 
          popupAnchor: [1, -34], 
          shadowSize: [30, 30] });

        var orangeIcon = new L.Icon({ 
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png', 
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', 
          iconSize: [25, 41], 
          iconAnchor: [12, 41], 
          popupAnchor: [1, -34], 
          shadowSize: [30, 30] });

        var purpleIcon = new L.Icon({ 
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-purple.png', 
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', 
          iconSize: [25, 41], 
          iconAnchor: [12, 41], 
          popupAnchor: [1, -34], 
          shadowSize: [30, 30] });

        var redIcon = new L.Icon({ 
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png', 
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', 
          iconSize: [25, 41], 
          iconAnchor: [12, 41], 
          popupAnchor: [1, -34], 
          shadowSize: [30, 30] });

        // Initialize map
        var map = L.map('map', { zoomControl: false }).setView([40.9126, -73.1234], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);
        L.control.zoom({ position: 'topleft' }).addTo(map);
        var zoomControl = document.querySelector('.leaflet-control-zoom');
        zoomControl.style.position = 'absolute';
        zoomControl.style.top = '58px';
        zoomControl.style.left = '10px';

        // Initialize map features
        var userMarker, outerLoopPolyline, innerLoopPolyline, hospitalPolyline;
        var outerStopMarkers = [], innerStopMarkers = [], hospitalStopMarkers = [], bikeShareMarkers = [];

        // Function to update user location
        function updateUserLocation(lat, lng) {
          if (userMarker) { map.removeLayer(userMarker); }
          userMarker = L.marker([lat, lng]).addTo(map).bindPopup('You are here').openPopup();
          map.setView([lat, lng], 15);
        }

        // Function to show map features
        function updateMapFeatures(showOuter, showInner, showHospital, showBikeShare) {
          // Clear existing layers
          if (outerLoopPolyline) map.removeLayer(outerLoopPolyline);
          if (innerLoopPolyline) map.removeLayer(innerLoopPolyline);
          if (hospitalPolyline) map.removeLayer(hospitalPolyline);
          
          outerStopMarkers.forEach(marker => map.removeLayer(marker));
          innerStopMarkers.forEach(marker => map.removeLayer(marker));
          hospitalStopMarkers.forEach(marker => map.removeLayer(marker));
          bikeShareMarkers.forEach(marker => map.removeLayer(marker));

          outerStopMarkers = [];
          innerStopMarkers = [];
          hospitalStopMarkers = [];
          bikeShareMarkers = [];


          // Add bike share stations
          if (showBikeShare) {
            ${JSON.stringify(bikeShareStations)}.forEach(station => {
              var marker = L.marker(station.position, { icon: redIcon }).addTo(map);
              marker.bindPopup(station.name);
              bikeShareMarkers.push(marker);
            });
          }

          // Add outer loop
          if (showOuter) {
            outerLoopPolyline = L.polyline(${JSON.stringify(outerLoopRouteCoordinates)}, {color: 'green', weight: 3}).addTo(map);
            ${JSON.stringify(outerLoopBusStops)}.forEach(stop => {
              var marker = L.marker(stop.position, { icon: greenIcon }).addTo(map);
              marker.bindPopup(stop.name);
              outerStopMarkers.push(marker);
            });
          }

          // Add inner loop
          if (showInner) {
            innerLoopPolyline = L.polyline(${JSON.stringify(innerLoopRouteCoordinates)}, {color: 'orange', weight: 3}).addTo(map);
            ${JSON.stringify(innerLoopBusStops)}.forEach(stop => {
              var marker = L.marker(stop.position, { icon: orangeIcon }).addTo(map);
              marker.bindPopup(stop.name);
              innerStopMarkers.push(marker);
            });
          }

          // Add hospital route
          if (showHospital) {
            hospitalPolyline = L.polyline(${JSON.stringify(hospitalRouteCoordinates)}, {color: 'purple', weight: 3}).addTo(map);
            ${JSON.stringify(hospitalBusStops)}.forEach(stop => {
              var marker = L.marker(stop.position, { icon: purpleIcon }).addTo(map);
              marker.bindPopup(stop.name);
              hospitalStopMarkers.push(marker);
            });
          }
        }

        window.addEventListener('message', function(event) {
          var data = JSON.parse(event.data);
          if (data.type === 'userLocation') {
            updateUserLocation(data.latitude, data.longitude);
          } else if (data.type === 'toggleFeatures') {
            updateMapFeatures(data.showOuter, data.showInner, data.showHospital, data.showBikeShare);
          }
        });
      </script>
    </body>
  </html>
`;

export { leafletHTML };