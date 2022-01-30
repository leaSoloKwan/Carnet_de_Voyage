import React, {useState, useContext} from 'react';
import {useEffect} from 'react';
import {View, Text} from 'react-native';
import { styles, BACKEND, TokenContext } from '../../../RootNavigation';
import Background from '../../General/Background';
import RightBloc from './RightBloc';
import ShareForm from './ShareForm';

/* Display the right for a travel in two category :
- the READING rights
- the WRITING rights
with 
- buttons to modify/delete the rights for an user
- buttons to add reading/writing rights

*/

function TravelRights(props) {
  const { token } = useContext(TokenContext);
  const [writerRight, setWriterRight] = useState([]);
  const [readerRight, setReaderRight] = useState([]);

  useEffect(() => {
    props.navigation.setOptions({ title: props.route.params.navigationTitle });
    refresh();
  }, []);

  // function to get the info about the rights for the travel
  function refresh() {
    var url = `${BACKEND}/travels/${props.route.params.id}/share`
    if (props.route.params.right != undefined) {
      url = url + "/shared"
    }
    fetch(url, {
      method: 'GET',
      headers: {'Content-Type': 'application/json', authorization: token},
    })
    .then(response => response.text())
    .then(data => {
      var rights = JSON.parse(data);
      var tmpRight = rights.shift();
      var tmpWriterRight = [];
      var tmpReaderRight = [];

      while ( tmpRight !== undefined ) {
        if(tmpRight.right == "WRITER")
          tmpWriterRight.push(tmpRight);
        else
          tmpReaderRight.push(tmpRight);
        tmpRight = rights.shift();
      }

      setWriterRight(tmpWriterRight);
      setReaderRight(tmpReaderRight);
    })
    .catch(error => console.log(error));
  }

  // function to modify the rights
  function send(data) {
    fetch(`${BACKEND}/travels/${props.route.params.id}/share`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', authorization: token},
      body: JSON.stringify({'data': JSON.stringify(data)})
    })
    .then(response => response.text())
    .then(data => {
      if (JSON.parse(data).msg == "ok") {
        refresh();
      } else {
        alert('Une erreur est survenue lors de la modification des droits : ' + JSON.parse(data).message)
      }
    })
    .catch(error => console.log(error));
  }


  return (
    <Background content={
      <View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Partage en écriture</Text>
          <ShareForm right="WRITER" send={send} />
          {writerRight.map(tmpRight => <RightBloc shared={tmpRight} id={props.route.params.id} title={props.route.params.title} key={tmpRight.user_email} refresh={refresh} />)}
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Partage en lecture</Text>
          <ShareForm right="READER" send={send} />
          {readerRight.map(tmpRight => <RightBloc shared={tmpRight} id={props.route.params.id} title={props.route.params.title} key={tmpRight.user_email} refresh={refresh} />)}
      </View>
      </View>
    } />  
  );
}

export default TravelRights;
