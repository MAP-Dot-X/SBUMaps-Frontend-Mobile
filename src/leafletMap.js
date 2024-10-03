import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LocationMarker from './components/LocationMarker';
import styles from './styles';

// Import Outer Loop Route data
import { outerLoopRouteCoordinates, outerLoopBusStops } from './utils/outerLoopRoute';

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
          border-top-left-radius: 20px;
          border-top-right-radius: 20px;
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
        var map = L.map('map', { zoomControl: false }).setView([40.9126, -73.1234], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.control.zoom({ position: 'topright' }).addTo(map);

        var userMarker, busRoutePolyline, busStopMarkers = [];

        function updateUserLocation(lat, lng) {
          if (userMarker) {
            map.removeLayer(userMarker);
          }
          userMarker = L.marker([lat, lng]).addTo(map)
            .bindPopup('You are here')
            .openPopup();
          map.setView([lat, lng], 15);
        }

        function updateMapFeatures(showOuterLoop) {
          if (busRoutePolyline) map.removeLayer(busRoutePolyline);
          busStopMarkers.forEach(marker => map.removeLayer(marker));
          busStopMarkers = [];

          if (showOuterLoop) {
            busRoutePolyline = L.polyline(${JSON.stringify(outerLoopRouteCoordinates)}, {color: 'green', weight: 3}).addTo(map);
            ${JSON.stringify(outerLoopBusStops)}.forEach(stop => {
              var marker = L.marker(stop.position).addTo(map);
              marker.bindPopup(stop.name);
              busStopMarkers.push(marker);
            });
          }
        }

        window.addEventListener('message', function(event) {
          var data = JSON.parse(event.data);
          if (data.type === 'userLocation') {
            updateUserLocation(data.latitude, data.longitude);
          } else if (data.type === 'toggleOuterLoop') {
            updateMapFeatures(data.showOuterLoop);
          }
        });
      </script>
    </body>
  </html>
`;

export default function LeafletMap() {
  const [userLocation, setUserLocation] = useState(null);
  const [showOuterLoop, setShowOuterLoop] = useState(true);
  const [selectedNav, setSelectedNav] = useState('');
  const [isNavOpen, setIsNavOpen] = useState(false);
  const webViewRef = useRef(null);
  const insets = useSafeAreaInsets();

  const sendLocationToWebView = () => {
    if (userLocation && webViewRef.current) {
      const message = JSON.stringify({
        type: 'userLocation',
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      });
      webViewRef.current.postMessage(message);
    }
  };

  const toggleOuterLoop = () => {
    setShowOuterLoop(prev => !prev);
    const message = JSON.stringify({
      type: 'toggleOuterLoop',
      showOuterLoop: !showOuterLoop,
    });
    webViewRef.current.postMessage(message);
  };

  useEffect(() => {
    if (userLocation) {
      sendLocationToWebView();
    }
  }, [userLocation]);

  const handleNavClick = (nav) => {
    setSelectedNav(nav);
    setIsNavOpen(false);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Hamburger Menu */}
      <TouchableOpacity
        style={styles.hamburgerMenu}
        onPress={() => setIsNavOpen(!isNavOpen)}
      >
        <Text style={styles.hamburgerIcon}>☰</Text>
      </TouchableOpacity>

      {/* Side Navigation */}
      {isNavOpen && (
        <View style={styles.sideNav}>
          <TouchableOpacity onPress={() => handleNavClick('SBU Bikes')}>
            <Text style={styles.navButton}>SBU Bikes</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNavClick('DoubleMap')}>
            <Text style={styles.navButton}>DoubleMap</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNavClick('Nutrislice')}>
            <Text style={styles.navButton}>Nutrislice</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Map View */}
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: leafletHTML }}
        style={styles.map}
        onLoad={sendLocationToWebView}
        javaScriptEnabled={true}
      />

      {/* Outer Loop Button */}
      {selectedNav === 'DoubleMap' && (
        <TouchableOpacity
          style={styles.outerLoopButton}
          onPress={toggleOuterLoop}
        >
          <Text style={styles.outerLoopButtonText}>
            {showOuterLoop ? 'Hide Outer Loop' : 'Show Outer Loop'}
          </Text>
        </TouchableOpacity>
      )}

      {/* User Location Marker */}
      <LocationMarker onLocationChange={setUserLocation} />
    </View>
  );
}
