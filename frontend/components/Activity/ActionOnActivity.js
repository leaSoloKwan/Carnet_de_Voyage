import React, {useEffect, useContext} from 'react';
import {View, Text } from 'react-native';
import { styles, BACKEND, TokenContext } from '../../RootNavigation';
import ActivityForm from './ActivityForm';
import Background from '../General/Background';

/* This function return a view for the next cases :
  - creation of an activity
  - modification of an activity
*/
function ActionOnActivity(props) {
  const { token } = useContext(TokenContext);

  useEffect(() => {
    // define the title of the page in the navigation bar
    props.navigation.setOptions({ title: props.route.params.navigationTitle });
  }, []);
  
  // function to send the data of the activity form (POST or PUT)
  function send(data) {
    let url= `${BACKEND}/travels/${props.route.params.id}/activities/`
    if (props.route.params.method == "PUT") {
      url = url + `${props.route.params.id_act}`
    }
    console.log(url)
    fetch(url, {
      method: props.route.params.method,
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json', authorization: token},
      body: JSON.stringify({'data' : JSON.stringify(data)}),
    })
    .then(response => response.text())
    .then(data => {
      if (JSON.parse(data).msg == "ok") {
        props.navigation.goBack();
      } else {
        console.log(data)
        if(props.route.params.method == "POST")
          alert('Une erreur est survenue lors de la création de cette activite')
        else
          alert('Une erreur est survenue lors de la modification de cette activite')
      }
    })
  }

  return (
    <Background content={
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Les informations</Text>
        <ActivityForm submit={send}
          initialValues={'activity' in props.route.params ? props.route.params.activity: {'name': '','type': '', 'place': '', 'start': new Date(), 'end': new Date()}}
        />
      </View>
    } />
  );
}


export default ActionOnActivity;
