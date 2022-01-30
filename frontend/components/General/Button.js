import React from 'react';
import {Text, View, StyleSheet, TouchableHighlight} from 'react-native';

/* A custom button
  Some styles are available with props style for the position : right/left
*/

const Button = props => {
  return (
    <View style={styles[props.style]}>
      <TouchableHighlight testID={props.testID} onPress={props.onPress} style={styles.button} underlayColor={'#DB707C'}>
          <Text style={styles.buttonText}> {props.title}</Text>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: '#8F2C38',
    marginBottom: 32,
    marginHorizontal: 10,
    borderRadius: 10,
    borderColor: '#DB707C',
    //borderWidth: 3,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  right: {
    alignSelf: 'flex-end',
  },
  left: {
    alignSelf: 'flex-start',
  }
});


export default Button;
