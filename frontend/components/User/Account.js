import React, {useContext, useState} from 'react';
import {useEffect} from 'react';
import {View, Text} from 'react-native';
import Background from '../General/Background';
import ButtonWithIcon from '../General/ButtonWithIcon';
import { styles, BACKEND, navigate } from '../../RootNavigation';
import { TokenContext } from '../../RootNavigation';

/* Component to display the info about the user and to disconnect
*/

function Account(props) {
  const [userInfo, setUserInfo] = useState({});
  const { token, disconnect } = useContext(TokenContext);

  useEffect(() => {
    fetch(`${BACKEND}/users/profile`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json', authorization: token},
    })
    .then(response => response.text())
    .then(data => {
      setUserInfo(JSON.parse(data));
    })
    .catch(error => console.log(error));
  }, []);

  return (
    <View>
      <Background content={
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Vos informations</Text>
          <Text style={styles.center}>{userInfo.firstname} {userInfo.lastname}</Text>
          <Text style={styles.sectionSubTitle}>Email</Text>
          <Text>{userInfo.email}</Text>
          <Text style={styles.sectionSubTitle}>Date de naissance</Text>
          <Text>{new Date(userInfo.birthdate).toLocaleDateString()}</Text>
          <ButtonWithIcon
            testID='disconnect'
            style='dark'
            onPress={() => {disconnect(); navigate('Home')}}
            icon='logout'
            title='Se déconnecter'
          />
        </View>
      } />
    </View>
     );
}

export default Account;
