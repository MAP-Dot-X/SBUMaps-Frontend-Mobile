import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LocationMarker from './components/LocationMarker';

import styles from './styles';
import { leafletHTML } from './utils/mapSetup';

export default function LeafletMap() {
  const [userLocation, setUserLocation] = useState(null);
  const [showOuterLoop, setShowOuterLoop] = useState(false);
  const [showInnerLoop, setShowInnerLoop] = useState(false);
  const [showHospital, setShowHospital] = useState(false);
  const [showBikeShare, setShowBikeShare] = useState(false);
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

  const toggleFeatures = () => {
    const message = JSON.stringify({
      type: 'toggleFeatures',
      showOuter: showOuterLoop,
      showInner: showInnerLoop,
      showHospital: showHospital,
      showBikeShare: showBikeShare,
    });
    webViewRef.current.postMessage(message);
  };

  useEffect(() => {
    if (userLocation) {
      sendLocationToWebView();
    }
    toggleFeatures();
  }, [userLocation, showOuterLoop, showInnerLoop, showHospital, showBikeShare]);
  

  const handleNavClick = (nav) => {
    setSelectedNav(nav);
    setIsNavOpen(false);
    // Reset feature visibility based on navigation selection
    if (nav === 'DoubleMap') {
      setShowOuterLoop(true);
      setShowInnerLoop(true);
      setShowHospital(true);
      setShowBikeShare(false);
    } else if (nav === 'SBU Bikes') {
      setShowOuterLoop(false);
      setShowInnerLoop(false);
      setShowHospital(false);
      setShowBikeShare(true);
    } else if (nav === 'Nutrislice') {
      setShowOuterLoop(false);
      setShowInnerLoop(false);
      setShowHospital(false);
      setShowBikeShare(false); 
    }
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

      {/* Toggle Options */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity onPress={() => setShowOuterLoop(prev => !prev)}>
          <Text style={styles.toggleLabel}>{showOuterLoop ? 'Hide Outer Loop' : 'Show Outer Loop'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowInnerLoop(prev => !prev)}>
          <Text style={styles.toggleLabel}>{showInnerLoop ? 'Hide Inner Loop' : 'Show Inner Loop'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowHospital(prev => !prev)}>
          <Text style={styles.toggleLabel}>{showHospital ? 'Hide Hospital Route' : 'Show Hospital Route'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowBikeShare(prev => !prev)}>
          <Text style={styles.toggleLabel}>{showBikeShare ? 'Hide Bike Share' : 'Show Bike Share'}</Text>
        </TouchableOpacity>
      </View>

      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: leafletHTML }}
        style={styles.map}
        onLoad={sendLocationToWebView}
        javaScriptEnabled={true}
        onMessage={(event) => {
          const data = JSON.parse(event.nativeEvent.data);
          if (data.type === 'userLocation') {
            setUserLocation({ latitude: data.latitude, longitude: data.longitude });
          }
        }}
      />
            <LocationMarker onLocationChange={setUserLocation} />
    </View>
  );
}
