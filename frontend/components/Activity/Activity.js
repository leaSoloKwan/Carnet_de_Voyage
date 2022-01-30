import React, {useState, useContext} from 'react';
import {useEffect} from 'react';
import {View, Text} from 'react-native';
import ButtonWithIcon from '../General/ButtonWithIcon';
import { styles, BACKEND, navigate, TokenContext } from '../../RootNavigation';
import Background from '../General/Background';

/* Display an activity with its features :
- info
- button to modify/delete the activity in function of the rights
*/

function Activity(props) {
  const { token } = useContext(TokenContext);
  const [activity, setActivity] = useState({});

  // function to get the info about the activity
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      // For the information of the activity
      var url = `${BACKEND}/travels/${props.route.params.id}/activities/${props.route.params.id_act}`
    
      fetch(url, {
        method: 'GET',
        headers: {'Content-Type': 'application/json', authorization: token},
      })
      .then(response => response.text())
      .then(data => {
        setActivity(JSON.parse(data));
        props.navigation.setOptions({ title: JSON.parse(data).name });
      })
      .catch(error => console.log(error));
    });
    return;
  }, [props.navigation]);


  // function to delete the activity
  function deleteActivity() {
    fetch(`${BACKEND}/travels/${props.route.params.id}/activities/${props.route.params.id_act}`, {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json', authorization: token},
    })
    .then(response => response.text())
    .then(data => {
      if (JSON.parse(data).msg == "ok") {
        props.navigation.goBack();
      } else {
        alert('Une erreur est survenue lors de la suppression de cette activité')
      }
    })
    .catch(error => console.log(error));
  }

  return (
    <Background content={
      <View>
        <View style={styles.sectionContainer}>
          <Text>{new Date(activity.start).toLocaleDateString() + " " + new Date(activity.start).toLocaleTimeString()} - {new Date(activity.end).toLocaleDateString() + " " + new Date(activity.end).toLocaleTimeString()}</Text>
          <Text style={styles.sectionSubTitle}>Lieu</Text>
          <Text>{activity.place}</Text>
          <Text style={styles.sectionSubTitle}>Type</Text>
          <Text>{activity.type}</Text>
          {props.route.params.right && props.route.params.right == "READER" ? (null):(
          <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <ButtonWithIcon
              testID='delete'
              style='light'
              onPress={deleteActivity}
              icon='trash-can'
              title='Supprimer'
            />
            <ButtonWithIcon
              testID='modify'
              style='dark'
              onPress={() => navigate("Action on an activity", {navigationTitle: 'Modifier l\'activité', method: 'PUT', id: props.route.params.id, activity:activity, id_act:props.route.params.id_act, shared: props.route.params.right != undefined})}
              icon='pen'
              title='Modifier'
            />
          </View>)}
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Vos documents</Text>
        </View>
      </View>
    } />  
  );
}

export default Activity;
