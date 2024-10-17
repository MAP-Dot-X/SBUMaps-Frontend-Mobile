import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, TouchableOpacity, Text, Animated, StatusBar, Switch } from "react-native";
import { WebView } from "react-native-webview";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LocationMarker from "./components/LocationMarker";
import styles from "./styles";
import { leafletHTML } from "./utils/mapSetup";

export default function LeafletMap() {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedNav, setSelectedNav] = useState("");
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [mapFeatures, setMapFeatures] = useState({
    showExpressEast: false,
    showExpressWest: false,
    showHospitalExpress: false,
    showHospital: false,
    showInner: false,
    showOuter: false,
    showRailroad: false,
    showBikeShare: false,
  });

  const navAnim = useRef(new Animated.Value(500)).current; // Slide menu off-screen initially
  const mapAnim = useRef(new Animated.Value(0)).current; // Map starts at its original position
  const webViewRef = useRef(null);
  const insets = useSafeAreaInsets();

  const handleExpressEastToggleChange = () => {
    setMapFeatures({
      ...mapFeatures,
      showExpressEast: !mapFeatures.showExpressEast,
    });
  }

  const handleExpressWestToggleChange = () => {
    setMapFeatures({
      ...mapFeatures,
      showExpressWest: !mapFeatures.showExpressWest,
    });
  }

  const handleHospitalExpressToggleChange = () => {
    setMapFeatures({
      ...mapFeatures,
      showHospitalExpress: !mapFeatures.showHospitalExpress,
    });
  }

  const handleHospitalToggleChange = () => {
    setMapFeatures({
      ...mapFeatures,
      showHospital: !mapFeatures.showHospital,
    });
  }

  const handleInnerToggleChange = () => {
    setMapFeatures({
      ...mapFeatures,
      showInner: !mapFeatures.showInner,
    });
  }

  const handleOuterToggleChange = () => {
    setMapFeatures({
      ...mapFeatures,
      showOuter: !mapFeatures.showOuter,
    });
  }

  const handleRailroadToggleChange = () => {
    setMapFeatures({
      ...mapFeatures,
      showRailroad: !mapFeatures.showRailroad,
    });
  }

  const handleBikeShareToggleChange = () => {
    setMapFeatures({
      ...mapFeatures,
      showBikeShare: !mapFeatures.showBikeShare,
    });
  }

  // Function to handle pressing on the map area
  const handleMapPress = () => {
    if (isNavOpen) {
      toggleNav();
    }
  };

  // Functions for sending messages to the WebView and toggling map features
  const sendLocationToWebView = () => {
    if (userLocation && webViewRef.current) {
      const message = JSON.stringify({
        type: "userLocation",
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      });
      webViewRef.current.postMessage(message);
    }
  };

  const toggleFeatures = useCallback(() => {
    if (webViewRef.current) {
      const message = JSON.stringify({
        type: "toggleFeatures",
        ...mapFeatures,
      });
      webViewRef.current.postMessage(message);
    }
  }, [mapFeatures]);

  useEffect(() => {
    toggleFeatures();
  }, [mapFeatures, toggleFeatures]);

  // Navigation between map categories
  const handleNavClick = useCallback((nav) => {
    setSelectedNav(nav);
    const features = {
      showExpressEast: false,
      showExpressWest: false,
      showHospitalExpress: false,
      showHospital: false,
      showInner: false,
      showOuter: false,
      showRailroad: false,
      showBikeShare: false,
    };

    switch (nav) {
      case "SBU Bikes":
        features.showBikeShare = true;
        break;
      case "DoubleMap":
        features.showExpressEast = true;
        features.showExpressWest = true;
        features.showHospitalExpress = true;
        features.showHospital = true;
        features.showOuter = true;
        features.showInner = true;
        features.showRailroad = true;
        break;
      case "Nutrislice":
        // No features yet
      break;
      default:
        break;
    }

    setMapFeatures(features);
    toggleFeatures();
  }, [isNavOpen, toggleFeatures]);

  // Handle sliding animation for navigation menu and map
  const toggleNav = () => {
    // Only allow toggle if animation is not already in progress
    if (!isNavOpen) {
      setIsNavOpen(true);
      Animated.parallel([
        Animated.timing(navAnim, {
          toValue: 0, // Slide nav into view
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(mapAnim, {
          toValue: -200, // Move map to the side
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      setIsNavOpen(false);
      Animated.parallel([
        Animated.timing(navAnim, {
          toValue: 500, // Slide nav off-screen
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(mapAnim, {
          toValue: 0, // Move map back to original position
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
      <Animated.View
        style={[styles.hamburgerMenu, { transform: [{ translateX: mapAnim }] }]}
      >
        <TouchableOpacity onPress={toggleNav}>
          <Text style={styles.hamburgerIcon}>☰</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Side Navigation Menu */}
      <Animated.View style={[styles.sideNav, { transform: [{ translateX: navAnim }] }]}>
        <TouchableOpacity onPress={() => handleNavClick("SBU Bikes")}>
          <Text style={styles.navButton}>SBU Bikes</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavClick("DoubleMap")}>
          <Text style={styles.navButton}>DoubleMap</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavClick("Nutrislice")}>
          <Text style={styles.navButton}>Nutrislice</Text>
        </TouchableOpacity>








      <View style={styles.container}>
      {selectedNav === 'DoubleMap' && (
        <View style={styles.checkboxMenu}>
          <View style={styles.toggleButton}>
            <Switch
              onValueChange={handleOuterToggleChange}
            />
            <Text style={styles.label}>Outer Loop</Text>
          </View>

          <View style={styles.toggleButton}>
            <Switch
              onValueChange={handleInnerToggleChange}
            />
            <Text style={styles.label}>Inner Loop</Text>
          </View>

          <View style={styles.toggleButton}>
            <Switch
              onValueChange={handleHospitalToggleChange}
            />
            <Text style={styles.label}>Hospital/Chapin</Text>
          </View>

          <View style={styles.toggleButton}>
            <Switch
              onValueChange={handleHospitalExpressToggleChange}
            />
            <Text style={styles.label}>Hospital Express</Text>
          </View>

          <View style={styles.toggleButton}>
            <Switch
              onValueChange={handleExpressEastToggleChange}
            />
            <Text style={styles.label}>East Express</Text>
          </View>

          <View style={styles.toggleButton}>
            <Switch
              onValueChange={handleExpressWestToggleChange}
            />
            <Text style={styles.label}>Express West</Text>
          </View>

          <View style={styles.toggleButton}>
            <Switch
              onValueChange={handleRailroadToggleChange}
            />
            <Text style={styles.label}>Railroad</Text>
          </View>



        </View>
      )}
      </View>












      </Animated.View>




      {/* Animated Container for the Map */}
      <TouchableOpacity 
        style={{ flex: 1 }} 
        activeOpacity={1} 
        onPress={handleMapPress} // Add onPress handler for the map area
      >
        <Animated.View style={{ flex: 1, transform: [{ translateX: mapAnim }] }}>
          <WebView
            ref={webViewRef}
            originWhitelist={["*"]}
            source={{ html: leafletHTML }}
            style={styles.map}
            onLoad={sendLocationToWebView}
            javaScriptEnabled={true}
            onMessage={(event) => {
              const data = JSON.parse(event.nativeEvent.data);

              if (data.type === "userLocation") {
                setUserLocation({
                  latitude: data.latitude,
                  longitude: data.longitude,
                });
              }
            }}
          />
        </Animated.View>
      </TouchableOpacity>

      {/* Location Marker */}
      <LocationMarker onLocationChange={setUserLocation} />
    </View>
  );
}
