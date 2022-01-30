import React from 'react';
import {Text, View, StyleSheet, TouchableHighlight} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

/* A custom button with an icon and some text
  Some styles are available with props style and style2 :
  - for the color : light/dark
  - for the position : right/left
  Some custom style is possible with the props style_config.
*/

const ButtonWithIcon = props => {
  return (
      <TouchableHighlight testID={props.testID} onPress={props.onPress} style={[styles.button, styles[props.style], styles[props.style2], props.style_config]} underlayColor={'#DB707C'}>
          <View style={styles.contentButton}>
            <MaterialCommunityIcons name={props.icon} color={'#8F2C38'} size={24} />
            <Text> {props.title}</Text>
          </View>
      </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 12,
    backgroundColor: 'white',
    marginTop: 32,
    marginHorizontal: 12,
    borderRadius: 10,
  },
  contentButton: {
    alignItems: 'center', 
    flexDirection: 'row',
  },
  right: {
    alignSelf: 'flex-end',
  },
  left: {
    alignSelf: 'flex-start',
  },
  dark: {
    backgroundColor: '#DB707C',
    paddingHorizontal: 25,
  },
  light: {
    borderColor: '#8F2C38',
    borderWidth: 2,
    paddingHorizontal: 25,
  }
});


export default ButtonWithIcon;
