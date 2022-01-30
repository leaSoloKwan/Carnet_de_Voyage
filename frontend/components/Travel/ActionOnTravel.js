import React, {useEffect, useContext} from 'react';
import {View, Text } from 'react-native';
import { styles, BACKEND, TokenContext } from '../../RootNavigation';
import TravelForm from './TravelForm';
import Background from '../General/Background';

/* This function return a view for the next cases :
  - creation of a travel
  - modification of a travel
  - modification of a shared travel
*/
function ActionOnTravel(props) {
  const { token } = useContext(TokenContext);

  useEffect(() => {
    // define the title of the page in the navigation bar
    props.navigation.setOptions({ title: props.route.params.navigationTitle });
  }, []);
  
  // function to send the data of the travel form (POST or PUT)
  function send(data) {
    let url= `${BACKEND}/travels/`
    if (props.route.params.method == "PUT") {
      url = url + `${props.route.params.id}`
      if (props.route.params.shared)
        url = url + '/shared'
    }
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
          alert('Une erreur est survenue lors de la création de ce voyage')
        else
          alert('Une erreur est survenue lors de la modification de ce voyage')
      }
    })
  }

  return (
    <Background content={
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Les informations</Text>
        <TravelForm submit={send}
          initialValues={'travel' in props.route.params ? props.route.params.travel: {'title': '', 'place': '', 'start': new Date(), 'end': new Date()}}
        />
      </View>
    } />
  );
}


export default ActionOnTravel;
