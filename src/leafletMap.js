import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, Animated, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
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
  const navAnim = useRef(new Animated.Value(500)).current;  // Slide menu off-screen initially
  const mapAnim = useRef(new Animated.Value(0)).current;   // Map starts at its original position
  const webViewRef = useRef(null);
  const insets = useSafeAreaInsets();

  // Functions for sending messages to the WebView and toggling map features
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

  // Navigation between map categories
  const handleNavClick = (nav) => {
    setSelectedNav(nav);
    setIsNavOpen(false);

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

  // Handle sliding animation for navigation menu and map
  const toggleNav = () => {
    if (isNavOpen) {
      Animated.parallel([
        Animated.timing(navAnim, {
          toValue: 500,  // Slide nav off-screen
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(mapAnim, {
          toValue: 0,  // Move map back to original position
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start(() => setIsNavOpen(false));
    } else {
      setIsNavOpen(true);
      Animated.parallel([
        Animated.timing(navAnim, {
          toValue: 0,  // Slide nav into view
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(mapAnim, {
          toValue: -200,  // Move map to the side
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  return (
    <View style={[styles.container]}>
      <StatusBar barStyle="dark-content" translucent />
      {/* Hamburger Menu for toggling navigation */}
      <Animated.View style={[styles.hamburgerMenu, { transform: [{ translateX: mapAnim }] }]}>
        <TouchableOpacity onPress={toggleNav}>
          <Text style={styles.hamburgerIcon}>☰</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Side Navigation Menu */}
      <Animated.View style={[
        styles.sideNav,
        { transform: [{ translateX: navAnim }] }
      ]}>
        <TouchableOpacity onPress={() => handleNavClick('SBU Bikes')}>
          <Text style={styles.navButton}>SBU Bikes</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavClick('DoubleMap')}>
          <Text style={styles.navButton}>DoubleMap</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavClick('Nutrislice')}>
          <Text style={styles.navButton}>Nutrislice</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Animated Container for the Map */}
      <Animated.View style={{ flex: 1, transform: [{ translateX: mapAnim }] }}>
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
              setUserLocation({
                latitude: data.latitude,
                longitude: data.longitude,
              });
            }
          }}
        />
      </Animated.View>

      {/* Location Marker */}
      <LocationMarker onLocationChange={setUserLocation} />
    </View>
  );
}
