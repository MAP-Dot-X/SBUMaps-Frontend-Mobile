import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Animated,
  StatusBar,
  Switch,
} from "react-native";
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
    showOuter: false,
    showInner: false,
    showHospital: false,
    showHospitalExpress: false,
    showExpressEast: false,
    showExpressWest: false,
    showRailroad: false,
    showBikeShare: false,
  });

  const navAnim = useRef(new Animated.Value(500)).current; // Slide menu off-screen initially
  const mapAnim = useRef(new Animated.Value(0)).current; // Map starts at its original position
  const webViewRef = useRef(null);
  const insets = useSafeAreaInsets();

  // Function to fetch live bus data
  const fetchBusData = async () => {
    try {
      const response = await fetch('https://stonybrookuniversity.doublemap.com/map/v2/buses');
      const buses = await response.json();
      return buses;
    } catch (error) {
      console.error("Error fetching bus data:", error);
      return [];
    }
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const buses = await fetchBusData();
      if (webViewRef.current) {
        webViewRef.current.postMessage(JSON.stringify({ type: 'busData', buses }));
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  const handleOuterToggleChange = () => {
    setMapFeatures({
      ...mapFeatures,
      showOuter: !mapFeatures.showOuter,
    });
  };

  const handleInnerToggleChange = () => {
    setMapFeatures({
      ...mapFeatures,
      showInner: !mapFeatures.showInner,
    });
  };

  const handleHospitalToggleChange = () => {
    setMapFeatures({
      ...mapFeatures,
      showHospital: !mapFeatures.showHospital,
    });
  };

  const handleHospitalExpressToggleChange = () => {
    setMapFeatures({
      ...mapFeatures,
      showHospitalExpress: !mapFeatures.showHospitalExpress,
    });
  };

  const handleExpressEastToggleChange = () => {
    setMapFeatures({
      ...mapFeatures,
      showExpressEast: !mapFeatures.showExpressEast,
    });
  };

  const handleExpressWestToggleChange = () => {
    setMapFeatures({
      ...mapFeatures,
      showExpressWest: !mapFeatures.showExpressWest,
    });
  };

  const handleRailroadToggleChange = () => {
    setMapFeatures({
      ...mapFeatures,
      showRailroad: !mapFeatures.showRailroad,
    });
  };

  const handleBikeShareToggleChange = () => {
    setMapFeatures({
      ...mapFeatures,
      showBikeShare: !mapFeatures.showBikeShare,
    });
  };

  const handleSelectAll = () => {
    setMapFeatures({
      showOuter: true,
      showInner: true,
      showHospital: true,
      showHospitalExpress: true,
      showExpressEast: true,
      showExpressWest: true,
      showRailroad: true,
    });
  };

  const handleSelectNone = () => {
    setMapFeatures({
      showOuter: false,
      showInner: false,
      showHospital: false,
      showHospitalExpress: false,
      showExpressEast: false,
      showExpressWest: false,
      showRailroad: false,
    });
  };

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
  const handleNavClick = useCallback(
    (nav) => {
      setSelectedNav(nav);
      const features = {
        showOuter: false,
        showInner: false,
        showHospital: false,
        showHospitalExpress: false,
        showExpressEast: false,
        showExpressWest: false,
        showRailroad: false,
        showBikeShare: false,
      };

      switch (nav) {
        case "SBU Bikes":
          features.showBikeShare = true;
          break;
        case "DoubleMap":
          features.showOuter = true;
          features.showInner = true;
          features.showHospital = true;
          features.showHospitalExpress = true;
          features.showExpressEast = true;
          features.showExpressWest = true;
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
    },
    [isNavOpen, toggleFeatures]
  );

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
          toValue: -250, // Move map to the side
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
      <Animated.View
        style={[styles.sideNav, { transform: [{ translateX: navAnim }] }]}
      >
        <TouchableOpacity onPress={() => handleNavClick("SBU Bikes")}>
          <Text style={styles.navButton}>SBU Bikes</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleNavClick("DoubleMap")}>
          <Text style={styles.navButton}>DoubleMap</Text>
        </TouchableOpacity>

        {selectedNav === "DoubleMap" && (
          <Animated.View
            style={[styles.sideNav, { transform: [{ translateX: navAnim }] }]}
          >
            <View style={styles.checkboxMenu}>
              <View style={[styles.toggleButton]}>
                <Switch
                  onValueChange={handleOuterToggleChange}
                  value={mapFeatures.showOuter}
                  trackColor={{ false: "#767577", true: "#4caf50" }}
                />
                <Text style={styles.label}>Outer Loop</Text>
              </View>

              <View style={[styles.toggleButton]}>
                <Switch
                  onValueChange={handleInnerToggleChange}
                  value={mapFeatures.showInner}
                  trackColor={{ false: "#767577", true: "#ffa500" }}
                />
                <Text style={styles.label}>Inner Loop</Text>
              </View>

              <View style={[styles.toggleButton]}>
                <Switch
                  onValueChange={handleHospitalToggleChange}
                  value={mapFeatures.showHospital}
                  trackColor={{ false: "#767577", true: "#8a2be2" }}
                />
                <Text style={styles.label}>Hospital/Chapin</Text>
              </View>

              <View style={[styles.toggleButton]}>
                <Switch
                  onValueChange={handleHospitalExpressToggleChange}
                  value={mapFeatures.showHospitalExpress}
                  trackColor={{ false: "#767577", true: "#e22bca" }}
                />
                <Text style={styles.label}>Hospital Express</Text>
              </View>

              <View style={[styles.toggleButton]}>
                <Switch
                  onValueChange={handleExpressEastToggleChange}
                  value={mapFeatures.showExpressEast}
                  trackColor={{ false: "#767577", true: "#2b37e2" }}
                />
                <Text style={styles.label}>East Express</Text>
              </View>

              <View style={[styles.toggleButton]}>
                <Switch
                  onValueChange={handleExpressWestToggleChange}
                  value={mapFeatures.showExpressWest}
                  trackColor={{ false: "#767577", true: "#e22b2b" }}
                />
                <Text style={styles.label}>Express West</Text>
              </View>

              <View style={[styles.toggleButton]}>
                <Switch
                  onValueChange={handleRailroadToggleChange}
                  value={mapFeatures.showRailroad}
                  trackColor={{ false: "#767577", true: "#212121" }}
                />
                <Text style={styles.label}>Railroad</Text>
              </View>

              <TouchableOpacity onPress={handleSelectAll} style={[styles.toggleSelectButton]}>
                <Text style={styles.label} onValueChange={handleSelectAll}>Select All</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleSelectNone} style={[styles.toggleSelectButton]}>
                <Text style={styles.label}>Select None</Text>
              </TouchableOpacity>

            </View>
          </Animated.View>
        )}

        <TouchableOpacity onPress={() => handleNavClick("Nutrislice")}>
          <Text style={styles.navButton}>Nutrislice</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Animated Container for the Map */}
      <TouchableOpacity
        style={{ flex: 1 }}
        activeOpacity={1}
        onPress={handleMapPress} // Add onPress handler for the map area
      >
        <Animated.View
          style={{ flex: 1, transform: [{ translateX: mapAnim }] }}
        >
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
