import * as React from 'react';
import {StyleSheet} from 'react-native';

export const navigationRef = React.createRef(); // Reference of the Top Stack
export const BACKEND = 'https://carnet-voyage.herokuapp.com';
//export const BACKEND = 'http://10.0.0.2';

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export const TokenContext = React.createContext(); // token of the user

// Global style sheet
export const styles = StyleSheet.create({
    sectionContainer: {
      marginTop: 32,
      backgroundColor: 'white',
      padding: 12,
      marginHorizontal: 12,
      borderRadius: 10,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '600',
      color: '#8F2C38',
    },
    sectionSubTitle: {
      fontWeight: 'bold',
      marginTop: 10,
    },
    sectionDescription: {
      marginTop: 8,
      fontSize: 18,
      fontWeight: '400',
    },
    highlight: {
      fontWeight: '700',
    },
    center: {
      textAlign: 'center',
    },
    right: {
      textAlign: 'right',
    },
    italic: {
      fontStyle: 'italic',
    },
    menubutton: {
      marginHorizontal: 12,
    },
    textInput: {
      borderRadius:10,
      borderColor:'lightgrey',
      borderWidth:1,
      marginTop:6,
      paddingHorizontal:10,
    },
    sectionAutocomplete: {
      borderColor:'lightgrey',
      borderLeftWidth:1,
      borderRightWidth :1,
      borderBottomWidth:1,
      borderBottomLeftRadius:10,
      borderBottomRightRadius:10,
    },
    resultAutocomplete: {
      paddingHorizontal:10,
      paddingVertical:3,
      borderTopColor: 'lightgrey',
    }
});