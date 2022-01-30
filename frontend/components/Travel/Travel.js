import React, {useState, useContext} from 'react';
import {useEffect} from 'react';
import {View, Text} from 'react-native';
import ActivityBloc from '../Activity/ActivityBloc';
import ButtonWithIcon from '../General/ButtonWithIcon';
import { styles, BACKEND, navigate, TokenContext } from '../../RootNavigation';
import Background from '../General/Background';

/* Display a travel with its features :
- info
- button to modify/share/delete the travel in function of the rights
- list of the activities 
*/

function Travel(props) {
  const { token } = useContext(TokenContext);
  const [travel, setTravel] = useState({});
  const [activities, setActitivities] = useState([]);
  const right = props.route.params.right;

  // function to get the info about the travel
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      // For the information of the travel
      var url = `${BACKEND}/travels/${props.route.params.id}`
      if (props.route.params.right != undefined) {
        url = url + "/shared"
      }
      fetch(url, {
        method: 'GET',
        headers: {'Content-Type': 'application/json', authorization: token},
      })
      .then(response => response.text())
      .then(data => {
        setTravel(JSON.parse(data));
        props.navigation.setOptions({ title: JSON.parse(data).title });
      })
      .catch(error => console.log(error));

      // For activities
      fetch(`${BACKEND}/travels/${props.route.params.id}/activities`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json', authorization: token},
      })
      .then(response => response.text())
      .then(data => {
        setActitivities(JSON.parse(data));
      })
      .catch(error => console.log(error));
    });
    return unsubscribe;
  }, [props.navigation]);

  // function to delete the travel
  function deleteTravel() {
    fetch(`${BACKEND}/travels/${props.route.params.id}`, {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json', authorization: token},
    })
    .then(response => response.text())
    .then(data => {
      if (JSON.parse(data).msg == "ok") {
        navigate('Home');
      } else {
        alert('Une erreur est survenue lors de la suppression de ce voyage')
      }
    })
    .catch(error => console.log(error));
  }

  return (
    <Background content={
      <View>
        <View style={styles.sectionContainer}>
          <Text>{new Date(travel.start).toLocaleDateString() + " " + new Date(travel.start).toLocaleTimeString()} - {new Date(travel.end).toLocaleDateString() + " " + new Date(travel.end).toLocaleTimeString()}</Text>
          <Text style={styles.sectionSubTitle}>Lieu</Text>
          <Text>{travel.place}</Text>
          {props.route.params.right ? (null):(
            <ButtonWithIcon
              testID='share'
              style='light'
              onPress={() => navigate("Travel's rights", {navigationTitle: travel.title, id: props.route.params.id})}
              icon='share-circle'
              title='Partager'
            />)}
          <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
            {props.route.params.right ? (null):(
            <ButtonWithIcon
              testID='delete'
              style='light'
              onPress={deleteTravel}
              icon='trash-can'
              title='Supprimer'
            />)}
            {props.route.params.right && props.route.params.right == "READER" ? (null):(
            <ButtonWithIcon
              testID='modify'
              style='dark'
              onPress={() => navigate("Action on a travel", {navigationTitle: 'Modifier le voyage', method: 'PUT', id: props.route.params.id, travel:travel, shared: props.route.params.right != undefined})}
              icon='pen'
              title='Modifier'
            />)}
          </View>
        </View>
        <View style={styles.sectionContainer}>
          <View style={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center'}}>
            <Text style={styles.sectionTitle}>Vos activités</Text>
            {props.route.params.right && props.route.params.right == "READER" ? (null):(
              <ButtonWithIcon 
                testID='create'
                style='right'
                style_config={{marginTop:5, marginBottom:10}}
                style2='dark'
                onPress={() => navigate("Action on an activity", {navigationTitle: 'Ajouter une activité', method: 'POST', id: props.route.params.id, shared: props.route.params.right != undefined})}
                icon='pen'
                title='Ajouter'
              />)}
            </View>
          {activities.map(tmpActivity => ActivityBloc({'activity': tmpActivity, 'right': right}))}
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Vos documents</Text>
        </View>
      </View>
    } />  
  );
}

export default Travel;
