import React, {useState} from 'react';
import {Text, TouchableOpacity, View } from 'react-native';
import {authorize} from 'react-native-app-auth';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles, BACKEND, navigationRef, TokenContext } from './RootNavigation';

import LoginForm from './components/User/LoginForm';
import Button from './components/General/Button';
import Home from './components/Home';
import Account from './components/User/Account';
import ActionOnTravel from './components/Travel/ActionOnTravel';
import Travel from './components/Travel/Travel';
import TravelRights from './components/Travel/Rights/TravelRights';
import Background from './components/General/Background';
import Activity from './components/Activity/Activity';
import ActionOnActivity from './components/Activity/ActionOnActivity';
import {TestScheduler} from '@jest/core';

const config = {
  redirectUrl: 'mapremiereappli://callback',
  clientId: '71e1b74bb71b341d43f3773ac6e4463aaf39de11d3d9d1a25e28a32af5407a66',
  usePKCE: false,
  scopes: ['read_user'],
  additionalHeaders: {'Accept': 'application/json'},
  serviceConfiguration: {
    authorizationEndpoint: `https://gitlab.ensimag.fr/oauth/authorize`,
    tokenEndpoint: `https://gitlab.ensimag.fr/oauth/token`,
  }
};


const Stack = createStackNavigator();

const App = () => {

  // function to log in
  async function connectWithGitlab() {
    console.log('authorize');
    const result = await authorize(config);
    console.log('result', result);
    const user = await fetch('https://gitlab.ensimag.fr/api/v4/user', {
      headers: {Authorization: `Bearer ${result.accessToken}`},
    }).then(res => res.text());
    setToken(result.accessToken);
  }
  function connect(username, password) {
    console.log('login', username, password);
    fetch(`${BACKEND}/login`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: `${JSON.stringify({login: username, password})}`,
    })
      .then(response => response.json())
      .then(data => setToken(data.msg === 'ok' ? data.token : ''))
      .catch(error => console.log(error));
  }
  function disconnect() {
    setToken('');
  }

  const [token, setToken] = useState('');
  
  // return the log in view or, if the user is connected, the principal stack navigator
  return (
    <TokenContext.Provider value={{ token, disconnect }}>
    <NavigationContainer ref={navigationRef}>
      {token === '' ? (
        <Background content={
        <View style={[styles.sectionContainer, {marginTop: 100}]}>
          <Text style={[styles.sectionTitle, styles.center]}>Bienvenue !</Text>
          <LoginForm onConnect={connect} />
          <Button
            title="Se connecter avec Backend et Gitlab"
            onPress={connectWithGitlab}
          />
        </View>
      } />
      ) : (
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={Home}
              options={({ navigation, route }) => ({
                title: 'Mon carnet de voyage',
                headerStyle: {
                  backgroundColor: '#8F2C38',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  textAlign: 'center',
                },
                headerRight: () => (<TouchableOpacity testID="account" onPress={() => navigation.navigate('Account')}>
                  <MaterialCommunityIcons style={styles.menubutton} name="account" color={'#DB707C'} size={26}/>
                  </TouchableOpacity>
                ),
                headerLeft: () => (<TouchableOpacity testID="home" onPress={() => navigation.navigate('Home')}>
                  <MaterialCommunityIcons  style={styles.menubutton} name="home-circle" color={'#DB707C'} size={26} />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="Account"
              component={Account}
              options={({ navigation, route }) => ({
                title: 'Mon carnet de voyage',
                headerStyle: {
                  backgroundColor: '#8F2C38',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  textAlign: 'center',
                },
                headerRight: () => (
                  <MaterialCommunityIcons style={styles.menubutton} name="account-circle" color={'#DB707C'} size={26} onPress={() => navigation.navigate('Account')}/>
                ),
                headerLeft: () => (
                  <MaterialCommunityIcons style={styles.menubutton} name="home" color={'#DB707C'} size={26} onPress={() => navigation.navigate('Home')}/>
                ),
              })}
            />
            <Stack.Screen
              name="Action on a travel"
              component={ActionOnTravel}
              options={({ navigation, route }) => ({
                title: 'Créer un nouveau voyage / Modifier un voyage',
                headerStyle: {
                  backgroundColor: '#8F2C38',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  textAlign: 'center',
                },
                headerLeft: () => (
                    <MaterialCommunityIcons style={styles.menubutton} name="arrow-left-bold-circle" color={'#DB707C'} size={26}/>),
              })}
            />
            <Stack.Screen
              name="Travel"
              component={Travel}
              options={({ navigation, route }) => ({
                title: 'Votre voyage',
                headerStyle: {
                  backgroundColor: '#8F2C38',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  textAlign: 'center',
                },
                headerLeft: () => (<TouchableOpacity testID="goback" onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons style={styles.menubutton} name="arrow-left-bold-circle" color={'#DB707C'} size={26} onPress={() => navigation.navigate('Home', { screen: 'MyTravels' })}/>
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="Travel's rights"
              component={TravelRights}
              options={({ navigation, route }) => ({
                title: 'Les droits d\'accès',
                headerStyle: {
                  backgroundColor: '#8F2C38',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  textAlign: 'center',
                },
                headerLeft: () => (
                  <MaterialCommunityIcons style={styles.menubutton} name="arrow-left-bold-circle" color={'#DB707C'} size={26} onPress={() => navigation.goBack()}/>
                ),
              })}
            />
            <Stack.Screen
              name="Activity"
              component={Activity}
              options={({ navigation, route }) => ({
                title: 'Mon activite',
                headerStyle: {
                  backgroundColor: '#8F2C38',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  textAlign: 'center',
                },
                headerLeft: () => (<TouchableOpacity testID="goback" onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons style={styles.menubutton} name="arrow-left-bold-circle" color={'#DB707C'} size={26}/>
                  </TouchableOpacity>
                ),
              })}
            />
             <Stack.Screen
              name="Action on an activity"
              component={ActionOnActivity}
              options={({ navigation, route }) => ({
                title: 'Mon activite',
                headerStyle: {
                  backgroundColor: '#8F2C38',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  textAlign: 'center',
                },
                headerLeft: () => (
                  <MaterialCommunityIcons style={styles.menubutton} name="arrow-left-bold-circle" color={'#DB707C'} size={26} onPress={() => navigation.goBack()}/>
                ),
              })}
            />

          </Stack.Navigator>
      )}
    </NavigationContainer>
    </TokenContext.Provider>
  );
};

export default App;
