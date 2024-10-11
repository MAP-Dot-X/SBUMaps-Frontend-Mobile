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
  hamburgerMenu: {
    position: 'absolute',
    top: 70,
    right: 20,
    zIndex: 1000,
    backgroundColor: 'white',
    borderRadius: 4,
    padding: 10,
    elevation: 5,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  hamburgerIcon: {
    fontSize: 34,
  },
  sideNav: {
    position: 'absolute',
    top: 120,
    right: 0,
    width: 200,
    height: '98%',
    backgroundColor: 'white',
    borderLeftWidth: 1,
    borderColor: 'white',
    padding: 20,
    elevation: 5,
    zIndex: 1000,
  },  
  navButton: {
    fontSize: 18,
    padding: 5,
    color: 'black',
  },
  toggleContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 4,
    padding: 10,
    elevation: 5,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});
