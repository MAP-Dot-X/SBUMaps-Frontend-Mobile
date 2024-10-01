import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';

function LocationMarker({ onLocationChange }) {
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      onLocationChange({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  return null;
}

export default LocationMarker;