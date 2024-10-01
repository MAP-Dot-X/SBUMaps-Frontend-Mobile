import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  button: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1000,
  },
});