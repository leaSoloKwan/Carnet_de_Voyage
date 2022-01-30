import React from 'react';
import { View, Text } from 'react-native';
import Background from './General/Background';

/* Notifications View : to develop in further works
*/

function Notifications() {
    return (
      <Background content={
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Notifications!</Text>
        </View>
      } />
    );
}

export default Notifications;