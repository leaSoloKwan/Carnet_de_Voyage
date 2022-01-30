import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Notifications from './Notifications';
import MyTravels from './Travel/MyTravels';

/* Home view with its bottom tab navigator
*/

const Tab = createMaterialBottomTabNavigator();

function Home(props) {
  return (
    <Tab.Navigator
        initialRouteName="MyTravels"
        activeColor="#CDE9F2"  // color of the icons of the active tab
        shifting={true}  // the active tab icon shifts up to show the label and the inactive tabs won't have a label 
        inactiveColor="#DB707C"  // color of the icons of the inactive tabs
        barStyle={{ backgroundColor: '#8F2C38' }}
      >
        <Tab.Screen
          name="Notifications"
          component={Notifications}
          options={{
            tabBarLabel: 'Notifications',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="bell" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="MyTravels"
          component={MyTravels}
          initialParams={{'shared': false}}
          options={{
            tabBarLabel: 'Mes voyages',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="earth" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="SharedTravels"
          component={MyTravels}
          initialParams={{'shared': true}}
          options={{
            tabBarLabel: 'Voyages partagés',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="billboard" color={color} size={26} />
            ),
          }}
        />
      </Tab.Navigator>
  );
}

export default Home;
