// App.js

import React from 'react';
import LeafletMap from './src/leafletMap';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return(
    <SafeAreaProvider>
      <LeafletMap />
    </SafeAreaProvider>
  );
}